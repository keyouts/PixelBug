"use strict";

const path = require("node:path");
const { app, BrowserWindow, ipcMain } = require("electron");

const errors = [];

ipcMain.handle("get-system-theme", () => "light");
ipcMain.handle("load-recovery", () => "");
ipcMain.handle("save-recovery", () => true);
ipcMain.handle("clear-recovery", () => true);
ipcMain.handle("list-recovery-snapshots", () => []);
ipcMain.handle("load-recovery-snapshot", () => ({ ok: false }));
ipcMain.handle("delete-recovery-snapshot", () => true);
ipcMain.handle("list-recent-projects", () => []);
ipcMain.handle("bind-project-path", () => true);
ipcMain.handle("forget-project-path", () => true);
ipcMain.handle("reset-mod-runner", () => true);
ipcMain.handle("run-mod-code", () => ({ ok: false, error: "Unavailable during smoke test" }));

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "src", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
  window.webContents.on("console-message", (_event, level, message) => {
    if (level >= 2) errors.push(message);
  });
  window.webContents.on("render-process-gone", (_event, details) => errors.push(`Renderer stopped: ${details.reason}`));
  await window.loadFile(path.join(__dirname, "..", "src", "index.html"));
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await window.webContents.executeJavaScript(`(async () => {
    const pause = () => new Promise(resolve => setTimeout(resolve, 80));
    const state = window.PixelBugAppApi?.getState?.();
    const firstPixel = () => state?.frames?.[0]?.layers?.[0]?.pixels?.[0]?.[0] ?? null;
    const canvas = document.querySelector("#pixel-canvas");
    const before = firstPixel();
    canvas?.focus();
    canvas?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await pause();
    const painted = firstPixel();
    document.querySelector("#undo-btn")?.click();
    await pause();
    const undone = firstPixel();
    document.querySelector("#redo-btn")?.click();
    await pause();
    const redone = firstPixel();

    const settings = document.querySelector("#settings-btn");
    settings?.click();
    await pause();
    const size = document.querySelector("#settings-text-size");
    if (size) {
      size.value = "large";
      size.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const contrast = document.querySelector("#settings-high-contrast");
    if (contrast) {
      contrast.checked = true;
      contrast.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await pause();
    const settingsOpen = document.querySelector("#settings-overlay")?.hidden === false;
    const accessibilityApplied = document.documentElement.classList.contains("a11y-high-contrast") && document.documentElement.style.getPropertyValue("--a11y-text-scale") === "1.1";
    const interfaceScale = document.querySelector("#settings-interface-scale");
    if (interfaceScale) {
      interfaceScale.value = "200";
      interfaceScale.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await pause();
    const interfaceScaleStable = getComputedStyle(document.documentElement).fontSize === "16px" && document.documentElement.dataset.interfaceScale === "200";
    if (interfaceScale) {
      interfaceScale.value = "100";
      interfaceScale.dispatchEvent(new Event("change", { bubbles: true }));
    }
    document.querySelector("#close-settings-btn")?.click();

    const canvasSize = document.querySelector("#canvas-size");
    if (canvasSize) {
      canvasSize.value = "512";
      canvasSize.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await pause();
    const largeCanvasRect = canvas?.getBoundingClientRect();
    const largeCanvasUsable = Boolean(largeCanvasRect && largeCanvasRect.width >= 500 && largeCanvasRect.height >= 500);

    document.querySelector("#export-menu-btn")?.click();
    document.querySelector("#export-png-btn")?.click();
    await pause();
    const preflightOpen = document.querySelector("#export-preflight-overlay")?.hidden === false;
    document.querySelector("#export-preflight-cancel-btn")?.click();

    const recovery = window.PixelBugDocuments?.serializeRecovery?.();
    const parsedRecovery = window.PixelBugSessionRecovery?.parse?.(recovery, window.PixelBugProjectPackage);
    const checks = {
      controllers: Boolean(window.PixelBugWorkflowControllers?.documents),
      packageApi: typeof window.PixelBugProjectPackage?.recover === "function",
      historyApi: typeof window.PixelBugHistoryPatches?.create === "function",
      recoveryApi: parsedRecovery?.documents?.length >= 1,
      settingsOpen,
      accessibilityApplied,
      interfaceScaleStable,
      largeCanvasUsable,
      accessibility: ["#settings-reduced-motion", "#settings-strong-focus", "#settings-large-targets", "#settings-font-preset", "#settings-bold-text", "#settings-high-contrast", "#settings-text-size"].every(selector => Boolean(document.querySelector(selector))),
      projectHealth: Boolean(document.querySelector("#project-health-grid")?.children.length),
      modPermissions: ["#mod-permission-canvas-read", "#mod-permission-pixels-write", "#mod-permission-play-ui"].every(selector => Boolean(document.querySelector(selector))),
      preflightOpen,
      tabs: document.querySelectorAll('[role="tab"]').length >= 1,
      canvas: Boolean(canvas?.getContext("2d")),
      keyboardPaint: before === null && painted !== null && undone === null && redone === painted
    };
    return { checks, failed: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key) };
  })()`);
  if (errors.length || result.failed.length) {
    process.stderr.write(JSON.stringify({ errors, result }, null, 2));
    app.exit(1);
    return;
  }
  process.stdout.write(JSON.stringify(result.checks));
  app.exit(0);
}).catch(error => {
  process.stderr.write(String(error?.stack || error));
  app.exit(1);
});
