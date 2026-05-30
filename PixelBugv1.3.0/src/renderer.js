// DOM refs
const $ = sel => document.querySelector(sel);
const canvas = $("#pixel-canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const renderScratch = document.createElement("canvas");
const renderScratchCtx = renderScratch.getContext("2d", { alpha: true });
const statusBox = $("#status");
const colorPicker = $("#color-picker");
const brushSizeInput = $("#brush-size");
const brushSizeOutput = $("#brush-size-output");
const canvasSizeSelect = $("#canvas-size");
const customSizeBtn = $("#custom-size-btn");
const customSizeOverlay = $("#custom-size-overlay");
const customSizeInput = $("#custom-size-input");
const pixelTextInput = $("#pixel-text-input");
const pixelTextScaleInput = $("#pixel-text-scale");
const pixelTextScaleOutput = $("#pixel-text-scale-output");
const closeCustomSizeBtn = $("#close-custom-size-btn");
const applyCustomSizeBtn = $("#apply-custom-size-btn");
const frameDurationInput = $("#frame-duration");
const layerOpacityInput = $("#layer-opacity");
const paletteColorWheel = $("#palette-color-wheel");
const paletteHexInput = $("#palette-hex-input");
const palettePresetSelect = $("#palette-preset-select");
const presetNameInput = $("#preset-name-input");
const imageImportInput = $("#image-import-input");
const pixelizeSizeInput = $("#pixelize-size");
const pixelizeSizeOutput = $("#pixelize-size-output");
const pixelizeColorsInput = $("#pixelize-colors");
const pixelizeColorsOutput = $("#pixelize-colors-output");
const pixelizeFitInput = $("#pixelize-fit");
const pixelizePreviewCanvas = $("#pixelize-preview");
const pixelizePreviewCtx = pixelizePreviewCanvas.getContext("2d");
const pixelizerOverlay = $("#pixelizer-overlay");
const openPixelizerBtn = $("#open-pixelizer-btn");
const closePixelizerBtn = $("#close-pixelizer-btn");
const voxelOverlay = $("#voxel-overlay");
const openVoxelBtn = $("#open-voxel-btn");
const touchToggleBtn = $("#touch-toggle-btn");
const leftHandedToggleBtn = $("#left-handed-toggle-btn");
const touchToolbarCollapseBtn = document.createElement("button");
const quickActionsDock = $('[data-dock-id="quick-actions"]');
const paletteDock = $('[data-dock-id="palette"]');
const toolsPanel = $(".tools-panel");
const closeVoxelBtn = $("#close-voxel-btn");
const voxelCanvas = $("#voxel-canvas");
const voxelCtx = voxelCanvas.getContext("2d", { alpha: false });
const voxelDepthInput = $("#voxel-depth");
const voxelDepthOutput = $("#voxel-depth-output");
const voxelScaleInput = $("#voxel-scale");
const voxelScaleOutput = $("#voxel-scale-output");
const voxelRotationXInput = $("#voxel-rotation-x");
const voxelRotationXOutput = $("#voxel-rotation-x-output");
const voxelRotationYInput = $("#voxel-rotation-y");
const voxelRotationYOutput = $("#voxel-rotation-y-output");
const voxelRotationZInput = $("#voxel-rotation-z");
const voxelRotationZOutput = $("#voxel-rotation-z-output");
const voxelFloorInput = $("#voxel-floor");
const voxelMergeInput = $("#voxel-merge");
const voxelDepthModeSelect = $("#voxel-depth-mode");
const exportVoxelBtn = $("#export-voxel-btn");
const exportVoxelTurntableBtn = $("#export-voxel-turntable-btn");
const exportVoxelObjBtn = $("#export-voxel-obj-btn");
const privacyOverlay = $("#privacy-overlay");
const openPrivacyBtn = $("#open-privacy-btn");
const closePrivacyBtn = $("#close-privacy-btn");
const rearrangeBtn = $("#rearrange-btn");
const STORAGE_LAYOUT_KEY = "pixel-bug-layout";
const STORAGE_TOUCH_KEY = "pixel-bug-touch-mode";
const STORAGE_TOUCH_HAND_KEY = "pixel-bug-touch-hand";
const STORAGE_TOUCH_TOOLS_COLLAPSED_KEY = "pixel-bug-touch-tools-collapsed";
const STORAGE_KEY = "pixel-bug-autosave";
const MAX_AUTOSAVE_CHARS = 12 * 1024 * 1024;
const refBtn = $("#ref-btn");
const storyBtn = $("#story-btn");
const symBtn = $("#sym-btn");
const selectionCopyBtn = $("#selection-copy-btn");
const selectionCutBtn = $("#selection-cut-btn");
const selectionPasteBtn = $("#selection-paste-btn");
const selectionDeleteBtn = $("#selection-delete-btn");
const selectionFlipHBtn = $("#selection-flip-h-btn");
const selectionFlipVBtn = $("#selection-flip-v-btn");
const selectionRotateBtn = $("#selection-rotate-btn");
const selectionClearBtn = $("#selection-clear-btn");
const refInput = $("#ref-input");
const storyboardPreview = $("#storyboard-preview");

const printModeBtn = $("#print-mode-btn");
const playModeBtn = $("#play-mode-btn");
const modModeBtn = $("#mod-mode-btn");
const printPanel = $(".print-panel");
const playPanel = $(".play-panel");
const printDpiInput = $("#print-dpi");
const printWidthInput = $("#print-width");
const printBleedInput = $("#print-bleed");
const printSafeInput = $("#print-safe");
const printRepeatSelect = $("#print-repeat");
const printStripWidthInput = $("#print-strip-width");
const printStripHeightInput = $("#print-strip-height");
const printWashiFields = $("#print-washi-fields");
const printStickerFields = $("#print-sticker-fields");
const printMemoFields = $("#print-memo-fields");
const printStickerColsInput = $("#print-sticker-cols");
const printStickerRowsInput = $("#print-sticker-rows");
const printStickerGapInput = $("#print-sticker-gap");
const printMemoHeightInput = $("#print-memo-height");
const printTemplateInput = $("#print-template-input");
const printTemplateName = $("#print-template-name");
const printTemplateSizeInput = $("#print-template-size");
const printTemplatePlacementSelect = $("#print-template-placement");
const clearPrintTemplateBtn = $("#clear-print-template-btn");
const printPreviewCanvas = $("#print-preview");
const printPreviewCtx = printPreviewCanvas.getContext("2d", { alpha: false });
const openPrintPreviewBtn = $("#open-print-preview-btn");
const printPreviewOverlay = $("#print-preview-overlay");
const closePrintPreviewBtn = $("#close-print-preview-btn");
const largePrintPreviewCanvas = $("#large-print-preview");
const largePrintPreviewCtx = largePrintPreviewCanvas.getContext("2d", { alpha: false });
const printInfo = $("#print-info");
const exportPrintBtn = $("#export-print-btn");
const exportCutlineBtn = $("#export-cutline-btn");

const playCanvas = $("#play-canvas");
const playCtx = playCanvas?.getContext("2d", { alpha: false });
const playRunBtn = $("#play-run-btn");
const playResetBtn = $("#play-reset-btn");
const playIdleFrameSelect = $("#play-idle-frame");
const playWalkFrameSelect = $("#play-walk-frame");
const playJumpFrameSelect = $("#play-jump-frame");
const playActorScaleInput = $("#play-actor-scale");
const playPropFrameSelect = $("#play-prop-frame");
const playPropXInput = $("#play-prop-x");
const playPropYInput = $("#play-prop-y");
const playAddPropBtn = $("#play-add-prop-btn");
const playClearPropsBtn = $("#play-clear-props-btn");
const playModeCenterBtn = $("#play-center-btn");
const playUseActiveBtn = $("#play-use-active-btn");
const playDeletePropBtn = $("#play-delete-prop-btn");
const playSceneWidthInput = $("#play-scene-width");
const playSceneHeightInput = $("#play-scene-height");
const playGroundYInput = $("#play-ground-y");
const playPropScaleInput = $("#play-prop-scale");
const playPropSolidInput = $("#play-prop-solid");
const playPropList = $("#play-prop-list");
const playExportPngBtn = $("#play-export-png-btn");
const playExportGifBtn = $("#play-export-gif-btn");
const playBackgroundFrameSelect = $("#play-background-frame");
const playBackgroundScaleSelect = $("#play-background-scale");
const playGridOverBgInput = $("#play-grid-over-bg");
const playWorldWidthInput = $("#play-world-width");
const playCameraFollowInput = $("#play-camera-follow");
const playAutoScrollInput = $("#play-auto-scroll");
const playScrollSpeedInput = $("#play-scroll-speed");
const playSceneryFrameSelect = $("#play-scenery-frame");
const playSceneryScaleInput = $("#play-scenery-scale");
const playScenerySpeedInput = $("#play-scenery-speed");
const playSceneryYInput = $("#play-scenery-y");
const playLayerList = $("#play-layer-list");
const playLayerFrameSelect = $("#play-layer-frame");
const playLayerScaleInput = $("#play-layer-scale");
const playLayerParallaxInput = $("#play-layer-parallax");
const playLayerYInput = $("#play-layer-y");
const playLayerOpacityInput = $("#play-layer-opacity");
const playLayerRepeatInput = $("#play-layer-repeat");
const playLayerVisibleInput = $("#play-layer-visible");
const newProjectOverlay = $("#new-project-overlay");
const confirmNewProjectBtn = $("#confirm-new-project-btn");
const cancelNewProjectBtn = $("#cancel-new-project-btn");
const keepCurrentProjectBtn = $("#keep-current-project-btn");

const brushPresetSelect = $("#brush-preset-select");
const brushSaveBtn = $("#brush-save-btn");
const brushClearBtn = $("#brush-clear-btn");
const brushPreview = $("#brush-preview");
const workspacePresetGrid = $("#workspace-preset-grid");
const effectSelect = $("#effect-select");
const effectPreviewBtn = $("#effect-preview-btn");
const effectApplyBtn = $("#effect-apply-btn");
const effectClearBtn = $("#effect-clear-btn");
const assetExportBtn = $("#asset-export-btn");
const assetImportInput = $("#asset-import-input");
const assetList = $("#asset-list");
const scriptInput = $("#script-input");
const scriptRunBtn = $("#script-run-btn");

// Mod refs
const modSandboxPanel = $("#mod-sandbox-panel");
const modPreviewCanvas = $("#mod-preview-canvas");
const modPreviewCtx = modPreviewCanvas?.getContext("2d", { alpha: false });
const modBrushSelect = $("#mod-brush-select");
const modEffectSelect = $("#mod-effect-select");
const modEffectCode = $("#mod-effect-code");
const modBrushCode = $("#mod-brush-code");
const modNameInput = $("#mod-name-input");
const modIdInput = $("#mod-id-input");
const modLiveBtn = $("#mod-live-btn");
const modRunEffectBtn = $("#mod-run-effect-btn");
const modExportBtn = $("#mod-export-btn");
const modImportBtn = $("#mod-import-btn");
const modImportInput = $("#mod-import-input");
const modResetBtn = $("#mod-reset-btn");
const modUseCanvasInput = $("#mod-use-canvas-input");
const modExampleInvertBtn = $("#mod-example-invert-btn");
const modExampleOutlineBtn = $("#mod-example-outline-btn");


// Tool list
const TOOLS = [
  ["pencil", "Pencil", "B"], ["eraser", "Eraser", "E"], ["fill", "Fill", "G"],
  ["eyedropper", "Pick Color", "I"], ["line", "Line", "L"], ["rect", "Rec", "R"], ["ellipse", "Ellipse", "O"], ["select", "Select", "M"], ["text", "Text", "T"]
];
const DEFAULT_PALETTE = ["#000000", "#ffffff", "#ff0000", "#00aa00", "#0055ff", "#ffff00", "#ff66cc", "#ff9900", "#8b5cf6", "#00c2c7", "#7a4a26", "#777777"];


// App state
let state = freshProject(32);
let tool = "pencil";
let color = "#000000";
let brushSize = 1;
let showGrid = true;
let showOnion = true;
let drawing = false;
let startPixel = null;
let previewLayer = null;
let undoStack = [];
let redoStack = [];
let importedImage = null;
let pixelizedPixels = null;
let symmetryMode = false;
let storyboardMode = false;
let selectionBox = null;
let selectionDrag = null;
let selectionClipboard = null;
let referenceImage = null;
let saveTimer = null;
let voxelFrame = null;
let voxelPixelCache = null;
let voxelNeighborCache = null;
let printMode = false;
let playModeScreen = false;
let modMode = false;
let touchMode = false;
let leftHandTouchMode = false;
let touchToolsCollapsed = false;
let touchPointers = new Map();
let touchPan = null;
let printFrame = null;
let printTemplateImage = null;
let printTemplateFileName = "";

let customBrushes = [];
let customEffects = [];
let activeBrushId = "square";
let effectPreview = null;

// Mod state
let modPreviewPixels = null;
let modPreviewTimer = null;
let modPointerDown = false;
let modLivePreview = true;

let playRunning = false;
let playFrameRequest = null;
let playKeys = {};
let playActor = { x: 24, y: 96, vx: 0, vy: 0, grounded: true, facing: 1 };
let playCameraX = 0;
let playSceneryScrollX = 0;
let playTick = 0;
let selectedPlayProp = -1;
let selectedPlayLayer = 2;
let playDrag = null;
let playDrawFrame = null;
let gridPathCache = null;
let editorCanvasMetricsCache = null;
let gridBitmapCache = null;
const playFrameCanvasCache = new Map();


// Layer defaults
function defaultPlayVisualLayers() {
  return [
    { id: "sky", name: "Sky", role: "background", frame: -1, scale: 8, parallax: 0.04, y: 0, opacity: 1, repeatX: false, visible: true, fit: "cover" },
    { id: "far", name: "Far BG", role: "background", frame: -1, scale: 5, parallax: 0.16, y: 72, opacity: 0.72, repeatX: true, visible: true, fit: "tile" },
    { id: "mid", name: "Mid BG", role: "background", frame: -1, scale: 4, parallax: 0.38, y: 180, opacity: 0.9, repeatX: true, visible: true, fit: "tile" },
    { id: "front", name: "Foreground", role: "foreground", frame: -1, scale: 4, parallax: 0.82, y: 276, opacity: 1, repeatX: true, visible: true, fit: "tile" },
    { id: "overlay", name: "Overlay", role: "overlay", frame: -1, scale: 6, parallax: 0.18, y: 0, opacity: 0.35, repeatX: true, visible: false, fit: "tile" }
  ];
}
function clampPlayLayer(layer, index = 0) {
  const base = defaultPlayVisualLayers()[index] || defaultPlayVisualLayers()[0];
  const next = { ...base, ...(layer || {}) };
  next.name = next.name || base.name;
  next.role = ["background", "foreground", "overlay"].includes(next.role) ? next.role : base.role;
  next.frame = Number.isFinite(Number(next.frame)) ? Math.max(-1, Math.min(Number(next.frame), state.frames.length - 1)) : -1;
  next.scale = Math.max(0.5, Math.min(Number(next.scale) || base.scale, 32));
  next.parallax = Math.max(-4, Math.min(Number(next.parallax) || 0, 4));
  next.y = Math.max(-1024, Math.min(Number(next.y) || 0, 2160));
  next.opacity = Math.max(0, Math.min(Number(next.opacity ?? 1), 1));
  next.repeatX = next.repeatX !== false;
  next.visible = next.visible !== false;
  next.fit = ["cover", "contain", "stretch", "tile"].includes(next.fit) ? next.fit : "tile";
  return next;
}

// Project data
function projectWidth(project = state) { return Math.max(1, Number(project.width) || Number(project.size) || 32); }
function projectHeight(project = state) { return Math.max(1, Number(project.height) || Number(project.size) || 32); }
function projectLabel(project = state) { return `${projectWidth(project)} × ${projectHeight(project)}`; }
function syncProjectSizeAlias(project = state) { project.width = projectWidth(project); project.height = projectHeight(project); project.size = Math.max(project.width, project.height); }
function freshProject(width, height = width) {
  width = Math.max(1, Number(width) || 32);
  height = Math.max(1, Number(height) || width);
  return {
    name: "Pixel Bug Project", size: Math.max(width, height), width, height, palette: [...DEFAULT_PALETTE], activePalettePreset: 0, palettePresets: [{ name: "Base", colors: [...DEFAULT_PALETTE] }], activeFrame: 0, activeLayer: 0,
    frames: [{ duration: 120, layers: [newLayer(width, "Layer 1", height)] }],
    playMode: { idleFrame: 0, walkFrame: 0, jumpFrame: 0, sceneWidth: 640, sceneHeight: 360, worldWidth: 1600, groundY: 300, actorScale: 3, backgroundFrame: -1, backgroundScale: "cover", showGridOverlay: true, cameraFollow: true, autoScroll: false, scrollSpeed: 1.25, sceneryFrame: -1, sceneryScale: 3, scenerySpeed: 0.45, sceneryY: 248, visualLayers: defaultPlayVisualLayers(), props: [] }
  };
}
function newLayer(width, name = "Layer", height = width) { return { name, visible: true, opacity: 1, pixels: blankPixels(width, height), sourceWidth: width, sourceHeight: height, sourcePixels: blankPixels(width, height) }; }
function blankPixels(width, height = width) { return Array.from({ length: height }, () => Array.from({ length: width }, () => null)); }
function clone(obj) { return typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj)); }
function setLayerSource(projectLayer, width = projectWidth(), height = projectHeight()) { projectLayer.sourceWidth = width; projectLayer.sourceHeight = height; projectLayer.sourceSize = Math.max(width, height); projectLayer.sourcePixels = clone(projectLayer.pixels); }
function clearLayerSource(projectLayer = layer()) { delete projectLayer.sourceSize; delete projectLayer.sourcePixels; }
function frame() { return state.frames[state.activeFrame]; }
function layer() { return frame().layers[state.activeLayer]; }
function setStatus(msg) { statusBox.textContent = msg; }
function isHexColor(value) { return /^#[0-9a-f]{6}$/i.test(value); }
function syncColorInputs(nextColor = color) { colorPicker.value = nextColor; if (paletteColorWheel) paletteColorWheel.value = nextColor; if (paletteHexInput) paletteHexInput.value = nextColor; }
function saveLocalNow() { try { const payload = JSON.stringify(state); if (payload.length <= MAX_AUTOSAVE_CHARS) localStorage.setItem(STORAGE_KEY, payload); } catch (_err) { /* Local save */ } }
function saveLocal() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveLocalNow, 300);
}
function invalidatePlayFrameCache() { playFrameCanvasCache.clear(); }
function schedulePlayDraw() {
  if (!playCtx || playRunning) return;
  cancelAnimationFrame(playDrawFrame);
  playDrawFrame = requestAnimationFrame(drawPlayScene);
}
function validProjectShape(project) {
  return project && typeof project === "object" && projectWidth(project) >= 1 && projectWidth(project) <= 512 && projectHeight(project) >= 1 && projectHeight(project) <= 512 && Array.isArray(project.frames);
}
function loadLocal() { try { const saved = localStorage.getItem(STORAGE_KEY); if (!saved || saved.length > MAX_AUTOSAVE_CHARS) return false; const next = JSON.parse(saved); if (!validProjectShape(next)) return false; state = next; normalizeProject(); clampActive(); return true; } catch (_err) { return false; } }
function historyLimit() { const maxDim = Math.max(projectWidth(), projectHeight()); return maxDim >= 256 ? 16 : maxDim >= 128 ? 32 : 60; }
function pushHistory() { undoStack.push(clone(state)); while (undoStack.length > historyLimit()) undoStack.shift(); redoStack = []; }
function restore(next) { state = next; clampActive(); syncControls(); renderAll(); }
function normalizeProject() {
  if (!Array.isArray(state.palettePresets) || !state.palettePresets.length) {
    state.palettePresets = [{ name: "Base", colors: Array.isArray(state.palette) ? [...state.palette] : [...DEFAULT_PALETTE] }];
  }
  state.palettePresets = state.palettePresets.map((preset, index) => ({
    name: preset.name || `Preset ${index + 1}`,
    colors: Array.isArray(preset.colors) && preset.colors.length ? preset.colors : [...DEFAULT_PALETTE]
  }));
  state.activePalettePreset = Math.max(0, Math.min(Number(state.activePalettePreset) || 0, state.palettePresets.length - 1));
  state.palette = state.palettePresets[state.activePalettePreset].colors;
  syncProjectSizeAlias(state);
  state.frames.forEach(projectFrame => projectFrame.layers.forEach(projectLayer => {
    if (!Array.isArray(projectLayer.pixels) || projectLayer.pixels.length !== projectHeight() || projectLayer.pixels.some(row => !Array.isArray(row) || row.length !== projectWidth())) projectLayer.pixels = resamplePixels(projectLayer.pixels || blankPixels(projectLayer.sourceSize || state.size || 32), projectWidth(), projectHeight());
    if (!Array.isArray(projectLayer.sourcePixels)) setLayerSource(projectLayer);
  }));
  if (!state.playMode || typeof state.playMode !== "object") state.playMode = { idleFrame: 0, walkFrame: 0, jumpFrame: 0, sceneWidth: 640, sceneHeight: 360, worldWidth: 1600, groundY: 300, actorScale: 3, backgroundFrame: -1, backgroundScale: "cover", showGridOverlay: true, cameraFollow: true, autoScroll: false, scrollSpeed: 1.25, sceneryFrame: -1, sceneryScale: 3, scenerySpeed: 0.45, sceneryY: 248, visualLayers: defaultPlayVisualLayers(), props: [] };
  state.playMode.idleFrame = Math.max(0, Math.min(Number(state.playMode.idleFrame) || 0, state.frames.length - 1));
  state.playMode.walkFrame = Math.max(0, Math.min(Number(state.playMode.walkFrame) || state.playMode.idleFrame, state.frames.length - 1));
  state.playMode.jumpFrame = Math.max(0, Math.min(Number(state.playMode.jumpFrame) || state.playMode.idleFrame, state.frames.length - 1));
  state.playMode.sceneWidth = Math.max(160, Math.min(Number(state.playMode.sceneWidth) || 640, 4096));
  state.playMode.sceneHeight = Math.max(120, Math.min(Number(state.playMode.sceneHeight) || 360, 2160));
  state.playMode.worldWidth = Math.max(state.playMode.sceneWidth, Math.min(Number(state.playMode.worldWidth) || Math.max(1600, state.playMode.sceneWidth), 20000));
  state.playMode.groundY = Math.max(32, Math.min(Number(state.playMode.groundY) || Math.round(state.playMode.sceneHeight * 0.84), state.playMode.sceneHeight - 8));
  state.playMode.actorScale = Math.max(1, Math.min(Number(state.playMode.actorScale) || 3, 16));
  state.playMode.backgroundFrame = Number.isFinite(Number(state.playMode.backgroundFrame)) ? Math.max(-1, Math.min(Number(state.playMode.backgroundFrame), state.frames.length - 1)) : -1;
  state.playMode.backgroundScale = ["cover", "contain", "stretch", "tile"].includes(state.playMode.backgroundScale) ? state.playMode.backgroundScale : "cover";
  state.playMode.showGridOverlay = state.playMode.showGridOverlay !== false;
  state.playMode.cameraFollow = state.playMode.cameraFollow !== false;
  state.playMode.autoScroll = state.playMode.autoScroll === true;
  state.playMode.scrollSpeed = Math.max(0, Math.min(Number(state.playMode.scrollSpeed) || 1.25, 20));
  state.playMode.sceneryFrame = Number.isFinite(Number(state.playMode.sceneryFrame)) ? Math.max(-1, Math.min(Number(state.playMode.sceneryFrame), state.frames.length - 1)) : -1;
  state.playMode.sceneryScale = Math.max(0.5, Math.min(Number(state.playMode.sceneryScale) || 3, 32));
  state.playMode.scenerySpeed = Math.max(-4, Math.min(Number(state.playMode.scenerySpeed) || 0.45, 4));
  state.playMode.sceneryY = Math.max(-1024, Math.min(Number(state.playMode.sceneryY) || Math.max(0, state.playMode.groundY - projectHeight() * state.playMode.sceneryScale), 2160));
  if (!Array.isArray(state.playMode.visualLayers)) {
    state.playMode.visualLayers = defaultPlayVisualLayers();
    if (Number(state.playMode.backgroundFrame) >= 0) state.playMode.visualLayers[0].frame = Number(state.playMode.backgroundFrame);
    if (Number(state.playMode.sceneryFrame) >= 0) {
      state.playMode.visualLayers[2].frame = Number(state.playMode.sceneryFrame);
      state.playMode.visualLayers[2].scale = state.playMode.sceneryScale;
      state.playMode.visualLayers[2].parallax = state.playMode.scenerySpeed;
      state.playMode.visualLayers[2].y = state.playMode.sceneryY;
    }
  }
  state.playMode.visualLayers = defaultPlayVisualLayers().map((base, index) => clampPlayLayer({ ...base, ...(state.playMode.visualLayers[index] || {}) }, index));
  selectedPlayLayer = Math.max(0, Math.min(Number(selectedPlayLayer) || 0, state.playMode.visualLayers.length - 1));
  if (!Array.isArray(state.playMode.props)) state.playMode.props = [];
  state.playMode.props = state.playMode.props
    .filter(prop => Number.isFinite(Number(prop.frame)))
    .map(prop => ({
      frame: Math.max(0, Math.min(Number(prop.frame) || 0, state.frames.length - 1)),
      x: Number(prop.x) || 0,
      y: Number(prop.y) || 0,
      scale: Math.max(1, Math.min(Number(prop.scale) || state.playMode.actorScale, 16)),
      solid: prop.solid !== false
    }));
  selectedPlayProp = Math.max(-1, Math.min(selectedPlayProp, state.playMode.props.length - 1));

}
function clampActive() { normalizeProject(); state.activeFrame = Math.max(0, Math.min(state.activeFrame, state.frames.length - 1)); state.activeLayer = Math.max(0, Math.min(state.activeLayer, frame().layers.length - 1)); state.activePalettePreset = Math.max(0, Math.min(state.activePalettePreset || 0, state.palettePresets.length - 1)); state.palette = state.palettePresets[state.activePalettePreset].colors; }
function activePreset() { normalizeProject(); return state.palettePresets[state.activePalettePreset]; }


// Tool UI
function setupTools() {
  const grid = $("#tool-grid");
  grid.innerHTML = "";
  TOOLS.forEach(([id, label, key]) => {
    const b = document.createElement("button");
    b.className = "tool-btn" + (id === tool ? " active" : "");
    b.dataset.tool = id;
    b.type = "button";
    b.setAttribute("aria-pressed", id === tool ? "true" : "false");
    b.setAttribute("aria-label", `${label} tool. Shortcut ${key}.`);
    b.textContent = `${label} ${key}`;
    b.addEventListener("click", () => setTool(id));
    grid.appendChild(b);
  });
}
function toolDisplayName(id) { const match = TOOLS.find(([toolId]) => toolId === id); return match ? match[1].toLowerCase() : id; }
function setTool(id) {
  if (tool === id) return;
  tool = id;
  document.querySelectorAll(".tool-btn").forEach(btn => {
    const active = btn.dataset.tool === id;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  setStatus(`${toolDisplayName(id)} selected.`);
}



// Touch layout
const quickActionsHome = document.createComment("quick actions home");
if (quickActionsDock?.parentNode) quickActionsDock.parentNode.insertBefore(quickActionsHome, quickActionsDock);

function moveTouchUtilityDock(enabled) {
  if (!quickActionsDock || !paletteDock || !toolsPanel) return;
  if (enabled) {
    quickActionsDock.classList.add("touch-utility-dock");
    paletteDock.insertAdjacentElement("afterend", quickActionsDock);
    return;
  }
  quickActionsDock.classList.remove("touch-utility-dock");
  if (quickActionsHome.parentNode) quickActionsHome.parentNode.insertBefore(quickActionsDock, quickActionsHome.nextSibling);
}

// Toolbar collapse
touchToolbarCollapseBtn.id = "touch-toolbar-collapse-btn";
touchToolbarCollapseBtn.className = "touch-toolbar-collapse-btn";
touchToolbarCollapseBtn.type = "button";
touchToolbarCollapseBtn.setAttribute("aria-controls", "touch-tools-panel");
touchToolbarCollapseBtn.addEventListener("click", () => setTouchToolbarCollapsed(!touchToolsCollapsed, true));
if (toolsPanel) {
  toolsPanel.id = toolsPanel.id || "touch-tools-panel";
  toolsPanel.insertAdjacentElement("beforebegin", touchToolbarCollapseBtn);
}

// Collapse state
function setTouchToolbarCollapsed(collapsed, announce = false) {
  touchToolsCollapsed = Boolean(collapsed);
  document.body.classList.toggle("touch-tools-collapsed", touchMode && touchToolsCollapsed);
  touchToolbarCollapseBtn.hidden = !touchMode;
  touchToolbarCollapseBtn.setAttribute("aria-expanded", String(touchMode && !touchToolsCollapsed));
  touchToolbarCollapseBtn.setAttribute("aria-label", touchToolsCollapsed ? "Show bottom touch tools" : "Hide bottom touch tools");
  touchToolbarCollapseBtn.innerHTML = `${touchToolsCollapsed ? "⌃" : "⌄"}<span class="sr-only">${touchToolsCollapsed ? " Show bottom touch tools" : " Hide bottom touch tools"}</span>`;
  localStorage.setItem(STORAGE_TOUCH_TOOLS_COLLAPSED_KEY, touchToolsCollapsed ? "1" : "0");
  if (announce) setStatus(touchToolsCollapsed ? "Bottom touch toolbar minimized." : "Bottom touch toolbar expanded.");
}

// Touch controls
function setTouchMode(enabled, announce = true, hand = leftHandTouchMode ? "left" : "right") {
  touchMode = Boolean(enabled);
  leftHandTouchMode = touchMode && hand === "left";
  document.body.classList.toggle("touch-mode", touchMode);
  document.body.classList.toggle("left-hand-touch", leftHandTouchMode);
  moveTouchUtilityDock(touchMode);
  touchToggleBtn?.setAttribute("aria-pressed", String(touchMode));
  leftHandedToggleBtn?.setAttribute("aria-pressed", String(leftHandTouchMode));
  if (touchToggleBtn) touchToggleBtn.innerHTML = `Touch Toggle<span class="sr-only">, currently ${touchMode ? "on" : "off"}</span>`;
  if (leftHandedToggleBtn) {
    leftHandedToggleBtn.disabled = !touchMode;
    leftHandedToggleBtn.innerHTML = `Left<span class="sr-only"> handed touch layout, currently ${leftHandTouchMode ? "on" : "off"}</span>`;
  }
  localStorage.setItem(STORAGE_TOUCH_KEY, touchMode ? "1" : "0");
  localStorage.setItem(STORAGE_TOUCH_HAND_KEY, leftHandTouchMode ? "left" : "right");
  setTouchToolbarCollapsed(touchToolsCollapsed, false);
  if (announce) {
    const message = touchMode
      ? (leftHandTouchMode ? "Touch Toggle on with left handed layout. Palette and utility controls are on the right side." : "Touch Toggle on. Controls are larger and touch input is safer.")
      : "Touch Toggle off. Desktop controls restored.";
    setStatus(message);
  }
}

function loadTouchMode() {
  const savedHand = localStorage.getItem(STORAGE_TOUCH_HAND_KEY) === "left" ? "left" : "right";
  touchToolsCollapsed = localStorage.getItem(STORAGE_TOUCH_TOOLS_COLLAPSED_KEY) === "1";
  setTouchMode(localStorage.getItem(STORAGE_TOUCH_KEY) === "1", false, savedHand);
}

function resetTouchPointers() {
  touchPointers.clear();
  touchPan = null;
}


// Canvas draw
function renderAll() {
  invalidatePlayFrameCache();
  drawCanvas();
  renderFrames();
  renderLayers();
  renderPalette();
  renderStoryboard();
  if (playModeScreen) { renderPlayPanel(); drawPlayPreview(); }
  if (printMode) schedulePrintPreview();
  saveLocal();
}

function renderStoryboard() {
  storyboardPreview.innerHTML = "";
  storyboardPreview.classList.toggle("hidden", !storyboardMode);
  if (!storyboardMode) return;
  const w = projectWidth(), h = projectHeight();
  state.frames.forEach(f => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const cctx = c.getContext("2d");
    f.layers.forEach(l => {
      if (!l.visible) return;
      for (let y=0;y<h;y++) for (let x=0;x<w;x++) {
        const px=l.pixels[y]?.[x];
        if (!px) continue;
        cctx.fillStyle=px;
        cctx.fillRect(x,y,1,1);
      }
    });
    storyboardPreview.appendChild(c);
  });
}

// Canvas metrics
function updateEditorCanvasMetrics() {
  const w = projectWidth(), h = projectHeight();
  const maxDisplay = 768;
  const ratio = Math.min(maxDisplay / w, maxDisplay / h);
  const nextWidth = Math.max(1, Math.round(w * ratio));
  const nextHeight = Math.max(1, Math.round(h * ratio));
  const key = `${w}:${h}:${nextWidth}:${nextHeight}`;
  if (editorCanvasMetricsCache === key) return;
  editorCanvasMetricsCache = key;
  canvas.width = nextWidth;
  canvas.height = nextHeight;
  canvas.style.aspectRatio = `${w} / ${h}`;
  gridPathCache = null;
  gridBitmapCache = null;
}
function cellSize() { return Math.min(canvas.width / projectWidth(), canvas.height / projectHeight()); }

function isDarkTheme() { return document.documentElement.dataset.theme === "dark"; }
function canvasBackgroundColor() { return isDarkTheme() ? "#000" : "#fff"; }
function canvasGridColor(alpha) { return isDarkTheme() ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`; }
function canvasInkColor() { return isDarkTheme() ? "#fff" : "#000"; }
function canvasMutedColor() { return isDarkTheme() ? "#aaa" : "#777"; }
function drawCanvas() {
  updateEditorCanvasMetrics();
  const w = projectWidth(), h = projectHeight(), cell = cellSize();
  if (renderScratch.width !== w || renderScratch.height !== h) {
    renderScratch.width = w;
    renderScratch.height = h;
  }
  renderScratchCtx.clearRect(0, 0, w, h);
  renderScratchCtx.imageSmoothingEnabled = false;
  if (showOnion && state.activeFrame > 0) drawCompositedFrame(state.frames[state.activeFrame - 1], 0.22, renderScratchCtx);
  drawCompositedFrame(frame(), 1, renderScratchCtx);
  if (previewLayer) drawPixelGrid(previewLayer, 1, renderScratchCtx);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = canvasBackgroundColor();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(renderScratch, 0, 0, canvas.width, canvas.height);
  if (referenceImage) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(referenceImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  if (showGrid) drawGrid(w, h, cell);
  drawSelectionOverlay(cell);
}

// Selection overlay
function drawSelectionOverlay(cell) {
  const box = activeSelectionBox();
  if (!box) return;
  const x = box.x * cell, y = box.y * cell, w = box.w * cell, h = box.h * cell;
  ctx.save();
  ctx.strokeStyle = canvasInkColor();
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(Math.round(x) + 1, Math.round(y) + 1, Math.max(1, Math.round(w) - 2), Math.max(1, Math.round(h) - 2));
  ctx.fillStyle = isDarkTheme() ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}
function drawCompositedFrame(f, alphaMul, targetCtx = ctx) { f.layers.forEach(l => { if (l.visible) drawPixelGrid(l.pixels, l.opacity * alphaMul, targetCtx); }); }
function drawPixelGrid(pixels, alpha, targetCtx = ctx) {
  targetCtx.save();
  targetCtx.globalAlpha = alpha;
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
    const c = pixels[y]?.[x]; if (!c) continue; targetCtx.fillStyle = c; targetCtx.fillRect(x, y, 1, 1);
  }
  targetCtx.restore();
}
function drawGrid(width, height, cell) {
  const step = Math.max(1, Math.ceil(4 / Math.max(cell, 0.01)));
  const alpha = cell >= 4 ? 0.18 : 0.24;
  const pitch = Math.max(1, Math.round(cell * step));
  const key = `${width}:${height}:${cell}:${canvas.width}:${canvas.height}:${step}:${pitch}:${isDarkTheme() ? "dark" : "light"}`;
  if (!gridBitmapCache || gridBitmapCache.key !== key) {
    const tile = document.createElement("canvas");
    tile.width = pitch;
    tile.height = pitch;
    const tileCtx = tile.getContext("2d", { alpha: true });
    tileCtx.strokeStyle = canvasGridColor(alpha);
    tileCtx.lineWidth = 1;
    tileCtx.beginPath();
    tileCtx.moveTo(0.5, 0);
    tileCtx.lineTo(0.5, pitch);
    tileCtx.moveTo(0, 0.5);
    tileCtx.lineTo(pitch, 0.5);
    tileCtx.stroke();

    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = canvas.width;
    gridCanvas.height = canvas.height;
    const gridCtx = gridCanvas.getContext("2d", { alpha: true });
    const pattern = gridCtx.createPattern(tile, "repeat");
    gridCtx.fillStyle = pattern;
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridBitmapCache = { key, canvas: gridCanvas };
    gridPathCache = null;
  }
  ctx.drawImage(gridBitmapCache.canvas, 0, 0);
}

// Drawing input
function getPixel(e) {
  const r = canvas.getBoundingClientRect(), c = cellSize();
  return { x: Math.max(0, Math.min(projectWidth() - 1, Math.floor((e.clientX - r.left) * (canvas.width / r.width) / c))), y: Math.max(0, Math.min(projectHeight() - 1, Math.floor((e.clientY - r.top) * (canvas.height / r.height) / c))) };
}
function setPixel(x, y, c, target = layer().pixels) {
  const half = Math.floor(brushSize / 2);
  for (let yy = y - half; yy <= y + half; yy++) for (let xx = x - half; xx <= x + half; xx++) {
    paintPixel(xx, yy, c, target);
    if (symmetryMode) paintPixel(projectWidth() - 1 - xx, yy, c, target);
  }
}
function paintPixel(x, y, c, target = layer().pixels) {
  const w = projectWidth(), h = projectHeight();
  if (x >= 0 && y >= 0 && x < w && y < h) target[y][x] = c;
}

// Extension core
const PixelBug = (() => {
  const pluginApi = {
    version: "1.3.0",
    tools: new Map(),
    effects: new Map(),
    exporters: new Map(),
    panels: new Map(),
    registerTool(id, config) {
      if (!id || !config) return false;
      this.tools.set(id, { id, ...config });
      renderPluginAssets();
      return true;
    },
    registerEffect(id, config) {
      if (!id || !config?.apply) return false;
      this.effects.set(id, { id, ...config });
      syncEffectSelect();
      renderPluginAssets();
      return true;
    },
    registerExporter(id, config) {
      if (!id || !config?.run) return false;
      this.exporters.set(id, { id, ...config });
      renderPluginAssets();
      return true;
    },
    registerPanel(id, config) {
      if (!id || !config?.mount) return false;
      this.panels.set(id, { id, ...config });
      renderPluginAssets();
      return true;
    },
    activeFrame() { return frame(); },
    activeLayer() { return pixelLayerFacade(layer()); },
    project() { return state; },
    redraw() { drawCanvas(); renderFrames(); renderLayers(); saveLocal(); },
    setStatus(message) { setStatus(String(message || "")); },
    colors() { return [...state.palette]; }
  };
  window.PixelBug = pluginApi;
  return pluginApi;
})();

// Brush presets
const BUILT_IN_BRUSHES = [
  { id: "square", name: "Square", pixels: [["#"]] },
  { id: "plus", name: "Plus", pixels: [[null,"#",null],["#","#","#"],[null,"#",null]] },
  { id: "checker", name: "Checker", pixels: [["#",null,"#"],[null,"#",null],["#",null,"#"]] },
  { id: "grass", name: "Grass", pixels: [[null,"#",null],["#","#",null],[null,"#","#"]] }
];

function allBrushes() { return [...BUILT_IN_BRUSHES, ...customBrushes]; }
function activeBrush() { return allBrushes().find(b => b.id === activeBrushId) || BUILT_IN_BRUSHES[0]; }
function stampBrush(x, y, c, target = layer().pixels) {
  const brush = activeBrush();
  if (!brush || brush.id === "square") return setPixel(x, y, c, target);
  if (brush.code) return stampCodeBrush(brush, x, y, c, target);
  const rows = brush.pixels || [["#"]];
  const oy = Math.floor(rows.length / 2);
  const ox = Math.floor((rows[0]?.length || 1) / 2);
  rows.forEach((row, yy) => row.forEach((mark, xx) => {
    if (!mark) return;
    paintPixel(x + xx - ox, y + yy - oy, mark === "#" ? c : mark, target);
    if (symmetryMode) paintPixel(projectWidth() - 1 - (x + xx - ox), y + yy - oy, mark === "#" ? c : mark, target);
  }));
}
function stampCodeBrush(brush, x, y, c, target = layer().pixels) {
  runModBrushCode(brush.code, x, y, c, target)
    .then(result => {
      if (!applyBrushDots(result, x, y, c, target)) paintPixel(x, y, c, target);
      drawCanvas();
      renderFrames();
      saveLocal();
    })
    .catch(err => setStatus(`Brush error: ${err.message}`));
}
function renderBrushLab() {
  if (!brushPresetSelect) return;
  brushPresetSelect.innerHTML = "";
  allBrushes().forEach(brush => {
    const option = document.createElement("option");
    option.value = brush.id;
    option.textContent = brush.name;
    brushPresetSelect.appendChild(option);
  });
  brushPresetSelect.value = activeBrushId;
  if (brushPreview) {
    const rows = activeBrush().pixels || [["#"]];
    brushPreview.innerHTML = rows.map(row => `<div>${row.map(cell => `<span class="${cell ? "on" : "off"}"></span>`).join("")}</div>`).join("");
  }
}
function saveSelectionAsBrush() {
  if (!selectionBox) return setStatus("Make a selection before saving a brush.");
  const data = extractPixels(selectionBox, false);
  const id = `brush-${Date.now()}`;
  customBrushes.push({ id, name: `Brush ${customBrushes.length + 1}`, pixels: data.pixels.map(row => row.map(c => c ? "#" : null)) });
  activeBrushId = id;
  renderBrushLab();
  saveExtensionPrefs();
  setStatus("Selection saved as a brush preset.");
}

// Workspace presets
const WORKSPACE_PRESETS = {
  Pixel: ["pixelizer","tools","text-tool","drawing-controls","quick-actions","brush-lab","workspace-presets","frames","layers","palette"],
  Animate: ["tools","quick-actions","workspace-presets","frames","layers","palette","effects-stack"],
  Assets: ["pixelizer","brush-lab","workspace-presets","palette"],
  Mod: ["brush-lab","workspace-presets","effects-stack","palette"],
  Play: ["pixelizer","tools","quick-actions","workspace-presets","frames","layers"],
  Print: ["pixelizer","workspace-presets","palette","frames","layers"]
};
function renderWorkspacePresets() {
  if (!workspacePresetGrid) return;
  workspacePresetGrid.innerHTML = "";
  Object.keys(WORKSPACE_PRESETS).forEach(name => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    btn.onclick = () => applyWorkspacePreset(name);
    workspacePresetGrid.appendChild(btn);
  });
}
function applyWorkspacePreset(name) {
  const visible = new Set(WORKSPACE_PRESETS[name] || []);
  dockCards().forEach(card => { card.hidden = visible.size && !visible.has(card.dataset.dockId); });
  if (name === "Play" && !playModeScreen) setPlayModeScreen(true);
  if (name === "Print" && !printMode) setPrintMode(true);
  setStatus(`${name} workspace loaded.`);
}

// Effects stack
const CORE_EFFECTS = {
  outline: { name: "Outline", apply: pixels => outlinePixels(pixels, color || "#000000") },
  shadow: { name: "Shadow", apply: pixels => offsetPixels(pixels, 1, 1, "rgba(0,0,0,0.45)", true) },
  dither: { name: "Dither", apply: pixels => ditherPixels(pixels) },
  limitPalette: { name: "Limit Palette", apply: pixels => limitPixelsToPalette(pixels, state.palette) }
};
Object.entries(CORE_EFFECTS).forEach(([id, config]) => PixelBug.registerEffect(id, config));
function copyPixels(pixels) { return pixels.map(row => row.slice()); }
function forEachPixelNeighbor(x, y, cb) { [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => cb(x + dx, y + dy)); }
function outlinePixels(pixels, outlineColor) {
  const out = copyPixels(pixels);
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
    if (pixels[y][x]) continue;
    let edge = false;
    forEachPixelNeighbor(x, y, (nx, ny) => { if (pixels[ny]?.[nx]) edge = true; });
    if (edge) out[y][x] = outlineColor;
  }
  return out;
}
function offsetPixels(pixels, dx, dy, fill, under = false) {
  const out = under ? blankPixels(projectWidth(), projectHeight()) : copyPixels(pixels);
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) if (pixels[y][x]) paintPixel(x + dx, y + dy, fill, out);
  if (under) for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) if (pixels[y][x]) out[y][x] = pixels[y][x];
  return out;
}
function ditherPixels(pixels) {
  return pixels.map((row, y) => row.map((c, x) => (c && (x + y) % 2 === 0) ? c : null));
}
function hexDistance(a, b) {
  const aa = parseHex(a), bb = parseHex(b);
  if (!aa || !bb) return Number.MAX_SAFE_INTEGER;
  return (aa.r-bb.r)**2 + (aa.g-bb.g)**2 + (aa.b-bb.b)**2;
}
function parseHex(hex) {
  const m = String(hex).match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function limitPixelsToPalette(pixels, palette) {
  const colors = palette.filter(isHexColor);
  if (!colors.length) return copyPixels(pixels);
  return pixels.map(row => row.map(c => c ? colors.reduce((best, next) => hexDistance(c, next) < hexDistance(c, best) ? next : best, colors[0]) : null));
}
function syncEffectSelect() {
  if (!effectSelect) return;
  const selected = effectSelect.value;
  effectSelect.innerHTML = "";
  PixelBug.effects.forEach(effect => {
    const option = document.createElement("option");
    option.value = effect.id;
    option.textContent = effect.name || effect.id;
    effectSelect.appendChild(option);
  });
  if (selected) effectSelect.value = selected;
}

async function runSelectedEffect(apply = false) {
  const effect = PixelBug.effects.get(effectSelect?.value);
  if (!effect) return setStatus("Choose an effect first.");
  try {
    const source = copyPixels(layer().pixels);
    const next = effect.code
      ? await runModEffectCode(effect.code, source, color)
      : effect.apply(source, PixelBug);
    if (!Array.isArray(next)) return setStatus("Effect did not return pixels.");
    if (apply) {
      pushHistory();
      layer().pixels = next;
      effectPreview = null;
      previewLayer = null;
      renderAll();
      saveLocal();
      setStatus("Effect applied to active layer.");
    } else {
      effectPreview = next;
      previewLayer = effectPreview;
      drawCanvas();
      setStatus("Effect preview on. Apply or Clear to continue.");
    }
  } catch (err) {
    setStatus(`Effect error: ${err.message}`);
  }
}

// Mod helpers
function setModMode(enabled) {
  modMode = Boolean(enabled);
  document.body.classList.toggle("mod-mode", modMode);
  if (modModeBtn) {
    modModeBtn.setAttribute("aria-pressed", String(modMode));
    modModeBtn.textContent = modMode ? "Base Mode" : "Mod Mode";
  }
  if (modSandboxPanel) modSandboxPanel.hidden = !modMode;
  if (modMode) {
    resetModPreview(false);
    renderModControls();
    drawModPreview();
    setStatus("Mod Mode on. Canvas stays safe.");
  } else {
    modPointerDown = false;
    setStatus("Mod Mode off.");
  }
}
function resetModPreview(announce = true) {
  if (modUseCanvasInput?.checked) {
    modPreviewPixels = flattenedPixels(frame());
  } else {
    modPreviewPixels = blankPixels(projectWidth(), projectHeight());
    const midY = Math.floor(projectHeight() / 2);
    const midX = Math.floor(projectWidth() / 2);
    for (let x = 3; x < projectWidth() - 3; x++) paintPixel(x, midY, "#777777", modPreviewPixels);
    for (let y = 3; y < projectHeight() - 3; y++) paintPixel(midX, y, "#777777", modPreviewPixels);
  }
  drawModPreview();
  if (announce) setStatus(modUseCanvasInput?.checked ? "Canvas copied." : "Test reset.");
}
function renderModControls() {
  if (modBrushSelect) {
    const selected = modBrushSelect.value || activeBrushId;
    modBrushSelect.innerHTML = "";
    allBrushes().forEach(brush => {
      const option = document.createElement("option");
      option.value = brush.id;
      option.textContent = brush.name;
      modBrushSelect.appendChild(option);
    });
    modBrushSelect.value = allBrushes().some(b => b.id === selected) ? selected : activeBrushId;
  }
  if (modEffectSelect) {
    const selected = modEffectSelect.value;
    modEffectSelect.innerHTML = "";
    PixelBug.effects.forEach(effect => {
      const option = document.createElement("option");
      option.value = effect.id;
      option.textContent = effect.name || effect.id;
      modEffectSelect.appendChild(option);
    });
    if (selected) modEffectSelect.value = selected;
  }
}
function modCellSize() {
  if (!modPreviewCanvas) return 1;
  return Math.min(modPreviewCanvas.width / projectWidth(), modPreviewCanvas.height / projectHeight());
}
function drawModPreview() {
  if (!modPreviewCtx || !modPreviewCanvas) return;
  if (!modPreviewPixels) resetModPreview(false);
  modPreviewCtx.imageSmoothingEnabled = false;
  modPreviewCtx.fillStyle = canvasBackgroundColor();
  modPreviewCtx.fillRect(0, 0, modPreviewCanvas.width, modPreviewCanvas.height);
  const scale = modCellSize();
  modPreviewPixels.forEach((row, y) => row.forEach((px, x) => {
    if (!px) return;
    modPreviewCtx.fillStyle = px;
    modPreviewCtx.fillRect(Math.floor(x * scale), Math.floor(y * scale), Math.ceil(scale), Math.ceil(scale));
  }));
}
function getModPixel(e) {
  const rect = modPreviewCanvas.getBoundingClientRect();
  const scale = modCellSize();
  return {
    x: Math.max(0, Math.min(projectWidth() - 1, Math.floor((e.clientX - rect.left) * (modPreviewCanvas.width / rect.width) / scale))),
    y: Math.max(0, Math.min(projectHeight() - 1, Math.floor((e.clientY - rect.top) * (modPreviewCanvas.height / rect.height) / scale)))
  };
}
function validateModCode(code) {
  const text = String(code || "");
  if (text.length > 12000) throw new Error("Code too long.");
  const blocked = /\b(?:window|document|globalThis|pixelBug|localStorage|indexedDB|fetch|XMLHttpRequest|WebSocket|Function|eval|importScripts|navigator|constructor|prototype|__proto__)\b/;
  if (blocked.test(text)) throw new Error("Blocked API.");
  return text;
}

let modBrushRunner = null;
let modBrushRunnerCode = "";
let modEffectRunner = null;
let modEffectRunnerCode = "";
let modRunnerSeq = 0;

// Worker setup
function stopModRunner(runner) {
  if (!runner) return;
  try { runner.worker.terminate(); } catch (_err) { /* worker cleanup */ }
  runner.pending.forEach(item => item.reject(new Error("Runner reset.")));
  runner.pending.clear();
  URL.revokeObjectURL(runner.url);
}

// Worker source
function createModRunner(kind, code) {
  const source = validateModCode(code);
  const isBrush = kind === "brush";
  const functionMatch = source.match(isBrush ? /function\s+brush\s*\(([^)]*)\)/ : /function\s+effect\s*\(([^)]*)\)/);
  const hasNamedFunction = Boolean(functionMatch);
  const params = functionMatch ? functionMatch[1].split(",").map(item => item.trim().toLowerCase()).filter(Boolean) : [];
  const effectMode = !isBrush && params.length
    ? ((params[0] === "pixels" || params[0] === "image" || params[0] === "layer") ? "pixels" : ((params[0] === "r" || params[0] === "red") ? "rgba" : "cell"))
    : "direct";
  const runnerBody = hasNamedFunction
    ? (isBrush
      ? `\n${source}\nreturn input => brush(input.x, input.y, input.color, input.pixels, input.app);\n`
      : `\n${source}\nreturn input => {\n  const pixels = input.pixels;\n  const app = input.app;\n  const color = input.color;\n  const getPixel = (x, y) => pixels[y] && pixels[y][x] ? pixels[y][x] : null;\n  const clamp = value => Math.max(0, Math.min(255, Math.round(Number(value) || 0)));\n  const toHex = value => clamp(value).toString(16).padStart(2, "0");\n  const parsePixel = px => {\n    if (!px || typeof px !== "string") return { r: 0, g: 0, b: 0, a: 0 };\n    const value = px.startsWith("#") ? px.slice(1) : px;\n    if (value.length !== 6) return { r: 0, g: 0, b: 0, a: 255 };\n    const n = parseInt(value, 16);\n    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 255 };\n  };\n  const normalizePixel = (next, fallback) => {\n    if (next === undefined) return fallback;\n    if (next === null || next === false || next === "") return null;\n    if (typeof next === "string") return next;\n    if (typeof next === "object") {\n      const alpha = next.a ?? next.alpha ?? 255;\n      if (alpha <= 0) return null;\n      return ` + "`#${toHex(next.r ?? next.red)}${toHex(next.g ?? next.green)}${toHex(next.b ?? next.blue)}`" + `;\n    }\n    return fallback;\n  };\n  if ("${effectMode}" === "pixels") {\n    const next = effect(pixels, app, color);\n    return Array.isArray(next) ? next : pixels;\n  }\n  if ("${effectMode}" === "rgba") {\n    return pixels.map((row, y) => row.map((px, x) => {\n      const rgba = parsePixel(px);\n      if (!px && rgba.a === 0) return null;\n      const next = effect(rgba.r, rgba.g, rgba.b, rgba.a, x, y, app, color);\n      return normalizePixel(next, px);\n    }));\n  }\n  return pixels.map((row, y) => row.map((px, x) => normalizePixel(effect(x, y, px, getPixel, app, color), px)));\n};\n`)
    : `\nreturn input => {\n  const ${isBrush ? "{ x, y, color, pixels, app }" : "{ pixels, app, color }"} = input;\n  ${source}\n};\n`;
  const workerSource = `"use strict";\nlet __runner;\ntry {\n  __runner = (() => {${runnerBody}})();\n} catch (err) {\n  self.postMessage({ initError: err && err.message ? err.message : String(err) });\n}\nself.onmessage = event => {\n  const id = event.data && event.data.id;\n  try {\n    if (!__runner) throw new Error("Runner did not load.");\n    self.postMessage({ id, result: __runner(event.data.payload) });\n  } catch (err) {\n    self.postMessage({ id, error: err && err.message ? err.message : String(err) });\n  }\n};`;
  const blob = new Blob([workerSource], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  const runner = { worker, url, pending: new Map(), initError: "" };
  worker.onmessage = event => {
    if (event.data?.initError) {
      runner.initError = event.data.initError;
      runner.pending.forEach(item => item.reject(new Error(runner.initError)));
      runner.pending.clear();
      return;
    }
    const item = runner.pending.get(event.data?.id);
    if (!item) return;
    runner.pending.delete(event.data.id);
    if (event.data.error) item.reject(new Error(event.data.error));
    else item.resolve(event.data.result);
  };
  worker.onerror = event => {
    runner.initError = event.message || "Worker error.";
    runner.pending.forEach(item => item.reject(new Error(runner.initError)));
    runner.pending.clear();
  };
  return runner;
}

// Worker call
function callModRunner(runner, payload) {
  return new Promise((resolve, reject) => {
    if (!runner || runner.initError) return reject(new Error(runner?.initError || "Runner missing."));
    const id = ++modRunnerSeq;
    runner.pending.set(id, { resolve, reject });
    runner.worker.postMessage({ id, payload });
    setTimeout(() => {
      if (!runner.pending.has(id)) return;
      runner.pending.delete(id);
      reject(new Error("Mod timed out."));
    }, 900);
  });
}

// Mod execution
async function runModBrushCode(code, x, y, brushColor, pixels) {
  const source = String(code || "").trim();
  if (!source) return null;
  if (!modBrushRunner || modBrushRunnerCode !== source) {
    stopModRunner(modBrushRunner);
    modBrushRunner = createModRunner("brush", source);
    modBrushRunnerCode = source;
  }
  return callModRunner(modBrushRunner, { x, y, color: brushColor, pixels: copyPixels(pixels), app: { width: projectWidth(), height: projectHeight() } });
}

// Effect execution
async function runModEffectCode(code, pixels, effectColor) {
  const source = String(code || "").trim();
  if (!source) return null;
  if (!modEffectRunner || modEffectRunnerCode !== source) {
    stopModRunner(modEffectRunner);
    modEffectRunner = createModRunner("effect", source);
    modEffectRunnerCode = source;
  }
  return callModRunner(modEffectRunner, { pixels: copyPixels(pixels), app: { width: projectWidth(), height: projectHeight() }, color: effectColor });
}

// Paint output
function applyBrushDots(result, x, y, brushColor, target) {
  if (result == null || result === false) return false;
  if (typeof result === "string") {
    paintPixel(x, y, result, target);
    return true;
  }
  const spots = Array.isArray(result) ? result : [result];
  let painted = false;
  spots.forEach(spot => {
    if (spot == null || spot === false) return;
    if (typeof spot === "string") {
      paintPixel(x, y, spot, target);
      painted = true;
      return;
    }
    const px = Number.isFinite(Number(spot.x)) ? Number(spot.x) : x;
    const py = Number.isFinite(Number(spot.y)) ? Number(spot.y) : y;
    paintPixel(px, py, spot.color || brushColor, target);
    painted = true;
  });
  return painted;
}
function applyModBrushResult(result, x, y, brushColor) {
  return applyBrushDots(result, x, y, brushColor, modPreviewPixels);
}
async function stampModBrush(x, y) {
  if (!modPreviewPixels) resetModPreview(false);
  try {
    const code = modBrushCode?.value.trim();
    if (code) {
      const result = await runModBrushCode(code, x, y, color, modPreviewPixels);
      if (!applyModBrushResult(result, x, y, color)) paintPixel(x, y, color, modPreviewPixels);
    } else {
      const previousBrush = activeBrushId;
      activeBrushId = modBrushSelect?.value || previousBrush;
      stampBrush(x, y, color, modPreviewPixels);
      activeBrushId = previousBrush;
    }
    drawModPreview();
    if (modLivePreview) scheduleModEffect();
  } catch (err) { setStatus(`Brush error: ${err.message}`); }
}
async function runModEffect(announce = true) {
  if (!modPreviewPixels) resetModPreview(false);
  try {
    const base = copyPixels(modPreviewPixels);
    const effectId = modEffectSelect?.value;
    let next = base;
    if (modEffectCode?.value.trim()) {
      next = await runModEffectCode(modEffectCode.value, base, color);
    } else if (effectId) {
      const effect = PixelBug.effects.get(effectId);
      next = effect?.apply(copyPixels(base), PixelBug) || base;
    }
    if (!Array.isArray(next)) {
      next = base;
      if (announce) setStatus("Effect returned one value. Kept canvas.");
    }
    modPreviewPixels = next;
    drawModPreview();
    if (announce) setStatus("Effect tested.");
  } catch (err) {
    if (announce) setStatus(`Mod error: ${err.message}`);
  }
}
function loadModEffectExample(kind) {
  if (!modEffectCode) return;
  if (kind === "outline") {
    modEffectCode.value = `function effect(x, y, pixel, getPixel, app, color) {
  if (pixel) return pixel;
  const near = getPixel(x - 1, y) || getPixel(x + 1, y) || getPixel(x, y - 1) || getPixel(x, y + 1);
  return near ? color : null;
}`;
  } else {
    modEffectCode.value = `function effect(r, g, b, a) {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
    a
  };
}`;
  }
  setStatus("Example loaded.");
  runModEffect(true);
}
function scheduleModEffect() {
  if (!modMode || !modLivePreview) return;
  clearTimeout(modPreviewTimer);
  modPreviewTimer = setTimeout(() => runModEffect(false), 220);
}
function cleanModId(value) {
  return String(value || "my-mod").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-mod";
}
function installModPack(pack, announce = true) {
  if (!pack || pack.type !== "pixel-bug-mod") throw new Error("Not a Pixel Bug mod.");
  const id = cleanModId(pack.id || pack.name);
  const name = String(pack.name || id);
  if (pack.brushCode) {
    const brushCode = validateModCode(pack.brushCode);
    const brush = { id: `${id}-brush`, name: `${name} Brush`, pixels: [["#"]], code: brushCode };
    customBrushes = [...customBrushes.filter(b => b.id !== brush.id), brush];
    activeBrushId = brush.id;
  }
  if (pack.effectCode) {
    const code = validateModCode(pack.effectCode);
    const effectId = `${id}-effect`;
    customEffects = [...customEffects.filter(effect => effect.id !== effectId), { id: effectId, name: `${name} Effect`, code }];
    PixelBug.registerEffect(effectId, {
      name: `${name} Effect`,
      code,
      apply(pixels) { return pixels; }
    });
  }
  renderBrushLab();
  syncEffectSelect();
  renderModControls();
  saveExtensionPrefs();
  if (announce) setStatus("Mod imported. Added to Base Mode.");
}
async function exportModPack() {
  const name = String(modNameInput?.value || "My Mod").trim() || "My Mod";
  const id = cleanModId(modIdInput?.value || name);
  const payload = {
    type: "pixel-bug-mod",
    version: "1.3.0",
    id,
    name,
    brushCode: modBrushCode?.value || "",
    effectCode: modEffectCode?.value || ""
  };
  installModPack(payload, false);
  const fileName = `${id}.pbmod`;
  await saveBase64("Export Mod", fileName, "Pixel Bug Mod", "pbmod", btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))));
  setStatus("Mod exported.");
}
function importModPack(file) {
  if (!file) return;
  if (file.size > 512 * 1024) { setStatus("Mod file too large."); return; }
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const pack = JSON.parse(String(reader.result || "{}"));
      installModPack(pack, true);
      if (modNameInput) modNameInput.value = pack.name || "My Mod";
      if (modIdInput) modIdInput.value = cleanModId(pack.id || pack.name);
      if (modBrushCode) modBrushCode.value = pack.brushCode || "";
      if (modEffectCode) modEffectCode.value = pack.effectCode || "";
      resetModPreview(false);
      runModEffect(false);
    } catch (err) { setStatus(`Could not import mod: ${err.message}`); }
    if (modImportInput) modImportInput.value = "";
  };
  reader.readAsText(file);
}

// Asset packs
function renderPluginAssets() {
  if (!assetList) return;
  const parts = [
    `${customBrushes.length} custom brush${customBrushes.length === 1 ? "" : "es"}`,
    `${state.palettePresets?.length || 0} palette preset${state.palettePresets?.length === 1 ? "" : "s"}`,
    `${PixelBug.effects.size} effect${PixelBug.effects.size === 1 ? "" : "s"}`
  ];
  assetList.textContent = parts.join(" • ");
}
function saveExtensionPrefs() {
  try { localStorage.setItem("pixel-bug-extension-prefs", JSON.stringify({ customBrushes, customEffects, activeBrushId })); } catch (_err) { /* Local prefs */ }
  renderPluginAssets();
}
function loadExtensionPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem("pixel-bug-extension-prefs") || "{}");
    if (Array.isArray(saved.customBrushes)) customBrushes = saved.customBrushes;
    if (Array.isArray(saved.customEffects)) {
      customEffects = saved.customEffects.filter(effect => effect.id && effect.code);
      customEffects.forEach(effect => PixelBug.registerEffect(effect.id, {
        name: effect.name || effect.id,
        code: effect.code,
        apply(pixels) {
          return pixels;
        }
      }));
    }
    if (saved.activeBrushId) activeBrushId = saved.activeBrushId;
  } catch (_err) { /* Local prefs */ }
}
async function exportAssetPack() {
  const payload = { type: "pixel-bug-pack", version: "1.3.0", brushes: customBrushes, palettes: state.palettePresets, workspaces: WORKSPACE_PRESETS };
  await saveBase64("Export Asset Pack", "pixel-bug-assets.pbpack", "Pixel Bug Pack", "pbpack", btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))));
  setStatus("Asset pack exported.");
}
function importAssetPack(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const pack = JSON.parse(String(reader.result || "{}"));
      if (Array.isArray(pack.brushes)) customBrushes = [...customBrushes, ...pack.brushes.filter(b => b.id && Array.isArray(b.pixels))];
      if (Array.isArray(pack.palettes)) state.palettePresets = [...state.palettePresets, ...pack.palettes.filter(p => p.name && Array.isArray(p.colors))];
      normalizeProject();
      renderAll();
      renderBrushLab();
      saveExtensionPrefs();
      saveLocal();
      setStatus("Asset pack imported.");
    } catch (_err) { setStatus("Could not import asset pack."); }
  };
  reader.readAsText(file);
}

// Script console
function pixelLayerFacade(targetLayer) {
  return {
    width: projectWidth(),
    height: projectHeight(),
    getPixel: (x, y) => targetLayer.pixels[y]?.[x] || null,
    setPixel: (x, y, c) => paintPixel(Number(x), Number(y), c, targetLayer.pixels),
    forEachPixel(callback) {
      for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
        const next = callback(x, y, targetLayer.pixels[y][x]);
        if (next !== undefined) targetLayer.pixels[y][x] = next;
      }
    }
  };
}
function runScriptConsole() {
  setStatus("Scripts run in Mod Mode.");
}

function beginDraw(e) {
  if (touchMode && e.pointerType === "touch") {
    touchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touchPointers.size > 1) {
      drawing = false;
      previewLayer = null;
      const frame = canvas.closest(".canvas-frame");
      touchPan = { x: e.clientX, y: e.clientY, scrollLeft: frame?.scrollLeft || 0, scrollTop: frame?.scrollTop || 0 };
      canvas.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      return;
    }
  }
  startPixel = getPixel(e);
  if (tool === "select") { beginSelection(e); return; }
  drawing = true;
  pushHistory();
  if (tool !== "eyedropper") clearLayerSource();
  applyTool(e, true);
  canvas.setPointerCapture?.(e.pointerId);
}
function moveDraw(e) {
  if (touchMode && e.pointerType === "touch" && touchPan) {
    const frame = canvas.closest(".canvas-frame");
    if (frame) {
      frame.scrollLeft = touchPan.scrollLeft - (e.clientX - touchPan.x);
      frame.scrollTop = touchPan.scrollTop - (e.clientY - touchPan.y);
    }
    e.preventDefault();
    return;
  }
  if (!drawing) return;
  if (tool === "select") { moveSelection(e); return; }
  if (["line", "rect", "ellipse"].includes(tool)) { previewShape(getShapeEnd(e)); return; }
  applyTool(e, false);
}
function endDraw(e) {
  if (touchMode && e.pointerType === "touch") {
    touchPointers.delete(e.pointerId);
    if (touchPointers.size < 2) touchPan = null;
  }
  if (!drawing) return;
  if (tool === "select") { endSelection(e); return; }
  if (["line", "rect", "ellipse"].includes(tool)) { drawShape(startPixel, getShapeEnd(e), layer().pixels); previewLayer = null; }
  drawing = false;
  drawCanvas();
  renderFrames();
  saveLocal();
}

// Selection helpers
function makeSelectionBox(a, b) {
  const minX = Math.min(a.x, b.x), minY = Math.min(a.y, b.y);
  const maxX = Math.max(a.x, b.x), maxY = Math.max(a.y, b.y);
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}
function activeSelectionBox() { return selectionDrag?.previewBox || selectionBox; }
function pointInBox(p, box) { return box && p.x >= box.x && p.y >= box.y && p.x < box.x + box.w && p.y < box.y + box.h; }
function clampSelectionBox(box) {
  return { x: Math.max(0, Math.min(projectWidth() - box.w, box.x)), y: Math.max(0, Math.min(projectHeight() - box.h, box.y)), w: box.w, h: box.h };
}
function extractPixels(box, erase = false) {
  const pixels = Array.from({ length: box.h }, () => Array.from({ length: box.w }, () => null));
  const target = layer().pixels;
  for (let y = 0; y < box.h; y++) for (let x = 0; x < box.w; x++) {
    const sx = box.x + x, sy = box.y + y;
    if (sx < 0 || sy < 0 || sx >= projectWidth() || sy >= projectHeight()) continue;
    pixels[y][x] = target[sy][sx];
    if (erase) target[sy][sx] = null;
  }
  return { w: box.w, h: box.h, pixels };
}
function pastePixels(data, x, y, transparent = true) {
  const target = layer().pixels;
  for (let yy = 0; yy < data.h; yy++) for (let xx = 0; xx < data.w; xx++) {
    const c = data.pixels[yy][xx];
    if (transparent && !c) continue;
    paintPixel(x + xx, y + yy, c, target);
  }
}
function previewPixels(data, box) {
  const saved = blankPixels(projectWidth(), projectHeight());
  const previousBrush = brushSize;
  brushSize = 1;
  for (let yy = 0; yy < data.h; yy++) for (let xx = 0; xx < data.w; xx++) {
    const c = data.pixels[yy][xx];
    if (c) paintPixel(box.x + xx, box.y + yy, c, saved);
  }
  brushSize = previousBrush;
  previewLayer = saved;
  drawCanvas();
}
function beginSelection(e) {
  drawing = true;
  const p = getPixel(e);
  if (selectionBox && pointInBox(p, selectionBox)) {
    pushHistory();
    const data = extractPixels(selectionBox, true);
    selectionDrag = { mode: "move", start: p, originalBox: { ...selectionBox }, previewBox: { ...selectionBox }, data };
    previewLayer = blankPixels(projectWidth(), projectHeight());
  } else {
    selectionDrag = { mode: "create", start: p, previewBox: { x: p.x, y: p.y, w: 1, h: 1 } };
    selectionBox = selectionDrag.previewBox;
  }
  drawCanvas();
  canvas.setPointerCapture?.(e.pointerId);
}
function moveSelection(e) {
  const p = getPixel(e);
  if (!selectionDrag) return;
  if (selectionDrag.mode === "create") {
    selectionDrag.previewBox = makeSelectionBox(selectionDrag.start, p);
    selectionBox = selectionDrag.previewBox;
    drawCanvas();
    return;
  }
  const dx = p.x - selectionDrag.start.x, dy = p.y - selectionDrag.start.y;
  selectionDrag.previewBox = clampSelectionBox({ ...selectionDrag.originalBox, x: selectionDrag.originalBox.x + dx, y: selectionDrag.originalBox.y + dy });
  previewPixels(selectionDrag.data, selectionDrag.previewBox);
}
function endSelection(e) {
  if (!selectionDrag) { drawing = false; return; }
  if (selectionDrag.mode === "move") {
    pastePixels(selectionDrag.data, selectionDrag.previewBox.x, selectionDrag.previewBox.y, true);
    selectionBox = { ...selectionDrag.previewBox };
    previewLayer = null;
  } else {
    selectionBox = { ...selectionDrag.previewBox };
  }
  selectionDrag = null;
  drawing = false;
  drawCanvas();
  renderFrames();
  saveLocal();
}
function selectionAction(action) {
  if (!selectionBox && action !== "paste") return setStatus("Make a selection first.");
  if (action === "copy") { selectionClipboard = extractPixels(selectionBox, false); setStatus("Selection copied."); return; }
  if (action === "cut") { pushHistory(); selectionClipboard = extractPixels(selectionBox, true); renderAll(); setStatus("Selection cut."); return; }
  if (action === "delete") { pushHistory(); extractPixels(selectionBox, true); renderAll(); setStatus("Selection deleted."); return; }
  if (action === "clear") { selectionBox = null; drawCanvas(); setStatus("Selection unselected."); return; }
  if (action === "paste") {
    if (!selectionClipboard) return setStatus("Copy or cut a selection first.");
    pushHistory();
    const x = selectionBox ? selectionBox.x : 0, y = selectionBox ? selectionBox.y : 0;
    pastePixels(selectionClipboard, x, y, true);
    selectionBox = clampSelectionBox({ x, y, w: selectionClipboard.w, h: selectionClipboard.h });
    renderAll();
    setStatus("Selection pasted.");
    return;
  }
  transformSelection(action);
}
function transformSelection(action) {
  pushHistory();
  let data = extractPixels(selectionBox, true);
  if (action === "flipH") data.pixels = data.pixels.map(row => row.slice().reverse());
  if (action === "flipV") data.pixels = data.pixels.slice().reverse();
  if (action === "rotate") {
    const rotated = Array.from({ length: data.w }, (_, y) => Array.from({ length: data.h }, (_, x) => data.pixels[data.h - 1 - x][y]));
    data = { w: data.h, h: data.w, pixels: rotated };
  }
  selectionClipboard = clone(data);
  selectionBox = clampSelectionBox({ x: selectionBox.x, y: selectionBox.y, w: data.w, h: data.h });
  pastePixels(data, selectionBox.x, selectionBox.y, true);
  renderAll();
  setStatus("Selection transformed.");
}

function getShapeEnd(e) {
  const p = getPixel(e);
  if (!e.ctrlKey || !startPixel) return p;

  if (tool === "line") return snapLineEnd(p);
  if (tool === "rect" || tool === "ellipse") return snapBoxEnd(p);

  return p;
}
function clampPixelPoint(x, y) {
  return {
    x: Math.max(0, Math.min(projectWidth() - 1, x)),
    y: Math.max(0, Math.min(projectHeight() - 1, y))
  };
}
function snapBoxEnd(p) {
  const dx = p.x - startPixel.x;
  const dy = p.y - startPixel.y;
  const size = Math.max(Math.abs(dx), Math.abs(dy));
  return clampPixelPoint(
    startPixel.x + Math.sign(dx || 1) * size,
    startPixel.y + Math.sign(dy || 1) * size
  );
}
function snapLineEnd(p) {
  const dx = p.x - startPixel.x;
  const dy = p.y - startPixel.y;
  if (dx === 0 && dy === 0) return p;

  const angle = Math.atan2(dy, dx);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  const length = Math.max(Math.abs(dx), Math.abs(dy));

  return clampPixelPoint(
    Math.round(startPixel.x + Math.cos(snapped) * length),
    Math.round(startPixel.y + Math.sin(snapped) * length)
  );
}
function applyTool(e, initial) {
  const p = getPixel(e), l = layer().pixels;
  if (tool === "pencil") stampBrush(p.x, p.y, color, l);
  if (tool === "eraser") setPixel(p.x, p.y, null, l);
  if (tool === "fill" && initial) floodFill(p.x, p.y, l[p.y][p.x], color, l);
  if (tool === "eyedropper" && initial) pickColor(p.x, p.y);
  if (tool === "text" && initial) stampPixelText(p.x, p.y);
  drawCanvas();
}
function previewShape(end) { previewLayer = blankPixels(projectWidth(), projectHeight()); drawShape(startPixel, end, previewLayer); drawCanvas(); }
function drawShape(a, b, target) {
  if (tool === "line") drawLine(a.x, a.y, b.x, b.y, target);
  if (tool === "rect") drawRect(a.x, a.y, b.x, b.y, target);
  if (tool === "ellipse") drawEllipse(a.x, a.y, b.x, b.y, target);
}
function drawLine(x0, y0, x1, y1, target) {
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1, err = dx + dy;
  while (true) { stampBrush(x0, y0, color, target); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
}
function drawRect(x0, y0, x1, y1, target) {
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1), minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  for (let x = minX; x <= maxX; x++) { setPixel(x, minY, color, target); setPixel(x, maxY, color, target); }
  for (let y = minY; y <= maxY; y++) { setPixel(minX, y, color, target); setPixel(maxX, y, color, target); }
}
function drawEllipse(x0, y0, x1, y1, target) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.max(1, Math.abs(x1 - x0) / 2), ry = Math.max(1, Math.abs(y1 - y0) / 2);
  for (let t = 0; t < Math.PI * 2; t += 0.01) setPixel(Math.round(cx + Math.cos(t) * rx), Math.round(cy + Math.sin(t) * ry), color, target);
}
function floodFill(x, y, target, replacement, pixels) {
  if (target === replacement) return;
  const stack = [[x, y]];
  const w = projectWidth(), h = projectHeight();
  const seen = new Set();

  while (stack.length) {
    let [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
    const key = `${cx},${cy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (pixels[cy][cx] !== target) continue;

    pixels[cy][cx] = replacement;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}
function pickColor(x, y) {
  for (let i = frame().layers.length - 1; i >= 0; i--) { const l = frame().layers[i]; if (l.visible && l.pixels[y][x]) { color = l.pixels[y][x]; syncColorInputs(color); setStatus(`Picked ${color}.`); return; } }
}

// Text tool
const PIXEL_FONT = {
  "A":["01110","10001","10001","11111","10001","10001","10001"],"B":["11110","10001","10001","11110","10001","10001","11110"],"C":["01111","10000","10000","10000","10000","10000","01111"],"D":["11110","10001","10001","10001","10001","10001","11110"],"E":["11111","10000","10000","11110","10000","10000","11111"],"F":["11111","10000","10000","11110","10000","10000","10000"],
  "G":["01111","10000","10000","10011","10001","10001","01111"],"H":["10001","10001","10001","11111","10001","10001","10001"],"I":["11111","00100","00100","00100","00100","00100","11111"],"J":["00111","00010","00010","00010","10010","10010","01100"],"K":["10001","10010","10100","11000","10100","10010","10001"],"L":["10000","10000","10000","10000","10000","10000","11111"],
  "M":["10001","11011","10101","10101","10001","10001","10001"],"N":["10001","11001","10101","10011","10001","10001","10001"],"O":["01110","10001","10001","10001","10001","10001","01110"],"P":["11110","10001","10001","11110","10000","10000","10000"],"Q":["01110","10001","10001","10001","10101","10010","01101"],"R":["11110","10001","10001","11110","10100","10010","10001"],
  "S":["01111","10000","10000","01110","00001","00001","11110"],"T":["11111","00100","00100","00100","00100","00100","00100"],"U":["10001","10001","10001","10001","10001","10001","01110"],"V":["10001","10001","10001","10001","01010","01010","00100"],"W":["10001","10001","10001","10101","10101","11011","10001"],"X":["10001","01010","00100","00100","00100","01010","10001"],
  "Y":["10001","01010","00100","00100","00100","00100","00100"],"Z":["11111","00001","00010","00100","01000","10000","11111"],"0":["01110","10001","10011","10101","11001","10001","01110"],"1":["00100","01100","00100","00100","00100","00100","01110"],"2":["01110","10001","00001","00010","00100","01000","11111"],"3":["11110","00001","00001","01110","00001","00001","11110"],
  "4":["00010","00110","01010","10010","11111","00010","00010"],"5":["11111","10000","10000","11110","00001","00001","11110"],"6":["01110","10000","10000","11110","10001","10001","01110"],"7":["11111","00001","00010","00100","01000","01000","01000"],"8":["01110","10001","10001","01110","10001","10001","01110"],"9":["01110","10001","10001","01111","00001","00001","01110"],
  " ":["00000","00000","00000","00000","00000","00000","00000"],".":["00000","00000","00000","00000","00000","01100","01100"],",":["00000","00000","00000","00000","00000","01100","01000"],"!":["00100","00100","00100","00100","00100","00000","00100"],"?":["01110","10001","00001","00010","00100","00000","00100"],"-":["00000","00000","00000","11111","00000","00000","00000"],"_":["00000","00000","00000","00000","00000","00000","11111"],":":["00000","01100","01100","00000","01100","01100","00000"]
};
function updatePixelTextLabel() { if (pixelTextScaleOutput) pixelTextScaleOutput.textContent = `${Number(pixelTextScaleInput.value) || 1}×`; }
function stampPixelText(x, y) {
  const text = (pixelTextInput?.value || "").toUpperCase();
  const scale = Math.max(1, Number(pixelTextScaleInput?.value) || 1);
  if (!text.trim()) return setStatus("Enter text before stamping.");
  let cursor = x;
  for (const ch of text) {
    const glyph = PIXEL_FONT[ch] || PIXEL_FONT["?"];
    for (let gy = 0; gy < glyph.length; gy++) for (let gx = 0; gx < glyph[gy].length; gx++) {
      if (glyph[gy][gx] !== "1") continue;
      for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
        const px = cursor + gx * scale + sx;
        const py = y + gy * scale + sy;
        if (px >= 0 && py >= 0 && px < projectWidth() && py < projectHeight()) layer().pixels[py][px] = color;
      }
    }
    cursor += 6 * scale;
  }
  setStatus("Pixel text stamped into the active layer.");
}



// Play mode
function renderPlayPanel() {
  if (!playCanvas) return;
  const selects = [playIdleFrameSelect, playWalkFrameSelect, playJumpFrameSelect, playPropFrameSelect, playSceneryFrameSelect, playLayerFrameSelect].filter(Boolean);
  selects.forEach(select => {
    const current = select.value;
    select.innerHTML = "";
    state.frames.forEach((_f, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Frame ${index + 1}`;
      select.appendChild(option);
    });
    select.value = current && Number(current) < state.frames.length ? current : ([playSceneryFrameSelect, playLayerFrameSelect].includes(select) ? "-1" : "0");
  });
  if (playSceneryFrameSelect) {
    const current = String(state.playMode.sceneryFrame ?? -1);
    playSceneryFrameSelect.innerHTML = '<option value="-1">None</option>';
    state.frames.forEach((_f, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Frame ${index + 1}`;
      playSceneryFrameSelect.appendChild(option);
    });
    playSceneryFrameSelect.value = Number(current) >= -1 && Number(current) < state.frames.length ? current : "-1";
  }
  if (playBackgroundFrameSelect) {
    const current = String(state.playMode.backgroundFrame ?? -1);
    playBackgroundFrameSelect.innerHTML = '<option value="-1">None</option>';
    state.frames.forEach((_f, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Frame ${index + 1}`;
      playBackgroundFrameSelect.appendChild(option);
    });
    playBackgroundFrameSelect.value = Number(current) >= -1 && Number(current) < state.frames.length ? current : "-1";
  }
  if (playLayerFrameSelect) {
    const selectedLayer = state.playMode.visualLayers?.[selectedPlayLayer] || defaultPlayVisualLayers()[0];
    const current = String(selectedLayer.frame ?? -1);
    playLayerFrameSelect.innerHTML = '<option value="-1">None</option>';
    state.frames.forEach((_f, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Frame ${index + 1}`;
      playLayerFrameSelect.appendChild(option);
    });
    playLayerFrameSelect.value = Number(current) >= -1 && Number(current) < state.frames.length ? current : "-1";
  }
  playIdleFrameSelect.value = String(state.playMode.idleFrame || 0);
  playWalkFrameSelect.value = String(state.playMode.walkFrame || 0);
  playJumpFrameSelect.value = String(state.playMode.jumpFrame || 0);
  playPropFrameSelect.value = String(Math.min(Number(playPropFrameSelect.value) || state.activeFrame, state.frames.length - 1));
  if (playSceneWidthInput) playSceneWidthInput.value = String(state.playMode.sceneWidth || 640);
  if (playSceneHeightInput) playSceneHeightInput.value = String(state.playMode.sceneHeight || 360);
  if (playGroundYInput) playGroundYInput.value = String(state.playMode.groundY || 300);
  if (playWorldWidthInput) playWorldWidthInput.value = String(state.playMode.worldWidth || Math.max(1600, state.playMode.sceneWidth || 640));
  if (playActorScaleInput) playActorScaleInput.value = String(playScale());
  if (playBackgroundScaleSelect) playBackgroundScaleSelect.value = state.playMode.backgroundScale || "cover";
  if (playGridOverBgInput) playGridOverBgInput.checked = state.playMode.showGridOverlay !== false;
  if (playCameraFollowInput) playCameraFollowInput.checked = state.playMode.cameraFollow !== false;
  if (playAutoScrollInput) playAutoScrollInput.checked = state.playMode.autoScroll === true;
  if (playScrollSpeedInput) playScrollSpeedInput.value = String(state.playMode.scrollSpeed ?? 1.25);
  if (playSceneryFrameSelect) playSceneryFrameSelect.value = String(state.playMode.sceneryFrame ?? -1);
  if (playSceneryScaleInput) playSceneryScaleInput.value = String(state.playMode.sceneryScale ?? 3);
  if (playScenerySpeedInput) playScenerySpeedInput.value = String(state.playMode.scenerySpeed ?? 0.45);
  if (playSceneryYInput) playSceneryYInput.value = String(state.playMode.sceneryY ?? 248);
  syncSelectedPlayLayerControls();
  renderPlayLayerList();
  renderPlayPropList();
}
function renderPlayLayerList() {
  if (!playLayerList) return;
  playLayerList.innerHTML = "";
  (state.playMode.visualLayers || []).forEach((layer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "play-layer-item" + (index === selectedPlayLayer ? " active" : "");
    button.setAttribute("aria-pressed", String(index === selectedPlayLayer));
    const frameLabel = layer.frame >= 0 ? `Frame ${layer.frame + 1}` : "None";
    const nameEl = document.createElement("strong");
    nameEl.textContent = layer.name || `Layer ${index + 1}`;
    const visibleEl = document.createElement("span");
    visibleEl.textContent = layer.visible === false ? "Hidden" : "Visible";
    const metaEl = document.createElement("span");
    metaEl.className = "play-layer-meta";
    metaEl.textContent = `${frameLabel} · ${layer.repeatX === false ? "fixed" : "repeats"} · ${Number(layer.parallax).toFixed(2)}x`;
    button.append(nameEl, visibleEl, metaEl);
    button.onclick = () => {
      selectedPlayLayer = index;
      renderPlayPanel();
      drawPlayScene();
    };
    playLayerList.appendChild(button);
  });
}
function syncSelectedPlayLayerControls() {
  const layer = state.playMode.visualLayers?.[selectedPlayLayer];
  if (!layer) return;
  if (playLayerFrameSelect) playLayerFrameSelect.value = String(layer.frame ?? -1);
  if (playLayerScaleInput) playLayerScaleInput.value = String(layer.scale ?? 3);
  if (playLayerParallaxInput) playLayerParallaxInput.value = String(layer.parallax ?? 0.45);
  if (playLayerYInput) playLayerYInput.value = String(layer.y ?? 0);
  if (playLayerOpacityInput) playLayerOpacityInput.value = String(layer.opacity ?? 1);
  if (playLayerRepeatInput) playLayerRepeatInput.checked = layer.repeatX !== false;
  if (playLayerVisibleInput) playLayerVisibleInput.checked = layer.visible !== false;
}
function updateSelectedPlayLayer() {
  const layer = state.playMode.visualLayers?.[selectedPlayLayer];
  if (!layer) return;
  const frameValue = Number(playLayerFrameSelect?.value);
  layer.frame = Number.isFinite(frameValue) ? Math.max(-1, Math.min(frameValue, state.frames.length - 1)) : -1;
  layer.scale = Math.max(0.5, Math.min(Number(playLayerScaleInput?.value) || layer.scale || 3, 32));
  layer.parallax = Math.max(-4, Math.min(Number(playLayerParallaxInput?.value) || 0, 4));
  layer.y = Math.max(-1024, Math.min(Number(playLayerYInput?.value) || 0, 2160));
  layer.opacity = Math.max(0, Math.min(Number(playLayerOpacityInput?.value ?? layer.opacity ?? 1), 1));
  layer.repeatX = playLayerRepeatInput ? playLayerRepeatInput.checked : layer.repeatX !== false;
  layer.visible = playLayerVisibleInput ? playLayerVisibleInput.checked : layer.visible !== false;
  state.playMode.visualLayers[selectedPlayLayer] = clampPlayLayer(layer, selectedPlayLayer);
  renderPlayLayerList();
  drawPlayScene();
  saveLocal();
}
function frameCanvas(index) {
  const safeIndex = Math.max(0, Math.min(index, state.frames.length - 1));
  const frameData = state.frames[safeIndex];
  const cached = playFrameCanvasCache.get(safeIndex);
  if (cached && cached.frameData === frameData && cached.width === projectWidth() && cached.height === projectHeight()) return cached.canvas;
  const canvasFrame = pixelsToCanvas(flattenedPixels(frameData), 1);
  playFrameCanvasCache.set(safeIndex, { frameData, width: projectWidth(), height: projectHeight(), canvas: canvasFrame });
  return canvasFrame;
}
function playScale() { return Math.max(1, Math.min(Number(state.playMode.actorScale) || 3, 16)); }
function playPropRect(prop) {
  const scale = Math.max(1, Math.min(Number(prop.scale) || playScale(), 16));
  return { x: Number(prop.x) || 0, y: Number(prop.y) || 0, w: projectWidth() * scale, h: projectHeight() * scale };
}
function playActorRect(x = playActor.x, y = playActor.y) {
  const scale = playScale();
  return { x, y, w: projectWidth() * scale, h: projectHeight() * scale };
}
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function solidPlayProps() { return state.playMode.props.filter(prop => prop.solid !== false); }
function playCanvasPoint(e) {
  const rect = playCanvas.getBoundingClientRect();
  return { x: Math.round((e.clientX - rect.left) * (playCanvas.width / rect.width)), y: Math.round((e.clientY - rect.top) * (playCanvas.height / rect.height)) };
}
function pickPlayProp(x, y) {
  const rect = playCanvas.getBoundingClientRect();
  const tolerance = Math.max(6, Math.round(10 * (playCanvas.width / Math.max(1, rect.width))));
  for (let i = state.playMode.props.length - 1; i >= 0; i--) {
    const r = playPropRect(state.playMode.props[i]);
    const sx = screenX(r.x);
    if (x >= sx - tolerance && x <= sx + r.w + tolerance && y >= r.y - tolerance && y <= r.y + r.h + tolerance) return i;
  }
  return -1;
}
function syncSelectedPlayPropControls() {
  const prop = state.playMode.props[selectedPlayProp];
  if (!prop) return;
  playPropFrameSelect.value = String(prop.frame);
  playPropXInput.value = String(Math.round(prop.x));
  playPropYInput.value = String(Math.round(prop.y));
  if (playPropScaleInput) playPropScaleInput.value = String(prop.scale || playScale());
  if (playPropSolidInput) playPropSolidInput.checked = prop.solid !== false;
}
function syncPlayCanvasSize() {
  const w = Math.max(160, Math.min(Number(state.playMode.sceneWidth) || 640, 4096));
  const h = Math.max(120, Math.min(Number(state.playMode.sceneHeight) || 360, 2160));
  if (playCanvas.width !== w) playCanvas.width = w;
  if (playCanvas.height !== h) playCanvas.height = h;
}
function drawPlayPreview() {
  if (!playCtx || playRunning) return;
  drawPlayScene();
}

// Camera math
function playWorldWidth() { return Math.max(playCanvas?.width || 640, Math.min(Number(state.playMode.worldWidth) || Math.max(1600, playCanvas?.width || 640), 20000)); }
function clampPlayCamera() { playCameraX = Math.max(0, Math.min(playWorldWidth() - playCanvas.width, playCameraX)); }
function updatePlayCamera() {
  if (!playCanvas) return;
  const maxCameraX = Math.max(0, playWorldWidth() - playCanvas.width);
  const actorW = projectWidth() * playScale();
  const actorCenter = playActor.x + actorW / 2;
  let target = playCameraX;

  // Follow target
  if (state.playMode.cameraFollow !== false) {
    const viewLeft = playCameraX;
    const viewRight = playCameraX + playCanvas.width;
    const leftSafe = viewLeft + Math.max(44, playCanvas.width * 0.28);
    const rightSafe = viewRight - Math.max(44, playCanvas.width * 0.34);
    if (actorCenter < leftSafe) target = actorCenter - Math.max(44, playCanvas.width * 0.28);
    if (actorCenter > rightSafe) target = actorCenter - playCanvas.width + Math.max(44, playCanvas.width * 0.34);
    target = Math.max(0, Math.min(maxCameraX, target));
    playCameraX += (target - playCameraX) * 0.22;
  }

  // Auto scroll
  if (state.playMode.autoScroll === true) {
    const speed = Math.max(0, Number(state.playMode.scrollSpeed) || 1.25);
    playCameraX = Math.max(playCameraX, Math.min(maxCameraX, playCameraX + speed));
  }

  // Pixel clamp
  playCameraX = Math.round(Math.max(0, Math.min(maxCameraX, playCameraX)));
}
function screenX(worldX) { return Math.round(worldX - playCameraX); }
function worldX(screenXValue) { return Math.round(screenXValue + playCameraX); }

// Scenery art
function drawPlayGrid(ground) {
  const grid = 32;
  playCtx.strokeStyle = canvasInkColor();
  playCtx.lineWidth = 2;
  playCtx.globalAlpha = isDarkTheme() ? 0.26 : 0.11;
  const startX = -((playCameraX % grid) + grid) % grid;
  for (let x = startX; x < playCanvas.width; x += grid) {
    playCtx.beginPath();
    playCtx.moveTo(Math.round(x), 0);
    playCtx.lineTo(Math.round(x), playCanvas.height);
    playCtx.stroke();
  }
  for (let y = 0; y < playCanvas.height; y += grid) {
    playCtx.beginPath();
    playCtx.moveTo(0, y);
    playCtx.lineTo(playCanvas.width, y);
    playCtx.stroke();
  }
  playCtx.globalAlpha = 1;
  playCtx.fillStyle = canvasInkColor();
  playCtx.fillRect(0, ground, playCanvas.width, 4);
  playCtx.globalAlpha = 0.35;
  playCtx.fillRect(0, ground + 14, playCanvas.width, 4);
  playCtx.globalAlpha = 1;
}
function drawDefaultSky(ground) {
  const bg = canvasBackgroundColor();
  playCtx.fillStyle = bg;
  playCtx.fillRect(0, 0, playCanvas.width, playCanvas.height);
  playCtx.globalAlpha = isDarkTheme() ? 0.18 : 0.08;
  playCtx.fillStyle = canvasInkColor();
  for (let i = 0; i < 18; i++) {
    const x = Math.round((i * 173 - playCameraX * 0.18) % (playCanvas.width + 160)) - 80;
    const y = 24 + (i * 37) % Math.max(40, ground - 80);
    playCtx.fillRect(x, y, 3, 3);
  }
  playCtx.globalAlpha = 1;
}
function drawScrollingTile(tileCanvas, y, scale, parallax, alpha = 1) {
  const w = Math.max(1, Math.round(tileCanvas.width * scale));
  const h = Math.max(1, Math.round(tileCanvas.height * scale));
  const scrollX = playCameraX;
  const offset = ((scrollX * parallax) % w + w) % w;
  playCtx.globalAlpha = alpha;
  for (let x = -offset - w; x < playCanvas.width + w; x += w) {
    playCtx.drawImage(tileCanvas, Math.round(x), Math.round(y), w, h);
  }
  playCtx.globalAlpha = 1;
}
function drawPlayVisualLayer(layer) {
  if (!layer || layer.visible === false || Number(layer.frame) < 0 || Number(layer.frame) >= state.frames.length) return false;
  const layerCanvas = frameCanvas(Number(layer.frame));
  const scale = Math.max(0.5, Math.min(Number(layer.scale) || 3, 32));
  const alpha = Math.max(0, Math.min(Number(layer.opacity ?? 1), 1));
  playCtx.globalAlpha = alpha;
  if (layer.repeatX !== false || layer.fit === "tile") {
    drawScrollingTile(layerCanvas, Number(layer.y) || 0, scale, Number(layer.parallax) || 0, alpha);
    playCtx.globalAlpha = 1;
    return true;
  }
  const ratio = layer.fit === "stretch" ? null : layer.fit === "contain" ? Math.min(playCanvas.width / layerCanvas.width, playCanvas.height / layerCanvas.height) : Math.max(playCanvas.width / layerCanvas.width, playCanvas.height / layerCanvas.height);
  const w = layer.fit === "stretch" ? playCanvas.width : Math.max(1, Math.round(layerCanvas.width * ratio));
  const h = layer.fit === "stretch" ? playCanvas.height : Math.max(1, Math.round(layerCanvas.height * ratio));
  const x = Math.round((playCanvas.width - w) / 2 - playCameraX * (Number(layer.parallax) || 0));
  const y = Number(layer.y) || (layer.fit === "stretch" ? 0 : Math.round((playCanvas.height - h) / 2));
  playCtx.drawImage(layerCanvas, x, Math.round(y), w, h);
  playCtx.globalAlpha = 1;
  return true;
}
function drawPlayVisualLayers(role) {
  let drew = false;
  (state.playMode.visualLayers || []).forEach(layer => {
    if (layer.role === role && drawPlayVisualLayer(layer)) drew = true;
  });
  return drew;
}
function drawPlayBackground() {
  const bgIndex = Number(state.playMode.backgroundFrame);
  if (bgIndex < 0 || bgIndex >= state.frames.length) return false;
  const bgCanvas = frameCanvas(bgIndex);
  const mode = state.playMode.backgroundScale || "cover";
  if (mode === "stretch") {
    playCtx.drawImage(bgCanvas, 0, 0, playCanvas.width, playCanvas.height);
    return true;
  }
  if (mode === "tile") {
    drawScrollingTile(bgCanvas, 0, Math.max(1, Math.round(playScale())), 0.22, 1);
    return true;
  }
  const ratio = mode === "contain" ? Math.min(playCanvas.width / bgCanvas.width, playCanvas.height / bgCanvas.height) : Math.max(playCanvas.width / bgCanvas.width, playCanvas.height / bgCanvas.height);
  const w = Math.max(1, Math.round(bgCanvas.width * ratio));
  const h = Math.max(1, Math.round(bgCanvas.height * ratio));
  const x = Math.round((playCanvas.width - w) / 2 - playCameraX * 0.08);
  const y = Math.round((playCanvas.height - h) / 2);
  playCtx.drawImage(bgCanvas, x, y, w, h);
  if (x > 0) playCtx.drawImage(bgCanvas, x - w, y, w, h);
  if (x + w < playCanvas.width) playCtx.drawImage(bgCanvas, x + w, y, w, h);
  return true;
}
function drawPlayScenery() {
  const sceneryIndex = Number(state.playMode.sceneryFrame);
  if (sceneryIndex < 0 || sceneryIndex >= state.frames.length) return;
  const sceneryCanvas = frameCanvas(sceneryIndex);
  const scale = Math.max(0.5, Math.min(Number(state.playMode.sceneryScale) || 3, 32));
  const speed = Math.max(-4, Math.min(Number(state.playMode.scenerySpeed) || 0.45, 4));
  const y = Number(state.playMode.sceneryY) || 0;
  drawScrollingTile(sceneryCanvas, y, scale, speed, 1);
}
function drawPlayScene() {
  if (!playCtx) return;
  syncPlayCanvasSize();
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  const actorScale = playScale();
  playCtx.imageSmoothingEnabled = false;
  playCtx.fillStyle = canvasBackgroundColor();
  playCtx.fillRect(0, 0, playCanvas.width, playCanvas.height);
  updatePlayCamera();
  drawDefaultSky(ground);
  const hasBackground = drawPlayBackground() || drawPlayVisualLayers("background");
  if (!hasBackground || state.playMode.showGridOverlay !== false) drawPlayGrid(ground);
  state.playMode.props.forEach((prop, index) => {
    const propCanvas = frameCanvas(prop.frame);
    const propScale = Math.max(1, Math.min(Number(prop.scale) || actorScale, 16));
    const propW = projectWidth() * propScale;
    const propH = projectHeight() * propScale;
    const px = screenX(Number(prop.x) || 0);
    if (px + propW < -8 || px > playCanvas.width + 8) return;
    playCtx.drawImage(propCanvas, px, Math.round(prop.y), propW, propH);
    playCtx.strokeStyle = index === selectedPlayProp ? canvasInkColor() : prop.solid === false ? "#aaa" : canvasMutedColor();
    playCtx.lineWidth = index === selectedPlayProp ? 4 : 2;
    playCtx.setLineDash(prop.solid === false ? [6, 4] : []);
    playCtx.strokeRect(px, Math.round(prop.y), propW, propH);
    playCtx.setLineDash([]);
    if (prop.solid !== false) {
      playCtx.fillStyle = canvasInkColor();
      playCtx.font = "900 10px system-ui, sans-serif";
      playCtx.fillText("SOLID", px + 4, Math.round(prop.y) + 12);
    }
  });
  const moving = Math.abs(playActor.vx) > 0.08;
  const actorFrame = !playActor.grounded ? state.playMode.jumpFrame : moving ? state.playMode.walkFrame : state.playMode.idleFrame;
  const actorCanvas = frameCanvas(actorFrame);
  const actorW = projectWidth() * actorScale;
  const actorH = projectHeight() * actorScale;
  playCtx.save();
  if (playActor.facing < 0) {
    playCtx.translate(screenX(playActor.x + actorW), Math.round(playActor.y));
    playCtx.scale(-1, 1);
    playCtx.drawImage(actorCanvas, 0, 0, actorW, actorH);
  } else {
    playCtx.drawImage(actorCanvas, screenX(playActor.x), Math.round(playActor.y), actorW, actorH);
  }
  playCtx.restore();
  drawPlayVisualLayers("foreground");
  drawPlayVisualLayers("overlay");
  playCtx.fillStyle = canvasInkColor();
  playCtx.font = "900 14px system-ui, sans-serif";
  playCtx.fillText(playRunning ? `PLAY  ${Math.round(playCameraX)}px` : "SCENE MOCKUP", 12, 22);
}
function resetPlayActor() {
  syncPlayCanvasSize();
  const actorScale = playScale();
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  playActor = { x: 24, y: ground - projectHeight() * actorScale, vx: 0, vy: 0, grounded: true, facing: 1 };
  playCameraX = 0;
  playSceneryScrollX = 0;
  playTick = 0;
  drawPlayScene();
}
function centerPlayActor() {
  syncPlayCanvasSize();
  const actorScale = playScale();
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  playActor.x = Math.round(playCameraX + (playCanvas.width - projectWidth() * actorScale) / 2);
  playActor.y = ground - projectHeight() * actorScale;
  playActor.vx = 0;
  playActor.vy = 0;
  playActor.grounded = true;
  drawPlayScene();
}
function stepPlay() {
  if (!playRunning) return;
  syncPlayCanvasSize();
  const actorScale = playScale();
  const actorH = projectHeight() * actorScale;
  const actorW = projectWidth() * actorScale;
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  const left = playKeys.ArrowLeft || playKeys.KeyA;
  const right = playKeys.ArrowRight || playKeys.KeyD;
  const jump = playKeys.Space || playKeys.ArrowUp || playKeys.KeyW;
  const runSpeed = 3;
  playActor.vx = right && !left ? runSpeed : left && !right ? -runSpeed : 0;
  if (playActor.vx) playActor.facing = playActor.vx > 0 ? 1 : -1;
  if (jump && playActor.grounded) { playActor.vy = -8; playActor.grounded = false; }
  playActor.vy += 0.45;
  playActor.grounded = false;
  playActor.x = Math.max(0, Math.min(playWorldWidth() - actorW, playActor.x + playActor.vx));
  let actorBox = playActorRect();
  solidPlayProps().forEach(prop => {
    const r = playPropRect(prop);
    if (!rectsOverlap(actorBox, r)) return;
    if (playActor.vx > 0) playActor.x = r.x - actorW;
    if (playActor.vx < 0) playActor.x = r.x + r.w;
    playActor.vx = 0;
    actorBox = playActorRect();
  });
  playActor.y += playActor.vy;
  actorBox = playActorRect();
  solidPlayProps().forEach(prop => {
    const r = playPropRect(prop);
    if (!rectsOverlap(actorBox, r)) return;
    if (playActor.vy > 0) { playActor.y = r.y - actorH; playActor.grounded = true; }
    if (playActor.vy < 0) playActor.y = r.y + r.h;
    playActor.vy = 0;
    actorBox = playActorRect();
  });
  if (playActor.y + actorH >= ground) { playActor.y = ground - actorH; playActor.vy = 0; playActor.grounded = true; }
  playTick++;
  drawPlayScene();
  playFrameRequest = requestAnimationFrame(stepPlay);
}
function setPlayRunning(next) {
  if (!playCanvas) return;
  playRunning = next;
  playRunBtn.textContent = playRunning ? "Stop" : "Run";
  playRunBtn.setAttribute("aria-pressed", String(playRunning));
  playKeys = {};
  if (playRunning) {
    cancelAnimationFrame(playFrameRequest);
    playFrameRequest = requestAnimationFrame(stepPlay);
  } else {
    cancelAnimationFrame(playFrameRequest);
    playActor.vx = 0;
    drawPlayScene();
  }
}
function addPlayProp() {
  pushHistory();
  state.playMode.props.push({
    frame: Number(playPropFrameSelect.value) || 0,
    x: Number(playPropXInput.value) || 0,
    y: Number(playPropYInput.value) || 0,
    scale: Math.max(1, Math.min(Number(playPropScaleInput?.value) || playScale(), 16)),
    solid: playPropSolidInput ? playPropSolidInput.checked : true
  });
  selectedPlayProp = state.playMode.props.length - 1;
  normalizeProject();
  renderPlayPanel();
  drawPlayScene();
  saveLocal();
  setStatus("Frame object placed in Play Mode.");
}
function renderPlayPropList() {
  if (!playPropList) return;
  playPropList.innerHTML = "";
  state.playMode.props.forEach((prop, index) => {
    const row = document.createElement("div");
    row.className = "frame-row" + (index === selectedPlayProp ? " active" : "");
    row.innerHTML = `<button class="frame-chip" aria-label="Select object ${index + 1}">${index + 1}</button><span>Frame ${prop.frame + 1}</span><small>x${Math.round(prop.x)} y${Math.round(prop.y)} · ${prop.scale}× · ${prop.solid === false ? "Ghost" : "Solid"}</small><span class="sr-only">Object ${index + 1} uses frame ${prop.frame + 1}, x position ${Math.round(prop.x)}, y position ${Math.round(prop.y)}, scale ${prop.scale || playScale()}, collision ${prop.solid === false ? "off" : "on"}.</span>`;
    row.onclick = () => {
      selectedPlayProp = index;
      syncSelectedPlayPropControls();
      renderPlayPropList();
      drawPlayScene();
    };
    playPropList.appendChild(row);
  });
}
function deleteSelectedPlayProp() {
  if (selectedPlayProp < 0 || selectedPlayProp >= state.playMode.props.length) return;
  pushHistory();
  state.playMode.props.splice(selectedPlayProp, 1);
  selectedPlayProp = Math.min(selectedPlayProp, state.playMode.props.length - 1);
  renderPlayPanel();
  drawPlayScene();
  saveLocal();
  setStatus("Selected Play Mode object deleted.");
}
function updatePlaySceneSettings() {
  pushHistory();
  state.playMode.sceneWidth = Number(playSceneWidthInput?.value) || 640;
  state.playMode.sceneHeight = Number(playSceneHeightInput?.value) || 360;
  state.playMode.worldWidth = Number(playWorldWidthInput?.value) || Math.max(1600, state.playMode.sceneWidth);
  state.playMode.groundY = Number(playGroundYInput?.value) || Math.round(state.playMode.sceneHeight * 0.84);
  state.playMode.actorScale = Math.max(1, Math.min(Number(playActorScaleInput?.value) || playScale(), 16));
  normalizeProject();
  resetPlayActor();
  renderPlayPanel();
  saveLocal();
}
function setPlayModeScreen(enabled) {
  playModeScreen = enabled;
  if (enabled && printMode) setPrintMode(false);
  document.body.classList.toggle("play-mode", enabled);
  if (playPanel) playPanel.hidden = !enabled;
  playModeBtn.setAttribute("aria-pressed", String(enabled));
  playModeBtn.textContent = enabled ? "Base Mode" : "Play Mode";
  if (enabled) {
    renderPlayPanel();
    resetPlayActor();
    setStatus("Play Mode ready.");
  } else {
    setPlayRunning(false);
    setStatus("Base Mode ready.");
  }
}

function playScenePixelsFromCanvas(sourceCanvas, maxWidth = 480) {
  const ratio = Math.min(1, maxWidth / sourceCanvas.width);
  const w = Math.max(1, Math.round(sourceCanvas.width * ratio));
  const h = Math.max(1, Math.round(sourceCanvas.height * ratio));
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tx = tmp.getContext("2d", { willReadFrequently: true });
  tx.imageSmoothingEnabled = false;
  tx.drawImage(sourceCanvas, 0, 0, w, h);
  const data = tx.getImageData(0, 0, w, h).data;
  const pixels = Array.from({ length: h }, () => Array.from({ length: w }, () => "#ffffff"));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      pixels[y][x] = rgbToHex(data[i], data[i + 1], data[i + 2]);
    }
  }
  return { pixels, w, h };
}
async function exportPlayScenePNG() {
  if (!playCanvas) return;
  const wasRunning = playRunning;
  if (wasRunning) setPlayRunning(false);
  drawPlayScene();
  await saveBase64("Export Play Scene PNG", "pixel-bug-play-scene.png", "PNG Image", "png", dataUrlBase64(playCanvas.toDataURL("image/png")));
}
async function exportPlaySceneGIF() {
  if (!playCanvas) return;
  const wasRunning = playRunning;
  if (wasRunning) setPlayRunning(false);
  syncPlayCanvasSize();
  const original = clone(playActor);
  const actorScale = playScale();
  const actorW = projectWidth() * actorScale;
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  const frames = [];
  const total = 32;
  for (let i = 0; i < total; i++) {
    const t = total <= 1 ? 0 : i / (total - 1);
    playActor.x = Math.round(24 + (playCanvas.width - actorW - 48) * t);
    playActor.y = ground - projectHeight() * actorScale;
    playActor.vx = 3;
    playActor.vy = 0;
    playActor.grounded = true;
    playActor.facing = 1;
    drawPlayScene();
    const snap = playScenePixelsFromCanvas(playCanvas, 480);
    frames.push({ pixels: snap.pixels, delay: 6 });
  }
  const first = playScenePixelsFromCanvas(playCanvas, 480);
  playActor = original;
  drawPlayScene();
  const gifBytes = encodeGif(frames, first.w, first.h);
  await saveBase64("Export Play Scene GIF", "pixel-bug-play-scene.gif", "GIF Image", "gif", bytesToBase64(gifBytes));
}

// Side panels
function renderFrames() {
  const list = $("#frames-list"); list.innerHTML = "";
  state.frames.forEach((f, i) => { const row = document.createElement("div"); row.className = "frame-row" + (i === state.activeFrame ? " active" : ""); row.innerHTML = `<button class="frame-chip" aria-label="Select frame ${i + 1}">${i + 1}</button><span>Frame ${i + 1}</span><small>${f.duration}ms</small>`; row.onclick = () => { state.activeFrame = i; clampActive(); syncControls(); renderAll(); }; list.appendChild(row); });
}
function renderLayers() {
  const list = $("#layers-list"); list.innerHTML = "";
  frame().layers.forEach((l, i) => {
    const row = document.createElement("div");
    row.className = "layer-row" + (i === state.activeLayer ? " active" : "");
    const eye = document.createElement("button");
    eye.className = "layer-eye";
    eye.type = "button";
    eye.setAttribute("aria-label", `Toggle visibility for ${l.name || `Layer ${i + 1}`}`);
    eye.textContent = l.visible ? "●" : "○";
    const input = document.createElement("input");
    input.setAttribute("aria-label", "Layer name");
    input.value = l.name || `Layer ${i + 1}`;
    const pct = document.createElement("small");
    pct.textContent = `${Math.round(l.opacity * 100)}%`;
    row.append(eye, input, pct);
    row.onclick = e => { if (!e.target.classList.contains("layer-eye") && e.target.tagName !== "INPUT") { state.activeLayer = i; syncControls(); renderAll(); } };
    eye.onclick = e => { e.stopPropagation(); pushHistory(); l.visible = !l.visible; renderAll(); };
    input.onchange = e => { pushHistory(); l.name = e.target.value || `Layer ${i+1}`; renderAll(); };
    list.appendChild(row);
  });
}
function escapeHtml(s) { return s.replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch])); }
function renderPalette() {
  const preset = activePreset();
  state.palette = preset.colors;
  if (presetNameInput) presetNameInput.value = preset.name;
  palettePresetSelect.innerHTML = "";
  state.palettePresets.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = item.name;
    option.selected = index === state.activePalettePreset;
    palettePresetSelect.appendChild(option);
  });
  const p = $("#palette");
  p.innerHTML = "";
  preset.colors.forEach((c, index) => {
    const wrap = document.createElement("div");
    wrap.className = "swatch-wrap";
    const b = document.createElement("button");
    b.className = "swatch" + (c.toLowerCase() === color.toLowerCase() ? " active" : "");
    b.style.background = c;
    b.setAttribute("aria-label", `Use color ${c}`);
    b.onclick = () => { color = c; syncColorInputs(c); renderPalette(); };
    const remove = document.createElement("button");
    remove.className = "swatch-remove";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${c} from ${preset.name}`);
    remove.onclick = event => { event.stopPropagation(); removeColorFromPreset(index); };
    wrap.appendChild(b);
    wrap.appendChild(remove);
    p.appendChild(wrap);
  });
}
function syncControls() {
  const presetValue = `${projectWidth()}x${projectHeight()}`;
  const squareValue = String(projectWidth());
  const sizeOption = Array.from(canvasSizeSelect.options).some(option => option.value === presetValue || option.value === squareValue);
  canvasSizeSelect.value = Array.from(canvasSizeSelect.options).some(option => option.value === presetValue) ? presetValue : (sizeOption && projectWidth() === projectHeight() ? squareValue : "");
  frameDurationInput.value = frame().duration;
  layerOpacityInput.value = Math.round(layer().opacity * 100);
  syncColorInputs(color);
}


// Image pixelizer
function quantizeChannel(value, levels) {
  if (levels <= 1) return value < 128 ? 0 : 255;
  return Math.round(Math.round((value / 255) * (levels - 1)) * (255 / (levels - 1)));
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}
function updatePixelizerLabels() {
  const size = Number(pixelizeSizeInput.value);
  const levels = Number(pixelizeColorsInput.value);
  pixelizeSizeOutput.textContent = `${size} × ${size}`;
  pixelizeColorsOutput.textContent = `${levels} levels`;
}
function clearPixelizerPreview(message = "Upload an image to pixelize.") {
  pixelizePreviewCtx.clearRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  pixelizePreviewCtx.fillStyle = canvasBackgroundColor();
  pixelizePreviewCtx.fillRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  pixelizePreviewCtx.fillStyle = canvasInkColor();
  pixelizePreviewCtx.font = "bold 12px system-ui, sans-serif";
  pixelizePreviewCtx.textAlign = "center";
  pixelizePreviewCtx.fillText(message, pixelizePreviewCanvas.width / 2, pixelizePreviewCanvas.height / 2);
}
function makePixelizedPixels() {
  if (!importedImage) return null;
  const target = Number(pixelizeSizeInput.value);
  const levels = Number(pixelizeColorsInput.value);
  const fit = pixelizeFitInput.checked;
  const tmp = document.createElement("canvas");
  tmp.width = target;
  tmp.height = target;
  const tx = tmp.getContext("2d", { willReadFrequently: true });
  tx.imageSmoothingEnabled = true;
  tx.clearRect(0, 0, target, target);

  let dw = target, dh = target, dx = 0, dy = 0;
  const imgRatio = importedImage.width / importedImage.height;
  if (fit) {
    if (imgRatio >= 1) { dw = target; dh = Math.max(1, Math.round(target / imgRatio)); dy = Math.floor((target - dh) / 2); }
    else { dh = target; dw = Math.max(1, Math.round(target * imgRatio)); dx = Math.floor((target - dw) / 2); }
  }
  tx.drawImage(importedImage, dx, dy, dw, dh);
  const data = tx.getImageData(0, 0, target, target);
  const out = Array.from({ length: target }, () => Array.from({ length: target }, () => null));
  for (let y = 0; y < target; y++) {
    for (let x = 0; x < target; x++) {
      const idx = (y * target + x) * 4;
      const a = data.data[idx + 3];
      if (a < 20) continue;
      const r = quantizeChannel(data.data[idx], levels);
      const g = quantizeChannel(data.data[idx + 1], levels);
      const b = quantizeChannel(data.data[idx + 2], levels);
      out[y][x] = rgbToHex(r, g, b);
    }
  }
  return out;
}
function drawPixelizerPreview() {
  updatePixelizerLabels();
  pixelizedPixels = makePixelizedPixels();
  pixelizePreviewCtx.imageSmoothingEnabled = false;
  pixelizePreviewCtx.clearRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  pixelizePreviewCtx.fillStyle = canvasBackgroundColor();
  pixelizePreviewCtx.fillRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  if (!pixelizedPixels) return clearPixelizerPreview();
  const size = pixelizedPixels.length;
  const scale = pixelizePreviewCanvas.width / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = pixelizedPixels[y][x];
      if (!c) continue;
      pixelizePreviewCtx.fillStyle = c;
      pixelizePreviewCtx.fillRect(Math.floor(x * scale), Math.floor(y * scale), Math.ceil(scale), Math.ceil(scale));
    }
  }
}
function resamplePixelsToProject(sourcePixels, targetWidth, targetHeight = targetWidth) {
  const sourceHeight = sourcePixels.length;
  const sourceWidth = sourcePixels[0]?.length || sourceHeight;
  const out = blankPixels(targetWidth, targetHeight);
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const sx = Math.min(sourceWidth - 1, Math.floor((x / targetWidth) * sourceWidth));
      const sy = Math.min(sourceHeight - 1, Math.floor((y / targetHeight) * sourceHeight));
      out[y][x] = sourcePixels[sy]?.[sx] || null;
    }
  }
  return out;
}

function importPixelizedImage() {
  if (!pixelizedPixels) drawPixelizerPreview();
  if (!pixelizedPixels) return setStatus("Upload an image before importing.");
  pushHistory();
  layer().pixels = resamplePixelsToProject(pixelizedPixels, projectWidth(), projectHeight());
  setLayerSource(layer());
  const colors = new Set(state.palette.map(c => c.toLowerCase()));
  pixelizedPixels.flat().forEach(c => { if (c && !colors.has(c.toLowerCase()) && state.palette.length < 64) { colors.add(c.toLowerCase()); state.palette.push(c); } });
  renderAll();
  setStatus("Pixelized image imported into the active layer.");
}
function loadImageFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      importedImage = img;
      drawPixelizerPreview();
      setStatus(`Loaded ${file.name} for pixelizing.`);
    };
    img.onerror = () => setStatus("That image could not be loaded.");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}



// Frame layer
function addFrame(copy=false) { pushHistory(); const f = copy ? clone(frame()) : { duration: Number(frameDurationInput.value) || 120, layers: [newLayer(projectWidth(), "Layer 1", projectHeight())] }; state.frames.splice(state.activeFrame + 1, 0, f); state.activeFrame++; state.activeLayer = 0; renderAll(); }
function deleteFrame() { if (state.frames.length === 1) return setStatus("At least one frame is required."); pushHistory(); state.frames.splice(state.activeFrame, 1); clampActive(); renderAll(); }
function addLayer(copy=false) { pushHistory(); const l = copy ? clone(layer()) : newLayer(projectWidth(), `Layer ${frame().layers.length + 1}`, projectHeight()); frame().layers.splice(state.activeLayer + 1, 0, l); state.activeLayer++; renderAll(); }
function deleteLayer() { if (frame().layers.length === 1) return setStatus("At least one layer is required."); pushHistory(); frame().layers.splice(state.activeLayer, 1); clampActive(); renderAll(); }
function moveLayer(dir) { const layers = frame().layers, i = state.activeLayer, j = i + dir; if (j < 0 || j >= layers.length) return; pushHistory(); [layers[i], layers[j]] = [layers[j], layers[i]]; state.activeLayer = j; renderAll(); }
function dominantPixel(pixels, x0, y0, x1, y1) {
  const counts = new Map();
  let best = null;
  let bestCount = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const px = pixels[y]?.[x] || null;
      if (!px) continue;
      const nextCount = (counts.get(px) || 0) + 1;
      counts.set(px, nextCount);
      if (nextCount > bestCount) {
        best = px;
        bestCount = nextCount;
      }
    }
  }
  return best;
}

function resamplePixels(pixels, nextWidth, nextHeight = nextWidth) {
  const oldHeight = pixels?.length || 0;
  const oldWidth = pixels?.[0]?.length || oldHeight;
  const next = blankPixels(nextWidth, nextHeight);
  if (!oldWidth || !oldHeight) return next;
  const scaleX = oldWidth / nextWidth;
  const scaleY = oldHeight / nextHeight;
  for (let y = 0; y < nextHeight; y++) {
    for (let x = 0; x < nextWidth; x++) {
      const sx = Math.min(oldWidth - 1, Math.floor((x + 0.5) * scaleX));
      const sy = Math.min(oldHeight - 1, Math.floor((y + 0.5) * scaleY));
      next[y][x] = pixels[sy]?.[sx] || null;
    }
  }
  return next;
}

function resizeProject(width, height = width) {
  width = Math.max(1, Math.min(Number(width) || projectWidth(), 512));
  height = Math.max(1, Math.min(Number(height) || width, 512));
  if (width === projectWidth() && height === projectHeight()) return;
  pushHistory();
  state.frames.forEach(projectFrame => {
    projectFrame.layers.forEach(projectLayer => {
      if (!Array.isArray(projectLayer.sourcePixels)) setLayerSource(projectLayer);
      projectLayer.pixels = resamplePixels(projectLayer.sourcePixels, width, height);
      projectLayer.sourcePixels = clone(projectLayer.pixels);
      projectLayer.sourceWidth = width;
      projectLayer.sourceHeight = height;
      projectLayer.sourceSize = Math.max(width, height);
    });
  });
  state.width = width;
  state.height = height;
  state.size = Math.max(width, height);
  gridPathCache = null;
  syncControls();
  renderAll();
  setStatus(`Resampled artwork to ${projectLabel()}.`);
}

function resetProject(width, height = width) {
  pushHistory();
  state = freshProject(width, height);
  syncControls();
  renderAll();
  setStatus(`New ${projectLabel()} project.`);
}

function openNewProjectConfirm() {
  if (!newProjectOverlay) return resetProject(projectWidth(), projectHeight());
  newProjectOverlay.hidden = false;
  confirmNewProjectBtn?.focus();
}
function closeNewProjectConfirm() {
  if (!newProjectOverlay) return;
  newProjectOverlay.hidden = true;
  document.querySelector("#new-project-btn")?.focus();
}
function confirmNewProject() {
  closeNewProjectConfirm();
  resetProject(projectWidth(), projectHeight());
}


// Palette presets
function addColorToPreset() {
  const next = (paletteHexInput.value || paletteColorWheel.value || color).trim().toLowerCase();
  if (!isHexColor(next)) return setStatus("Use a valid #RRGGBB color.");
  const preset = activePreset();
  color = next;
  syncColorInputs(color);
  if (preset.colors.some(c => c.toLowerCase() === color)) {
    renderPalette();
    return setStatus(`${color} is already in ${preset.name}.`);
  }
  pushHistory();
  preset.colors.push(color);
  state.palette = preset.colors;
  renderPalette();
  saveLocal();
  setStatus(`Added ${color} to ${preset.name}.`);
}
function removeColorFromPreset(index) {
  const preset = activePreset();
  if (preset.colors.length <= 1) return setStatus("Preset needs at least one color.");
  const removed = preset.colors.splice(index, 1)[0];
  state.palette = preset.colors;
  renderPalette();
  saveLocal();
  setStatus(`Removed ${removed}.`);
}
function uniquePresetName(baseName) {
  const base = (baseName || "Preset").trim() || "Preset";
  const names = new Set(state.palettePresets.map(p => p.name.toLowerCase()));
  if (!names.has(base.toLowerCase())) return base;
  let i = 2;
  while (names.has(`${base} ${i}`.toLowerCase())) i++;
  return `${base} ${i}`;
}
function createPreset() {
  const typedName = presetNameInput ? presetNameInput.value.trim() : "";
  const defaultName = `Preset ${state.palettePresets.length + 1}`;
  const name = uniquePresetName(typedName && typedName !== activePreset().name ? typedName : defaultName);
  pushHistory();
  state.palettePresets.push({ name, colors: [color] });
  state.activePalettePreset = state.palettePresets.length - 1;
  state.palette = activePreset().colors;
  renderPalette();
  saveLocal();
  setStatus(`Created ${name}.`);
}
function renamePreset() {
  const preset = activePreset();
  const typedName = presetNameInput ? presetNameInput.value.trim() : "";
  if (!typedName) return setStatus("Type a preset name first.");
  if (typedName === preset.name) return setStatus("Type a new name first.");
  pushHistory();
  preset.name = uniquePresetName(typedName);
  renderPalette();
  saveLocal();
  setStatus(`Renamed preset to ${preset.name}.`);
}
function deletePreset() {
  if (state.palettePresets.length <= 1) return setStatus("At least one preset is required.");
  const preset = activePreset();
  if (!confirm(`Delete ${preset.name}?`)) return;
  pushHistory();
  state.palettePresets.splice(state.activePalettePreset, 1);
  state.activePalettePreset = Math.max(0, state.activePalettePreset - 1);
  state.palette = activePreset().colors;
  renderPalette();
  saveLocal();
  setStatus("Preset deleted.");
}
function switchPreset(index) {
  state.activePalettePreset = Number(index);
  state.palette = activePreset().colors;
  if (state.palette.length) color = state.palette[0];
  syncColorInputs(color);
  renderPalette();
  saveLocal();
  setStatus(`Using ${activePreset().name}.`);
}


// Voxel math
function shadeHex(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const clamp = value => Math.max(0, Math.min(255, Math.round(value)));
  return `rgb(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)})`;
}

function mixHex(hex, mix, weight) {
  const [r, g, b] = hexToRgb(hex);
  const [mr, mg, mb] = hexToRgb(mix);
  const clamp = value => Math.max(0, Math.min(255, Math.round(value)));
  return `rgb(${clamp(r * (1 - weight) + mr * weight)}, ${clamp(g * (1 - weight) + mg * weight)}, ${clamp(b * (1 - weight) + mb * weight)})`;
}

function voxelAngle(value) {
  return Number(value) * Math.PI / 180;
}

function voxelPreviewStep() {
  return Math.max(1, Math.ceil(state.size / 48));
}

function voxelPreviewSize() {
  return Math.ceil(state.size / voxelPreviewStep());
}

function cubeKey(cube) {
  return `${cube.x},${cube.y},${cube.z || 0},${cube.color},${cube.depth}`;
}

function voxelHasNeighbor(map, cube, dx, dy) {
  return map.has(`${cube.x + dx},${cube.y + dy},${cube.z || 0},${cube.color},${cube.depth}`);
}

function voxelBrightnessDepth(color, baseDepth, reverse = false) {
  const [r, g, b] = hexToRgb(color);
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  const value = reverse ? 1 - luminance : luminance;
  return Math.max(1, Math.round(1 + value * Math.max(1, baseDepth - 1)));
}


function voxelLandscapeDepth(color, baseDepth) {
  const [r, g, b] = hexToRgb(color);
  const maxDepth = Math.max(2, baseDepth);
  const total = Math.max(1, r + g + b);
  const red = r / total;
  const green = g / total;
  const blue = b / total;
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  let value = brightness;

  if (blue > 0.38 && blue > green * 1.1) value = 0.12 + brightness * 0.22;
  else if (green > 0.34 && green >= red * 0.8) value = 0.34 + brightness * 0.32;
  else if (red > 0.34 && green > 0.24 && blue < 0.28) value = 0.58 + brightness * 0.28;
  else if (Math.abs(red - green) < 0.08 && Math.abs(green - blue) < 0.08) value = 0.68 + brightness * 0.3;
  else value = 0.42 + brightness * 0.4;

  return Math.max(1, Math.min(maxDepth + 4, Math.round(1 + value * (maxDepth + 3))));
}

function voxelLayerThickness(layerCount, baseDepth) {
  return Math.max(1, Math.ceil(baseDepth / Math.max(1, layerCount)));
}

// Pixel cache
function voxelPixels() {
  if (voxelPixelCache) return voxelPixelCache;
  const step = voxelPreviewStep();
  const baseDepth = Number(voxelDepthInput.value);
  const layers = frame().layers;
  const mode = voxelDepthModeSelect.value;
  const cubes = [];

  if (mode === "layers") {
    const visibleLayers = layers.filter(item => item.visible);
    const slice = voxelLayerThickness(visibleLayers.length, baseDepth);
    visibleLayers.forEach((item, layerIndex) => {
      for (let y = 0; y < state.size; y += step) {
        for (let x = 0; x < state.size; x += step) {
          const colorValue = item.pixels[y][x];
          if (!colorValue) continue;
          cubes.push({
            x: Math.floor(x / step),
            y: Math.floor(y / step),
            z: layerIndex * slice,
            w: 1,
            h: 1,
            color: colorValue,
            depth: slice
          });
        }
      }
    });
  } else {
    const source = new Map();
    layers.forEach(item => {
      if (!item.visible) return;
      for (let y = 0; y < state.size; y += step) {
        for (let x = 0; x < state.size; x += step) {
          const colorValue = item.pixels[y][x];
          if (!colorValue) continue;
          source.set(`${Math.floor(x / step)},${Math.floor(y / step)}`, {
            x: Math.floor(x / step),
            y: Math.floor(y / step),
            z: 0,
            w: 1,
            h: 1,
            color: colorValue,
            depth: mode === "landscape" ? voxelLandscapeDepth(colorValue, baseDepth) : mode === "brightness" || mode === "brightness-reverse" ? voxelBrightnessDepth(colorValue, baseDepth, mode === "brightness-reverse") : baseDepth
          });
        }
      }
    });
    cubes.push(...source.values());
  }

  voxelPixelCache = voxelMergeInput.checked ? mergeVoxelRects(cubes) : cubes;
  voxelNeighborCache = null;
  return voxelPixelCache;
}

function mergeVoxelRects(cubes) {
  const byRow = new Map();
  cubes.forEach(cube => {
    const key = `${cube.y}|${cube.z || 0}|${cube.color}|${cube.depth}`;
    if (!byRow.has(key)) byRow.set(key, []);
    byRow.get(key).push(cube);
  });
  const strips = [];
  byRow.forEach(row => {
    row.sort((a, b) => a.x - b.x);
    let current = null;
    row.forEach(cube => {
      if (current && cube.x === current.x + current.w) current.w += 1;
      else {
        current = { ...cube, w: 1, h: 1 };
        strips.push(current);
      }
    });
  });
  strips.sort((a, b) => a.x - b.x || a.y - b.y || (a.z || 0) - (b.z || 0) || a.color.localeCompare(b.color) || a.depth - b.depth);
  const used = new Set();
  const merged = [];
  strips.forEach((strip, index) => {
    if (used.has(index)) return;
    const rect = { ...strip };
    used.add(index);
    for (let i = index + 1; i < strips.length; i++) {
      const next = strips[i];
      if (used.has(i)) continue;
      if (next.x === rect.x && next.w === rect.w && next.y === rect.y + rect.h && (next.z || 0) === (rect.z || 0) && next.color === rect.color && next.depth === rect.depth) {
        rect.h += 1;
        used.add(i);
      }
    }
    merged.push(rect);
  });
  return merged;
}

function refreshVoxelPreview() {
  voxelPixelCache = null;
  voxelNeighborCache = null;
  drawVoxelPreview();
}

function voxelTransform(x, y, z, size, depth, angleX, angleY, angleZ) {
  let px = x - size / 2;
  let py = y - size / 2;
  let pz = z - depth / 2;
  const cosZ = Math.cos(angleZ);
  const sinZ = Math.sin(angleZ);
  const zx = px * cosZ - py * sinZ;
  py = px * sinZ + py * cosZ;
  px = zx;
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rx = px * cosY + pz * sinY;
  let rz = -px * sinY + pz * cosY;
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const ry = py * cosX - rz * sinX;
  rz = py * sinX + rz * cosX;
  return { x: rx, y: ry, z: rz };
}

function voxelProject(point, scale, originX, originY) {
  return {
    x: originX + point.x * scale,
    y: originY + point.y * scale - point.z * scale * 0.15
  };
}

function voxelCorner(x, y, z, size, depth, angleX, angleY, angleZ, scale, originX, originY) {
  const point = voxelTransform(x, y, z, size, depth, angleX, angleY, angleZ);
  const screen = voxelProject(point, scale, originX, originY);
  return { ...screen, depth: point.z };
}

function voxelFace(points, fill) {
  return {
    points,
    fill,
    depth: points.reduce((sum, point) => sum + point.depth, 0) / points.length
  };
}

function drawVoxelPolygon(points, fill) {
  voxelCtx.beginPath();
  voxelCtx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(point => voxelCtx.lineTo(point.x, point.y));
  voxelCtx.closePath();
  voxelCtx.fillStyle = fill;
  voxelCtx.fill();
  voxelCtx.strokeStyle = canvasInkColor();
  voxelCtx.lineWidth = 1;
  voxelCtx.stroke();
}

// Material shade
function voxelNeighborMap() {
  if (!voxelNeighborCache) voxelNeighborCache = new Set(voxelPixels().map(cubeKey));
  return voxelNeighborCache;
}

function materialFaceColor(color, faceName, cube) {
  if (voxelDepthModeSelect.value === "landscape" && faceName === "top") return shadeHex(color, 10);
  const neighborMap = voxelNeighborMap();
  const ao = [
    voxelHasNeighbor(neighborMap, cube, -1, 0),
    voxelHasNeighbor(neighborMap, cube, 1, 0),
    voxelHasNeighbor(neighborMap, cube, 0, -1),
    voxelHasNeighbor(neighborMap, cube, 0, 1)
  ].filter(Boolean).length * -5;
  const base = { back: 16, front: 26, left: -30, right: -18, top: -8, bottom: -38 }[faceName] + ao;
  return shadeHex(color, base);
}

function voxelPrismFaces(cube, scale, originX, originY, angleX, angleY, angleZ) {
  const size = voxelPreviewSize();
  const x = cube.x;
  const y = cube.y;
  const w = cube.w || 1;
  const h = cube.h || 1;
  const depth = cube.depth;
  const z0 = cube.z || 0;
  const z1 = z0 + depth;
  const p000 = voxelCorner(x, y, z0, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p100 = voxelCorner(x + w, y, z0, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p010 = voxelCorner(x, y + h, z0, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p110 = voxelCorner(x + w, y + h, z0, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p001 = voxelCorner(x, y, z1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p101 = voxelCorner(x + w, y, z1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p011 = voxelCorner(x, y + h, z1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const p111 = voxelCorner(x + w, y + h, z1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  return [
    voxelFace([p000, p100, p110, p010], materialFaceColor(cube.color, "back", cube)),
    voxelFace([p001, p101, p111, p011], materialFaceColor(cube.color, "front", cube)),
    voxelFace([p000, p001, p011, p010], materialFaceColor(cube.color, "left", cube)),
    voxelFace([p100, p101, p111, p110], materialFaceColor(cube.color, "right", cube)),
    voxelFace([p000, p100, p101, p001], materialFaceColor(cube.color, "top", cube)),
    voxelFace([p010, p110, p111, p011], materialFaceColor(cube.color, "bottom", cube))
  ];
}

// Voxel draw
function drawVoxelBackdrop() {
  voxelCtx.fillStyle = canvasBackgroundColor();
  voxelCtx.fillRect(0, 0, voxelCanvas.width, voxelCanvas.height);
}

function drawVoxelFloor(scale, originX, originY, angleX, angleY, angleZ) {
  const size = voxelPreviewSize();
  const depth = Number(voxelDepthInput.value);
  const y = size + 1;
  const a = voxelCorner(-1, y, -1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const b = voxelCorner(size + 1, y, -1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const c = voxelCorner(size + 1, y, depth + 1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  const d = voxelCorner(-1, y, depth + 1, size, depth, angleX, angleY, angleZ, scale, originX, originY);
  drawVoxelPolygon([a, b, c, d], "#f2f2f2");
}

function updateVoxelLabels() {
  voxelDepthOutput.textContent = `${voxelDepthInput.value} blocks`;
  voxelScaleOutput.textContent = `${voxelScaleInput.value} px`;
  voxelRotationXOutput.textContent = `${voxelRotationXInput.value}°`;
  voxelRotationYOutput.textContent = `${voxelRotationYInput.value}°`;
  voxelRotationZOutput.textContent = `${voxelRotationZInput.value}°`;
}

function drawVoxelPreview() {
  updateVoxelLabels();
  const scale = Number(voxelScaleInput.value);
  const angleX = voxelAngle(voxelRotationXInput.value);
  const angleY = voxelAngle(voxelRotationYInput.value);
  const angleZ = voxelAngle(voxelRotationZInput.value);
  const originX = voxelCanvas.width / 2;
  const originY = voxelCanvas.height / 2;
  voxelCtx.clearRect(0, 0, voxelCanvas.width, voxelCanvas.height);
  drawVoxelBackdrop();
  if (voxelFloorInput.checked) drawVoxelFloor(scale, originX, originY, angleX, angleY, angleZ);
  if (voxelPreviewStep() > 1) setStatus(`Voxel preview simplified for ${state.size} by ${state.size}.`);
  const faces = [];
  voxelPixels().forEach(cube => faces.push(...voxelPrismFaces(cube, scale, originX, originY, angleX, angleY, angleZ)));
  faces.sort((a, b) => a.depth - b.depth);
  faces.forEach(face => drawVoxelPolygon(face.points, face.fill));
}

function drawVoxelScanlines() {
  voxelCtx.fillStyle = "rgba(0,0,0,.05)";
  for (let y = 0; y < voxelCanvas.height; y += 4) voxelCtx.fillRect(0, y, voxelCanvas.width, 1);
}

function openVoxelModal() {
  voxelOverlay.hidden = false;
  voxelPixelCache = null;
  voxelNeighborCache = null;
  openVoxelBtn.setAttribute("aria-expanded", "true");
  drawVoxelPreview();
  closeVoxelBtn.focus();
}

function closeVoxelModal() {
  voxelOverlay.hidden = true;
  openVoxelBtn.setAttribute("aria-expanded", "false");
  openVoxelBtn.focus();
}

// Image export
async function exportVoxelPNG() {
  drawVoxelPreview();
  await saveBase64("Export Voxel Preview", "pixel-bug-voxel-preview.png", "PNG Image", "png", dataUrlBase64(voxelCanvas.toDataURL("image/png")));
}

function gifSafeHex(r, g, b) {
  const rr = Math.max(0, Math.min(255, r)) & 0xe0;
  const gg = Math.max(0, Math.min(255, g)) & 0xe0;
  const bb = Math.max(0, Math.min(255, b)) & 0xc0;
  return `#${[rr, gg, bb].map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

function canvasFramePixels(sourceCanvas, scale) {
  const tiny = document.createElement("canvas");
  tiny.width = Math.max(1, Math.round(sourceCanvas.width * scale));
  tiny.height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const tx = tiny.getContext("2d", { alpha: false });
  tx.imageSmoothingEnabled = false;
  tx.fillStyle = "#111111";
  tx.fillRect(0, 0, tiny.width, tiny.height);
  tx.drawImage(sourceCanvas, 0, 0, tiny.width, tiny.height);
  const data = tx.getImageData(0, 0, tiny.width, tiny.height).data;
  const pixels = [];
  for (let y = 0; y < tiny.height; y++) {
    const row = [];
    for (let x = 0; x < tiny.width; x++) {
      const i = (y * tiny.width + x) * 4;
      row.push(gifSafeHex(data[i], data[i + 1], data[i + 2]));
    }
    pixels.push(row);
  }
  return pixels;
}

function canvasFramePNG(sourceCanvas, scale) {
  const frame = document.createElement("canvas");
  frame.width = Math.max(1, Math.round(sourceCanvas.width * scale));
  frame.height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const fx = frame.getContext("2d", { alpha: false });
  fx.imageSmoothingEnabled = false;
  fx.fillStyle = "#111111";
  fx.fillRect(0, 0, frame.width, frame.height);
  fx.drawImage(sourceCanvas, 0, 0, frame.width, frame.height);
  return frame;
}

async function exportVoxelTurntableGIF() {
  const oldY = voxelRotationYInput.value;
  const frames = [];
  const scale = 0.5;
  for (let i = 0; i < 16; i++) {
    voxelRotationYInput.value = String(Math.round(i * 360 / 16));
    drawVoxelPreview();
    frames.push({ pixels: canvasFramePixels(voxelCanvas, scale), delay: 7 });
  }
  voxelRotationYInput.value = oldY;
  drawVoxelPreview();
  const w = frames[0]?.pixels[0]?.length || Math.round(voxelCanvas.width * scale);
  const h = frames[0]?.pixels.length || Math.round(voxelCanvas.height * scale);
  const gifBytes = encodeGif(frames, w, h, { transparent: false, palette: "rgb332" });
  await saveBase64("Export Voxel Turntable", "pixel-bug-voxel-turntable.gif", "GIF Image", "gif", bytesToBase64(gifBytes));
}

// Model export
function safeMaterialName(color) {
  return `mat_${color.replace("#", "")}`;
}

function objVertexLine(vertex) {
  return `v ${vertex.x.toFixed(4)} ${vertex.y.toFixed(4)} ${vertex.z.toFixed(4)}`;
}

function objFaceLine(indices) {
  return `f ${indices.join(" ")}`;
}

function voxelCubeGeometry(cube, size, vertexStart) {
  const x0 = cube.x - size / 2;
  const x1 = x0 + (cube.w || 1);
  const y0 = size / 2 - cube.y;
  const y1 = y0 - (cube.h || 1);
  const z0 = cube.z || 0;
  const z1 = z0 + cube.depth;
  const vertices = [
    { x: x0, y: y0, z: z0 }, { x: x1, y: y0, z: z0 }, { x: x1, y: y1, z: z0 }, { x: x0, y: y1, z: z0 },
    { x: x0, y: y0, z: z1 }, { x: x1, y: y0, z: z1 }, { x: x1, y: y1, z: z1 }, { x: x0, y: y1, z: z1 }
  ];
  const faces = [
    [1, 2, 3, 4], [5, 8, 7, 6], [1, 5, 6, 2],
    [2, 6, 7, 3], [3, 7, 8, 4], [4, 8, 5, 1]
  ].map(face => face.map(index => index + vertexStart - 1));
  return { vertices, faces };
}

function buildVoxelOBJ() {
  const size = voxelPreviewSize();
  const pixels = voxelPixels().filter(cube => cube.color && isHexColor(cube.color));
  const usedColors = new Set();
  const obj = ["# Pixel Bug voxel model", "mtllib pixel-bug-voxel-model.mtl", "o PixelBugVoxel"];
  let vertexStart = 1;
  pixels.forEach((cube, index) => {
    const colorValue = cube.color.toLowerCase();
    usedColors.add(colorValue);
    const geometry = voxelCubeGeometry({ ...cube, color: colorValue }, size, vertexStart);
    obj.push(`g voxel_${index + 1}`);
    obj.push(`usemtl ${safeMaterialName(colorValue)}`);
    geometry.vertices.forEach(vertex => obj.push(objVertexLine(vertex)));
    geometry.faces.forEach(face => obj.push(objFaceLine(face)));
    vertexStart += geometry.vertices.length;
  });
  const mtl = ["# Pixel Bug voxel materials"];
  [...usedColors].sort().forEach(color => {
    const [r, g, b] = hexToRgb(color);
    mtl.push(`newmtl ${safeMaterialName(color)}`);
    mtl.push(`Kd ${(r / 255).toFixed(4)} ${(g / 255).toFixed(4)} ${(b / 255).toFixed(4)}`);
    mtl.push("Ka 0.0000 0.0000 0.0000");
    mtl.push("Ks 0.1200 0.1200 0.1200");
    mtl.push("Ns 24.0000");
    mtl.push("");
  });
  return { obj: `${obj.join("\n")}\n`, mtl: `${mtl.join("\n")}\n` };
}

async function exportVoxelOBJ() {
  const model = buildVoxelOBJ();
  const res = await window.pixelBug.saveFile({
    title: "Export 3D Voxel Model",
    defaultPath: "pixel-bug-voxel-model.obj",
    filters: [{ name: "Wavefront OBJ", extensions: ["obj"] }],
    data: model.obj,
    extraFiles: [{ filename: "pixel-bug-voxel-model.mtl", data: model.mtl }]
  });
  setStatus(res.ok ? "3D voxel model exported with MTL." : "Save cancelled.");
}


// Privacy modal
function openPrivacyModal() {
  privacyOverlay.hidden = false;
  openPrivacyBtn?.setAttribute("aria-expanded", "true");
  closePrivacyBtn?.focus();
}
function closePrivacyModal() {
  privacyOverlay.hidden = true;
  openPrivacyBtn?.setAttribute("aria-expanded", "false");
  openPrivacyBtn?.focus();
}


// Export helpers
function flattenedPixels(f) { const out = blankPixels(projectWidth(), projectHeight()); f.layers.forEach(l => { if (!l.visible) return; for (let y=0;y<projectHeight();y++) for (let x=0;x<projectWidth();x++) if (l.pixels[y]?.[x]) out[y][x] = l.pixels[y][x]; }); return out; }
function pixelsToCanvas(pixels, scale=1) { const c = document.createElement("canvas"); c.width = projectWidth() * scale; c.height = projectHeight() * scale; const cx = c.getContext("2d"); cx.imageSmoothingEnabled = false; for (let y=0;y<projectHeight();y++) for (let x=0;x<projectWidth();x++) if (pixels[y]?.[x]) { cx.fillStyle = pixels[y][x]; cx.fillRect(x*scale,y*scale,scale,scale); } return c; }
function dataUrlBase64(url) { return url.replace(/^data:image\/\w+;base64,/, ""); }
async function exportPNG() { const c = pixelsToCanvas(flattenedPixels(frame()), 1); await saveBase64("Export PNG", "pixel-bug-frame.png", "PNG Image", "png", dataUrlBase64(c.toDataURL("image/png"))); }
async function exportSheet() { const sheet = document.createElement("canvas"); sheet.width = projectWidth() * state.frames.length; sheet.height = projectHeight(); const sx = sheet.getContext("2d"); sx.imageSmoothingEnabled = false; state.frames.forEach((f,i)=>sx.drawImage(pixelsToCanvas(flattenedPixels(f),1), i*projectWidth(), 0)); await saveBase64("Export Spritesheet", "pixel-bug-sheet.png", "PNG Image", "png", dataUrlBase64(sheet.toDataURL("image/png"))); }
async function saveBase64(title, defaultPath, name, ext, data) { const res = await window.pixelBug.saveFile({ title, defaultPath, filters:[{name, extensions:[ext]}], data, encoding:"base64" }); setStatus(res.ok ? `Saved ${defaultPath}.` : "Save cancelled."); }
async function saveProject() { const res = await window.pixelBug.saveFile({ title:"Save Pixel Bug Project", defaultPath:"project.pxbuild", filters:[{name:"Pixel Bug Project", extensions:["pxbuild"]}], data: JSON.stringify(state, null, 2) }); if (res.ok) saveLocal(); setStatus(res.ok ? "Project saved." : "Save cancelled."); }
async function openProject() {
  const res = await window.pixelBug.openProject();
  if (!res.ok) return setStatus("Open cancelled.");
  const parsed = JSON.parse(res.text);
  if (!validProjectShape(parsed)) throw new Error("Project file is not a valid Pixel Bug project.");
  state = parsed;
  normalizeProject();
  clampActive();
  undoStack = [];
  redoStack = [];
  editorCanvasMetricsCache = null;
  gridBitmapCache = null;
  gridPathCache = null;
  syncControls();
  renderAll();
  saveLocal();
  setStatus("Project opened.");
}
async function exportGIF() { const gifBytes = encodeGif(state.frames.map(f => ({ pixels: flattenedPixels(f), delay: Math.max(2, Math.round(f.duration / 10)) })), projectWidth(), projectHeight()); const b64 = bytesToBase64(gifBytes); await saveBase64("Export Animated GIF", "pixel-bug-animation.gif", "GIF Image", "gif", b64); }
function bytesToBase64(bytes) { let bin=""; bytes.forEach(b=>bin+=String.fromCharCode(b)); return btoa(bin); }
function hexToRgb(hex) { const n = parseInt(hex.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; }

function gif332Palette() {
  const colors = [];
  for (let r = 0; r < 8; r++) {
    for (let g = 0; g < 8; g++) {
      for (let b = 0; b < 4; b++) {
        const rr = r << 5;
        const gg = g << 5;
        const bb = b << 6;
        colors.push(`#${[rr, gg, bb].map(value => value.toString(16).padStart(2, "0")).join("")}`);
      }
    }
  }
  return colors;
}

function gif332Index(hex) {
  const [r, g, b] = hexToRgb(hex || "#000000");
  return ((r >> 5) << 5) | ((g >> 5) << 2) | (b >> 6);
}
function collectPalette(frames) {
  const colors = ["#000000"];
  const seen = new Set(colors);
  frames.forEach(f => f.pixels.flat().forEach(c => {
    if (c && !seen.has(c) && colors.length < 256) {
      seen.add(c);
      colors.push(c);
    }
  }));
  while (colors.length < 256) colors.push("#000000");
  return colors;
}
function encodeGif(frames, w, h, options = {}) {
  const useFixed = options.palette === "rgb332";
  const pal = useFixed ? gif332Palette() : collectPalette(frames);
  const colorIndex = new Map();
  pal.forEach((c, i) => colorIndex.set(c, i));
  const out = [];
  const str = s => [...s].forEach(ch => out.push(ch.charCodeAt(0)));
  const word = n => { out.push(n & 255, (n >> 8) & 255); };
  str("GIF89a"); word(w); word(h); out.push(0xF7, 0, 0);
  pal.forEach(c => { const [r, g, b] = hexToRgb(c); out.push(r, g, b); });
  out.push(0x21, 0xFF, 11); str("NETSCAPE2.0"); out.push(3, 1, 0, 0, 0);
  frames.forEach(f => {
    const transparent = options.transparent === true;
    out.push(0x21, 0xF9, 4, transparent ? 0x01 : 0x00);
    word(f.delay); out.push(0, 0); out.push(0x2C); word(0); word(0); word(w); word(h); out.push(0); out.push(8);
    const idx = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const color = f.pixels[y]?.[x] || "#000000";
      idx.push(useFixed ? gif332Index(color) : (colorIndex.get(color) ?? 0));
    }
    const data = lzwEncode(idx, 8);
    for (let i = 0; i < data.length; i += 255) { const chunk = data.slice(i, i + 255); out.push(chunk.length, ...chunk); }
    out.push(0);
  });
  out.push(0x3B); return new Uint8Array(out);
}
function lzwEncode(indices, minCodeSize) {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  const codeSize = minCodeSize + 1;
  const bits = [];
  const write = code => {
    for (let i = 0; i < codeSize; i++) bits.push((code >> i) & 1);
  };
  let sinceClear = 0;
  write(clear);
  indices.forEach(index => {
    if (sinceClear >= 240) {
      write(clear);
      sinceClear = 0;
    }
    write(index & (clear - 1));
    sinceClear++;
  });
  write(end);
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) if (bits[i + j]) b |= 1 << j;
    bytes.push(b);
  }
  return bytes;
}


// Layout tools
let rearrangeMode = false;
let draggedDockCard = null;
let autoScrollFrame = null;
let latestDragEvent = null;

function dockZones() {
  return Array.from(document.querySelectorAll(".rearrange-zone"));
}

function dockCards() {
  return Array.from(document.querySelectorAll(".dock-card"));
}

function saveDockLayout() {
  const layout = {};
  dockZones().forEach(zone => {
    layout[zone.dataset.zone] = Array.from(zone.querySelectorAll(".dock-card")).map(card => card.dataset.dockId);
  });
  localStorage.setItem(STORAGE_LAYOUT_KEY, JSON.stringify(layout));
}

function loadDockLayout() {
  try {
    const layout = JSON.parse(localStorage.getItem(STORAGE_LAYOUT_KEY) || "{}");
    dockZones().forEach(zone => {
      const ids = layout[zone.dataset.zone];
      if (!Array.isArray(ids)) return;
      ids.forEach(id => {
        const card = zone.querySelector(`[data-dock-id="${id}"]`);
        if (card) zone.appendChild(card);
      });
    });
  } catch (_err) {
    /* Layout save */
  }
}

function setRearrangeMode(enabled) {
  rearrangeMode = enabled;
  document.body.classList.toggle("rearrange-mode", enabled);
  rearrangeBtn.setAttribute("aria-pressed", String(enabled));
  rearrangeBtn.textContent = enabled ? "Done" : "Rearrange";
  dockCards().forEach(card => card.draggable = enabled);
  setStatus(enabled ? "Rearrange side panels. Canvas stays fixed." : "Layout saved.");
  if (!enabled) saveDockLayout();
}

function cardAfterPointer(zone, y) {
  const cards = Array.from(zone.querySelectorAll(".dock-card:not(.dragging)"));
  return cards.reduce((closest, card) => {
    const box = card.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, card };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY, card: null }).card;
}

function stopDockAutoScroll() {
  if (autoScrollFrame) cancelAnimationFrame(autoScrollFrame);
  autoScrollFrame = null;
  latestDragEvent = null;
}

function runDockAutoScroll() {
  if (!latestDragEvent || !rearrangeMode) return stopDockAutoScroll();

  const margin = 82;
  const maxSpeed = 18;
  const y = latestDragEvent.clientY;
  const zones = dockZones();
  const activeZone = zones.find(zone => {
    const box = zone.getBoundingClientRect();
    return latestDragEvent.clientX >= box.left && latestDragEvent.clientX <= box.right;
  });

  let target = null;
  let delta = 0;

  if (activeZone) {
    const box = activeZone.getBoundingClientRect();
    const canScroll = activeZone.scrollHeight > activeZone.clientHeight;
    if (canScroll && y < box.top + margin) {
      target = activeZone;
      delta = -Math.ceil(maxSpeed * (1 - Math.max(0, y - box.top) / margin));
    } else if (canScroll && y > box.bottom - margin) {
      target = activeZone;
      delta = Math.ceil(maxSpeed * (1 - Math.max(0, box.bottom - y) / margin));
    }
  }

  if (!target && y < margin) {
    target = document.scrollingElement || document.documentElement;
    delta = -Math.ceil(maxSpeed * (1 - Math.max(0, y) / margin));
  } else if (!target && y > window.innerHeight - margin) {
    target = document.scrollingElement || document.documentElement;
    delta = Math.ceil(maxSpeed * (1 - Math.max(0, window.innerHeight - y) / margin));
  }

  if (target && delta) target.scrollTop += delta;
  autoScrollFrame = requestAnimationFrame(runDockAutoScroll);
}

function setupDockRearrange() {
  dockCards().forEach(card => {
    card.addEventListener("dragstart", event => {
      if (!rearrangeMode) return event.preventDefault();
      draggedDockCard = card;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.dockId || "dock-card");
      setStatus("Drag blocks within or between the sidebars.");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      dockCards().forEach(item => item.classList.remove("drag-over"));
      draggedDockCard = null;
      stopDockAutoScroll();
      if (rearrangeMode) saveDockLayout();
    });
  });

  dockZones().forEach(zone => {
    zone.addEventListener("dragenter", event => {
      if (!rearrangeMode || !draggedDockCard) return;
      event.preventDefault();
      zone.classList.add("zone-ready");
    });

    zone.addEventListener("dragleave", event => {
      if (!zone.contains(event.relatedTarget)) zone.classList.remove("zone-ready");
    });

    zone.addEventListener("dragover", event => {
      if (!rearrangeMode || !draggedDockCard) return;
      event.preventDefault();
      latestDragEvent = event;
      if (!autoScrollFrame) autoScrollFrame = requestAnimationFrame(runDockAutoScroll);

      const after = cardAfterPointer(zone, event.clientY);
      if (after == null) zone.appendChild(draggedDockCard);
      else zone.insertBefore(draggedDockCard, after);
    });

    zone.addEventListener("drop", event => {
      if (!rearrangeMode || !draggedDockCard) return;
      event.preventDefault();
      zone.classList.remove("zone-ready");
      saveDockLayout();
    });
  });
}



// Modal controls
function openPixelizerModal() {
  pixelizerOverlay.hidden = false;
  openPixelizerBtn.setAttribute("aria-expanded", "true");
  setTimeout(() => imageImportInput.focus(), 0);
}
function closePixelizerModal() {
  pixelizerOverlay.hidden = true;
  openPixelizerBtn.setAttribute("aria-expanded", "false");
  openPixelizerBtn.focus();
}

function openCustomSizeModal() {
  customSizeInput.value = `${projectWidth()}x${projectHeight()}`;
  customSizeOverlay.hidden = false;
  customSizeBtn.setAttribute("aria-expanded", "true");
  setTimeout(() => customSizeInput.focus(), 0);
}

function closeCustomSizeModal() {
  customSizeOverlay.hidden = true;
  customSizeBtn.setAttribute("aria-expanded", "false");
  customSizeBtn.focus();
}

function applyCustomSize() {
  const raw = String(customSizeInput.value || "").toLowerCase().replace(/×/g, "x");
  const parts = raw.split("x").map(value => Math.floor(Number(value.trim()))).filter(Number.isFinite);
  const nextWidth = parts[0];
  const nextHeight = parts[1] || parts[0];
  if (!Number.isInteger(nextWidth) || !Number.isInteger(nextHeight) || nextWidth < 1 || nextHeight < 1 || nextWidth > 512 || nextHeight > 512) {
    return setStatus("Custom size must be 1–512, like 128x64.");
  }
  closeCustomSizeModal();
  resizeProject(nextWidth, nextHeight);
}


// Print tools
function cleanPrintNumber(input, fallback, min, max) {
  const value = Number(input.value);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function printSettings() {
  const dpi = Math.round(cleanPrintNumber(printDpiInput, 300, 72, 1200));
  const artWidth = cleanPrintNumber(printWidthInput, 2, 0.1, 60);
  const bleed = cleanPrintNumber(printBleedInput, 0.125, 0, 1);
  const safe = cleanPrintNumber(printSafeInput, 0.125, 0, 1);
  const stripWidth = cleanPrintNumber(printStripWidthInput, 10, 1, 120);
  const stripHeight = cleanPrintNumber(printStripHeightInput, 0.6, 0.1, 6);
  const stickerCols = Math.round(cleanPrintNumber(printStickerColsInput, 3, 1, 12));
  const stickerRows = Math.round(cleanPrintNumber(printStickerRowsInput, 3, 1, 12));
  const stickerGap = cleanPrintNumber(printStickerGapInput, 0.2, 0, 2);
  const memoHeight = cleanPrintNumber(printMemoHeightInput, 4, 1, 14);
  return { dpi, artWidth, bleed, safe, stripWidth, stripHeight, stickerCols, stickerRows, stickerGap, memoHeight, mode: printRepeatSelect.value, templateSize: !!printTemplateSizeInput?.checked, templatePlacement: printTemplatePlacementSelect?.value || "guide" };
}

function drawPrintTile(ctxTarget, sourceCanvas, x, y, w, h) {
  ctxTarget.imageSmoothingEnabled = false;
  ctxTarget.drawImage(sourceCanvas, x, y, w, h);
}

function scaledStickerCanvas(sourceCanvas, sizePx, borderPx) {
  const output = document.createElement("canvas");
  output.width = sizePx + borderPx * 2;
  output.height = sizePx + borderPx * 2;
  const out = output.getContext("2d");
  out.imageSmoothingEnabled = false;
  out.clearRect(0, 0, output.width, output.height);
  out.fillStyle = "#fff";
  for (let oy = -borderPx; oy <= borderPx; oy += Math.max(1, Math.floor(borderPx / 3) || 1)) {
    for (let ox = -borderPx; ox <= borderPx; ox += Math.max(1, Math.floor(borderPx / 3) || 1)) {
      if (ox * ox + oy * oy <= borderPx * borderPx) out.drawImage(sourceCanvas, borderPx + ox, borderPx + oy, sizePx, sizePx);
    }
  }
  out.globalCompositeOperation = "source-in";
  out.fillRect(0, 0, output.width, output.height);
  out.globalCompositeOperation = "source-over";
  out.drawImage(sourceCanvas, borderPx, borderPx, sizePx, sizePx);
  return output;
}

function makePrintArtCanvas(settings) {
  const pixels = flattenedPixels(frame());
  const source = pixelsToCanvas(pixels, 1);
  const artPixels = Math.max(1, Math.round(settings.artWidth * settings.dpi));
  const bleedPixels = Math.round(settings.bleed * settings.dpi);
  const safePixels = Math.round(settings.safe * settings.dpi);
  const gapPixels = Math.round(settings.stickerGap * settings.dpi);
  const tilePixels = artPixels + bleedPixels * 2;
  const output = document.createElement("canvas");
  if (settings.mode === "washi" || settings.mode === "stamp-washi") {
    output.width = Math.max(1, Math.round(settings.stripWidth * settings.dpi));
    output.height = Math.max(1, Math.round(settings.stripHeight * settings.dpi));
  } else if (settings.mode === "tile") {
    output.width = artPixels * 3 + bleedPixels * 2;
    output.height = artPixels * 3 + bleedPixels * 2;
  } else if (settings.mode === "sticker") {
    output.width = settings.stickerCols * tilePixels + Math.max(0, settings.stickerCols - 1) * gapPixels;
    output.height = settings.stickerRows * tilePixels + Math.max(0, settings.stickerRows - 1) * gapPixels;
  } else if (settings.mode === "memo") {
    output.width = artPixels + bleedPixels * 2;
    output.height = Math.max(1, Math.round(settings.memoHeight * settings.dpi));
  } else {
    output.width = tilePixels;
    output.height = tilePixels;
  }
  const out = output.getContext("2d");
  out.imageSmoothingEnabled = false;
  out.fillStyle = "#fff";
  out.fillRect(0, 0, output.width, output.height);
  if (settings.mode === "single") {
    drawPrintTile(out, source, bleedPixels, bleedPixels, artPixels, artPixels);
  } else if (settings.mode === "tile") {
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPrintTile(out, source, bleedPixels + x * artPixels, bleedPixels + y * artPixels, artPixels, artPixels);
  } else if (settings.mode === "washi") {
    const tileSize = output.height;
    for (let x = 0; x < output.width; x += tileSize) drawPrintTile(out, source, x, 0, tileSize, output.height);
  } else if (settings.mode === "stamp-washi") {
    const stamp = Math.min(output.height - safePixels * 2, Math.round(settings.artWidth * settings.dpi));
    const step = stamp + Math.max(safePixels, gapPixels);
    for (let x = safePixels; x < output.width; x += step) {
      out.setLineDash([12, 8]);
      out.strokeStyle = "#222";
      out.lineWidth = Math.max(2, Math.round(settings.dpi / 150));
      out.strokeRect(x, safePixels, stamp, stamp);
      out.setLineDash([]);
      drawPrintTile(out, source, x, safePixels, stamp, stamp);
    }
  } else if (settings.mode === "sticker") {
    const sticker = scaledStickerCanvas(source, artPixels, bleedPixels);
    for (let y = 0; y < settings.stickerRows; y++) for (let x = 0; x < settings.stickerCols; x++) {
      const px = x * (tilePixels + gapPixels);
      const py = y * (tilePixels + gapPixels);
      out.drawImage(sticker, px, py);
    }
  } else if (settings.mode === "memo") {
    const header = Math.min(artPixels, Math.round(output.height * 0.32));
    drawPrintTile(out, source, bleedPixels, bleedPixels, header, header);
    out.strokeStyle = "rgba(0,0,0,0.28)";
    out.lineWidth = Math.max(1, Math.round(settings.dpi / 300));
    const lineGap = Math.max(18, Math.round(settings.dpi * 0.28));
    for (let y = bleedPixels + header + lineGap; y < output.height - bleedPixels; y += lineGap) {
      out.beginPath();
      out.moveTo(bleedPixels, y);
      out.lineTo(output.width - bleedPixels, y);
      out.stroke();
    }
  }
  return output;
}

function drawTemplateImage(ctxTarget, template, width, height) {
  if (!template) return;
  ctxTarget.drawImage(template, 0, 0, width, height);
}

function drawCenteredPrintArt(ctxTarget, art, width, height, settings) {
  const margin = Math.round(settings.safe * settings.dpi);
  const fitW = Math.max(1, width - margin * 2);
  const fitH = Math.max(1, height - margin * 2);
  const scale = Math.min(fitW / art.width, fitH / art.height);
  const drawW = Math.max(1, Math.round(art.width * scale));
  const drawH = Math.max(1, Math.round(art.height * scale));
  const x = Math.floor((width - drawW) / 2);
  const y = Math.floor((height - drawH) / 2);
  ctxTarget.drawImage(art, x, y, drawW, drawH);
}

function makePrintCanvas(settings, includeGuide = false) {
  const art = makePrintArtCanvas(settings);
  if (!printTemplateImage) return art;
  const useTemplateSize = settings.templateSize;
  const width = useTemplateSize ? printTemplateImage.naturalWidth || printTemplateImage.width : art.width;
  const height = useTemplateSize ? printTemplateImage.naturalHeight || printTemplateImage.height : art.height;
  const output = document.createElement("canvas");
  output.width = Math.max(1, width);
  output.height = Math.max(1, height);
  const out = output.getContext("2d");
  out.imageSmoothingEnabled = false;
  out.fillStyle = "#fff";
  out.fillRect(0, 0, output.width, output.height);
  if (settings.templatePlacement === "behind") drawTemplateImage(out, printTemplateImage, output.width, output.height);
  if (useTemplateSize) drawCenteredPrintArt(out, art, output.width, output.height, settings);
  else out.drawImage(art, 0, 0);
  if (settings.templatePlacement === "over" || (includeGuide && settings.templatePlacement === "guide")) {
    out.save();
    out.globalAlpha = settings.templatePlacement === "guide" ? 0.45 : 1;
    drawTemplateImage(out, printTemplateImage, output.width, output.height);
    out.restore();
  }
  return output;
}

function drawPrintGuides(previewCanvas, settings, scaleX, scaleY, targetCtx = printPreviewCtx) {
  const bleed = settings.bleed * settings.dpi;
  const safe = settings.safe * settings.dpi;
  const ctxTarget = targetCtx;
  ctxTarget.save();
  ctxTarget.setLineDash([7, 5]);
  ctxTarget.lineWidth = 2;
  ctxTarget.strokeStyle = "#000";
  if (settings.mode === "washi" || settings.mode === "stamp-washi") {
    ctxTarget.strokeRect(1, 1, previewCanvas.width - 2, previewCanvas.height - 2);
  } else if (settings.mode !== "sticker") {
    ctxTarget.strokeRect(bleed * scaleX, bleed * scaleY, previewCanvas.width - bleed * 2 * scaleX, previewCanvas.height - bleed * 2 * scaleY);
    ctxTarget.setLineDash([3, 4]);
    ctxTarget.strokeRect((bleed + safe) * scaleX, (bleed + safe) * scaleY, previewCanvas.width - (bleed + safe) * 2 * scaleX, previewCanvas.height - (bleed + safe) * 2 * scaleY);
  }
  ctxTarget.restore();
}

function updatePrintFields() {
  const mode = printRepeatSelect.value;
  const usesWashi = mode === "washi" || mode === "stamp-washi";
  printWashiFields.hidden = !usesWashi;
  printStickerFields.hidden = mode !== "sticker";
  printMemoFields.hidden = mode !== "memo";
  exportCutlineBtn.hidden = mode !== "sticker";
}

function drawPrintPreview() {
  updatePrintFields();
  const settings = printSettings();
  const output = makePrintCanvas(settings, true);
  const maxW = printPreviewCanvas.width;
  const maxH = printPreviewCanvas.height;
  const scale = Math.min(maxW / output.width, maxH / output.height);
  const drawW = Math.max(1, Math.round(output.width * scale));
  const drawH = Math.max(1, Math.round(output.height * scale));
  const x = Math.floor((maxW - drawW) / 2);
  const y = Math.floor((maxH - drawH) / 2);
  printPreviewCtx.imageSmoothingEnabled = false;
  printPreviewCtx.fillStyle = canvasBackgroundColor();
  printPreviewCtx.fillRect(0, 0, maxW, maxH);
  printPreviewCtx.drawImage(output, x, y, drawW, drawH);
  printPreviewCtx.save();
  printPreviewCtx.translate(x, y);
  drawPrintGuides({ width: drawW, height: drawH }, settings, drawW / output.width, drawH / output.height);
  printPreviewCtx.restore();
  const widthIn = output.width / settings.dpi;
  const heightIn = output.height / settings.dpi;
  printInfo.textContent = `${output.width} × ${output.height} px, ${widthIn.toFixed(2)} × ${heightIn.toFixed(2)} in at ${settings.dpi} DPI.`;
}


function drawLargePrintPreview() {
  const settings = printSettings();
  const output = makePrintCanvas(settings, true);
  const maxW = largePrintPreviewCanvas.width;
  const maxH = largePrintPreviewCanvas.height;
  const scale = Math.min(maxW / output.width, maxH / output.height);
  const drawW = Math.max(1, Math.round(output.width * scale));
  const drawH = Math.max(1, Math.round(output.height * scale));
  const x = Math.floor((maxW - drawW) / 2);
  const y = Math.floor((maxH - drawH) / 2);
  largePrintPreviewCtx.imageSmoothingEnabled = false;
  largePrintPreviewCtx.fillStyle = canvasBackgroundColor();
  largePrintPreviewCtx.fillRect(0, 0, maxW, maxH);
  largePrintPreviewCtx.drawImage(output, x, y, drawW, drawH);
  largePrintPreviewCtx.save();
  largePrintPreviewCtx.translate(x, y);
  drawPrintGuides({ width: drawW, height: drawH }, settings, drawW / output.width, drawH / output.height, largePrintPreviewCtx);
  largePrintPreviewCtx.restore();
}

function openLargePrintPreview() {
  drawLargePrintPreview();
  printPreviewOverlay.hidden = false;
  openPrintPreviewBtn.setAttribute("aria-expanded", "true");
  closePrintPreviewBtn.focus();
}

function closeLargePrintPreview() {
  printPreviewOverlay.hidden = true;
  openPrintPreviewBtn.setAttribute("aria-expanded", "false");
  openPrintPreviewBtn.focus();
}

function schedulePrintPreview() {
  cancelAnimationFrame(printFrame);
  printFrame = requestAnimationFrame(() => {
    drawPrintPreview();
    if (!printPreviewOverlay.hidden) drawLargePrintPreview();
  });
}

function setPrintMode(enabled) {
  if (enabled && playModeScreen) setPlayModeScreen(false);
  printMode = enabled;
  document.body.classList.toggle("print-mode", enabled);
  printPanel.hidden = !enabled;
  printModeBtn.setAttribute("aria-pressed", String(enabled));
  printModeBtn.textContent = enabled ? "Base Mode" : "Print Mode";
  if (enabled) {
    drawPrintPreview();
    setStatus("Print Mode ready.");
  } else {
    setStatus("Base Mode ready.");
  }
}

function makeCutlineSVG(settings) {
  const pixels = flattenedPixels(frame());
  const artPixels = Math.max(1, Math.round(settings.artWidth * settings.dpi));
  const cell = artPixels / projectWidth();
  const bleedCells = Math.max(1, Math.ceil((settings.bleed * settings.dpi) / Math.max(1, cell)));
  const maskWidth = projectWidth() + bleedCells * 2;
  const maskHeight = projectHeight() + bleedCells * 2;
  const mask = Array.from({ length: maskHeight }, () => Array(maskWidth).fill(false));
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
    if (!pixels[y]?.[x]) continue;
    for (let oy = -bleedCells; oy <= bleedCells; oy++) for (let ox = -bleedCells; ox <= bleedCells; ox++) {
      if (ox * ox + oy * oy <= bleedCells * bleedCells) {
        const mx = x + bleedCells + ox;
        const my = y + bleedCells + oy;
        if (mx >= 0 && my >= 0 && mx < maskWidth && my < maskHeight) mask[my][mx] = true;
      }
    }
  }
  const path = [];
  const add = (x1, y1, x2, y2) => path.push(`M${(x1 * cell).toFixed(2)} ${(y1 * cell).toFixed(2)}L${(x2 * cell).toFixed(2)} ${(y2 * cell).toFixed(2)}`);
  for (let y = 0; y < maskHeight; y++) for (let x = 0; x < maskWidth; x++) {
    if (!mask[y][x]) continue;
    if (!mask[y - 1]?.[x]) add(x, y, x + 1, y);
    if (!mask[y + 1]?.[x]) add(x + 1, y + 1, x, y + 1);
    if (!mask[y]?.[x - 1]) add(x, y + 1, x, y);
    if (!mask[y]?.[x + 1]) add(x + 1, y, x + 1, y + 1);
  }
  const width = (maskWidth * cell).toFixed(2);
  const height = (maskHeight * cell).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${(Number(width) / settings.dpi).toFixed(3)}in" height="${(Number(height) / settings.dpi).toFixed(3)}in" viewBox="0 0 ${width} ${height}"><path d="${path.join(" ")}" fill="none" stroke="#ff00ff" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}

async function exportCutlineSVG() {
  const settings = printSettings();
  const svg = makeCutlineSVG(settings);
  const res = await window.pixelBug.saveFile({ title: "Export Sticker Cutline", defaultPath: "pixel-bug-sticker-cutline.svg", filters: [{ name: "SVG Cutline", extensions: ["svg"] }], data: svg, encoding: "utf8" });
  setStatus(res.ok ? "Saved pixel-bug-sticker-cutline.svg." : "Save cancelled.");
}

async function exportPrintPNG() {
  const settings = printSettings();
  const output = makePrintCanvas(settings, false);
  const filename = settings.mode === "washi" || settings.mode === "stamp-washi" ? "pixel-bug-washi-print.png" : settings.mode === "sticker" ? "pixel-bug-sticker-sheet.png" : settings.mode === "memo" ? "pixel-bug-memo-pad.png" : "pixel-bug-print.png";
  await saveBase64("Export Print PNG", filename, "PNG Image", "png", dataUrlBase64(output.toDataURL("image/png")));
}

function loadPrintTemplate(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      printTemplateImage = img;
      printTemplateFileName = file.name;
      if (printTemplateName) printTemplateName.textContent = `${file.name} loaded.`;
      schedulePrintPreview();
      setStatus("Print template loaded.");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function clearPrintTemplate() {
  printTemplateImage = null;
  printTemplateFileName = "";
  if (printTemplateInput) printTemplateInput.value = "";
  if (printTemplateName) printTemplateName.textContent = "No template uploaded.";
  schedulePrintPreview();
  setStatus("Print template cleared.");
}

// Event wiring
canvas.addEventListener("pointerdown", beginDraw); canvas.addEventListener("pointermove", moveDraw); canvas.addEventListener("pointerup", endDraw); canvas.addEventListener("pointercancel", endDraw); canvas.addEventListener("pointerleave", endDraw);
colorPicker.oninput = e => { color = e.target.value; syncColorInputs(color); renderPalette(); saveLocal(); };
paletteColorWheel.oninput = e => { color = e.target.value; syncColorInputs(color); renderPalette(); };
paletteHexInput.oninput = e => { const next = e.target.value.trim(); if (isHexColor(next)) { color = next; syncColorInputs(color); renderPalette(); } };
brushSizeInput.oninput = e => { brushSize = Number(e.target.value); brushSizeOutput.textContent = `${brushSize} px`; };
canvasSizeSelect.onchange = e => { const value = String(e.target.value || ""); if (!value) return; const [w, h] = value.includes("x") ? value.split("x").map(Number) : [Number(value), Number(value)]; resizeProject(w, h); };
frameDurationInput.onchange = e => { pushHistory(); frame().duration = Number(e.target.value) || 120; renderFrames(); saveLocal(); };
layerOpacityInput.oninput = e => { layer().opacity = Number(e.target.value)/100; drawCanvas(); renderLayers(); };
layerOpacityInput.onchange = () => { pushHistory(); saveLocal(); };
$("#toggle-grid-btn").onclick = e => { showGrid=!showGrid; e.target.textContent=showGrid?"Grid On":"Grid Off"; e.target.setAttribute("aria-pressed", String(showGrid)); drawCanvas(); saveLocal(); };
$("#toggle-onion-btn").onclick = e => { showOnion=!showOnion; e.target.textContent=showOnion?"Onion On":"Onion Off"; e.target.setAttribute("aria-pressed", String(showOnion)); drawCanvas(); saveLocal(); };
$("#undo-btn").onclick = () => { if(!undoStack.length) return; redoStack.push(clone(state)); restore(undoStack.pop()); };
$("#redo-btn").onclick = () => { if(!redoStack.length) return; undoStack.push(clone(state)); restore(redoStack.pop()); };
$("#new-project-btn").onclick = openNewProjectConfirm; $("#save-project-btn").onclick = saveProject; $("#open-project-btn").onclick = openProject; $("#export-png-btn").onclick = exportPNG; $("#export-sheet-btn").onclick = exportSheet; $("#export-gif-btn").onclick = exportGIF;
confirmNewProjectBtn && (confirmNewProjectBtn.onclick = confirmNewProject);
cancelNewProjectBtn && (cancelNewProjectBtn.onclick = closeNewProjectConfirm);
keepCurrentProjectBtn && (keepCurrentProjectBtn.onclick = closeNewProjectConfirm);
newProjectOverlay && newProjectOverlay.addEventListener("click", e => { if (e.target === newProjectOverlay) closeNewProjectConfirm(); });
$("#add-frame-btn").onclick = () => addFrame(false); $("#duplicate-frame-btn").onclick = () => addFrame(true); $("#delete-frame-btn").onclick = deleteFrame;
$("#add-layer-btn").onclick = () => addLayer(false); $("#duplicate-layer-btn").onclick = () => addLayer(true); $("#delete-layer-btn").onclick = deleteLayer; $("#layer-up-btn").onclick = () => moveLayer(1); $("#layer-down-btn").onclick = () => moveLayer(-1);
openPixelizerBtn.setAttribute("aria-haspopup", "dialog");
openPixelizerBtn.setAttribute("aria-expanded", "false");
openPixelizerBtn.onclick = openPixelizerModal;
closePixelizerBtn.onclick = closePixelizerModal;
pixelizerOverlay.addEventListener("click", e => { if (e.target === pixelizerOverlay) closePixelizerModal(); });
openVoxelBtn.setAttribute("aria-haspopup", "dialog");
openVoxelBtn.setAttribute("aria-expanded", "false");
openVoxelBtn.onclick = openVoxelModal;
closeVoxelBtn.onclick = closeVoxelModal;
function scheduleVoxelPreview() {
  cancelAnimationFrame(voxelFrame);
  voxelFrame = requestAnimationFrame(drawVoxelPreview);
}
exportVoxelBtn.onclick = exportVoxelPNG;
exportVoxelTurntableBtn.onclick = exportVoxelTurntableGIF;
exportVoxelObjBtn.onclick = exportVoxelOBJ;
voxelOverlay.addEventListener("click", e => { if (e.target === voxelOverlay) closeVoxelModal(); });
[voxelDepthInput, voxelScaleInput, voxelRotationXInput, voxelRotationYInput, voxelRotationZInput].forEach(input => input.oninput = () => { if (input === voxelDepthInput) { voxelPixelCache = null; voxelNeighborCache = null; } scheduleVoxelPreview(); });
[voxelFloorInput, voxelMergeInput, voxelDepthModeSelect].forEach(input => input.onchange = () => { voxelPixelCache = null; voxelNeighborCache = null; scheduleVoxelPreview(); });
customSizeBtn.setAttribute("aria-haspopup", "dialog");
customSizeBtn.setAttribute("aria-expanded", "false");
customSizeBtn.onclick = openCustomSizeModal;
closeCustomSizeBtn.onclick = closeCustomSizeModal;
applyCustomSizeBtn.onclick = applyCustomSize;
customSizeInput.addEventListener("keydown", e => { if (e.key === "Enter") applyCustomSize(); });
customSizeOverlay.addEventListener("click", e => { if (e.target === customSizeOverlay) closeCustomSizeModal(); });
$("#add-palette-btn").onclick = addColorToPreset;
palettePresetSelect.onchange = e => switchPreset(e.target.value);
$("#new-preset-btn").onclick = createPreset;
$("#rename-preset-btn").onclick = renamePreset;
$("#delete-preset-btn").onclick = deletePreset;
rearrangeBtn.onclick = () => setRearrangeMode(!rearrangeMode);

printModeBtn.onclick = () => setPrintMode(!printMode);
playModeBtn.onclick = () => setPlayModeScreen(!playModeScreen);
openPrintPreviewBtn.setAttribute("aria-expanded", "false");
openPrintPreviewBtn.onclick = openLargePrintPreview;
closePrintPreviewBtn.onclick = closeLargePrintPreview;
printPreviewOverlay.addEventListener("click", e => { if (e.target === printPreviewOverlay) closeLargePrintPreview(); });
exportPrintBtn.onclick = exportPrintPNG;
exportCutlineBtn.onclick = exportCutlineSVG;
printTemplateInput.onchange = e => loadPrintTemplate(e.target.files?.[0]);
printTemplateSizeInput.onchange = schedulePrintPreview;
printTemplatePlacementSelect.onchange = schedulePrintPreview;
clearPrintTemplateBtn.onclick = clearPrintTemplate;
[printDpiInput, printWidthInput, printBleedInput, printSafeInput, printStripWidthInput, printStripHeightInput, printStickerColsInput, printStickerRowsInput, printStickerGapInput, printMemoHeightInput].forEach(input => input.oninput = schedulePrintPreview);
printRepeatSelect.onchange = () => { updatePrintFields(); schedulePrintPreview(); };
openPrivacyBtn?.setAttribute("aria-haspopup", "dialog");
openPrivacyBtn?.setAttribute("aria-expanded", "false");
if (openPrivacyBtn) openPrivacyBtn.onclick = openPrivacyModal;
if (closePrivacyBtn) closePrivacyBtn.onclick = closePrivacyModal;
privacyOverlay.addEventListener("click", e => { if (e.target === privacyOverlay) closePrivacyModal(); });
imageImportInput.onchange = e => loadImageFile(e.target.files[0]);
pixelizeSizeInput.oninput = () => { updatePixelizerLabels(); if (importedImage) drawPixelizerPreview(); };
pixelizeColorsInput.oninput = () => { updatePixelizerLabels(); if (importedImage) drawPixelizerPreview(); };
pixelizeFitInput.onchange = () => { if (importedImage) drawPixelizerPreview(); };
if (pixelTextScaleInput) pixelTextScaleInput.oninput = updatePixelTextLabel;
$("#pixelize-import-btn").onclick = importPixelizedImage;

if (playCanvas) {
  playRunBtn.onclick = () => setPlayRunning(!playRunning);
  playResetBtn.onclick = () => { setPlayRunning(false); resetPlayActor(); };
  playModeCenterBtn.onclick = centerPlayActor;
  if (playExportPngBtn) playExportPngBtn.onclick = exportPlayScenePNG;
  if (playExportGifBtn) playExportGifBtn.onclick = exportPlaySceneGIF;
  playAddPropBtn.onclick = addPlayProp;
  playUseActiveBtn.onclick = () => { playPropFrameSelect.value = String(state.activeFrame); setStatus("Active frame selected for Play Mode placement."); };
  playDeletePropBtn.onclick = deleteSelectedPlayProp;
  playClearPropsBtn.onclick = () => { pushHistory(); state.playMode.props = []; selectedPlayProp = -1; renderPlayPanel(); drawPlayScene(); saveLocal(); setStatus("Play Mode scene cleared."); };
  playIdleFrameSelect.onchange = e => { pushHistory(); state.playMode.idleFrame = Number(e.target.value) || 0; drawPlayScene(); saveLocal(); };
  playWalkFrameSelect.onchange = e => { pushHistory(); state.playMode.walkFrame = Number(e.target.value) || 0; drawPlayScene(); saveLocal(); };
  playJumpFrameSelect.onchange = e => { pushHistory(); state.playMode.jumpFrame = Number(e.target.value) || 0; drawPlayScene(); saveLocal(); };
  [playSceneWidthInput, playSceneHeightInput, playGroundYInput, playWorldWidthInput].filter(Boolean).forEach(input => input.onchange = updatePlaySceneSettings);
  if (playBackgroundFrameSelect) playBackgroundFrameSelect.onchange = e => { pushHistory(); state.playMode.backgroundFrame = Number(e.target.value); normalizeProject(); drawPlayScene(); saveLocal(); setStatus("Play Mode background updated."); };
  if (playBackgroundScaleSelect) playBackgroundScaleSelect.onchange = e => { state.playMode.backgroundScale = e.target.value; normalizeProject(); drawPlayScene(); saveLocal(); };
  if (playGridOverBgInput) playGridOverBgInput.onchange = () => { state.playMode.showGridOverlay = playGridOverBgInput.checked; drawPlayScene(); saveLocal(); };
  if (playCameraFollowInput) playCameraFollowInput.onchange = () => { state.playMode.cameraFollow = playCameraFollowInput.checked; drawPlayScene(); saveLocal(); };
  if (playAutoScrollInput) playAutoScrollInput.onchange = () => { state.playMode.autoScroll = playAutoScrollInput.checked; saveLocal(); setStatus(state.playMode.autoScroll ? "Auto-scroll enabled." : "Auto-scroll disabled."); };
  if (playScrollSpeedInput) playScrollSpeedInput.oninput = () => { state.playMode.scrollSpeed = Math.max(0, Math.min(Number(playScrollSpeedInput.value) || 0, 20)); saveLocal(); };
  if (playSceneryFrameSelect) playSceneryFrameSelect.onchange = e => { pushHistory(); state.playMode.sceneryFrame = Number(e.target.value); normalizeProject(); drawPlayScene(); saveLocal(); setStatus("Repeating scenery updated."); };
  [playSceneryScaleInput, playScenerySpeedInput, playSceneryYInput].filter(Boolean).forEach(input => input.oninput = () => {
    state.playMode.sceneryScale = Math.max(0.5, Math.min(Number(playSceneryScaleInput?.value) || 3, 32));
    state.playMode.scenerySpeed = Math.max(-4, Math.min(Number(playScenerySpeedInput?.value) || 0.45, 4));
    state.playMode.sceneryY = Math.max(-1024, Math.min(Number(playSceneryYInput?.value) || 0, 2160));
    drawPlayScene();
    saveLocal();
  });
  if (playLayerFrameSelect) playLayerFrameSelect.onchange = () => { pushHistory(); updateSelectedPlayLayer(); setStatus("Play Mode visual layer updated."); };
  [playLayerScaleInput, playLayerParallaxInput, playLayerYInput, playLayerOpacityInput, playLayerRepeatInput, playLayerVisibleInput].filter(Boolean).forEach(input => {
    input.oninput = updateSelectedPlayLayer;
    input.onchange = updateSelectedPlayLayer;
  });
  if (playActorScaleInput) playActorScaleInput.oninput = () => {
    state.playMode.actorScale = Math.max(1, Math.min(Number(playActorScaleInput.value) || 3, 16));
    normalizeProject();
    const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
    const actorScale = playScale();
    const actorW = projectWidth() * actorScale;
    const actorH = projectHeight() * actorScale;
    playActor.x = Math.max(0, Math.min(playWorldWidth() - actorW, playActor.x));
    if (playActor.grounded || playActor.y + actorH > ground) playActor.y = ground - actorH;
    drawPlayScene();
    saveLocal();
  };
  [playPropXInput, playPropYInput, playPropScaleInput].forEach(input => input.oninput = () => {
    const prop = state.playMode.props[selectedPlayProp];
    if (prop) {
      prop.x = Number(playPropXInput.value) || 0;
      prop.y = Number(playPropYInput.value) || 0;
      prop.scale = Math.max(1, Math.min(Number(playPropScaleInput?.value) || playScale(), 16));
      renderPlayPropList();
      saveLocal();
    }
    schedulePlayDraw();
  });
  if (playPropSolidInput) playPropSolidInput.onchange = () => {
    const prop = state.playMode.props[selectedPlayProp];
    if (prop) { pushHistory(); prop.solid = playPropSolidInput.checked; renderPlayPropList(); drawPlayScene(); saveLocal(); }
  };
  playCanvas.addEventListener("pointerdown", e => {
    const point = playCanvasPoint(e);
    const picked = pickPlayProp(point.x, point.y);
    if (picked >= 0) {
      selectedPlayProp = picked;
      const prop = state.playMode.props[picked];
      playDrag = { index: picked, offsetX: worldX(point.x) - prop.x, offsetY: point.y - prop.y, moved: false };
      syncSelectedPlayPropControls();
      renderPlayPropList();
      drawPlayScene();
      playCanvas.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      return;
    }
    playPropXInput.value = String(worldX(point.x));
    playPropYInput.value = String(point.y);
    drawPlayScene();
  });
  playCanvas.addEventListener("pointermove", e => {
    if (!playDrag) return;
    const prop = state.playMode.props[playDrag.index];
    if (!prop) return;
    const point = playCanvasPoint(e);
    const r = playPropRect(prop);
    prop.x = Math.max(0, Math.min(playWorldWidth() - r.w, worldX(point.x) - playDrag.offsetX));
    prop.y = Math.max(0, Math.min(playCanvas.height - r.h, point.y - playDrag.offsetY));
    playDrag.moved = true;
    syncSelectedPlayPropControls();
    schedulePlayDraw();
    e.preventDefault();
  });
  playCanvas.addEventListener("pointerup", e => {
    if (!playDrag) return;
    if (playDrag.moved) { renderPlayPropList(); saveLocal(); setStatus("Play Mode object moved."); }
    playDrag = null;
    playCanvas.releasePointerCapture?.(e.pointerId);
  });
  playCanvas.addEventListener("pointercancel", () => { playDrag = null; });
  resetPlayActor();
}
window.addEventListener("keydown", e => {
  const editable = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName) || e.target?.isContentEditable;
  if (editable) {
    if (e.key === "Escape") e.target.blur?.();
    return;
  }
  if (e.key === "Escape" && selectionBox && (pixelizerOverlay.hidden && voxelOverlay.hidden && customSizeOverlay.hidden && privacyOverlay.hidden && (!newProjectOverlay || newProjectOverlay.hidden))) { e.preventDefault(); selectionAction("clear"); return; }
  if (e.key === "Escape" && !pixelizerOverlay.hidden) { closePixelizerModal(); return; }
  if (e.key === "Escape" && !voxelOverlay.hidden) { closeVoxelModal(); return; }
  if (e.key === "Escape" && !customSizeOverlay.hidden) { closeCustomSizeModal(); return; }
  if (e.key === "Escape" && !privacyOverlay.hidden) { closePrivacyModal(); return; }
  if (e.key === "Escape" && newProjectOverlay && !newProjectOverlay.hidden) { closeNewProjectConfirm(); return; }
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); saveProject(); }
  if (mod && e.key.toLowerCase() === "o") { e.preventDefault(); openProject(); }
  if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? $("#redo-btn").click() : $("#undo-btn").click(); }
  if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); $("#redo-btn").click(); }
  if (mod && e.key.toLowerCase() === "c") { e.preventDefault(); selectionAction("copy"); }
  if (mod && e.key.toLowerCase() === "x") { e.preventDefault(); selectionAction("cut"); }
  if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); selectionAction("paste"); }
  if (e.key === "Delete" || e.key === "Backspace") { if (selectionBox) { e.preventDefault(); selectionAction("delete"); } }
  const map = { b: "pencil", e: "eraser", g: "fill", i: "eyedropper", l: "line", r: "rect", o: "ellipse", m: "select", t: "text" };
  if (!mod && map[e.key.toLowerCase()]) setTool(map[e.key.toLowerCase()]);
});

window.addEventListener("keydown", e => {
  if (!playRunning) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)) e.preventDefault();
  playKeys[e.code] = true;
});
window.addEventListener("keyup", e => { playKeys[e.code] = false; });


// Extension wiring
brushPresetSelect?.addEventListener("change", e => { activeBrushId = e.target.value; renderBrushLab(); saveExtensionPrefs(); });
brushSaveBtn?.addEventListener("click", saveSelectionAsBrush);
brushClearBtn?.addEventListener("click", () => { customBrushes = []; activeBrushId = "square"; renderBrushLab(); saveExtensionPrefs(); setStatus("Custom brushes cleared."); });
effectPreviewBtn?.addEventListener("click", () => runSelectedEffect(false));
effectApplyBtn?.addEventListener("click", () => runSelectedEffect(true));
effectClearBtn?.addEventListener("click", () => { effectPreview = null; previewLayer = null; drawCanvas(); setStatus("Effect preview cleared."); });
assetExportBtn?.addEventListener("click", exportAssetPack);
assetImportInput?.addEventListener("change", e => importAssetPack(e.target.files?.[0]));
scriptRunBtn?.addEventListener("click", runScriptConsole);

// Mod events
modModeBtn?.addEventListener("click", () => setModMode(!modMode));
modResetBtn?.addEventListener("click", () => resetModPreview(true));
modUseCanvasInput?.addEventListener("change", () => resetModPreview(true));
modExampleInvertBtn?.addEventListener("click", () => loadModEffectExample("invert"));
modExampleOutlineBtn?.addEventListener("click", () => loadModEffectExample("outline"));
modRunEffectBtn?.addEventListener("click", () => runModEffect(true));
modExportBtn?.addEventListener("click", exportModPack);
modImportBtn?.addEventListener("click", () => modImportInput?.click());
modImportInput?.addEventListener("change", e => importModPack(e.target.files?.[0]));
modLiveBtn?.addEventListener("click", () => { modLivePreview = !modLivePreview; modLiveBtn.setAttribute("aria-pressed", String(modLivePreview)); setStatus(modLivePreview ? "Live test on." : "Live test off."); });
modEffectSelect?.addEventListener("change", () => runModEffect(false));
modEffectCode?.addEventListener("input", scheduleModEffect);
modBrushCode?.addEventListener("input", scheduleModEffect);
modBrushSelect?.addEventListener("change", () => setStatus("Brush selected."));
modPreviewCanvas?.addEventListener("pointerdown", e => { modPointerDown = true; modPreviewCanvas.setPointerCapture?.(e.pointerId); const p = getModPixel(e); stampModBrush(p.x, p.y); });
modPreviewCanvas?.addEventListener("pointermove", e => { if (!modPointerDown) return; const p = getModPixel(e); stampModBrush(p.x, p.y); });
modPreviewCanvas?.addEventListener("pointerup", e => { modPointerDown = false; modPreviewCanvas.releasePointerCapture?.(e.pointerId); });
modPreviewCanvas?.addEventListener("pointercancel", () => { modPointerDown = false; });

loadExtensionPrefs();
renderBrushLab();
renderWorkspacePresets();
syncEffectSelect();
renderPluginAssets();
loadDockLayout();
setupDockRearrange();
loadTouchMode();
if (loadLocal()) setStatus("Restored local autosave.");
setupTools(); syncControls(); updatePixelizerLabels(); updatePixelTextLabel(); updateVoxelLabels(); clearPixelizerPreview();
requestAnimationFrame(renderAll);
const themeObserver = new MutationObserver(() => {
  gridPathCache = null;
  drawCanvas();
  drawPlayPreview();
  clearPixelizerPreview();
  drawVoxelPreview?.();
  drawPrintPreview?.();
  drawLargePrintPreview?.();
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

selectionCopyBtn?.addEventListener("click", () => selectionAction("copy"));
selectionCutBtn?.addEventListener("click", () => selectionAction("cut"));
selectionPasteBtn?.addEventListener("click", () => selectionAction("paste"));
selectionDeleteBtn?.addEventListener("click", () => selectionAction("delete"));
selectionFlipHBtn?.addEventListener("click", () => selectionAction("flipH"));
selectionFlipVBtn?.addEventListener("click", () => selectionAction("flipV"));
selectionRotateBtn?.addEventListener("click", () => selectionAction("rotate"));
selectionClearBtn?.addEventListener("click", () => selectionAction("clear"));

refBtn?.addEventListener("click", () => {
  if (!referenceImage) {
    refInput.click();
    return;
  }
  referenceImage = null;
  refBtn.setAttribute("aria-pressed", "false");
  drawCanvas();
});

refInput?.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  img.onload = () => {
    referenceImage = img;
    URL.revokeObjectURL(objectUrl);
    refBtn.setAttribute("aria-pressed", "true");
    drawCanvas();
  };
  img.onerror = () => URL.revokeObjectURL(objectUrl);
  img.src = objectUrl;
});

storyBtn?.addEventListener("click", () => {
  storyboardMode = !storyboardMode;
  storyBtn.setAttribute("aria-pressed", String(storyboardMode));
  renderStoryboard();
});

symBtn?.addEventListener("click", () => {
  symmetryMode = !symmetryMode;
  symBtn.setAttribute("aria-pressed", String(symmetryMode));
});

touchToggleBtn?.addEventListener("click", () => setTouchMode(!touchMode, true, touchMode ? (leftHandTouchMode ? "left" : "right") : (leftHandTouchMode ? "left" : "right")));
leftHandedToggleBtn?.addEventListener("click", () => {
  if (!touchMode) return;
  setTouchMode(true, true, leftHandTouchMode ? "right" : "left");
});
window.addEventListener("blur", resetTouchPointers);
