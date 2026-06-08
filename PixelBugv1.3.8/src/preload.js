const { contextBridge, ipcRenderer } = require("electron");

const safeInvoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

const api = Object.freeze({
  saveFile: options => safeInvoke("save-file", options && typeof options === "object" ? { ...options } : {}),
  openProject: () => safeInvoke("open-project"),
  getSystemTheme: () => safeInvoke("get-system-theme"),
  onSystemThemeChanged: callback => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, theme) => callback(theme);
    ipcRenderer.on("system-theme-changed", listener);
    return () => ipcRenderer.removeListener("system-theme-changed", listener);
  },
  // Zoom bridge
  onBrowserZoomBlocked: callback => {
    if (typeof callback !== "function") return () => {};
    const listener = () => callback();
    ipcRenderer.on("browser-zoom-blocked", listener);
    return () => ipcRenderer.removeListener("browser-zoom-blocked", listener);
  }
});

contextBridge.exposeInMainWorld("pixelBug", api);
