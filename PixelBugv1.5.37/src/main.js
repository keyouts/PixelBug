const { app, BrowserWindow, dialog, ipcMain, nativeTheme, session } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { APP_URL, registerHandler, registerScheme, MOD_URL } = require("./main/app-protocol");
const { writeFilesTransaction } = require("./main/file-transactions");
const { readBoundedText } = require("./main/bounded-file");
const IpcTrust = require("./main/ipc-trust");
const { validateSaveRequest, MAX_SAVE_BYTES } = require("./main/save-request");
const { ModRunnerManager } = require("./main/mod-runner-manager");
const { ProjectPathStore, cleanDocumentId, pathKey } = require("./main/project-paths");
const { clearRecovery, deleteRecoverySnapshot, listRecoverySnapshots, loadRecovery, loadRecoverySnapshot, saveRecovery } = require("./main/recovery-store");
const { openRecentProject, readRecentProjects, rememberRecentProject } = require("./main/recent-projects");
const { decodePsdTemplateAsync } = require("./main/psd-worker-client");
const { deleteStoredProject, listStoredProjects, loadStoredProject, saveStoredProject } = require("./main/project-store");

const APP_TITLE = "Pixel Bug";
const MAX_OPEN_TEXT_BYTES = MAX_SAVE_BYTES;
const SAFE_INDEX_URL = `${APP_URL}?safeRecovery=1`;
const hardenedContents = new WeakSet();
const mainWindows = new Set();
const mainContents = new Set();
const crashState = new Map();
const closeState = new WeakMap();
let modRunnerManager = null;
const projectPathStore = new ProjectPathStore();

registerScheme();
nativeTheme.themeSource = "system";

function currentTheme() {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}

function isTrustedAppUrl(value) {
  return IpcTrust.isTrustedAppUrl(value, APP_URL);
}

function isTrustedSender(event) {
  return IpcTrust.isTrustedSender(event, mainContents, APP_URL);
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
function browserZoomAction(input = {}) {
  const key = String(input.key || "").toLowerCase();
  const code = String(input.code || "").toLowerCase();
  if (!(input.control || input.meta)) return "";
  if (["0", "numpad0"].includes(key) || ["numpad0"].includes(code)) return "reset";
  if (["+", "=", "numpadadd"].includes(key) || ["equal", "numpadadd"].includes(code)) return "in";
  if (["-", "numsub", "numpadsubtract"].includes(key) || ["minus", "numpadsubtract"].includes(code)) return "out";
  return "";
}

function isBrowserZoomInput(input = {}) {
  return Boolean(browserZoomAction(input));
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
  contents.on("will-frame-navigate", (event, details) => { if (!isTrustedAppUrl(details?.url)) event.preventDefault(); });
  contents.on("will-attach-webview", event => event.preventDefault());
  contents.on("did-finish-load", () => {
    resetPageZoom(contents);
    const previous = crashState.get(contents.id);
    if (previous?.resetTimer) clearTimeout(previous.resetTimer);
    const resetTimer = setTimeout(() => crashState.delete(contents.id), 60000);
    crashState.set(contents.id, { count: previous?.count || 0, at: previous?.at || 0, resetTimer });
  });
  contents.on("zoom-changed", event => {
    event.preventDefault();
    resetPageZoom(contents);
  });
  contents.on("before-input-event", (event, input) => {
    if (!isBrowserZoomInput(input)) return;
    event.preventDefault();
    resetPageZoom(contents);
    contents.send("browser-zoom-blocked", browserZoomAction(input));
  });
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
  const contentsId = win.webContents.id;
  closeState.set(win, { approved: false, pending: false, ready: false });
  mainWindows.add(win);
  mainContents.add(contentsId);
  win.webContents.on("did-start-loading", () => {
    const state = closeState.get(win);
    if (state) {
      state.ready = false;
      state.pending = false;
    }
  });
  win.on("closed", () => {
    mainWindows.delete(win);
    mainContents.delete(contentsId);
    const previous = crashState.get(contentsId);
    if (previous?.resetTimer) clearTimeout(previous.resetTimer);
    crashState.delete(contentsId);
    projectPathStore.clear(contentsId);
    closeState.delete(win);
  });
  win.on("close", event => {
    const state = closeState.get(win);
    if (state?.approved || !state?.ready || win.webContents.isDestroyed()) return;
    event.preventDefault();
    if (state?.pending) return;
    state.pending = true;
    win.webContents.send("window-close-requested");
  });
  win.setMenuBarVisibility(false);
  hardenWebContents(win.webContents);
  win.once("ready-to-show", () => win.show());
  win.loadURL(APP_URL);
}

nativeTheme.on("updated", () => {
  const theme = currentTheme();
  for (const win of mainWindows) {
    if (win.isDestroyed()) continue;
    win.setBackgroundColor(theme === "dark" ? "#121212" : "#ffffff");
    win.webContents.send("system-theme-changed", theme);
  }
});

configureAppPaths();
app.enableSandbox();
app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
app.on("child-process-gone", (_event, details) => console.warn("Child process gone", details.type, details.reason));
app.on("render-process-gone", (_event, webContents, details) => {
  if (!webContents || webContents.isDestroyed() || !mainContents.has(webContents.id)) return;
  console.warn("Renderer process gone", details.reason);
  const now = Date.now();
  const previous = crashState.get(webContents.id);
  if (previous?.resetTimer) clearTimeout(previous.resetTimer);
  const count = previous && now - previous.at < 60000 ? previous.count + 1 : 1;
  crashState.set(webContents.id, { count, at: now, resetTimer: null });
  if (count >= 2) webContents.loadURL(SAFE_INDEX_URL);
  else webContents.reload();
});

app.whenReady().then(() => {
  registerHandler(__dirname);
  hardenSession();
  modRunnerManager = new ModRunnerManager(ipcMain, MOD_URL);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!mainWindows.size) createWindow();
});

ipcMain.handle("get-system-theme", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return currentTheme();
});

ipcMain.on("renderer-close-ready", event => {
  if (!isTrustedSender(event)) return;
  const win = BrowserWindow.fromWebContents(event.sender);
  const state = win && closeState.get(win);
  if (state) state.ready = true;
});

ipcMain.handle("decode-psd-template", async (event, data) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return decodePsdTemplateAsync(data);
});

ipcMain.handle("request-window-close", async (event, request) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const win = BrowserWindow.fromWebContents(event.sender);
  const state = win && closeState.get(win);
  if (!win || !state?.pending) throw new Error("Close request is not active");
  const dirtyNames = Array.isArray(request?.dirtyNames) ? request.dirtyNames.map(name => String(name || "").trim().slice(0, 80)).filter(Boolean).slice(0, 12) : [];
  const recoveryFailed = request?.recoveryFailed === true;
  if (!dirtyNames.length && !recoveryFailed) return { action: "close" };
  const details = [];
  if (dirtyNames.length) details.push(`Unsaved projects: ${dirtyNames.join(", ")}`);
  if (recoveryFailed) details.push("The latest recovery copy could not be written.");
  const buttons = dirtyNames.length ? ["Save All", "Close Without Saving", "Cancel"] : ["Close Anyway", "Cancel"];
  const result = await dialog.showMessageBox(win, {
    type: recoveryFailed ? "warning" : "question",
    buttons,
    defaultId: 0,
    cancelId: buttons.length - 1,
    noLink: true,
    title: "Close Pixel Bug",
    message: dirtyNames.length ? "Save changes before closing?" : "Close without a current recovery copy?",
    detail: details.join("\n")
  });
  if (!dirtyNames.length) return { action: result.response === 0 ? "close" : "cancel" };
  return { action: result.response === 0 ? "save" : result.response === 1 ? "discard" : "cancel" };
});

ipcMain.handle("complete-window-close", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const win = BrowserWindow.fromWebContents(event.sender);
  const state = win && closeState.get(win);
  if (!win || !state?.pending) throw new Error("Close request is not active");
  state.approved = true;
  setImmediate(() => { if (!win.isDestroyed()) win.close(); });
  return true;
});

ipcMain.handle("cancel-window-close", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const win = BrowserWindow.fromWebContents(event.sender);
  const state = win && closeState.get(win);
  if (!state) return false;
  state.pending = false;
  return true;
});

ipcMain.handle("run-mod-code", (event, request) => {
  if (!isTrustedSender(event) || !modRunnerManager) throw new Error("Untrusted sender");
  return modRunnerManager.run(event, request);
});

ipcMain.handle("reset-mod-runner", (event, kind) => {
  if (!isTrustedSender(event) || !modRunnerManager) throw new Error("Untrusted sender");
  return modRunnerManager.reset(event, kind);
});

ipcMain.handle("save-recovery", (event, payload) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return saveRecovery(app, payload);
});

ipcMain.handle("load-recovery", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return loadRecovery(app);
});

ipcMain.handle("clear-recovery", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return clearRecovery(app);
});

ipcMain.handle("list-recovery-snapshots", event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return listRecoverySnapshots(app);
});

ipcMain.handle("load-recovery-snapshot", (event, snapshotId) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return loadRecoverySnapshot(app, snapshotId);
});

ipcMain.handle("delete-recovery-snapshot", (event, snapshotId) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return deleteRecoverySnapshot(app, snapshotId);
});

ipcMain.handle("list-stored-projects", (event, kind) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return listStoredProjects(app, kind);
});

ipcMain.handle("save-stored-project", (event, kind, value) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return saveStoredProject(app, kind, value);
});

ipcMain.handle("load-stored-project", (event, kind, id) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return loadStoredProject(app, kind, id);
});

ipcMain.handle("delete-stored-project", (event, kind, id) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return deleteStoredProject(app, kind, id);
});

ipcMain.handle("save-file", async (event, options) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const request = validateSaveRequest(options);
  const result = await dialog.showSaveDialog({ title: request.title, defaultPath: request.defaultPath, filters: request.filters });
  if (result.canceled || !result.filePath) return { ok: false };
  const entries = [{ filePath: result.filePath, payload: request.primary.payload }];
  for (const extra of request.extras) entries.push({ filePath: path.join(path.dirname(result.filePath), extra.filename), payload: extra.payload, requireAbsent: true });
  const existingExtras = [];
  for (const entry of entries.slice(1)) {
    try {
      await fs.lstat(entry.filePath);
      existingExtras.push(entry);
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  if (existingExtras.length) {
    const confirmation = await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
      type: "warning", title: "Replace companion files?", message: "The export also contains existing files.",
      detail: existingExtras.map(entry => path.basename(entry.filePath)).join("\n"), buttons: ["Replace", "Cancel"], defaultId: 1, cancelId: 1, noLink: true
    });
    if (confirmation.response !== 0) return { ok: false };
    for (const entry of existingExtras) entry.requireAbsent = false;
  }
  await writeFilesTransaction(entries);
  if (/\.pxbuild$/i.test(result.filePath)) await rememberRecentProject(app, result.filePath);
  return { ok: true, filePath: result.filePath };
});

ipcMain.handle("save-project-file", async (event, options) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const documentId = cleanDocumentId(options?.documentId);
  const request = validateSaveRequest(options);
  if (request.extras.length) throw new Error("Project saves do not support extra files");
  const boundPath = projectPathStore.get(event.sender.id, documentId);
  let filePath = options?.forceDialog === true ? "" : boundPath;
  if (!filePath) {
    const result = await dialog.showSaveDialog({ title: request.title, defaultPath: options?.forceDialog === true && boundPath ? boundPath : request.defaultPath, filters: request.filters });
    if (result.canceled || !result.filePath) return { ok: false };
    filePath = result.filePath;
  }
  await writeFilesTransaction([{ filePath, payload: request.primary.payload }]);
  projectPathStore.bindSaved(event.sender.id, documentId, filePath);
  if (/\.pxbuild$/i.test(filePath)) await rememberRecentProject(app, filePath);
  return { ok: true, filePath };
});

ipcMain.handle("bind-project-path", async (event, documentId, filePath) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const id = cleanDocumentId(documentId);
  const recent = await readRecentProjects(app);
  const requestedKey = pathKey(filePath);
  const remembered = recent.find(item => pathKey(item.filePath) === requestedKey);
  if (remembered) projectPathStore.approve(event.sender.id, remembered.filePath);
  return projectPathStore.bind(event.sender.id, id, filePath);
});

ipcMain.handle("forget-project-path", (event, documentId) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  projectPathStore.forget(event.sender.id, documentId);
  return true;
});

async function openTextFile(event, options) {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const result = await dialog.showOpenDialog({ title: options.title, properties: ["openFile"], filters: options.filters });
  if (result.canceled || !result.filePaths[0]) return { ok: false };
  const filePath = result.filePaths[0];
  const maxBytes = Math.min(Number(options.maxBytes) || MAX_OPEN_TEXT_BYTES, MAX_OPEN_TEXT_BYTES);
  const text = await readBoundedText(filePath, maxBytes);
  if (/\.pxbuild$/i.test(filePath)) {
    await rememberRecentProject(app, filePath);
    projectPathStore.approve(event.sender.id, filePath);
  }
  return { ok: true, text, filePath };
}

ipcMain.handle("open-project", event => openTextFile(event, {
  title: "Open Pixel Bug Project",
  filters: [{ name: "Pixel Bug Project", extensions: ["pxbuild", "json"] }],
  maxBytes: MAX_OPEN_TEXT_BYTES
}));

ipcMain.handle("list-recent-projects", async event => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  return readRecentProjects(app);
});

ipcMain.handle("open-recent-project", async (event, filePath) => {
  if (!isTrustedSender(event)) throw new Error("Untrusted sender");
  const result = await openRecentProject(app, filePath, MAX_OPEN_TEXT_BYTES);
  projectPathStore.approve(event.sender.id, result.filePath);
  return result;
});

ipcMain.handle("open-voxel-model", event => openTextFile(event, {
  title: "Open Voxel Model JSON",
  filters: [{ name: "Voxel Model JSON", extensions: ["json"] }],
  maxBytes: 12 * 1024 * 1024
}));
