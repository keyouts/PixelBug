const { app, BrowserWindow, dialog, ipcMain, nativeTheme, session } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { pathToFileURL } = require("url");

const APP_TITLE = "Pixel Bug";
const MAX_SAVE_BYTES = 256 * 1024 * 1024;
const MAX_EXTRA_FILES = 16;
const EXTRA_FILE_NAME_LIMIT = 120;
const INDEX_PATH = path.join(__dirname, "index.html");
const INDEX_URL = pathToFileURL(INDEX_PATH).toString();
nativeTheme.themeSource = "system";

function currentTheme() {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}

function isTrustedSender(event) {
  return event.senderFrame && event.senderFrame.url === INDEX_URL;
}

function cleanExtraFilename(filename) {
  const safe = path.basename(String(filename || "")).replace(/[<>:"/\\|?*\x00-\x1F]/g, "-").trim().slice(0, EXTRA_FILE_NAME_LIMIT);
  return safe || "pixel-bug-extra.txt";
}

// Payload limits
function byteLength(data, encoding) {
  if (encoding === "base64") return Buffer.byteLength(String(data || ""), "base64");
  return Buffer.byteLength(String(data ?? ""), "utf8");
}

function assertSafePayload(data, encoding) {
  if (byteLength(data, encoding) > MAX_SAVE_BYTES) throw new Error("Save payload is too large");
}


function hardenSession() {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
}

// Zoom guard
function isBrowserZoomInput(input = {}) {
  const key = String(input.key || "").toLowerCase();
  const code = String(input.code || "");
  const hasModifier = Boolean(input.control || input.meta);
  return hasModifier && ["-", "=", "+", "0", "numsub", "numpadsubtract", "numpadadd", "numpad0", "minus", "equal"].includes(key || code.toLowerCase());
}

function resetPageZoom(contents) {
  if (!contents || contents.isDestroyed()) return;
  contents.setZoomFactor(1);
  contents.setVisualZoomLevelLimits?.(1, 1).catch?.(() => {});
}

function hardenWebContents(contents) {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
  contents.on("will-navigate", event => event.preventDefault());
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

ipcMain.handle("save-file", async (event, options = {}) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");

  const { title, defaultPath, filters, data, encoding = "utf8", extraFiles = [] } = options;
  assertSafePayload(data, encoding);
  const result = await dialog.showSaveDialog({ title: String(title || APP_TITLE).slice(0, 120), defaultPath: defaultPath ? path.basename(String(defaultPath)) : undefined, filters: cleanFilters(filters) });
  if (result.canceled || !result.filePath) return { ok: false };

  const payload = encoding === "base64" ? Buffer.from(String(data || ""), "base64") : String(data ?? "");
  await fs.writeFile(result.filePath, payload);

  const writtenExtraPaths = new Set([path.resolve(result.filePath)]);
  for (const extra of (Array.isArray(extraFiles) ? extraFiles : []).slice(0, MAX_EXTRA_FILES)) {
    assertSafePayload(extra.data, extra.encoding);
    const safeName = cleanExtraFilename(extra.filename);
    const extraPath = path.join(path.dirname(result.filePath), safeName);
    const resolvedExtraPath = path.resolve(extraPath);
    if (writtenExtraPaths.has(resolvedExtraPath)) throw new Error("Extra files must use unique names");
    writtenExtraPaths.add(resolvedExtraPath);
    const extraPayload = extra.encoding === "base64" ? Buffer.from(String(extra.data || ""), "base64") : String(extra.data ?? "");
    await fs.writeFile(extraPath, extraPayload);
  }

  return { ok: true, filePath: result.filePath };
});

ipcMain.handle("open-project", async event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");

  const result = await dialog.showOpenDialog({
    title: "Open Pixel Bug Project",
    properties: ["openFile"],
    filters: [{ name: "Pixel Bug Project", extensions: ["pxbuild", "json"] }]
  });
  if (result.canceled || !result.filePaths[0]) return { ok: false };

  const stats = await fs.stat(result.filePaths[0]);
  if (stats.size > MAX_SAVE_BYTES) throw new Error("Project file is too large");
  const text = await fs.readFile(result.filePaths[0], "utf8");
  return { ok: true, text, filePath: result.filePaths[0] };
});
