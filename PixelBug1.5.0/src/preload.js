const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  saveFile: "save-file",
  decodePsdTemplate: "decode-psd-template",
  openProject: "open-project",
  openRecentProject: "open-recent-project",
  listRecentProjects: "list-recent-projects",
  openVoxelModel: "open-voxel-model",
  getSystemTheme: "get-system-theme",
  systemThemeChanged: "system-theme-changed",
  browserZoomBlocked: "browser-zoom-blocked",
  runModCode: "run-mod-code",
  resetModRunner: "reset-mod-runner",
  saveRecovery: "save-recovery",
  loadRecovery: "load-recovery",
  clearRecovery: "clear-recovery"
});

function plainOptions(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return {
    title: value.title,
    defaultPath: value.defaultPath,
    filters: value.filters,
    data: value.data,
    encoding: value.encoding,
    extraFiles: value.extraFiles
  };
}

function modRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("Mod request is required");
  return {
    kind: value.kind,
    code: value.code,
    payload: value.payload
  };
}

function listen(channel, callback, transform = value => value) {
  if (typeof callback !== "function") return () => {};
  const listener = (_event, value) => callback(transform(value));
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

function binaryData(value) {
  if (value instanceof ArrayBuffer) return value;
  if (ArrayBuffer.isView(value)) return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  throw new TypeError("Binary data is required");
}

const api = Object.freeze({
  saveFile: options => ipcRenderer.invoke(CHANNELS.saveFile, plainOptions(options)),
  decodePsdTemplate: data => ipcRenderer.invoke(CHANNELS.decodePsdTemplate, binaryData(data)),
  openProject: () => ipcRenderer.invoke(CHANNELS.openProject),
  openRecentProject: filePath => ipcRenderer.invoke(CHANNELS.openRecentProject, String(filePath || "")),
  listRecentProjects: () => ipcRenderer.invoke(CHANNELS.listRecentProjects),
  openVoxelModel: () => ipcRenderer.invoke(CHANNELS.openVoxelModel),
  getSystemTheme: () => ipcRenderer.invoke(CHANNELS.getSystemTheme),
  runModCode: request => ipcRenderer.invoke(CHANNELS.runModCode, modRequest(request)),
  resetModRunner: kind => ipcRenderer.invoke(CHANNELS.resetModRunner, kind),
  saveRecovery: payload => ipcRenderer.invoke(CHANNELS.saveRecovery, String(payload || "")),
  loadRecovery: () => ipcRenderer.invoke(CHANNELS.loadRecovery),
  clearRecovery: () => ipcRenderer.invoke(CHANNELS.clearRecovery),
  onSystemThemeChanged: callback => listen(CHANNELS.systemThemeChanged, callback, value => value === "dark" ? "dark" : "light"),
  onBrowserZoomBlocked: callback => listen(CHANNELS.browserZoomBlocked, callback, value => ["in", "out", "reset"].includes(value) ? value : "reset")
});

contextBridge.exposeInMainWorld("pixelBug", api);
