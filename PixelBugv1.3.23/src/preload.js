const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  saveFile: "save-file",
  openProject: "open-project",
  openVoxelModel: "open-voxel-model",
  getSystemTheme: "get-system-theme",
  systemThemeChanged: "system-theme-changed",
  browserZoomBlocked: "browser-zoom-blocked"
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

function listen(channel, callback, transform = value => value) {
  if (typeof callback !== "function") return () => {};
  const listener = (_event, value) => callback(transform(value));
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const api = Object.freeze({
  saveFile: options => ipcRenderer.invoke(CHANNELS.saveFile, plainOptions(options)),
  openProject: () => ipcRenderer.invoke(CHANNELS.openProject),
  openVoxelModel: () => ipcRenderer.invoke(CHANNELS.openVoxelModel),
  getSystemTheme: () => ipcRenderer.invoke(CHANNELS.getSystemTheme),
  onSystemThemeChanged: callback => listen(CHANNELS.systemThemeChanged, callback, value => value === "dark" ? "dark" : "light"),
  onBrowserZoomBlocked: callback => listen(CHANNELS.browserZoomBlocked, callback, () => undefined)
});

contextBridge.exposeInMainWorld("pixelBug", api);
