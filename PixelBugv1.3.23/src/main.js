const { app, BrowserWindow, dialog, ipcMain, nativeTheme, session } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { pathToFileURL } = require("url");

const APP_TITLE = "Pixel Bug";
const MAX_SAVE_BYTES = 256 * 1024 * 1024;
const MAX_TOTAL_SAVE_BYTES = 256 * 1024 * 1024;
const MAX_EXTRA_FILES = 16;
const EXTRA_FILE_NAME_LIMIT = 120;
const INDEX_PATH = path.join(__dirname, "index.html");
const INDEX_URL = pathToFileURL(INDEX_PATH).toString();
const SAVE_ENCODINGS = new Set(["utf8", "base64"]);
const hardenedContents = new WeakSet();
nativeTheme.themeSource = "system";

function currentTheme() {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}

function isPlainRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isTrustedSender(event) {
  const contents = event?.sender;
  const frame = event?.senderFrame;
  return Boolean(contents && !contents.isDestroyed() && frame && frame === contents.mainFrame && frame.url === INDEX_URL);
}

function cleanExtraFilename(filename) {
  const safe = path.basename(String(filename || "")).replace(/[<>:"/\\|?*\x00-\x1F]/g, "-").trim().slice(0, EXTRA_FILE_NAME_LIMIT);
  return safe || "pixel-bug-extra.txt";
}

function pathIdentity(filePath) {
  const resolved = path.resolve(filePath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

// Payload limits
function cleanEncoding(value) {
  const encoding = value == null ? "utf8" : String(value).toLowerCase();
  if (!SAVE_ENCODINGS.has(encoding)) throw new Error("Unsupported save encoding");
  return encoding;
}

function base64ByteLength(value) {
  const text = String(value || "");
  if (text.length > Math.ceil(MAX_SAVE_BYTES * 4 / 3) + 4) throw new Error("Save payload is too large");
  if (text && (!/^[A-Za-z0-9+/]*={0,2}$/.test(text) || text.length % 4 !== 0 || /=/.test(text.slice(0, -2)))) throw new Error("Invalid base64 payload");
  const padding = text.endsWith("==") ? 2 : text.endsWith("=") ? 1 : 0;
  return Math.max(0, text.length / 4 * 3 - padding);
}

function validatePayload(data, requestedEncoding) {
  if (typeof data !== "string") throw new Error("Save payload must be text");
  const encoding = cleanEncoding(requestedEncoding);
  const bytes = encoding === "base64" ? base64ByteLength(data) : Buffer.byteLength(data, "utf8");
  if (bytes > MAX_SAVE_BYTES) throw new Error("Save payload is too large");
  return { encoding, bytes, payload: encoding === "base64" ? Buffer.from(data, "base64") : data };
}

function validateSaveRequest(options) {
  if (!isPlainRecord(options)) throw new Error("Invalid save request");
  const primary = validatePayload(options.data, options.encoding);
  const sourceExtras = options.extraFiles == null ? [] : options.extraFiles;
  if (!Array.isArray(sourceExtras) || sourceExtras.length > MAX_EXTRA_FILES) throw new Error("Invalid extra file list");
  const extras = sourceExtras.map(extra => {
    if (!isPlainRecord(extra)) throw new Error("Invalid extra file request");
    return { filename: cleanExtraFilename(extra.filename), ...validatePayload(extra.data, extra.encoding) };
  });
  const totalBytes = extras.reduce((sum, extra) => sum + extra.bytes, primary.bytes);
  if (totalBytes > MAX_TOTAL_SAVE_BYTES) throw new Error("Combined save payload is too large");
  return {
    title: String(options.title || APP_TITLE).slice(0, 120),
    defaultPath: options.defaultPath ? path.basename(String(options.defaultPath)).slice(0, 240) : undefined,
    filters: cleanFilters(options.filters),
    primary,
    extras
  };
}

function hardenSession() {
  const activeSession = session.defaultSession;
  activeSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  activeSession.setPermissionCheckHandler(() => false);
  activeSession.setDevicePermissionHandler?.(() => false);
  activeSession.setDisplayMediaRequestHandler?.((_request, callback) => callback({}));
  activeSession.on("will-download", event => event.preventDefault());
}

// Zoom guard
function isBrowserZoomInput(input = {}) {
  const key = String(input.key || "").toLowerCase();
  const code = String(input.code || "").toLowerCase();
  const hasModifier = Boolean(input.control || input.meta);
  return hasModifier && ["-", "=", "+", "0", "numsub", "numpadsubtract", "numpadadd", "numpad0", "minus", "equal"].includes(key || code);
}

function resetPageZoom(contents) {
  if (!contents || contents.isDestroyed()) return;
  contents.setZoomFactor(1);
  contents.setVisualZoomLevelLimits?.(1, 1).catch?.(() => {});
}

function hardenWebContents(contents) {
  if (!contents || hardenedContents.has(contents)) return;
  hardenedContents.add(contents);
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
  contents.on("will-navigate", event => event.preventDefault());
  contents.on("will-redirect", event => event.preventDefault());
  contents.on("will-frame-navigate", (event, details) => { if (details?.url !== INDEX_URL) event.preventDefault(); });
  contents.on("will-attach-webview", event => event.preventDefault());
  contents.on("did-finish-load", () => resetPageZoom(contents));
  contents.on("zoom-changed", event => {
    event.preventDefault();
    resetPageZoom(contents);
  });
  contents.on("before-input-event", (event, input) => {
    if (!isBrowserZoomInput(input)) return;
    event.preventDefault();
    resetPageZoom(contents);
    contents.send("browser-zoom-blocked");
  });
}

function cleanFilters(filters) {
  if (!Array.isArray(filters)) return undefined;
  return filters.slice(0, 12).map(filter => ({
    name: String(filter?.name || "File").slice(0, 80),
    extensions: Array.isArray(filter?.extensions) ? filter.extensions.map(ext => String(ext).replace(/[^a-z0-9]/gi, "").slice(0, 16)).filter(Boolean).slice(0, 12) : []
  })).filter(filter => filter.extensions.length);
}

function configureAppPaths() {
  if (app.isPackaged) return;
  const cacheRoot = path.join(app.getPath("temp"), "PixelBugElectron");
  const userDataPath = path.join(cacheRoot, "UserData");
  const sessionDataPath = path.join(cacheRoot, "SessionData");
  const diskCachePath = path.join(cacheRoot, "DiskCache");
  app.setPath("userData", userDataPath);
  try {
    app.setPath("sessionData", sessionDataPath);
  } catch (_error) {
    app.commandLine.appendSwitch("user-data-dir", userDataPath);
  }
  app.commandLine.appendSwitch("disk-cache-dir", diskCachePath);
  app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1040,
    minHeight: 680,
    title: APP_TITLE,
    icon: path.join(__dirname, "../assets/icon.png"),
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#121212" : "#ffffff",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      navigateOnDragDrop: false,
      webviewTag: false,
      devTools: !app.isPackaged,
      spellcheck: false
    }
  });
  win.setMenuBarVisibility(false);
  hardenWebContents(win.webContents);
  win.once("ready-to-show", () => win.show());
  win.loadFile(INDEX_PATH);
}

nativeTheme.on("updated", () => {
  const theme = currentTheme();
  for (const win of BrowserWindow.getAllWindows()) {
    win.setBackgroundColor(theme === "dark" ? "#121212" : "#ffffff");
    win.webContents.send("system-theme-changed", theme);
  }
});

configureAppPaths();
app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
app.on("web-contents-created", (_event, contents) => hardenWebContents(contents));
app.on("child-process-gone", (_event, details) => console.warn("Child process gone", details.type, details.reason));
app.on("render-process-gone", (_event, webContents, details) => {
  console.warn("Renderer process gone", details.reason);
  if (webContents && !webContents.isDestroyed()) webContents.reload();
});

app.whenReady().then(() => {
  hardenSession();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle("get-system-theme", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return currentTheme();
});

ipcMain.handle("save-file", async (event, options) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const request = validateSaveRequest(options);
  const result = await dialog.showSaveDialog({ title: request.title, defaultPath: request.defaultPath, filters: request.filters });
  if (result.canceled || !result.filePath) return { ok: false };
  await fs.writeFile(result.filePath, request.primary.payload);
  const writtenExtraPaths = new Set([pathIdentity(result.filePath)]);
  for (const extra of request.extras) {
    const extraPath = path.join(path.dirname(result.filePath), extra.filename);
    const resolvedExtraPath = pathIdentity(extraPath);
    if (writtenExtraPaths.has(resolvedExtraPath)) throw new Error("Extra files must use unique names");
    writtenExtraPaths.add(resolvedExtraPath);
    await fs.writeFile(extraPath, extra.payload);
  }
  return { ok: true, filePath: result.filePath };
});

async function openTextFile(event, options) {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const result = await dialog.showOpenDialog({ title: options.title, properties: ["openFile"], filters: options.filters });
  if (result.canceled || !result.filePaths[0]) return { ok: false };
  const filePath = result.filePaths[0];
  const stats = await fs.stat(filePath);
  if (!stats.isFile() || stats.size > MAX_SAVE_BYTES) throw new Error("Selected file is too large");
  const text = await fs.readFile(filePath, "utf8");
  return { ok: true, text, filePath };
}

ipcMain.handle("open-project", event => openTextFile(event, {
  title: "Open Pixel Bug Project",
  filters: [{ name: "Pixel Bug Project", extensions: ["pxbuild", "json"] }]
}));

ipcMain.handle("open-voxel-model", event => openTextFile(event, {
  title: "Open Voxel Model JSON",
  filters: [{ name: "Voxel Model JSON", extensions: ["json"] }]
}));
