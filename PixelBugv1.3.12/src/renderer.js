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
const settingsBtn = $("#settings-btn");
const exportMenuBtn = $("#export-menu-btn");
const exportOverlay = $("#export-overlay");
const closeExportBtn = $("#close-export-btn");
const settingsOverlay = $("#settings-overlay");
const closeSettingsBtn = $("#close-settings-btn");
const shortcutSettingsList = $("#shortcut-settings-list");
const resetShortcutsBtn = $("#reset-shortcuts-btn");
const settingsThemeSelect = $("#settings-theme-select");
const settingsPaperColor = $("#settings-paper-color");
const settingsPanelColor = $("#settings-panel-color");
const settingsSoftColor = $("#settings-soft-color");
const settingsInkColor = $("#settings-ink-color");
const settingsActiveTextColor = $("#settings-active-text-color");
const resetInterfaceColorsBtn = $("#reset-interface-colors-btn");
const interfaceLightBtn = $("#interface-light-btn");
const interfaceDarkBtn = $("#interface-dark-btn");
const customInterfacePaletteSelect = $("#custom-interface-palette-select");
const customInterfacePaletteName = $("#custom-interface-palette-name");
const saveInterfacePaletteBtn = $("#save-interface-palette-btn");
const applyInterfacePaletteBtn = $("#apply-interface-palette-btn");
const deleteInterfacePaletteBtn = $("#delete-interface-palette-btn");
const customSizeOverlay = $("#custom-size-overlay");
const customSizeInput = $("#custom-size-input");
const pixelTextInput = $("#pixel-text-input");
const pixelTextScaleInput = $("#pixel-text-scale");
const pixelTextScaleOutput = $("#pixel-text-scale-output");
const closeCustomSizeBtn = $("#close-custom-size-btn");
const applyCustomSizeBtn = $("#apply-custom-size-btn");
const frameDurationInput = $("#frame-duration");
const layerOpacityInput = $("#layer-opacity");
const layerBlendModeSelect = $("#layer-blend-mode");
const addLayerGroupBtn = $("#add-layer-group-btn");
const moveLayerGroupBtn = $("#move-layer-group-btn");
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
const openModelConverterBtn = $("#open-model-converter-btn");
const modelConverterOverlay = $("#model-converter-overlay");
const closeModelConverterBtn = $("#close-model-converter-btn");
const modelConverterInput = $("#model-converter-input");
const modelConverterSizeInput = $("#model-converter-size");
const modelConverterSizeOutput = $("#model-converter-size-output");
const modelConverterShadingInput = $("#model-converter-shading");
const modelConverterColorModeInputs = Array.from(document.querySelectorAll('input[name="model-converter-color-mode"]'));
const modelConverterInkInput = $("#model-converter-ink-color");
const modelConverterTurntableXInput = $("#model-converter-turntable-x");
const modelConverterTurntableYInput = $("#model-converter-turntable-y");
const modelConverterTurntableZInput = $("#model-converter-turntable-z");
const modelConverterTurntableXOutput = $("#model-converter-turntable-x-output");
const modelConverterTurntableYOutput = $("#model-converter-turntable-y-output");
const modelConverterTurntableZOutput = $("#model-converter-turntable-z-output");
const modelConverterPreviewCanvas = $("#model-converter-preview");
const modelConverterPreviewCtx = modelConverterPreviewCanvas?.getContext("2d", { alpha: false });
const modelConverterImportBtn = $("#model-converter-import-btn");
const modelConverterImportTurntableBtn = $("#model-converter-import-turntable-btn");
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
const exportVoxelNodesBtn = $("#export-voxel-nodes-btn");
const exportVoxelGpBtn = $("#export-voxel-gp-btn");
const exportBlenderPackBtn = $("#export-blender-pack-btn");
const privacyOverlay = $("#privacy-overlay");
const openPrivacyBtn = $("#open-privacy-btn");
const closePrivacyBtn = $("#close-privacy-btn");
const rearrangeBtn = $("#rearrange-btn");
const STORAGE_LAYOUT_KEY = "pixel-bug-layout";
const STORAGE_TOUCH_KEY = "pixel-bug-touch-mode";
const STORAGE_TOUCH_HAND_KEY = "pixel-bug-touch-hand";
const STORAGE_TOUCH_TOOLS_COLLAPSED_KEY = "pixel-bug-touch-tools-collapsed";
const STORAGE_KEY = "pixel-bug-autosave";
const STORAGE_TILE_LIBRARY_KEY = "pixel-bug-tile-library";
const STORAGE_INTERFACE_COLORS_KEY = "pixel-bug-interface-colors";
const STORAGE_INTERFACE_THEME_KEY = "pixel-bug-interface-theme";
const STORAGE_INTERFACE_PALETTES_KEY = "pixel-bug-interface-palettes";
const STARTUP_DEFER_MS = 16;
const MAX_AUTOSAVE_CHARS = 12 * 1024 * 1024;
const MAX_PROJECT_FRAMES = 240;
const MAX_PROJECT_LAYERS = 96;
const MAX_LAYER_GROUPS = 48;
const MAX_PALETTE_PRESETS = 80;
const MAX_IMPORT_FILE_BYTES = 16 * 1024 * 1024;
const MAX_IMAGE_SOURCE_PIXELS = 4096 * 4096;

const DEFAULT_INTERFACE_COLORS = {
  paper: "#ffffff",
  panel: "#ffffff",
  soft: "#f2f2f2",
  ink: "#000000",
  activeText: "#ffffff"
};
const DARK_INTERFACE_COLORS = {
  paper: "#121212",
  panel: "#1d1d1d",
  soft: "#2a2a2a",
  ink: "#f4f4f4",
  activeText: "#000000"
};
const INTERFACE_COLOR_FIELDS = {
  paper: settingsPaperColor,
  panel: settingsPanelColor,
  soft: settingsSoftColor,
  ink: settingsInkColor,
  activeText: settingsActiveTextColor
};
function validColor(value) { return /^#[0-9a-f]{6}$/i.test(String(value || "")); }
function readableColor(hex) {
  if (!validColor(hex)) return "#000000";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? "#000000" : "#ffffff";
}
function softColor(hex, amount) {
  if (!validColor(hex)) return DEFAULT_INTERFACE_COLORS.soft;
  const mix = hex === "#000000" ? 255 : 0;
  const parts = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const next = parts.map(v => Math.round(v + (mix - v) * amount));
  return `#${next.map(v => v.toString(16).padStart(2, "0")).join("")}`;
}
function sanitizeInterfaceColors(colors, fallback = DEFAULT_INTERFACE_COLORS) {
  return Object.fromEntries(Object.keys(DEFAULT_INTERFACE_COLORS).map(key => [key, validColor(colors?.[key]) ? colors[key] : fallback[key]]));
}
function loadInterfacePalettes() {
  try {
    const palettes = JSON.parse(localStorage.getItem(STORAGE_INTERFACE_PALETTES_KEY) || "[]");
    return Array.isArray(palettes) ? palettes.map((palette, index) => ({ name: String(palette?.name || `Custom ${index + 1}`).slice(0, 32), colors: sanitizeInterfaceColors(palette?.colors) })).slice(0, 24) : [];
  } catch {
    return [];
  }
}
function saveInterfacePalettes(palettes) {
  localStorage.setItem(STORAGE_INTERFACE_PALETTES_KEY, JSON.stringify(palettes.slice(0, 24)));
}
function renderInterfacePaletteSelect() {
  if (!customInterfacePaletteSelect) return;
  const palettes = loadInterfacePalettes();
  const fragment = document.createDocumentFragment();
  if (!palettes.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No saved palettes";
    fragment.appendChild(option);
    customInterfacePaletteSelect.replaceChildren(fragment);
    customInterfacePaletteSelect.disabled = true;
    return;
  }
  palettes.forEach((palette, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = palette.name;
    fragment.appendChild(option);
  });
  customInterfacePaletteSelect.replaceChildren(fragment);
  customInterfacePaletteSelect.disabled = false;
}
function currentInterfaceInputColors() {
  return sanitizeInterfaceColors(Object.fromEntries(Object.entries(INTERFACE_COLOR_FIELDS).map(([key, input]) => [key, input?.value])));
}
function loadCustomInterfaceColors() {
  try {
    return sanitizeInterfaceColors(JSON.parse(localStorage.getItem(STORAGE_INTERFACE_COLORS_KEY) || "{}"));
  } catch {
    return { ...DEFAULT_INTERFACE_COLORS };
  }
}
function loadInterfaceThemeMode() {
  const mode = localStorage.getItem(STORAGE_INTERFACE_THEME_KEY);
  return ["system", "light", "dark", "custom"].includes(mode) ? mode : "system";
}
function systemThemeMode() { return document.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
function colorsForInterfaceMode(mode) {
  if (mode === "dark") return DARK_INTERFACE_COLORS;
  if (mode === "custom") return loadCustomInterfaceColors();
  return DEFAULT_INTERFACE_COLORS;
}
function setColorInputs(colors) {
  const next = sanitizeInterfaceColors(colors);
  Object.entries(INTERFACE_COLOR_FIELDS).forEach(([key, input]) => { if (input && input.value !== next[key]) input.value = next[key]; });
}
function clearInterfaceColorOverrides() {
  ["--paper", "--panel", "--soft", "--soft-2", "--ink", "--shadow", "--inverse-ink", "--active-button-text", "--overlay", "--canvas-bg"].forEach(name => document.documentElement.style.removeProperty(name));
}
function applyCustomInterfaceColors(colors, syncInputs = true) {
  const root = document.documentElement;
  const next = sanitizeInterfaceColors(colors);
  const values = {
    "--paper": next.paper,
    "--panel": next.panel,
    "--soft": next.soft,
    "--soft-2": softColor(next.soft, 0.18),
    "--ink": next.ink,
    "--shadow": next.ink,
    "--inverse-ink": next.activeText,
    "--active-button-text": next.activeText,
    "--overlay": `${next.paper}bb`,
    "--canvas-bg": next.panel
  };
  Object.entries(values).forEach(([name, value]) => { if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value); });
  if (syncInputs) setColorInputs(next);
}
function applyInterfaceSettings(mode = loadInterfaceThemeMode()) {
  if (settingsThemeSelect) settingsThemeSelect.value = mode;
  if (mode === "system") {
    localStorage.setItem(STORAGE_INTERFACE_THEME_KEY, "system");
    document.documentElement.dataset.theme = systemThemeMode();
    clearInterfaceColorOverrides();
    setColorInputs(colorsForInterfaceMode(systemThemeMode()));
    return;
  }
  localStorage.setItem(STORAGE_INTERFACE_THEME_KEY, mode);
  if (mode === "light" || mode === "dark") {
    document.documentElement.dataset.theme = mode;
    clearInterfaceColorOverrides();
    setColorInputs(colorsForInterfaceMode(mode));
    return;
  }
  document.documentElement.dataset.theme = "custom";
  applyCustomInterfaceColors(loadCustomInterfaceColors());
}
let interfaceColorFrame = 0;
let interfaceColorSaveTimer = 0;
let interfaceColorApplyTimer = 0;
let pendingInterfaceColors = null;
function queueInterfaceColorApply(colors, delay = 48) {
  pendingInterfaceColors = sanitizeInterfaceColors(colors);
  if (interfaceColorApplyTimer || interfaceColorFrame) return;
  interfaceColorApplyTimer = setTimeout(() => {
    interfaceColorApplyTimer = 0;
    interfaceColorFrame = requestAnimationFrame(() => {
      interfaceColorFrame = 0;
      if (!pendingInterfaceColors) return;
      applyCustomInterfaceColors(pendingInterfaceColors, false);
      pendingInterfaceColors = null;
    });
  }, delay);
}
function flushInterfaceColorApply() {
  if (interfaceColorApplyTimer) {
    clearTimeout(interfaceColorApplyTimer);
    interfaceColorApplyTimer = 0;
  }
  if (interfaceColorFrame) {
    cancelAnimationFrame(interfaceColorFrame);
    interfaceColorFrame = 0;
  }
  const colors = pendingInterfaceColors || currentInterfaceInputColors();
  pendingInterfaceColors = null;
  applyCustomInterfaceColors(colors, false);
  return colors;
}
function prepareCustomInterfaceEditing() {
  if (settingsThemeSelect && settingsThemeSelect.value !== "custom") settingsThemeSelect.value = "custom";
  if (document.documentElement.dataset.theme !== "custom") document.documentElement.dataset.theme = "custom";
  document.documentElement.classList.add("theme-editing");
  localStorage.setItem(STORAGE_INTERFACE_THEME_KEY, "custom");
}
function saveInterfaceColors() {
  prepareCustomInterfaceEditing();
  queueInterfaceColorApply(currentInterfaceInputColors());
  clearTimeout(interfaceColorSaveTimer);
  interfaceColorSaveTimer = setTimeout(() => {
    const colors = flushInterfaceColorApply();
    localStorage.setItem(STORAGE_INTERFACE_COLORS_KEY, JSON.stringify(colors));
    document.documentElement.classList.remove("theme-editing");
  }, 260);
}
function changeInterfaceTheme() { applyInterfaceSettings(settingsThemeSelect?.value || "system"); }
function setOriginalInterfaceTheme(mode) {
  localStorage.setItem(STORAGE_INTERFACE_THEME_KEY, mode);
  applyInterfaceSettings(mode);
  setStatus(mode === "dark" ? "Original dark theme restored." : "Original light theme restored.");
}
function resetInterfaceColors() {
  localStorage.setItem(STORAGE_INTERFACE_THEME_KEY, "system");
  applyInterfaceSettings("system");
  setStatus("System theme restored.");
}
function saveCurrentInterfacePalette() {
  const name = String(customInterfacePaletteName?.value || "Custom Palette").trim().slice(0, 32) || "Custom Palette";
  const colors = currentInterfaceInputColors();
  const palettes = loadInterfacePalettes();
  const selected = Number(customInterfacePaletteSelect?.value);
  if (Number.isInteger(selected) && selected >= 0 && selected < palettes.length && palettes[selected].name === name) palettes[selected] = { name, colors };
  else palettes.push({ name, colors });
  saveInterfacePalettes(palettes);
  renderInterfacePaletteSelect();
  if (customInterfacePaletteSelect) customInterfacePaletteSelect.value = String(Math.min(palettes.length - 1, 23));
  localStorage.setItem(STORAGE_INTERFACE_COLORS_KEY, JSON.stringify(colors));
  applyInterfaceSettings("custom");
  setStatus("Custom interface palette saved.");
}
function applySavedInterfacePalette() {
  const palettes = loadInterfacePalettes();
  const selected = Number(customInterfacePaletteSelect?.value);
  if (!Number.isInteger(selected) || selected < 0 || selected >= palettes.length) return;
  const palette = palettes[selected];
  localStorage.setItem(STORAGE_INTERFACE_COLORS_KEY, JSON.stringify(palette.colors));
  if (customInterfacePaletteName) customInterfacePaletteName.value = palette.name;
  applyInterfaceSettings("custom");
  setStatus("Custom interface palette applied.");
}
function deleteSavedInterfacePalette() {
  const palettes = loadInterfacePalettes();
  const selected = Number(customInterfacePaletteSelect?.value);
  if (!Number.isInteger(selected) || selected < 0 || selected >= palettes.length) return;
  palettes.splice(selected, 1);
  saveInterfacePalettes(palettes);
  renderInterfacePaletteSelect();
  setStatus("Custom interface palette deleted.");
}
renderInterfacePaletteSelect();
applyInterfaceSettings();
const refBtn = $("#ref-btn");
const storyBtn = $("#story-btn");
const symmetryModeSelect = $("#symmetry-mode-select");
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
const tilemapSelect = $("#tilemap-select");
const tilemapSaveBtn = $("#tilemap-save-btn");
const tilemapStampBtn = $("#tilemap-stamp-btn");
const tilemapDeleteBtn = $("#tilemap-delete-btn");
const tilemapPreview = $("#tilemap-preview");

const printModeBtn = $("#print-mode-btn");
const playModeBtn = $("#play-mode-btn");
const modModeBtn = $("#mod-mode-btn");
const printPanel = $(".print-panel");
const playPanel = $(".play-panel");
const printDpiInput = $("#print-dpi");
const printWidthInput = $("#print-width");
const printBleedInput = $("#print-bleed");
const printSafeInput = $("#print-safe");
const printPageSizeSelect = $("#print-page-size");
const printPageWidthInput = $("#print-page-width");
const printPageHeightInput = $("#print-page-height");
const printPageMarginInput = $("#print-page-margin");
const printResampleModeSelect = $("#print-resample-mode");
const printShowArtInput = $("#print-show-art");
const printShowGuidesInput = $("#print-show-guides");
const printShowCutlineInput = $("#print-show-cutline");
const exportCalibrationBtn = $("#export-calibration-btn");
const printRepeatSelect = $("#print-repeat");
const printStripWidthInput = $("#print-strip-width");
const printStripHeightInput = $("#print-strip-height");
const printStampCurlSpacingInput = $("#print-stamp-curl-spacing");
const printStampCurlDepthInput = $("#print-stamp-curl-depth");
const printStampEdgeDifferenceInput = $("#print-stamp-edge-difference");
const printStampTeethInput = $("#print-stamp-teeth");
const printStampTeethValue = $("#print-stamp-teeth-value");
const printStampRoundnessInput = $("#print-stamp-roundness");
const printStampRoundnessValue = $("#print-stamp-roundness-value");
const printStampMirrorVerticalInput = $("#print-stamp-mirror-vertical");
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
const printPreviewZoomInput = $("#print-preview-zoom");
const printPreviewZoomOutput = $("#print-preview-zoom-output");
const printPreviewZoomInBtn = $("#print-preview-zoom-in");
const printPreviewZoomOutBtn = $("#print-preview-zoom-out");
const printPreviewZoomResetBtn = $("#print-preview-zoom-reset");
const printInfo = $("#print-info");
const exportPrintBtn = $("#export-print-btn");
const exportCutlineBtn = $("#export-cutline-btn");

// Preview zoom
let printPreviewZoom = 1;
let printPreviewPanX = 0;
let printPreviewPanY = 0;
let printPreviewDragging = false;
let printPreviewDragStartX = 0;
let printPreviewDragStartY = 0;
let printPreviewStartPanX = 0;
let printPreviewStartPanY = 0;
let largePrintPreviewCache = null;
let largePrintPreviewFrame = 0;
let dialogueTypewriterStart = 0;
let dialogueRevealChars = Infinity;
let selectedDialogueCharacter = 0;

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
const playToggleCollisionBtn = $("#play-toggle-collision-btn");
const playSceneWidthInput = $("#play-scene-width");
const playSceneHeightInput = $("#play-scene-height");
const playGroundYInput = $("#play-ground-y");
const playPropScaleInput = $("#play-prop-scale");
const playPropSolidInput = $("#play-prop-solid");
const playPropDialogueSelect = $("#play-prop-dialogue");
const playPropList = $("#play-prop-list");
const playExportPngBtn = $("#play-export-png-btn");
const playExportGifBtn = $("#play-export-gif-btn");
const playExportGameBtn = $("#play-export-game-btn");
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
const dialogueEnabledInput = $("#dialogue-enabled");
const characterList = $("#character-list");
const characterNameInput = $("#character-name");
const characterFrameSelect = $("#character-frame");
const characterPositionSelect = $("#character-position");
const characterScaleInput = $("#character-scale");
const characterFlipInput = $("#character-flip");
const characterAddBtn = $("#character-add-btn");
const characterDuplicateBtn = $("#character-duplicate-btn");
const characterDeleteBtn = $("#character-delete-btn");
const dialogueLineSelect = $("#dialogue-line-index");
const dialogueSpeakerInput = $("#dialogue-speaker");
const dialogueCharacterSelect = $("#dialogue-character");
const dialogueFrameSelect = $("#dialogue-frame");
const dialogueTextInput = $("#dialogue-text");
const dialoguePrevBtn = $("#dialogue-prev-btn");
const dialogueNextBtn = $("#dialogue-next-btn");
const dialogueAddBtn = $("#dialogue-add-btn");
const dialogueDuplicateBtn = $("#dialogue-duplicate-btn");
const dialogueDeleteBtn = $("#dialogue-delete-btn");
const dialogueTypewriterBtn = $("#dialogue-typewriter-btn");
const dialogueNodeTree = $("#dialogue-node-tree");
const dialogueInteractBtn = $("#dialogue-interact-btn");
let dialogueDraftText = "";
let dialogueAddClickText = null;
const characterStartLineSelect = $("#character-start-line");
const newProjectOverlay = $("#new-project-overlay");
const confirmNewProjectBtn = $("#confirm-new-project-btn");
const cancelNewProjectBtn = $("#cancel-new-project-btn");
const keepCurrentProjectBtn = $("#keep-current-project-btn");

const brushPresetSelect = $("#brush-preset-select");
const brushSaveBtn = $("#brush-save-btn");
const brushClearBtn = $("#brush-clear-btn");
const brushPreview = $("#brush-preview");
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
const modPlayUiCode = $("#mod-play-ui-code");
const modPlayUiApplyBtn = $("#mod-play-ui-apply-btn");
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

// Shortcut map
const SHORTCUT_STORAGE_KEY = "pixelbug-shortcuts-v1";
const DEFAULT_SHORTCUTS = {
  toolPencil: "B", toolEraser: "E", toolFill: "G", toolEyedropper: "I", toolLine: "L", toolRect: "R", toolEllipse: "O", toolSelect: "M", toolText: "T",
  save: "Ctrl+S", open: "Ctrl+O", undo: "Ctrl+Z", redo: "Ctrl+Y", copy: "Ctrl+C", cut: "Ctrl+X", paste: "Ctrl+V", clearSelection: "Escape", deleteSelection: "Delete",
  settings: "Ctrl+,"
};
const SHORTCUT_LABELS = {
  toolPencil: "Pencil", toolEraser: "Eraser", toolFill: "Fill", toolEyedropper: "Pick Color", toolLine: "Line", toolRect: "Rec", toolEllipse: "Ellipse", toolSelect: "Select", toolText: "Text",
  save: "Save", open: "Open", undo: "Undo", redo: "Redo", copy: "Copy Selection", cut: "Cut Selection", paste: "Paste Selection", clearSelection: "Unselect", deleteSelection: "Delete Selection",
  settings: "Settings"
};
const TOOL_SHORTCUT_ACTIONS = { toolPencil: "pencil", toolEraser: "eraser", toolFill: "fill", toolEyedropper: "eyedropper", toolLine: "line", toolRect: "rect", toolEllipse: "ellipse", toolSelect: "select", toolText: "text" };
let shortcuts = loadShortcuts();
let listeningShortcut = null;


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
let pixelizerFrame = 0;
let pixelizerTmpCanvas = null;
let pixelizerTmpCtx = null;
let pixelizerPreviewBuffer = null;
let pixelizerPreviewImage = null;
let pixelizerPreviewBitmap = null;
let symmetryMode = "off";
let storyboardMode = false;
let selectionBox = null;
let selectionDrag = null;
let selectionClipboard = null;
let tileStampMode = false;
let activeTileId = "";
let frameDragIndex = -1;
let layerDragIndex = -1;
let referenceImage = null;
let saveTimer = null;
let voxelFrame = null;
let voxelSimplifiedStatusShown = false;
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
let modelConverterModel = null;
let modelConverterFileName = "";
let modelConverterViews = [];
let modelConverterTurntableView = null;
const MAX_MODEL_FILE_BYTES = 12 * 1024 * 1024;
const MAX_MODEL_EXTRA_BYTES = 8 * 1024 * 1024;
const MAX_MODEL_TEXTURE_PIXELS = 4096 * 4096;
const MAX_MODEL_TRIANGLES = 24000;
const MAX_MODEL_RENDER_TRIANGLES = 18000;
let modelConverterPreviewFrame = 0;
let playDrawFrame = null;
let gridPathCache = null;
let editorCanvasMetricsCache = null;
let gridBitmapCache = null;
const playFrameCanvasCache = new Map();
const compositedFrameCanvasCache = new Map();
let printCanvasCache = null;
let printPreviewInfoCache = "";



// Layer defaults
function defaultPlayVisualLayers() {
  return [
    { id: "sky", name: "Sky", role: "background", frame: -1, scale: 8, parallax: 0.04, y: 0, opacity: 1, repeatX: false, visible: true, fit: "cover" },
    { id: "far", name: "Far BG", role: "background", frame: -1, scale: 5, parallax: 0.16, y: 72, opacity: 0.72, repeatX: true, visible: true, fit: "tile" },
    { id: "mid", name: "Mid BG", role: "background", frame: -1, scale: 4, parallax: 0.38, y: 180, opacity: 0.9, repeatX: true, visible: true, fit: "tile" },
    { id: "front", name: "Foreground", role: "foreground", frame: -1, scale: 4, parallax: 0.82, y: 276, opacity: 1, repeatX: true, visible: true, fit: "tile" },
    { id: "overlay", name: "OVERLAY", role: "overlay", frame: -1, scale: 6, parallax: 0, y: 0, opacity: 1, repeatX: false, visible: false, fit: "cover" }
  ];
}
// Number clamp
function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
function clampFiniteNumber(value, fallback, min, max) {
  return Math.max(min, Math.min(finiteNumber(value, fallback), max));
}

function clampPlayLayer(layer, index = 0) {
  const base = defaultPlayVisualLayers()[index] || defaultPlayVisualLayers()[0];
  const next = { ...base, ...(layer || {}) };
  next.name = next.name || base.name;
  next.role = ["background", "foreground", "overlay"].includes(next.role) ? next.role : base.role;
  if (next.role === "overlay") {
    next.name = "OVERLAY";
    next.repeatX = false;
    next.fit = "cover";
    next.parallax = 0;
  }
  next.frame = Number.isFinite(Number(next.frame)) ? Math.max(-1, Math.min(Number(next.frame), state.frames.length - 1)) : -1;
  next.scale = clampFiniteNumber(next.scale, base.scale, 0.5, 32);
  next.parallax = clampFiniteNumber(next.parallax, 0, -4, 4);
  next.y = clampFiniteNumber(next.y, 0, -1024, 2160);
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
function makeDialogueCharacter(name = "Character", frame = 0, position = "left", role = "npc") {
  return { id: `char-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name, frame, position, role, scale: 3, flip: false, visible: true, startLine: 0 };
}
function defaultDialogueState() {
  const first = { id: "char-a", name: "Character A", frame: 0, position: "left", role: "actor", scale: 3, flip: false, visible: false, startLine: 0 };
  const second = { id: "char-b", name: "Character B", frame: 0, position: "right", role: "npc", scale: 3, flip: true, visible: true, startLine: 1 };
  return {
    enabled: false,
    currentLine: 0,
    typewriter: true,
    characters: [first, second],
    lines: [
      { characterId: first.id, speaker: first.name, text: "Hello! This is a test line.", frame: 0 },
      { characterId: second.id, speaker: second.name, text: "Swap frames and text to mock up a conversation.", frame: 0 }
    ]
  };
}

function defaultPlayUiMod() {
  return {
    dialogueBoxColor: "rgba(15,15,15,0.94)",
    dialogueInkColor: "#f7f0da",
    dialogueBorderColor: "#f7f0da",
    dialogueBorderWidth: 4,
    dialogueFont: "system-ui, sans-serif",
    dialogueNameSize: 16,
    dialogueTextSize: 15,
    dialogueMargin: 0.035,
    dialogueBoxHeight: 0.28,
    dialoguePortrait: true,
    dialogueCounter: true
  };
}
function clampNumber(value, fallback, min, max) {
  const next = Number(value);
  return Number.isFinite(next) ? Math.max(min, Math.min(next, max)) : fallback;
}
function cleanCssColor(value, fallback) {
  const text = String(value || "").trim();
  if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(text)) return text;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.test(text)) return text;
  return fallback;
}
function cleanFontFamily(value, fallback) {
  const text = String(value || "").trim();
  if (!text || text.length > 80 || /[;{}<>]/.test(text)) return fallback;
  return text;
}
function normalizePlayUiMod(input = {}) {
  const base = defaultPlayUiMod();
  return {
    dialogueBoxColor: cleanCssColor(input.dialogueBoxColor, base.dialogueBoxColor),
    dialogueInkColor: cleanCssColor(input.dialogueInkColor, base.dialogueInkColor),
    dialogueBorderColor: cleanCssColor(input.dialogueBorderColor, base.dialogueBorderColor),
    dialogueBorderWidth: clampNumber(input.dialogueBorderWidth, base.dialogueBorderWidth, 0, 16),
    dialogueFont: cleanFontFamily(input.dialogueFont, base.dialogueFont),
    dialogueNameSize: clampNumber(input.dialogueNameSize, base.dialogueNameSize, 8, 32),
    dialogueTextSize: clampNumber(input.dialogueTextSize, base.dialogueTextSize, 8, 30),
    dialogueMargin: clampNumber(input.dialogueMargin, base.dialogueMargin, 0.01, 0.12),
    dialogueBoxHeight: clampNumber(input.dialogueBoxHeight, base.dialogueBoxHeight, 0.18, 0.55),
    dialoguePortrait: input.dialoguePortrait !== false,
    dialogueCounter: input.dialogueCounter !== false
  };
}
function parsePlayUiModCode(code) {
  const text = String(code || "").trim();
  if (!text) return defaultPlayUiMod();
  if (text.length > 6000) throw new Error("Play UI settings too long.");
  return normalizePlayUiMod(JSON.parse(text));
}
function playUiMod() {
  return normalizePlayUiMod(state.playMode?.ui || {});
}
function stringifyPlayUiMod(ui = state.playMode?.ui) {
  return JSON.stringify(normalizePlayUiMod(ui || {}), null, 2);
}

function freshProject(width, height = width) {
  width = Math.max(1, Number(width) || 32);
  height = Math.max(1, Number(height) || width);
  return {
    name: "Pixel Bug Project", size: Math.max(width, height), width, height, palette: [...DEFAULT_PALETTE], activePalettePreset: 0, palettePresets: [{ name: "Base", colors: [...DEFAULT_PALETTE] }], activeFrame: 0, activeLayer: 0, layerGroups: [],
    frames: [{ duration: 120, layers: [newLayer(width, "Layer 1", height)] }],
    tilemap: { activeTileId: "", tiles: [] },
    playMode: { idleFrame: 0, walkFrame: 0, jumpFrame: 0, sceneWidth: 640, sceneHeight: 360, worldWidth: 1600, groundY: 300, actorScale: 3, backgroundFrame: -1, backgroundScale: "cover", showGridOverlay: true, cameraFollow: true, autoScroll: false, scrollSpeed: 1.25, sceneryFrame: -1, sceneryScale: 3, scenerySpeed: 0.45, sceneryY: 248, visualLayers: defaultPlayVisualLayers(), props: [], dialogue: defaultDialogueState(), ui: defaultPlayUiMod() }
  };
}
function newLayer(width, name = "Layer", height = width) { return { name, visible: true, opacity: 1, blendMode: "source-over", groupId: null, pixels: blankPixels(width, height), sourceWidth: width, sourceHeight: height, sourcePixels: blankPixels(width, height) }; }
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
  saveTimer = setTimeout(() => runWhenIdle(saveLocalNow, 2000), 800);
}

function runWhenIdle(callback, timeout = 1000) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(callback, { timeout });
    return;
  }
  setTimeout(callback, STARTUP_DEFER_MS);
}

function runStartupTasks(tasks) {
  const pending = Array.isArray(tasks) ? tasks.slice() : [];
  const next = () => {
    const task = pending.shift();
    if (!task) return;
    try { task(); } catch (error) { console.warn("Startup task skipped", error); }
    if (pending.length) runWhenIdle(next, 1200);
  };
  runWhenIdle(next, 1200);
}

function invalidatePlayFrameCache() { playFrameCanvasCache.clear(); }
function invalidateArtworkCaches() {
  playFrameCanvasCache.clear();
  compositedFrameCanvasCache.clear();
  printCanvasCache = null;
  largePrintPreviewCache = null;
}
function activeFrameSignature(index = state.activeFrame) {
  const f = state.frames[index];
  if (!f) return "missing";
  return `${index}:${projectWidth()}:${projectHeight()}:${f.layers.length}:${f.layers.map(layer => `${layer.visible ? 1 : 0}:${Number(layer.opacity ?? 1).toFixed(3)}:${layer.blendMode || "source-over"}:${layer.name || ""}`).join("|")}`;
}
function schedulePlayDraw() {
  if (!playCtx || playRunning) return;
  cancelAnimationFrame(playDrawFrame);
  playDrawFrame = requestAnimationFrame(drawPlayScene);
}
function validProjectShape(project) {
  if (!project || typeof project !== "object" || !Array.isArray(project.frames)) return false;
  const width = projectWidth(project);
  const height = projectHeight(project);
  if (width < 1 || width > 512 || height < 1 || height > 512) return false;
  if (project.frames.length < 1 || project.frames.length > MAX_PROJECT_FRAMES) return false;
  return project.frames.every(projectFrame => projectFrame && Array.isArray(projectFrame.layers) && projectFrame.layers.length >= 1 && projectFrame.layers.length <= MAX_PROJECT_LAYERS);
}
function loadLocal() { try { const saved = localStorage.getItem(STORAGE_KEY); if (!saved || saved.length > MAX_AUTOSAVE_CHARS) return false; const next = JSON.parse(saved); if (!validProjectShape(next)) return false; state = next; normalizeProject(); clampActive(); return true; } catch (_err) { return false; } }
function historyLimit() { const maxDim = Math.max(projectWidth(), projectHeight()); return maxDim >= 256 ? 16 : maxDim >= 128 ? 32 : 60; }
function pushHistory() { undoStack.push(clone(state)); while (undoStack.length > historyLimit()) undoStack.shift(); redoStack = []; }
function restore(next) { state = next; clampActive(); syncControls(); renderAll(); }
function normalizeProject() {
  if (!Array.isArray(state.frames) || !state.frames.length) state.frames = freshProject(32).frames;
  state.frames = state.frames.slice(0, MAX_PROJECT_FRAMES).map(projectFrame => {
    const nextFrame = projectFrame && typeof projectFrame === "object" ? projectFrame : {};
    nextFrame.duration = Math.max(20, Math.min(Number(nextFrame.duration) || 120, 10000));
    nextFrame.layers = Array.isArray(nextFrame.layers) && nextFrame.layers.length ? nextFrame.layers.slice(0, MAX_PROJECT_LAYERS) : [newLayer(projectWidth(), "Layer 1", projectHeight())];
    return nextFrame;
  });
  if (!Array.isArray(state.palettePresets) || !state.palettePresets.length) {
    state.palettePresets = [{ name: "Base", colors: Array.isArray(state.palette) ? [...state.palette] : [...DEFAULT_PALETTE] }];
  }
  if (!Array.isArray(state.layerGroups)) state.layerGroups = [];
  state.layerGroups = state.layerGroups.filter(group => group && group.id).slice(0, MAX_LAYER_GROUPS).map((group, index) => ({ id: String(group.id).slice(0, 80), name: String(group.name || `Folder ${index + 1}`).slice(0, 40), collapsed: Boolean(group.collapsed) }));
  const groupIds = new Set(state.layerGroups.map(group => group.id));
  state.palettePresets = state.palettePresets.slice(0, MAX_PALETTE_PRESETS).map((preset, index) => ({
    name: String(preset.name || `Preset ${index + 1}`).slice(0, 48),
    colors: Array.isArray(preset.colors) && preset.colors.length ? preset.colors.filter(isHexColor).slice(0, 256) : [...DEFAULT_PALETTE]
  }));
  state.activePalettePreset = Math.max(0, Math.min(Number(state.activePalettePreset) || 0, state.palettePresets.length - 1));
  state.palette = state.palettePresets[state.activePalettePreset].colors;
  syncProjectSizeAlias(state);
  state.frames.forEach(projectFrame => projectFrame.layers.forEach(projectLayer => {
    if (!Array.isArray(projectLayer.pixels) || projectLayer.pixels.length !== projectHeight() || projectLayer.pixels.some(row => !Array.isArray(row) || row.length !== projectWidth())) projectLayer.pixels = resamplePixels(projectLayer.pixels || blankPixels(projectLayer.sourceSize || state.size || 32), projectWidth(), projectHeight());
    if (!Array.isArray(projectLayer.sourcePixels)) setLayerSource(projectLayer);
  }));
  state.tilemap = normalizeTilemapState(state.tilemap);
  state.frames.forEach(projectFrame => projectFrame.layers.forEach(projectLayer => {
    projectLayer.blendMode = normalizeBlendMode(projectLayer.blendMode);
    projectLayer.groupId = groupIds.has(projectLayer.groupId) ? projectLayer.groupId : null;
  }));
  if (!state.playMode || typeof state.playMode !== "object") state.playMode = { idleFrame: 0, walkFrame: 0, jumpFrame: 0, sceneWidth: 640, sceneHeight: 360, worldWidth: 1600, groundY: 300, actorScale: 3, backgroundFrame: -1, backgroundScale: "cover", showGridOverlay: true, cameraFollow: true, autoScroll: false, scrollSpeed: 1.25, sceneryFrame: -1, sceneryScale: 3, scenerySpeed: 0.45, sceneryY: 248, visualLayers: defaultPlayVisualLayers(), props: [] };
  state.playMode.idleFrame = Math.max(0, Math.min(Number(state.playMode.idleFrame) || 0, state.frames.length - 1));
  state.playMode.walkFrame = Math.max(0, Math.min(Number(state.playMode.walkFrame) || state.playMode.idleFrame, state.frames.length - 1));
  state.playMode.jumpFrame = Math.max(0, Math.min(Number(state.playMode.jumpFrame) || state.playMode.idleFrame, state.frames.length - 1));
  state.playMode.sceneWidth = Math.max(160, Math.min(Number(state.playMode.sceneWidth) || 640, 4096));
  state.playMode.sceneHeight = Math.max(120, Math.min(Number(state.playMode.sceneHeight) || 360, 2160));
  state.playMode.worldWidth = Math.max(state.playMode.sceneWidth, Math.min(Number(state.playMode.worldWidth) || Math.max(1600, state.playMode.sceneWidth), 20000));
  state.playMode.groundY = Math.max(32, Math.min(Number(state.playMode.groundY) || Math.round(state.playMode.sceneHeight * 0.84), state.playMode.sceneHeight - 8));
  state.playMode.actorScale = Math.max(0.5, Math.min(Number(state.playMode.actorScale) || 3, 32));
  state.playMode.backgroundFrame = Number.isFinite(Number(state.playMode.backgroundFrame)) ? Math.max(-1, Math.min(Number(state.playMode.backgroundFrame), state.frames.length - 1)) : -1;
  state.playMode.backgroundScale = ["cover", "contain", "stretch", "tile"].includes(state.playMode.backgroundScale) ? state.playMode.backgroundScale : "cover";
  state.playMode.showGridOverlay = state.playMode.showGridOverlay !== false;
  state.playMode.cameraFollow = state.playMode.cameraFollow !== false;
  state.playMode.autoScroll = state.playMode.autoScroll === true;
  state.playMode.scrollSpeed = Math.max(0, Math.min(Number(state.playMode.scrollSpeed) || 1.25, 20));
  state.playMode.sceneryFrame = Number.isFinite(Number(state.playMode.sceneryFrame)) ? Math.max(-1, Math.min(Number(state.playMode.sceneryFrame), state.frames.length - 1)) : -1;
  state.playMode.sceneryScale = Math.max(0.5, Math.min(Number(state.playMode.sceneryScale) || 3, 32));
  state.playMode.scenerySpeed = Math.max(-4, Math.min(Number(state.playMode.scenerySpeed) || 0.45, 4));
  state.playMode.sceneryY = clampFiniteNumber(state.playMode.sceneryY, Math.max(0, state.playMode.groundY - projectHeight() * state.playMode.sceneryScale), -1024, 2160);
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
      solid: prop.solid !== false,
      dialogueCharacterId: typeof prop.dialogueCharacterId === "string" ? prop.dialogueCharacterId : ""
    }));
  selectedPlayProp = Math.max(-1, Math.min(selectedPlayProp, state.playMode.props.length - 1));
  if (!state.playMode.dialogue || typeof state.playMode.dialogue !== "object") state.playMode.dialogue = defaultDialogueState();
  state.playMode.dialogue.enabled = state.playMode.dialogue.enabled !== false;
  state.playMode.dialogue.typewriter = state.playMode.dialogue.typewriter !== false;
  if (!Array.isArray(state.playMode.dialogue.characters) || !state.playMode.dialogue.characters.length) {
    const defaults = defaultDialogueState();
    state.playMode.dialogue.characters = defaults.characters;
  }
  state.playMode.dialogue.characters = state.playMode.dialogue.characters.map((character, index) => {
    const role = character.role === "actor" || index === 0 ? "actor" : "npc";
    return {
      id: String(character.id || `char-${index + 1}`),
      name: String(character.name || character.speaker || (role === "actor" ? "Character A" : `NPC ${index}`)).slice(0, 32),
      frame: Math.max(0, Math.min(Number(character.frame) || 0, state.frames.length - 1)),
      position: ["left", "center", "right"].includes(character.position) ? character.position : index % 2 ? "right" : "left",
      role,
      scale: Math.max(1, Math.min(Number(character.scale) || 3, 16)),
      flip: character.flip === true,
      visible: role === "actor" ? false : character.visible !== false,
      startLine: role === "actor" ? 0 : Math.max(0, Math.min(Number(character.startLine) || 0, Math.max(0, state.playMode.dialogue.lines?.length - 1 || 0)))
    };
  });
  if (!state.playMode.dialogue.characters.some(character => character.role === "actor")) state.playMode.dialogue.characters[0].role = "actor";
  selectedDialogueCharacter = Math.max(0, Math.min(Number(selectedDialogueCharacter) || 0, state.playMode.dialogue.characters.length - 1));
  if (!Array.isArray(state.playMode.dialogue.lines) || !state.playMode.dialogue.lines.length) state.playMode.dialogue.lines = defaultDialogueState().lines;
  const fallbackCharacter = state.playMode.dialogue.characters[0];
  state.playMode.dialogue.lines = state.playMode.dialogue.lines.map(line => {
    const idMatch = state.playMode.dialogue.characters.find(character => character.id === line.characterId);
    const nameMatch = state.playMode.dialogue.characters.find(character => character.name === line.speaker);
    const matched = idMatch || nameMatch || fallbackCharacter;
    return {
      characterId: matched.id,
      speaker: String(line.speaker || matched.name || "Character").slice(0, 32),
      text: String(line.text || "").slice(0, 260),
      frame: Math.max(0, Math.min(Number(line.frame ?? matched.frame) || 0, state.frames.length - 1))
    };
  });
  state.playMode.dialogue.currentLine = Math.max(0, Math.min(Number(state.playMode.dialogue.currentLine) || 0, state.playMode.dialogue.lines.length - 1));
  state.playMode.ui = normalizePlayUiMod(state.playMode.ui || {});

}
function clampActive() { normalizeProject(); state.activeFrame = Math.max(0, Math.min(state.activeFrame, state.frames.length - 1)); state.activeLayer = Math.max(0, Math.min(state.activeLayer, frame().layers.length - 1)); state.activePalettePreset = Math.max(0, Math.min(state.activePalettePreset || 0, state.palettePresets.length - 1)); state.palette = state.palettePresets[state.activePalettePreset].colors; }
function activePreset() { normalizeProject(); return state.palettePresets[state.activePalettePreset]; }


// Shortcut UI
function loadShortcuts() {
  try {
    const saved = JSON.parse(localStorage.getItem(SHORTCUT_STORAGE_KEY) || "{}");
    return { ...DEFAULT_SHORTCUTS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch { return { ...DEFAULT_SHORTCUTS }; }
}
function saveShortcuts() { try { localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(shortcuts)); } catch (_err) { /* Shortcut save */ } }
function normalizeShortcutEvent(event) {
  const key = String(event.key || "");
  if (!key) return "";
  const lower = key.toLowerCase();
  if (["control", "shift", "alt", "meta"].includes(lower)) return "";
  const parts = [];
  if (event.ctrlKey || event.metaKey) parts.push("Ctrl");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey && key.length > 1) parts.push("Shift");
  let label = key === " " ? "Space" : key;
  if (label.length === 1) label = label.toUpperCase();
  if (lower === "escape") label = "Escape";
  if (lower === "delete") label = "Delete";
  if (lower === "backspace") label = "Backspace";
  if (lower === ",") label = ",";
  parts.push(label);
  return parts.join("+");
}
function shortcutMatches(event, combo) { return normalizeShortcutEvent(event) === combo; }
function shortcutForTool(toolId) {
  const key = Object.keys(TOOL_SHORTCUT_ACTIONS).find(action => TOOL_SHORTCUT_ACTIONS[action] === toolId);
  return key ? shortcuts[key] : "";
}
function openExportModal() { if (!exportOverlay) return; exportOverlay.hidden = false; exportMenuBtn?.setAttribute("aria-expanded", "true"); }
function closeExportModal() { if (!exportOverlay) return; exportOverlay.hidden = true; exportMenuBtn?.setAttribute("aria-expanded", "false"); }
function runExportAction(action) { closeExportModal(); action(); }
function openSettingsModal() { settingsOverlay.hidden = false; applyInterfaceSettings(); renderShortcutSettings(); renderInterfacePaletteSelect(); settingsBtn?.setAttribute("aria-expanded", "true"); }
function closeSettingsModal() { settingsOverlay.hidden = true; listeningShortcut = null; settingsBtn?.setAttribute("aria-expanded", "false"); }
function renderShortcutSettings() {
  if (!shortcutSettingsList) return;
  shortcutSettingsList.innerHTML = "";
  Object.keys(DEFAULT_SHORTCUTS).forEach(action => {
    const row = document.createElement("div");
    row.className = "shortcut-row";
    const label = document.createElement("span");
    label.textContent = SHORTCUT_LABELS[action] || action;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shortcut-capture";
    button.dataset.action = action;
    button.textContent = listeningShortcut === action ? "Press keys" : (shortcuts[action] || "None");
    button.addEventListener("click", () => { listeningShortcut = action; renderShortcutSettings(); button.focus(); });
    row.append(label, button);
    shortcutSettingsList.appendChild(row);
  });
}

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
    const shortcut = shortcutForTool(id) || key;
    b.setAttribute("aria-label", `${label} tool. Shortcut ${shortcut}.`);
    b.textContent = `${label} ${shortcut}`;
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

// Zoom guard
function isBrowserZoomShortcut(event) {
  if (!(event.ctrlKey || event.metaKey)) return false;
  const key = String(event.key || "").toLowerCase();
  const code = String(event.code || "").toLowerCase();
  return ["-", "=", "+", "0", "minus", "equal", "numpadsubtract", "numpadadd", "numpad0"].includes(key) || ["minus", "equal", "numpadsubtract", "numpadadd", "numpad0"].includes(code);
}

function blockBrowserZoom(event) {
  if (!isBrowserZoomShortcut(event)) return false;
  event.preventDefault();
  event.stopPropagation();
  editorCanvasMetricsCache = null;
  drawCanvas();
  setStatus("Canvas zoom stays pixel-perfect. Use the window size or scrollbars to change the view.");
  return true;
}

window.addEventListener("keydown", blockBrowserZoom, { capture: true });
window.addEventListener("wheel", event => {
  if (!(event.ctrlKey || event.metaKey)) return;
  event.preventDefault();
  event.stopPropagation();
}, { capture: true, passive: false });
window.pixelBug?.onBrowserZoomBlocked?.(() => {
  editorCanvasMetricsCache = null;
  drawCanvas();
  setStatus("Browser zoom reset so canvas pixels stay even.");
});


// Canvas draw
function renderAll(options = {}) {
  const shouldPersist = options.persist !== false;
  if (options.invalidate !== false) invalidateArtworkCaches();
  drawCanvas();
  renderFrames();
  renderLayers();
  renderPalette();
  renderStoryboard();
  renderTilemapPanel();
  if (playModeScreen) { renderPlayPanel(); drawPlayPreview(); }
  if (printMode) schedulePrintPreview();
  if (shouldPersist) saveLocal();
}

function renderStoryboard() {
  storyboardPreview.classList.toggle("hidden", !storyboardMode);
  if (!storyboardMode) return;
  storyboardPreview.innerHTML = "";
  const w = projectWidth(), h = projectHeight();
  state.frames.forEach((f, i) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.draggable = true;
    c.dataset.frameIndex = String(i);
    c.title = `Frame ${i + 1} - drag to reorder`;
    c.setAttribute("aria-label", `Frame ${i + 1}. Drag to reorder.`);
    c.className = i === state.activeFrame ? "active" : "";
    drawCompositedFrame(f, 1, c.getContext("2d"));
    c.addEventListener("click", () => {
      state.activeFrame = i;
      clampActive();
      syncControls();
      renderAll({ persist: false });
    });
    c.addEventListener("dragstart", event => {
      frameDragIndex = i;
      c.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(i));
    });
    c.addEventListener("dragend", () => {
      frameDragIndex = -1;
      c.classList.remove("dragging");
      storyboardPreview.querySelectorAll(".drag-over").forEach(item => item.classList.remove("drag-over"));
    });
    c.addEventListener("dragover", event => {
      event.preventDefault();
      c.classList.add("drag-over");
    });
    c.addEventListener("dragleave", () => c.classList.remove("drag-over"));
    c.addEventListener("drop", event => {
      event.preventDefault();
      c.classList.remove("drag-over");
      const from = frameDragIndex >= 0 ? frameDragIndex : Number(event.dataTransfer.getData("text/plain"));
      reorderFrame(from, i);
    });
    storyboardPreview.appendChild(c);
  });
}

// Canvas metrics
function centerEditorCanvasFrame() {
  const frame = canvas.closest(".canvas-frame");
  if (!frame) return;
  const extraX = frame.scrollWidth - frame.clientWidth;
  const extraY = frame.scrollHeight - frame.clientHeight;
  if (extraX > 0) frame.scrollLeft = Math.round(extraX / 2);
  if (extraY > 0) frame.scrollTop = Math.round(extraY / 2);
}

function updateEditorCanvasMetrics() {
  const w = projectWidth(), h = projectHeight();
  const maxDisplay = 1024;
  const stageBox = canvas.closest(".stage-panel")?.getBoundingClientRect();
  const framePadding = 36;
  const availableWidth = Math.max(1, Math.floor((stageBox?.width || maxDisplay) - framePadding));
  const availableHeight = Math.max(1, Math.floor((window.innerHeight || maxDisplay) - 178));
  const ratio = Math.min(maxDisplay / w, maxDisplay / h, availableWidth / w, availableHeight / h);
  const pixelScale = Math.max(1, Math.floor(ratio));
  const nextWidth = Math.max(1, w * pixelScale);
  const nextHeight = Math.max(1, h * pixelScale);
  const key = `${w}:${h}:${nextWidth}:${nextHeight}:${pixelScale}`;
  if (editorCanvasMetricsCache === key) return;
  editorCanvasMetricsCache = key;
  canvas.width = nextWidth;
  canvas.height = nextHeight;
  canvas.style.width = `${nextWidth}px`;
  canvas.style.height = `${nextHeight}px`;
  canvas.style.aspectRatio = `${w} / ${h}`;
  gridPathCache = null;
  gridBitmapCache = null;
  requestAnimationFrame(centerEditorCanvasFrame);
}
function cellSize() { return Math.floor(Math.min(canvas.width / projectWidth(), canvas.height / projectHeight())); }

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
function drawCompositedFrame(f, alphaMul, targetCtx = ctx) {
  targetCtx.save();
  f.layers.forEach(l => {
    if (!l.visible) return;
    targetCtx.globalCompositeOperation = normalizeBlendMode(l.blendMode);
    drawPixelGrid(l.pixels, l.opacity * alphaMul, targetCtx);
  });
  targetCtx.restore();
}
function normalizeBlendMode(mode) {
  return ["source-over", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"].includes(mode) ? mode : "source-over";
}
function drawPixelGrid(pixels, alpha, targetCtx = ctx) {
  targetCtx.save();
  targetCtx.globalAlpha = alpha;
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
    const c = pixels[y]?.[x]; if (!c) continue; targetCtx.fillStyle = c; targetCtx.fillRect(x, y, 1, 1);
  }
  targetCtx.restore();
}
function drawGrid(width, height, cell) {
  const step = Math.max(1, Math.ceil(4 / Math.max(cell, 1)));
  const alpha = cell >= 4 ? 0.18 : 0.24;
  const key = `${width}:${height}:${cell}:${canvas.width}:${canvas.height}:${step}:${isDarkTheme() ? "dark" : "light"}`;
  if (!gridBitmapCache || gridBitmapCache.key !== key) {
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = canvas.width;
    gridCanvas.height = canvas.height;
    const gridCtx = gridCanvas.getContext("2d", { alpha: true });
    gridCtx.strokeStyle = canvasGridColor(alpha);
    gridCtx.lineWidth = 1;
    gridCtx.beginPath();
    for (let x = 0; x <= width; x += step) {
      const px = Math.round(x * cell) + 0.5;
      gridCtx.moveTo(px, 0);
      gridCtx.lineTo(px, canvas.height);
    }
    for (let y = 0; y <= height; y += step) {
      const py = Math.round(y * cell) + 0.5;
      gridCtx.moveTo(0, py);
      gridCtx.lineTo(canvas.width, py);
    }
    gridCtx.stroke();
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
function mirroredPoints(x, y) {
  const w = projectWidth(), h = projectHeight();
  const points = [{ x, y }];
  if (symmetryMode === "vertical" || symmetryMode === "both" || symmetryMode === "quad") points.push({ x: w - 1 - x, y });
  if (symmetryMode === "horizontal" || symmetryMode === "both" || symmetryMode === "quad") points.push({ x, y: h - 1 - y });
  if (symmetryMode === "both" || symmetryMode === "quad") points.push({ x: w - 1 - x, y: h - 1 - y });
  return points.filter((point, index, list) => list.findIndex(other => other.x === point.x && other.y === point.y) === index);
}
function setPixel(x, y, c, target = layer().pixels) {
  const half = Math.floor(brushSize / 2);
  for (let yy = y - half; yy <= y + half; yy++) for (let xx = x - half; xx <= x + half; xx++) mirroredPoints(xx, yy).forEach(point => paintPixel(point.x, point.y, c, target));
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
    mirroredPoints(x + xx - ox, y + yy - oy).forEach(point => paintPixel(point.x, point.y, mark === "#" ? c : mark, target));
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
  if (enabled && playModeScreen) setPlayModeScreen(false);
  if (enabled && printMode) setPrintMode(false);
  modMode = Boolean(enabled);
  document.body.classList.toggle("mod-mode", modMode);
  if (modModeBtn) {
    modModeBtn.setAttribute("aria-pressed", String(modMode));
    modModeBtn.textContent = modMode ? "Base Mode" : "Mod Mode";
  }
  if (modSandboxPanel) {
    modSandboxPanel.hidden = !modMode;
    modSandboxPanel.toggleAttribute("aria-hidden", !modMode);
    modSandboxPanel.style.display = modMode ? "block" : "";
  }
  if (modMode) {
    if (modPlayUiCode && !modPlayUiCode.value.trim()) modPlayUiCode.value = stringifyPlayUiMod();
    try {
      resetModPreview(false);
      renderModControls();
      drawModPreview();
      modSandboxPanel?.scrollIntoView?.({ block: "start" });
      setStatus("Mod Mode on. Build brushes, effects, and Play UI mods here.");
    } catch (err) {
      console.error("Mod Mode failed to draw", err);
      setStatus(`Mod Mode opened, but preview failed: ${err.message}`);
    }
  } else {
    modPointerDown = false;
    if (modSandboxPanel) modSandboxPanel.style.display = "";
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
  const runner = { worker, url, kind, pending: new Map(), initError: "" };
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
      if (runner.kind === "brush" && modBrushRunner === runner) { stopModRunner(modBrushRunner); modBrushRunner = null; modBrushRunnerCode = ""; }
      if (runner.kind === "effect" && modEffectRunner === runner) { stopModRunner(modEffectRunner); modEffectRunner = null; modEffectRunnerCode = ""; }
      reject(new Error("Mod timed out and was stopped."));
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

function applyModPlayUi(announce = true) {
  try {
    const ui = parsePlayUiModCode(modPlayUiCode?.value || "{}");
    state.playMode.ui = ui;
    schedulePlayDraw();
    saveLocal();
    if (announce) setStatus("Play UI mod applied.");
    return ui;
  } catch (err) {
    if (announce) setStatus(`Play UI error: ${err.message}`);
    throw err;
  }
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
  if (pack.playUiCode || pack.playUi) {
    const ui = pack.playUi ? normalizePlayUiMod(pack.playUi) : parsePlayUiModCode(pack.playUiCode);
    state.playMode.ui = ui;
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
  schedulePlayDraw();
  saveLocal();
  if (announce) setStatus("Mod imported. Added to Base and Play Mode.");
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
    effectCode: modEffectCode?.value || "",
    playUiCode: modPlayUiCode?.value || stringifyPlayUiMod(),
    playUi: parsePlayUiModCode(modPlayUiCode?.value || stringifyPlayUiMod())
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
      if (modPlayUiCode) modPlayUiCode.value = pack.playUiCode || stringifyPlayUiMod(pack.playUi || state.playMode.ui);
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
  const payload = { type: "pixel-bug-pack", version: "1.3.0", brushes: customBrushes, palettes: state.palettePresets };
  await saveBase64("Export Asset Pack", "pixel-bug-assets.pbpack", "Pixel Bug Pack", "pbpack", btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))));
  setStatus("Asset pack exported.");
}
function importAssetPack(file) {
  if (!file) return;
  if (file.size > MAX_IMPORT_FILE_BYTES) { setStatus("Asset pack file too large."); return; }
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

// Tilemap tools
function normalizeTilemapState(input = {}) {
  const tiles = Array.isArray(input.tiles) ? input.tiles : [];
  const cleanTiles = tiles
    .filter(tile => tile && Array.isArray(tile.pixels) && Number(tile.w) > 0 && Number(tile.h) > 0)
    .slice(0, 80)
    .map((tile, index) => ({
      id: String(tile.id || `tile-${index + 1}`),
      name: String(tile.name || `Tile ${index + 1}`).slice(0, 40),
      w: Math.max(1, Math.min(128, Number(tile.w) || tile.pixels[0]?.length || 1)),
      h: Math.max(1, Math.min(128, Number(tile.h) || tile.pixels.length || 1)),
      pixels: tile.pixels.slice(0, 128).map(row => Array.isArray(row) ? row.slice(0, 128).map(c => isHexColor(c) ? c : null) : [])
    }));
  const activeId = cleanTiles.some(tile => tile.id === input.activeTileId) ? input.activeTileId : (cleanTiles[0]?.id || "");
  return { activeTileId: activeId, tiles: cleanTiles };
}
function activeTile() {
  state.tilemap = normalizeTilemapState(state.tilemap);
  return state.tilemap.tiles.find(tile => tile.id === state.tilemap.activeTileId) || null;
}
function saveLocalTileLibrary() {
  try { localStorage.setItem(STORAGE_TILE_LIBRARY_KEY, JSON.stringify(state.tilemap?.tiles || [])); } catch (_err) { /* Tile save */ }
}
function loadLocalTileLibrary() {
  try {
    if (state.tilemap?.tiles?.length) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_TILE_LIBRARY_KEY) || "[]");
    if (!Array.isArray(saved) || !saved.length) return;
    state.tilemap = normalizeTilemapState({ tiles: saved, activeTileId: saved[0]?.id || "" });
  } catch (_err) { /* Tile load */ }
}
function renderTilemapPanel() {
  if (!tilemapSelect || !tilemapPreview) return;
  state.tilemap = normalizeTilemapState(state.tilemap);
  tilemapSelect.innerHTML = "";
  if (!state.tilemap.tiles.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No saved tiles";
    tilemapSelect.appendChild(option);
  } else {
    state.tilemap.tiles.forEach(tile => {
      const option = document.createElement("option");
      option.value = tile.id;
      option.textContent = `${tile.name} (${tile.w}×${tile.h})`;
      option.selected = tile.id === state.tilemap.activeTileId;
      tilemapSelect.appendChild(option);
    });
  }
  tilemapPreview.innerHTML = "";
  const tile = activeTile();
  tilemapPreview.classList.toggle("hidden", !tile);
  tilemapPreview.toggleAttribute("hidden", !tile);
  if (tile) tilemapPreview.appendChild(pixelsToPreviewElement(tile.pixels, tile.w, tile.h));
  if (tilemapStampBtn) {
    tilemapStampBtn.textContent = tileStampMode ? "Stamp On" : "Stamp Off";
    tilemapStampBtn.setAttribute("aria-pressed", String(tileStampMode));
  }
}
function pixelsToPreviewElement(pixels, w, h) {
  const box = document.createElement("div");
  box.className = "tile-preview-grid";
  box.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
  box.style.aspectRatio = `${w} / ${h}`;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cell = document.createElement("span");
    const c = pixels[y]?.[x];
    if (c) cell.style.background = c;
    box.appendChild(cell);
  }
  return box;
}
function saveSelectionAsTile() {
  if (!selectionBox) return setStatus("Make a selection before saving a tile.");
  const data = extractPixels(selectionBox, false);
  const id = `tile-${Date.now().toString(36)}`;
  const tile = { id, name: `Tile ${state.tilemap.tiles.length + 1}`, ...data };
  state.tilemap.tiles.push(tile);
  state.tilemap.activeTileId = id;
  activeTileId = id;
  tileStampMode = true;
  renderTilemapPanel();
  saveLocalTileLibrary();
  saveLocal();
  setStatus("Selection saved as a project tile.");
}
function deleteActiveTile() {
  const tile = activeTile();
  if (!tile) return setStatus("No tile selected.");
  state.tilemap.tiles = state.tilemap.tiles.filter(item => item.id !== tile.id);
  state.tilemap.activeTileId = state.tilemap.tiles[0]?.id || "";
  activeTileId = state.tilemap.activeTileId;
  if (!activeTile()) tileStampMode = false;
  renderTilemapPanel();
  saveLocalTileLibrary();
  saveLocal();
  setStatus("Tile deleted.");
}
function stampTileAt(x, y) {
  const tile = activeTile();
  if (!tile) return false;
  tile.pixels.forEach((row, yy) => row.forEach((c, xx) => {
    if (!c) return;
    mirroredPoints(x + xx, y + yy).forEach(point => paintPixel(point.x, point.y, c, layer().pixels));
  }));
  return true;
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
  if (tool === "pencil" && tileStampMode && activeTile()) stampTileAt(p.x, p.y);
  else if (tool === "pencil") stampBrush(p.x, p.y, color, l);
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
  renderDialogueCharacters();
  renderPlayPropDialogueOptions();
  renderDialogueControls();
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
  layer.scale = clampFiniteNumber(playLayerScaleInput?.value, layer.scale ?? 3, 0.5, 32);
  layer.parallax = clampFiniteNumber(playLayerParallaxInput?.value, 0, -4, 4);
  layer.y = clampFiniteNumber(playLayerYInput?.value, layer.y ?? 0, -1024, 2160);
  layer.opacity = Math.max(0, Math.min(Number(playLayerOpacityInput?.value ?? layer.opacity ?? 1), 1));
  layer.repeatX = playLayerRepeatInput ? playLayerRepeatInput.checked : layer.repeatX !== false;
  layer.visible = playLayerVisibleInput ? playLayerVisibleInput.checked : layer.visible !== false;
  state.playMode.visualLayers[selectedPlayLayer] = clampPlayLayer(layer, selectedPlayLayer);
  renderPlayLayerList();
  drawPlayScene();
  saveLocal();
}
function compositedFrameCanvas(index = state.activeFrame) {
  const safeIndex = Math.max(0, Math.min(index, state.frames.length - 1));
  const frameData = state.frames[safeIndex];
  const signature = activeFrameSignature(safeIndex);
  const cached = compositedFrameCanvasCache.get(safeIndex);
  if (cached && cached.frameData === frameData && cached.signature === signature) return cached.canvas;

  // Cache canvas
  const canvasFrame = document.createElement("canvas");
  canvasFrame.width = projectWidth();
  canvasFrame.height = projectHeight();
  const cctx = canvasFrame.getContext("2d", { alpha: true });
  cctx.imageSmoothingEnabled = false;
  drawCompositedFrame(frameData, 1, cctx);
  compositedFrameCanvasCache.set(safeIndex, { frameData, signature, canvas: canvasFrame });
  return canvasFrame;
}
function frameCanvas(index) {
  const safeIndex = Math.max(0, Math.min(index, state.frames.length - 1));
  const cached = playFrameCanvasCache.get(safeIndex);
  const source = compositedFrameCanvas(safeIndex);
  if (cached && cached.source === source) return cached.canvas;
  playFrameCanvasCache.set(safeIndex, { source, canvas: source });
  return source;
}
function playScale() { return Math.max(0.5, Math.min(Number(state.playMode.actorScale) || 3, 32)); }
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
function renderPlayPropDialogueOptions() {
  if (!playPropDialogueSelect) return;
  const current = playPropDialogueSelect.value || "";
  playPropDialogueSelect.innerHTML = "";
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "No interaction";
  playPropDialogueSelect.appendChild(none);
  interactionDialogueCharacters().forEach(character => {
    const option = document.createElement("option");
    option.value = character.id;
    option.textContent = `${character.name} → line ${(Number(character.startLine) || 0) + 1}`;
    playPropDialogueSelect.appendChild(option);
  });
  playPropDialogueSelect.value = Array.from(playPropDialogueSelect.options).some(option => option.value === current) ? current : "";
}
function syncSelectedPlayPropControls() {
  const prop = state.playMode.props[selectedPlayProp];
  renderPlayPropDialogueOptions();
  if (!prop) return;
  playPropFrameSelect.value = String(prop.frame);
  playPropXInput.value = String(Math.round(prop.x));
  playPropYInput.value = String(Math.round(prop.y));
  if (playPropScaleInput) playPropScaleInput.value = String(prop.scale || playScale());
  if (playPropSolidInput) playPropSolidInput.checked = prop.solid !== false;
  if (playPropDialogueSelect) playPropDialogueSelect.value = prop.dialogueCharacterId || "";
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
  if (layer.role === "overlay") {
    const ratio = Math.max(playCanvas.width / layerCanvas.width, playCanvas.height / layerCanvas.height);
    const w = Math.max(1, Math.round(layerCanvas.width * ratio));
    const h = Math.max(1, Math.round(layerCanvas.height * ratio));
    const x = Math.round((playCanvas.width - w) / 2);
    const y = Math.round((playCanvas.height - h) / 2);
    playCtx.save();
    playCtx.globalAlpha = Math.max(0, Math.min(Number(layer.opacity ?? 1), 1));
    playCtx.imageSmoothingEnabled = false;
    playCtx.drawImage(layerCanvas, x, y, w, h);
    playCtx.restore();
    return true;
  }
  const scale = Math.max(0.5, Math.min(Number(layer.scale) || 3, 32));
  const alpha = Math.max(0, Math.min(Number(layer.opacity ?? 1), 1));
  playCtx.globalAlpha = alpha;
  if (layer.repeatX !== false || layer.fit === "tile") {
    drawScrollingTile(layerCanvas, finiteNumber(layer.y, 0), scale, finiteNumber(layer.parallax, 0), alpha);
    playCtx.globalAlpha = 1;
    return true;
  }
  const ratio = layer.fit === "stretch" ? null : layer.fit === "contain" ? Math.min(playCanvas.width / layerCanvas.width, playCanvas.height / layerCanvas.height) : Math.max(playCanvas.width / layerCanvas.width, playCanvas.height / layerCanvas.height);
  const w = layer.fit === "stretch" ? playCanvas.width : Math.max(1, Math.round(layerCanvas.width * ratio));
  const h = layer.fit === "stretch" ? playCanvas.height : Math.max(1, Math.round(layerCanvas.height * ratio));
  const x = Math.round((playCanvas.width - w) / 2 - playCameraX * (Number(layer.parallax) || 0));
  const y = Number.isFinite(Number(layer.y)) ? Number(layer.y) : (layer.fit === "stretch" ? 0 : Math.round((playCanvas.height - h) / 2));
  playCtx.drawImage(layerCanvas, x, Math.round(y), w, h);
  playCtx.globalAlpha = 1;
  return true;
}
// Layer drawing
function drawPlayVisualLayers(role = null) {
  let drew = false;
  (state.playMode.visualLayers || []).forEach(layer => {
    const layerRole = layer?.role || "background";
    if ((role === null || layerRole === role) && drawPlayVisualLayer(layer)) drew = true;
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
function currentDialogueLine() {
  normalizeProject();
  return state.playMode.dialogue.lines[state.playMode.dialogue.currentLine] || state.playMode.dialogue.lines[0];
}
function dialogueCharacterById(id) {
  normalizeProject();
  return state.playMode.dialogue.characters.find(character => character.id === id) || state.playMode.dialogue.characters[0];
}
function dialogueCharacterExact(id) {
  normalizeProject();
  return state.playMode.dialogue.characters.find(character => character.id === id) || null;
}
function selectedDialogueLineCharacter(line = currentDialogueLine()) {
  normalizeProject();
  const selectedId = String(dialogueCharacterSelect?.value || "");
  const selected = state.playMode.dialogue.characters.find(character => character.id === selectedId);
  const assigned = state.playMode.dialogue.characters.find(character => character.id === line?.characterId);
  return selected || assigned || state.playMode.dialogue.characters[0];
}
function applyDialogueCharacterToCurrentLine(characterId) {
  normalizeProject();
  const dialogue = state.playMode.dialogue;
  const character = dialogue.characters.find(item => item.id === characterId);
  const line = currentDialogueLine();
  if (!character || !line) return;
  const currentFrame = Number.isFinite(Number(line.frame)) ? Number(line.frame) : Number(character.frame) || 0;
  line.characterId = character.id;
  line.speaker = character.name || "Character";
  line.frame = Math.max(0, Math.min(currentFrame, state.frames.length - 1));
  if (dialogueSpeakerInput) dialogueSpeakerInput.value = line.speaker;
  if (dialogueFrameSelect) dialogueFrameSelect.value = String(line.frame);
  if (dialogueCharacterSelect) dialogueCharacterSelect.value = character.id;
  resetDialogueTypewriter();
  renderDialogueNodeTree();
  drawPlayScene();
  saveLocal();
}
function interactionDialogueCharacters() {
  normalizeProject();
  return state.playMode.dialogue.characters.filter(character => character.role !== "actor" && character.visible !== false);
}
function isDialogueVisible() {
  const dialogue = state.playMode.dialogue;
  if (!dialogue || dialogue.enabled === false) return false;
  return playRunning ? playDialogueActive : true;
}
function closeRuntimeDialogue(message = "Dialogue closed.") {
  playDialogueActive = false;
  activeDialogueSourceId = "";
  drawPlayScene();
  setStatus(message);
}
function drawDialogueCharacters() {
  const dialogue = state.playMode.dialogue;
  if (!playCtx || !dialogue) return;
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  const slots = { left: 0.24, center: 0.5, right: 0.76 };
  dialogue.characters.filter(character => character.role !== "actor" && character.visible !== false).forEach(character => {
    const source = frameCanvas(character.frame);
    const scale = Math.max(1, Math.min(Number(character.scale) || 3, 16));
    const w = projectWidth() * scale;
    const h = projectHeight() * scale;
    const x = Math.round(playCanvas.width * (slots[character.position] || 0.5) - w / 2);
    const y = Math.round(ground - h);
    playCtx.save();
    playCtx.globalAlpha = 1;
    playCtx.imageSmoothingEnabled = false;
    if (character.flip) {
      playCtx.translate(x + w, y);
      playCtx.scale(-1, 1);
      playCtx.drawImage(source, 0, 0, w, h);
    } else {
      playCtx.drawImage(source, x, y, w, h);
    }
    playCtx.restore();
  });
}
function wrapDialogueText(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}
function resetDialogueTypewriter() {
  dialogueTypewriterStart = performance.now();
  dialogueRevealChars = 0;
}
function drawDialogueOverlay() {
  const dialogue = state.playMode.dialogue;
  if (!playCtx || !dialogue || !isDialogueVisible()) return;
  const line = currentDialogueLine();
  const ui = playUiMod();
  const margin = Math.max(8, Math.round(playCanvas.width * ui.dialogueMargin));
  const boxH = Math.max(72, Math.round(playCanvas.height * ui.dialogueBoxHeight));
  const boxY = playCanvas.height - boxH - margin;
  const portraitSize = ui.dialoguePortrait ? Math.max(44, Math.min(120, boxH - 28)) : 0;
  const textX = margin + (ui.dialoguePortrait ? portraitSize + 28 : 16);
  const textW = playCanvas.width - textX - margin - 16;
  const now = performance.now();
  if (dialogue.typewriter !== false) {
    dialogueRevealChars = Math.min(String(line.text || "").length, Math.floor((now - dialogueTypewriterStart) / 22));
    if (dialogueRevealChars < String(line.text || "").length) requestAnimationFrame(drawPlayScene);
  } else {
    dialogueRevealChars = Infinity;
  }
  const visibleText = String(line.text || "").slice(0, dialogueRevealChars);
  playCtx.save();
  // Dialogue contrast
  const dialogueBoxColor = ui.dialogueBoxColor || (isDarkTheme() ? "rgba(18,18,18,0.96)" : "rgba(255,255,255,0.96)");
  const dialogueInkColor = ui.dialogueInkColor || (isDarkTheme() ? "#f8f8f8" : "#111");
  playCtx.fillStyle = dialogueBoxColor;
  playCtx.strokeStyle = ui.dialogueBorderColor || dialogueInkColor;
  playCtx.lineWidth = ui.dialogueBorderWidth;
  playCtx.fillRect(margin, boxY, playCanvas.width - margin * 2, boxH);
  playCtx.strokeRect(margin, boxY, playCanvas.width - margin * 2, boxH);
  playCtx.fillStyle = dialogueInkColor;
  playCtx.font = `900 ${ui.dialogueNameSize}px ${ui.dialogueFont}`;
  const activeCharacter = dialogueCharacterById(line.characterId);
  playCtx.fillText(line.speaker || activeCharacter.name || "Character", textX, boxY + 28);
  const portraitCanvas = frameCanvas(line.frame ?? activeCharacter.frame);
  playCtx.imageSmoothingEnabled = false;
  if (ui.dialoguePortrait) {
    playCtx.drawImage(portraitCanvas, margin + 12, boxY + 14, portraitSize, portraitSize);
    playCtx.strokeStyle = ui.dialogueBorderColor || dialogueInkColor;
    playCtx.strokeRect(margin + 12, boxY + 14, portraitSize, portraitSize);
  }
  playCtx.fillStyle = dialogueInkColor;
  playCtx.font = `800 ${ui.dialogueTextSize}px ${ui.dialogueFont}`;
  wrapDialogueText(playCtx, visibleText, textW).slice(0, 4).forEach((textLine, index) => {
    playCtx.fillText(textLine, textX, boxY + 56 + index * Math.round(ui.dialogueTextSize * 1.45));
  });
  if (ui.dialogueCounter) {
    playCtx.font = `900 12px ${ui.dialogueFont}`;
    playCtx.fillText(`${dialogue.currentLine + 1}/${dialogue.lines.length}`, playCanvas.width - margin - 44, boxY + boxH - 14);
  }
  playCtx.restore();
}
function drawPlayScene() {
  if (!playCtx) return;
  syncPlayCanvasSize();
  const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
  const actorScale = playScale();
  playCtx.imageSmoothingEnabled = false;
  playCtx.globalAlpha = 1;
  playCtx.setTransform(1, 0, 0, 1, 0, 0);
  playCtx.fillStyle = canvasBackgroundColor();
  playCtx.fillRect(0, 0, playCanvas.width, playCanvas.height);
  updatePlayCamera();
  drawDefaultSky(ground);
  const drewLegacyBackground = drawPlayBackground();
  const drewVisualLayers = drawPlayVisualLayers(null);
  const hasBackground = drewLegacyBackground || drewVisualLayers;
  if (!hasBackground || state.playMode.showGridOverlay !== false) drawPlayGrid(ground);
  state.playMode.props.forEach((prop, index) => {
    const propCanvas = frameCanvas(prop.frame);
    const propScale = Math.max(1, Math.min(Number(prop.scale) || actorScale, 16));
    const propW = projectWidth() * propScale;
    const propH = projectHeight() * propScale;
    const px = screenX(Number(prop.x) || 0);
    if (px + propW < -8 || px > playCanvas.width + 8) return;
    playCtx.globalAlpha = 1;
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
  drawDialogueCharacters();
  const moving = Math.abs(playActor.vx) > 0.08;
  const actorFrame = !playActor.grounded ? state.playMode.jumpFrame : moving ? state.playMode.walkFrame : state.playMode.idleFrame;
  const actorCanvas = frameCanvas(actorFrame);
  const actorW = projectWidth() * actorScale;
  const actorH = projectHeight() * actorScale;
  playCtx.save();
  playCtx.globalAlpha = 1;
  if (playActor.facing < 0) {
    playCtx.translate(screenX(playActor.x + actorW), Math.round(playActor.y));
    playCtx.scale(-1, 1);
    playCtx.drawImage(actorCanvas, 0, 0, actorW, actorH);
  } else {
    playCtx.drawImage(actorCanvas, screenX(playActor.x), Math.round(playActor.y), actorW, actorH);
  }
  playCtx.restore();
  drawDialogueOverlay();
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
function frameOptions(select, selected = 0) {
  if (!select) return;
  select.innerHTML = "";
  state.frames.forEach((_, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Frame ${index + 1}`;
    select.appendChild(option);
  });
  select.value = String(Math.max(0, Math.min(Number(selected) || 0, state.frames.length - 1)));
}
function renderDialogueCharacters() {
  if (!characterList) return;
  normalizeProject();
  const characters = state.playMode.dialogue.characters;
  characterList.innerHTML = "";
  characters.forEach((character, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `list-item ${index === selectedDialogueCharacter ? "active" : ""}`;
    button.textContent = character.role === "actor" ? `${character.name} · actor` : `${character.name} · NPC · ${character.position}`;
    button.onclick = () => { saveCharacterEdits(); selectedDialogueCharacter = index; renderDialogueCharacters(); drawPlayScene(); };
    characterList.appendChild(button);
  });
  const character = characters[selectedDialogueCharacter] || characters[0];
  if (!character) return;
  if (characterNameInput) characterNameInput.value = character.name || "Character";
  frameOptions(characterFrameSelect, character.frame);
  if (characterPositionSelect) {
    characterPositionSelect.value = character.position || "left";
    characterPositionSelect.disabled = character.role === "actor";
  }
  if (characterScaleInput) {
    characterScaleInput.value = String(character.scale || 3);
    characterScaleInput.disabled = character.role === "actor";
  }
  if (characterFlipInput) {
    characterFlipInput.checked = character.flip === true;
    characterFlipInput.disabled = character.role === "actor";
  }
  if (characterStartLineSelect) {
    characterStartLineSelect.innerHTML = "";
    state.playMode.dialogue.lines.forEach((line, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      const speaker = line.speaker || dialogueCharacterById(line.characterId).name || "Line";
      option.textContent = `${index + 1}: ${speaker}`;
      characterStartLineSelect.appendChild(option);
    });
    characterStartLineSelect.value = String(Math.max(0, Math.min(Number(character.startLine) || 0, state.playMode.dialogue.lines.length - 1)));
    characterStartLineSelect.disabled = character.role === "actor";
  }
}
function saveCharacterEdits() {
  if (!characterNameInput || !state.playMode?.dialogue?.characters?.length) return;
  const character = state.playMode.dialogue.characters[selectedDialogueCharacter] || state.playMode.dialogue.characters[0];
  const oldName = character.name;
  character.name = String(characterNameInput.value || "Character").slice(0, 32);
  character.frame = Math.max(0, Math.min(Number(characterFrameSelect?.value) || 0, state.frames.length - 1));
  if (character.role !== "actor") {
    character.position = ["left", "center", "right"].includes(characterPositionSelect?.value) ? characterPositionSelect.value : "left";
    character.scale = Math.max(1, Math.min(Number(characterScaleInput?.value) || 3, 16));
    character.flip = characterFlipInput?.checked === true;
    character.visible = true;
  }
  state.playMode.dialogue.lines.forEach(line => {
    if (line.characterId === character.id || line.speaker === oldName) {
      line.characterId = character.id;
      line.speaker = character.name;
      if (!Number.isFinite(Number(line.frame))) line.frame = character.frame;
    }
  });
  if (character.role !== "actor" && characterStartLineSelect) {
    character.startLine = Math.max(0, Math.min(Number(characterStartLineSelect.value) || 0, state.playMode.dialogue.lines.length - 1));
  }
  saveLocal();
  renderDialogueControls();
  drawPlayScene();
}
function addDialogueCharacter(duplicate = false) {
  pushHistory();
  saveCharacterEdits();
  const source = duplicate ? clone(state.playMode.dialogue.characters[selectedDialogueCharacter] || state.playMode.dialogue.characters[0]) : makeDialogueCharacter(`NPC ${state.playMode.dialogue.characters.length}`, 0, state.playMode.dialogue.characters.length % 2 ? "right" : "left", "npc");
  source.role = "npc";
  source.visible = true;
  source.id = `char-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  source.name = duplicate ? `${source.name} Copy`.slice(0, 32) : source.name;
  state.playMode.dialogue.characters.push(source);
  selectedDialogueCharacter = state.playMode.dialogue.characters.length - 1;
  renderDialogueCharacters();
  renderPlayPropDialogueOptions();
  renderDialogueControls();
  drawPlayScene();
  saveLocal();
}
function deleteDialogueCharacter() {
  if (!state.playMode.dialogue.characters || state.playMode.dialogue.characters.length <= 1) return;
  if ((state.playMode.dialogue.characters[selectedDialogueCharacter] || {}).role === "actor") { setStatus("The actor is required for dialogue and cannot be deleted."); return; }
  pushHistory();
  const removed = state.playMode.dialogue.characters.splice(selectedDialogueCharacter, 1)[0];
  selectedDialogueCharacter = Math.max(0, Math.min(selectedDialogueCharacter, state.playMode.dialogue.characters.length - 1));
  const fallback = state.playMode.dialogue.characters[selectedDialogueCharacter] || state.playMode.dialogue.characters[0];
  state.playMode.dialogue.lines.forEach(line => {
    if (line.characterId === removed.id) { line.characterId = fallback.id; line.speaker = fallback.name; line.frame = fallback.frame; }
  });
  renderDialogueCharacters();
  renderPlayPropDialogueOptions();
  renderDialogueControls();
  drawPlayScene();
  saveLocal();
}
function renderDialogueControls() {
  if (!dialogueLineSelect) return;
  normalizeProject();
  const dialogue = state.playMode.dialogue;
  dialogueLineSelect.innerHTML = "";
  dialogue.lines.forEach((line, index) => {
    const character = dialogueCharacterById(line.characterId);
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}: ${line.speaker || character.name || "Character"}`;
    dialogueLineSelect.appendChild(option);
  });
  const line = currentDialogueLine();
  const activeCharacter = dialogueCharacterById(line.characterId);
  dialogueEnabledInput.checked = dialogue.enabled !== false;
  dialogueLineSelect.value = String(dialogue.currentLine);
  if (dialogueCharacterSelect) {
    dialogueCharacterSelect.innerHTML = "";
    dialogue.characters.forEach(character => {
      const option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.name;
      dialogueCharacterSelect.appendChild(option);
    });
    dialogueCharacterSelect.value = activeCharacter.id;
  }
  dialogueSpeakerInput.value = line.speaker || activeCharacter.name || "Character";
  if (dialogueTextInput) {
    dialogueTextInput.value = line.text || "";
    dialogueDraftText = dialogueTextInput.value;
  }
  frameOptions(dialogueFrameSelect, line.frame ?? activeCharacter.frame);
  dialogueTypewriterBtn?.setAttribute("aria-pressed", String(dialogue.typewriter !== false));
  renderDialogueNodeTree();
}
function renderDialogueNodeTree() {
  if (!dialogueNodeTree || !state.playMode?.dialogue) return;
  const dialogue = state.playMode.dialogue;
  dialogueNodeTree.innerHTML = "";
  const startsByLine = new Map();
  interactionDialogueCharacters().forEach(character => {
    const lineIndex = Math.max(0, Math.min(Number(character.startLine) || 0, dialogue.lines.length - 1));
    if (!startsByLine.has(lineIndex)) startsByLine.set(lineIndex, []);
    startsByLine.get(lineIndex).push(character.name);
  });
  dialogue.lines.forEach((line, index) => {
    const character = dialogueCharacterById(line.characterId);
    const node = document.createElement("button");
    node.type = "button";
    node.className = `dialogue-node ${index === dialogue.currentLine ? "active" : ""}`;
    const starts = startsByLine.get(index) || [];
    const startLabel = starts.length ? `<span class="dialogue-node-tag">Starts: ${escapeHtml(starts.join(", "))}</span>` : "";
    node.innerHTML = `<strong>${index + 1}. ${escapeHtml(line.speaker || character.name || "Character")}</strong>${startLabel}<span>${escapeHtml(String(line.text || "Empty line").slice(0, 90))}</span>`;
    node.onclick = () => selectDialogueLine(index);
    dialogueNodeTree.appendChild(node);
    if (index < dialogue.lines.length - 1) {
      const link = document.createElement("div");
      link.className = "dialogue-node-link";
      link.textContent = "↓ next";
      dialogueNodeTree.appendChild(link);
    }
  });
}
// Dialogue helpers
function normalizeDialogueTextParts(text) {
  return String(text ?? "").replace(/\r\n/g, "\n").split("\n");
}
function makeDialogueLineForCharacter(character, text = "") {
  return { characterId: character.id, speaker: character.name, text: String(text || "").slice(0, 260), frame: Math.max(0, Math.min(Number(character.frame) || 0, state.frames.length - 1)) };
}

function applyDialoguePortraitFrameToCurrentLine() {
  if (!dialogueFrameSelect || !state.playMode?.dialogue) return;
  const dialogue = state.playMode.dialogue;
  const lineIndex = Math.max(0, Math.min(Number(dialogue.currentLine) || 0, dialogue.lines.length - 1));
  const line = dialogue.lines[lineIndex];
  if (!line) return;
  const frame = Math.max(0, Math.min(Number(dialogueFrameSelect.value) || 0, state.frames.length - 1));
  line.frame = frame;
  resetDialogueTypewriter();
  renderDialogueNodeTree();
  drawPlayScene();
  saveLocal();
}

function saveDialogueEdits(options = {}) {
  if (!dialogueSpeakerInput || !state.playMode?.dialogue) return;
  const dialogue = state.playMode.dialogue;
  const lineIndex = Math.max(0, Math.min(Number(dialogue.currentLine) || 0, dialogue.lines.length - 1));
  const line = dialogue.lines[lineIndex] || dialogue.lines[0];
  const selectedCharacter = selectedDialogueLineCharacter(line);
  const speaker = String(dialogueSpeakerInput.value || selectedCharacter.name || "Character").slice(0, 32);
  const rawText = String(dialogueTextInput?.value ?? dialogueDraftText ?? "");
  dialogueDraftText = rawText;
  const parts = options.splitMultiline ? normalizeDialogueTextParts(rawText) : [rawText];
  line.characterId = selectedCharacter.id;
  line.speaker = speaker;
  line.text = String(parts.shift() ?? "").slice(0, 260);
  line.frame = Math.max(0, Math.min(Number(dialogueFrameSelect?.value ?? selectedCharacter.frame) || 0, state.frames.length - 1));
  if (parts.length) {
    const createdLines = parts.map(text => ({ ...makeDialogueLineForCharacter(selectedCharacter, text), speaker, frame: line.frame }));
    dialogue.lines.splice(lineIndex + 1, 0, ...createdLines);
  }
  state.playMode.dialogue.enabled = dialogueEnabledInput ? dialogueEnabledInput.checked : dialogue.enabled !== false;
  if (options.render !== false) {
    saveLocal();
    drawPlayScene();
  }
}
function selectDialogueLine(index) {
  saveDialogueEdits();
  state.playMode.dialogue.currentLine = Math.max(0, Math.min(Number(index) || 0, state.playMode.dialogue.lines.length - 1));
  resetDialogueTypewriter();
  renderDialogueControls();
  drawPlayScene();
  saveLocal();
}
function addDialogueLine(duplicate = false) {
  if (!state.playMode?.dialogue) return;
  pushHistory();
  const dialogue = state.playMode.dialogue;
  const lineIndex = Math.max(0, Math.min(Number(dialogue.currentLine) || 0, dialogue.lines.length - 1));
  const selectedCharacter = selectedDialogueLineCharacter(dialogue.lines[lineIndex]) || dialogue.characters[selectedDialogueCharacter] || dialogue.characters[0];
  const typedText = String(dialogueAddClickText ?? dialogueTextInput?.value ?? dialogueDraftText ?? "").slice(0, 260);
  dialogueAddClickText = null;
  const speaker = String(dialogueSpeakerInput?.value || selectedCharacter.name || "Character").slice(0, 32);
  const frame = Math.max(0, Math.min(Number(dialogueFrameSelect?.value ?? selectedCharacter.frame) || 0, state.frames.length - 1));
  const currentLine = dialogue.lines[lineIndex] || makeDialogueLineForCharacter(selectedCharacter, "");

  currentLine.characterId = selectedCharacter.id;
  currentLine.speaker = speaker;
  currentLine.text = typedText;
  currentLine.frame = frame;
  dialogue.lines[lineIndex] = currentLine;

  // Line insert
  const source = duplicate ? clone(currentLine) : { ...makeDialogueLineForCharacter(selectedCharacter, typedText), speaker, frame };
  dialogue.lines.splice(lineIndex + 1, 0, source);
  dialogue.currentLine = lineIndex + 1;
  dialogueDraftText = typedText;
  normalizeProject();
  resetDialogueTypewriter();
  renderDialogueControls();
  renderDialogueCharacters();
  drawPlayScene();
  saveLocal();
  setStatus("Dialogue line added with the typed text.");
}
// Dialogue split
function splitDialogueLineAtCursor() {
  if (!dialogueTextInput || !state.playMode?.dialogue) return;
  pushHistory();
  const dialogue = state.playMode.dialogue;
  const selectedCharacter = selectedDialogueLineCharacter(currentDialogueLine());
  const start = dialogueTextInput.selectionStart ?? dialogueTextInput.value.length;
  const end = dialogueTextInput.selectionEnd ?? start;
  const before = dialogueTextInput.value.slice(0, start);
  const after = dialogueTextInput.value.slice(end);
  dialogueTextInput.value = before;
  saveDialogueEdits({ render: false });
  const line = currentDialogueLine();
  const nextLine = { ...makeDialogueLineForCharacter(selectedCharacter, after), speaker: line.speaker, frame: line.frame };
  dialogue.lines.splice(dialogue.currentLine + 1, 0, nextLine);
  dialogue.currentLine += 1;
  resetDialogueTypewriter();
  renderDialogueControls();
  drawPlayScene();
  saveLocal();
}

function deleteDialogueLine() {
  pushHistory();
  const dialogue = state.playMode.dialogue;
  if (dialogue.lines.length <= 1) {
    const actor = dialogue.characters.find(character => character.role === "actor") || dialogue.characters[0];
    dialogue.lines = [makeDialogueLineForCharacter(actor, "")];
    dialogue.currentLine = 0;
  } else {
    dialogue.lines.splice(dialogue.currentLine, 1);
    dialogue.currentLine = Math.min(dialogue.currentLine, dialogue.lines.length - 1);
  }
  resetDialogueTypewriter();
  renderDialogueControls();
  renderDialogueCharacters();
  drawPlayScene();
  saveLocal();
}

function activeInteractionCharacter() {
  normalizeProject();
  const characters = interactionDialogueCharacters();
  if (!characters.length) { setStatus("Add an NPC in Character Manager, then assign its interaction start line."); return null; }
  const actorBox = playActorRect();
  const reach = Math.max(28, projectWidth() * playScale());
  const interactionBox = { x: actorBox.x - reach, y: actorBox.y - reach / 2, w: actorBox.w + reach * 2, h: actorBox.h + reach };
  let bestProp = null;
  let bestPropDistance = Infinity;
  state.playMode.props.forEach(prop => {
    if (!prop.dialogueCharacterId) return;
    const character = characters.find(item => item.id === prop.dialogueCharacterId);
    if (!character) return;
    const rect = playPropRect(prop);
    if (!rectsOverlap(interactionBox, rect)) return;
    const distance = Math.abs((rect.x + rect.w / 2) - (actorBox.x + actorBox.w / 2));
    if (distance < bestPropDistance) { bestProp = character; bestPropDistance = distance; }
  });
  if (bestProp) return bestProp;
  const actorCenter = playActor.x + actorBox.w / 2;
  const slots = { left: 0.24, center: 0.5, right: 0.76 };
  let best = null;
  let bestDistance = Infinity;
  characters.forEach(character => {
    const worldX = playCameraX + playCanvas.width * (slots[character.position] || 0.5);
    const distance = Math.abs(worldX - actorCenter);
    if (distance < bestDistance) { best = character; bestDistance = distance; }
  });
  if (best && bestDistance <= Math.max(96, playCanvas.width * 0.2)) return best;
  setStatus("Move near an assigned NPC or object, then press E / Interact.");
  return null;
}
function startInteractionDialogue(character = activeInteractionCharacter()) {
  if (!character) return;
  playDialogueActive = true;
  activeDialogueSourceId = character.id;
  state.playMode.dialogue.enabled = true;
  state.playMode.dialogue.currentLine = Math.max(0, Math.min(Number(character.startLine) || 0, state.playMode.dialogue.lines.length - 1));
  resetDialogueTypewriter();
  renderDialogueControls();
  drawPlayScene();
  setStatus(`Started dialogue with ${character.name}.`);
}
function advanceDialogueRuntime() {
  const dialogue = state.playMode.dialogue;
  const line = currentDialogueLine();
  const textLength = String(line.text || "").length;
  if (dialogue.typewriter !== false && dialogueRevealChars < textLength) {
    dialogueRevealChars = textLength;
    drawPlayScene();
    return;
  }
  if (dialogue.currentLine < dialogue.lines.length - 1) selectDialogueLine(dialogue.currentLine + 1);
  else closeRuntimeDialogue("Dialogue finished.");
}

function setPlayRunning(next) {
  if (!playCanvas) return;
  playRunning = next;
  playRunBtn.textContent = playRunning ? "Stop" : "Run";
  playRunBtn.setAttribute("aria-pressed", String(playRunning));
  playKeys = {};
  if (playRunning) {
    playDialogueActive = false;
    activeDialogueSourceId = "";
    resetDialogueTypewriter();
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
    solid: playPropSolidInput ? playPropSolidInput.checked : true,
    dialogueCharacterId: playPropDialogueSelect ? playPropDialogueSelect.value : ""
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
  drawPlayVisualLayers("foreground");
  drawPlayVisualLayers("overlay");
  state.playMode.props.forEach((prop, index) => {
    const row = document.createElement("div");
    row.className = "frame-row" + (index === selectedPlayProp ? " active" : "");
    const assignedCharacter = prop.dialogueCharacterId ? dialogueCharacterById(prop.dialogueCharacterId) : null;
    const assignedName = prop.dialogueCharacterId && assignedCharacter ? ` · talks to ${assignedCharacter.name}` : "";
    const safeAssignedName = escapeHtml(assignedName);
    row.innerHTML = `<button class="frame-chip" aria-label="Select object ${index + 1}">${index + 1}</button><span>Frame ${prop.frame + 1}</span><small>x${Math.round(prop.x)} y${Math.round(prop.y)} · ${prop.scale}× · ${prop.solid === false ? "Ghost" : "Solid"}${safeAssignedName}</small><button class="collision-chip" type="button" aria-pressed="${prop.solid !== false}" aria-label="Toggle collision for object ${index + 1}">${prop.solid === false ? "Collision Off" : "Collision On"}</button><span class="sr-only">Object ${index + 1} uses frame ${prop.frame + 1}, x position ${Math.round(prop.x)}, y position ${Math.round(prop.y)}, scale ${prop.scale || playScale()}, collision ${prop.solid === false ? "off" : "on"}${safeAssignedName}.</span>`;
    row.onclick = event => {
      selectedPlayProp = index;
      if (event.target.classList.contains("collision-chip")) { toggleSelectedPlayPropCollision(); return; }
      syncSelectedPlayPropControls();
      renderPlayPropList();
      drawPlayScene();
    };
    playPropList.appendChild(row);
  });
}
function toggleSelectedPlayPropCollision() {
  const prop = state.playMode.props[selectedPlayProp];
  if (!prop) return;
  pushHistory();
  prop.solid = prop.solid === false;
  syncSelectedPlayPropControls();
  renderPlayPropList();
  drawPlayScene();
  saveLocal();
  setStatus(prop.solid === false ? "Selected object collision disabled." : "Selected object collision enabled.");
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
  state.playMode.actorScale = Math.max(0.5, Math.min(Number(playActorScaleInput?.value) || playScale(), 32));
  normalizeProject();
  resetPlayActor();
  renderPlayPanel();
  saveLocal();
}
function setPlayModeScreen(enabled) {
  if (enabled && modMode) setModMode(false);
  playModeScreen = enabled;
  if (enabled && printMode) setPrintMode(false);
  document.body.classList.toggle("play-mode", enabled);
  if (playPanel) playPanel.hidden = !enabled;
  playModeBtn.setAttribute("aria-pressed", String(enabled));
  playModeBtn.textContent = enabled ? "Base Mode" : "Play Mode";
  if (enabled) {
    playDialogueActive = false;
    activeDialogueSourceId = "";
    if (state.playMode?.dialogue) state.playMode.dialogue.enabled = false;
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


// Game export
function playFrameDataUrl(index) {
  const source = frameCanvas(index);
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const outCtx = out.getContext("2d", { alpha: true });
  outCtx.imageSmoothingEnabled = false;
  outCtx.drawImage(source, 0, 0);
  return out.toDataURL("image/png");
}

// Export sync
function syncPlayModeControlsForExport() {
  if (!state.playMode) return;
  state.playMode.sceneWidth = Math.max(160, Math.min(Number(playSceneWidthInput?.value) || Number(state.playMode.sceneWidth) || 640, 4096));
  state.playMode.sceneHeight = Math.max(120, Math.min(Number(playSceneHeightInput?.value) || Number(state.playMode.sceneHeight) || 360, 2160));
  state.playMode.worldWidth = Math.max(state.playMode.sceneWidth, Math.min(Number(playWorldWidthInput?.value) || Number(state.playMode.worldWidth) || Math.max(1600, state.playMode.sceneWidth), 20000));
  state.playMode.groundY = Math.max(32, Math.min(Number(playGroundYInput?.value) || Number(state.playMode.groundY) || Math.round(state.playMode.sceneHeight * 0.84), state.playMode.sceneHeight - 8));
  state.playMode.actorScale = Math.max(0.5, Math.min(Number(playActorScaleInput?.value) || Number(state.playMode.actorScale) || 3, 32));
  if (playBackgroundFrameSelect) state.playMode.backgroundFrame = Number(playBackgroundFrameSelect.value);
  if (playBackgroundScaleSelect) state.playMode.backgroundScale = playBackgroundScaleSelect.value || state.playMode.backgroundScale || "cover";
  if (playGridOverBgInput) state.playMode.showGridOverlay = playGridOverBgInput.checked;
  if (playCameraFollowInput) state.playMode.cameraFollow = playCameraFollowInput.checked;
  if (playAutoScrollInput) state.playMode.autoScroll = playAutoScrollInput.checked;
  if (playScrollSpeedInput) state.playMode.scrollSpeed = Math.max(0, Math.min(Number(playScrollSpeedInput.value) || 0, 20));
  if (playSceneryFrameSelect) state.playMode.sceneryFrame = Number(playSceneryFrameSelect.value);
  if (playSceneryScaleInput) state.playMode.sceneryScale = Math.max(0.5, Math.min(Number(playSceneryScaleInput.value) || 3, 32));
  if (playScenerySpeedInput) state.playMode.scenerySpeed = Math.max(-4, Math.min(Number(playScenerySpeedInput.value) || 0.45, 4));
  if (playSceneryYInput) state.playMode.sceneryY = clampFiniteNumber(playSceneryYInput.value, state.playMode.sceneryY ?? 0, -1024, 2160);
  const prop = state.playMode.props?.[selectedPlayProp];
  if (prop) {
    prop.x = Number(playPropXInput?.value) || 0;
    prop.y = Number(playPropYInput?.value) || 0;
    prop.scale = Math.max(1, Math.min(Number(playPropScaleInput?.value) || state.playMode.actorScale || 3, 16));
    if (playPropSolidInput) prop.solid = playPropSolidInput.checked;
    if (playPropDialogueSelect) prop.dialogueCharacterId = playPropDialogueSelect.value || "";
  }
  const layer = state.playMode.visualLayers?.[selectedPlayLayer];
  if (layer) {
    const frameValue = Number(playLayerFrameSelect?.value);
    layer.frame = Number.isFinite(frameValue) ? Math.max(-1, Math.min(frameValue, state.frames.length - 1)) : -1;
    layer.scale = clampFiniteNumber(playLayerScaleInput?.value, layer.scale ?? 3, 0.5, 32);
    layer.parallax = clampFiniteNumber(playLayerParallaxInput?.value, layer.parallax ?? 0, -4, 4);
    layer.y = clampFiniteNumber(playLayerYInput?.value, layer.y ?? 0, -1024, 2160);
    layer.opacity = Math.max(0, Math.min(Number(playLayerOpacityInput?.value ?? layer.opacity ?? 1), 1));
    layer.repeatX = playLayerRepeatInput ? playLayerRepeatInput.checked : layer.repeatX !== false;
    layer.visible = playLayerVisibleInput ? playLayerVisibleInput.checked : layer.visible !== false;
  }
  saveDialogueEdits({ render: false });
  normalizeProject();
}

// Game payload
function buildTinyGamePayload() {
  syncPlayModeControlsForExport();
  const usedFrames = new Set([state.playMode.idleFrame, state.playMode.walkFrame, state.playMode.jumpFrame, state.playMode.backgroundFrame, state.playMode.sceneryFrame]);
  (state.playMode.visualLayers || []).forEach(layer => usedFrames.add(layer.frame));
  (state.playMode.props || []).forEach(prop => usedFrames.add(prop.frame));
  (state.playMode.dialogue?.characters || []).forEach(character => usedFrames.add(character.frame));
  (state.playMode.dialogue?.lines || []).forEach(line => usedFrames.add(line.frame));
  const frameImages = {};
  Array.from(usedFrames).forEach(index => {
    const safeIndex = Number(index);
    if (safeIndex >= 0 && safeIndex < state.frames.length) frameImages[safeIndex] = playFrameDataUrl(safeIndex);
  });
  return {
    title: String(state.name || "Pixel Bug Tiny Game").slice(0, 64),
    exportWidth: Math.max(160, Math.min(Number(state.playMode.sceneWidth) || 640, 4096)),
    exportHeight: Math.max(120, Math.min(Number(state.playMode.sceneHeight) || 360, 2160)),
    artWidth: projectWidth(),
    artHeight: projectHeight(),
    sceneBackground: canvasBackgroundColor(),
    playMode: clone(state.playMode),
    playUi: playUiMod(),
    frames: frameImages
  };
}

// Html escape
function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

// Game html
function buildTinyGameHtml(payload) {
  const payloadJson = escapeScriptJson(payload);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none';" />
<title>${escapeHtml(payload.title)}</title>
<style>
:root { color-scheme: dark; --bg:#141414; --ink:#f7f0da; --edge:#050505; --panel:#242424; --accent:#ffd447; }
* { box-sizing: border-box; }
html, body { margin:0; min-height:100%; background:var(--bg); color:var(--ink); font-family:system-ui, sans-serif; }
body { display:grid; place-items:center; padding:16px; overflow:auto; }
.wrap { width:max-content; max-width:none; }
h1 { margin:0 0 10px; font-size:clamp(20px, 4vw, 32px); text-transform:uppercase; letter-spacing:.04em; }
.stage { border:4px solid var(--edge); box-shadow:8px 8px 0 var(--edge); background:#fff; width:${payload.exportWidth}px; height:${payload.exportHeight}px; image-rendering:pixelated; }
canvas { display:block; width:${payload.exportWidth}px; height:${payload.exportHeight}px; image-rendering:pixelated; outline:none; }
.help { margin:16px 0 0; padding:12px 14px; border:3px solid var(--edge); background:var(--panel); box-shadow:5px 5px 0 var(--edge); font-weight:800; line-height:1.45; }
kbd { background:var(--accent); color:#111; border:2px solid var(--edge); padding:1px 5px; box-shadow:2px 2px 0 var(--edge); }
</style>
</head>
<body>
<main class="wrap">
<h1>${escapeHtml(payload.title)}</h1>
<div class="stage"><canvas id="game" width="${payload.exportWidth}" height="${payload.exportHeight}" tabindex="0" aria-label="Tiny exported Pixel Bug game"></canvas></div>
<p class="help"><kbd>A</kbd>/<kbd>D</kbd> or arrows move. <kbd>W</kbd>/<kbd>Space</kbd> jumps. <kbd>E</kbd>/<kbd>Enter</kbd> advances dialogue.</p>
</main>
<script>
const GAME = ${payloadJson};
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha:false });
const pm = GAME.playMode || {};
const ui = Object.assign({ dialogueBoxColor:"rgba(15,15,15,0.94)", dialogueInkColor:"#f7f0da", dialogueBorderColor:"#f7f0da", dialogueBorderWidth:4, dialogueFont:"system-ui, sans-serif", dialogueNameSize:16, dialogueTextSize:15, dialogueMargin:0.035, dialogueBoxHeight:0.28, dialoguePortrait:true, dialogueCounter:true }, GAME.playUi || pm.ui || {});
const props = Array.isArray(pm.props) ? pm.props : [];
const solidProps = props.filter(prop => prop && prop.solid !== false);
const visualLayers = Array.isArray(pm.visualLayers) ? pm.visualLayers : [];
const sceneLayers = visualLayers.filter(layer => layer && ["background", "foreground", "overlay"].includes(layer.role));
const artW = Math.max(1, GAME.artWidth || 32);
const artH = Math.max(1, GAME.artHeight || 32);
const images = {};
const keys = {};
const actor = { x:24, y:96, vx:0, vy:0, grounded:false, facing:1 };
let cameraX = 0;
let tick = 0;
let dialogueActive = false;
let dialogueLine = 0;
let revealStart = 0;
let revealChars = 0;
let activeCharacterId = "";
canvas.width = Math.max(160, Math.min(GAME.exportWidth || pm.sceneWidth || 640, 4096));
canvas.height = Math.max(120, Math.min(GAME.exportHeight || pm.sceneHeight || 360, 2160));
ctx.imageSmoothingEnabled = false;
function loadImages() {
  return Promise.all(Object.entries(GAME.frames || {}).map(([id, src]) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => { images[id] = img; resolve(); };
    img.onerror = resolve;
    img.src = src;
  })));
}
function scale() { return Math.max(0.5, Math.min(Number(pm.actorScale) || 3, 32)); }
function worldWidth() { return Math.max(canvas.width, Math.min(Number(pm.worldWidth) || Math.max(1600, canvas.width), 20000)); }
function groundY() { return Math.max(32, Math.min(Number(pm.groundY) || canvas.height - 48, canvas.height - 8)); }
function screenX(x) { return Math.round(x - cameraX); }
function rectsOverlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
// Camera update
function updateCamera() {
  const maxCameraX = Math.max(0, worldWidth() - canvas.width);
  const actorW = artW * scale();
  const actorCenter = actor.x + actorW / 2;
  const previousCameraX = cameraX;
  let target = cameraX;
  if (pm.cameraFollow !== false) {
    const viewLeft = cameraX;
    const viewRight = cameraX + canvas.width;
    const leftSafe = viewLeft + Math.max(44, canvas.width * 0.28);
    const rightSafe = viewRight - Math.max(44, canvas.width * 0.34);
    if (actorCenter < leftSafe) target = actorCenter - Math.max(44, canvas.width * 0.28);
    if (actorCenter > rightSafe) target = actorCenter - canvas.width + Math.max(44, canvas.width * 0.34);
    target = Math.max(0, Math.min(maxCameraX, target));
    cameraX += (target - cameraX) * 0.22;
  }
  if (pm.autoScroll === true) {
    const speed = Math.max(0, Number(pm.scrollSpeed) || 0);
    cameraX = Math.max(cameraX, Math.min(maxCameraX, cameraX + speed));
  }
  cameraX = Math.round(Math.max(0, Math.min(maxCameraX, cameraX)));
  if (pm.autoScroll === true) {
    const cameraDelta = cameraX - previousCameraX;
    if (cameraDelta > 0) actor.x = Math.max(0, Math.min(worldWidth() - actorW, actor.x + cameraDelta));
  }
}
function actorRect(x = actor.x, y = actor.y) { const s = scale(); return { x, y, w:artW * s, h:artH * s }; }
function propRect(prop) { const s = Math.max(1, Math.min(Number(prop.scale) || scale(), 16)); return { x:Number(prop.x) || 0, y:Number(prop.y) || 0, w:artW * s, h:artH * s }; }
function drawImageFrame(frame, x, y, w, h, flip = false) {
  const img = images[String(frame)];
  if (!img) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, w, h); }
  else ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}
function drawSceneBase() {
  ctx.fillStyle = GAME.sceneBackground || "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function parallaxCameraX() {
  const speed = pm.autoScroll === true ? Math.max(0, Number(pm.scrollSpeed) || 0) : 0;
  return cameraX + tick * speed;
}
function drawLayer(layer) {
  if (!layer || layer.visible === false || layer.frame < 0 || !images[String(layer.frame)]) return;
  const img = images[String(layer.frame)];
  if (layer.role === "overlay") {
    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = Math.max(1, Math.round(img.width * ratio));
    const h = Math.max(1, Math.round(img.height * ratio));
    const x = Math.round((canvas.width - w) / 2);
    const y = Math.round((canvas.height - h) / 2);
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(Number(layer.opacity ?? 1), 1));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    return;
  }
  const sc = Math.max(0.5, Math.min(Number(layer.scale) || 3, 32));
  const parallax = Number.isFinite(Number(layer.parallax)) ? Number(layer.parallax) : 0;
  const opacity = Math.max(0, Math.min(Number(layer.opacity ?? 1), 1));
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.imageSmoothingEnabled = false;
  if (layer.repeatX !== false || layer.fit === "tile") {
    const w = Math.max(1, Math.round(img.width * sc));
    const h = Math.max(1, Math.round(img.height * sc));
    const y = Math.round(Number.isFinite(Number(layer.y)) ? Number(layer.y) : 0);
    const offset = ((parallaxCameraX() * parallax) % w + w) % w;
    for (let x = -offset - w; x < canvas.width + w; x += w) ctx.drawImage(img, Math.round(x), y, w, h);
    ctx.restore();
    return;
  }
  const fit = layer.fit || "cover";
  const ratio = fit === "stretch" ? null : fit === "contain" ? Math.min(canvas.width / img.width, canvas.height / img.height) : Math.max(canvas.width / img.width, canvas.height / img.height);
  const w = fit === "stretch" ? canvas.width : Math.max(1, Math.round(img.width * ratio));
  const h = fit === "stretch" ? canvas.height : Math.max(1, Math.round(img.height * ratio));
  const x = Math.round((canvas.width - w) / 2 - parallaxCameraX() * parallax);
  const y = Number.isFinite(Number(layer.y)) ? Math.round(Number(layer.y)) : (fit === "stretch" ? 0 : Math.round((canvas.height - h) / 2));
  const shouldRepeatCover = fit !== "stretch" && layer.repeatX === true;
  if (shouldRepeatCover) {
    const offset = ((parallaxCameraX() * parallax - (canvas.width - w) / 2) % w + w) % w;
    for (let drawX = -offset - w; drawX < canvas.width + w; drawX += w) ctx.drawImage(img, Math.round(drawX), y, w, h);
  } else {
    ctx.drawImage(img, x, y, w, h);
  }
  ctx.restore();
}
function drawTiledImage(img, y, sc, parallax, opacity = 1) {
  const w = Math.max(1, Math.round(img.width * sc));
  const h = Math.max(1, Math.round(img.height * sc));
  const offset = ((parallaxCameraX() * parallax) % w + w) % w;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(Number(opacity ?? 1), 1));
  ctx.imageSmoothingEnabled = false;
  for (let x = -offset - w; x < canvas.width + w; x += w) ctx.drawImage(img, Math.round(x), Math.round(y), w, h);
  ctx.restore();
}
function drawRepeatedImage(img, y, w, h, parallax, opacity = 1) {
  const offset = ((parallaxCameraX() * parallax) % w + w) % w;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(Number(opacity ?? 1), 1));
  ctx.imageSmoothingEnabled = false;
  for (let x = -offset - w; x < canvas.width + w; x += w) ctx.drawImage(img, Math.round(x), Math.round(y), w, h);
  ctx.restore();
}
function drawBackground() {
  drawSceneBase();
  const bg = Number(pm.backgroundFrame);
  const img = images[String(bg)];
  if (img) {
    const mode = pm.backgroundScale || "cover";
    if (mode === "stretch") ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    else if (mode === "tile") drawTiledImage(img, 0, Math.max(1, scale()), 0.22, 1);
    else {
      const ratio = mode === "contain" ? Math.min(canvas.width / img.width, canvas.height / img.height) : Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const y = Math.round((canvas.height - h) / 2);
      drawRepeatedImage(img, y, w, h, 0.08, 1);
    }
  }
  sceneLayers.forEach(drawLayer);
  const scenery = images[String(pm.sceneryFrame)];
  if (scenery) drawTiledImage(scenery, Number(pm.sceneryY) || 0, Math.max(0.5, Math.min(Number(pm.sceneryScale) || 3, 32)), Math.max(-4, Math.min(Number(pm.scenerySpeed) || 0.45, 4)), 1);
}
function characters() { return (pm.dialogue && pm.dialogue.characters) || []; }
function lines() { return (pm.dialogue && pm.dialogue.lines) || []; }
function characterById(id) { return characters().find(c => c.id === id) || characters()[0] || {}; }
function startDialogue(character) {
  if (!character) return;
  dialogueActive = true;
  activeCharacterId = character.id || "";
  dialogueLine = Math.max(0, Math.min(Number(character.startLine) || 0, Math.max(0, lines().length - 1)));
  revealStart = performance.now();
  revealChars = 0;
}
function activeInteractionCharacter() {
  const box = actorRect();
  const reach = Math.max(28, artW * scale());
  const near = { x:box.x - reach, y:box.y - reach / 2, w:box.w + reach * 2, h:box.h + reach };
  let best = null;
  let bestDist = Infinity;
  props.forEach(prop => {
    if (!prop.dialogueCharacterId) return;
    const c = characterById(prop.dialogueCharacterId);
    const r = propRect(prop);
    if (!rectsOverlap(near, r)) return;
    const dist = Math.abs((r.x + r.w / 2) - (box.x + box.w / 2));
    if (dist < bestDist) { best = c; bestDist = dist; }
  });
  if (best) return best;
  const slots = { left:0.24, center:0.5, right:0.76 };
  interactionCharacters().forEach(character => {
    const sc = Math.max(1, Math.min(Number(character.scale) || 3, 16));
    const r = { x: cameraX + canvas.width * (slots[character.position] || 0.5) - (artW * sc) / 2, y: groundY() - artH * sc, w: artW * sc, h: artH * sc };
    if (!rectsOverlap(near, r)) return;
    const dist = Math.abs((r.x + r.w / 2) - (box.x + box.w / 2));
    if (dist < bestDist) { best = character; bestDist = dist; }
  });
  return best;
}
function interactionCharacters() { return characters().filter(c => c && c.role !== "actor" && c.visible !== false); }
function drawSceneCharacters() {
  const slots = { left:0.24, center:0.5, right:0.76 };
  const ground = groundY();
  interactionCharacters().forEach(character => {
    const img = images[String(character.frame)];
    if (!img) return;
    const sc = Math.max(1, Math.min(Number(character.scale) || 3, 16));
    const w = artW * sc;
    const h = artH * sc;
    const x = Math.round(canvas.width * (slots[character.position] || 0.5) - w / 2);
    const y = Math.round(ground - h);
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
    if (character.flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, w, h); }
    else ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  });
}
function advanceDialogue() {
  if (!dialogueActive) { startDialogue(activeInteractionCharacter()); return; }
  const line = lines()[dialogueLine] || {};
  const len = String(line.text || "").length;
  if (revealChars < len) { revealChars = len; return; }
  if (dialogueLine < lines().length - 1) { dialogueLine++; revealStart = performance.now(); revealChars = 0; }
  else { dialogueActive = false; activeCharacterId = ""; }
}
function drawDialogue() {
  if (!dialogueActive || !lines().length) return;
  const line = lines()[dialogueLine] || {};
  const ch = characterById(line.characterId || activeCharacterId);
  const text = String(line.text || "");
  if ((pm.dialogue || {}).typewriter === false) revealChars = text.length;
  else revealChars = Math.min(text.length, Math.max(revealChars, Math.floor((performance.now() - revealStart) / 12)));
  const margin = Math.max(8, Math.round(canvas.width * (Number(ui.dialogueMargin) || .035)));
  const boxH = Math.max(72, Math.round(canvas.height * (Number(ui.dialogueBoxHeight) || .28)));
  const boxY = canvas.height - boxH - margin;
  const portrait = ui.dialoguePortrait !== false ? Math.max(44, Math.min(120, boxH - 28)) : 0;
  ctx.fillStyle = ui.dialogueBoxColor || "rgba(15,15,15,.94)";
  ctx.strokeStyle = ui.dialogueBorderColor || ui.dialogueInkColor || "#f7f0da";
  ctx.lineWidth = Math.max(0, Math.min(Number(ui.dialogueBorderWidth) || 4, 16));
  ctx.fillRect(margin, boxY, canvas.width - margin * 2, boxH);
  ctx.strokeRect(margin, boxY, canvas.width - margin * 2, boxH);
  if (ui.dialoguePortrait !== false) drawImageFrame(line.frame ?? ch.frame ?? 0, margin + 12, boxY + 14, portrait, portrait, false);
  ctx.fillStyle = ui.dialogueInkColor || "#f7f0da";
  ctx.font = "900 " + Math.max(8, Math.min(Number(ui.dialogueNameSize) || 16, 32)) + "px " + (ui.dialogueFont || "system-ui, sans-serif");
  const textX = margin + (ui.dialoguePortrait !== false ? portrait + 28 : 16);
  ctx.fillText(line.speaker || ch.name || "Character", textX, boxY + 28);
  ctx.font = "800 " + Math.max(8, Math.min(Number(ui.dialogueTextSize) || 15, 30)) + "px " + (ui.dialogueFont || "system-ui, sans-serif");
  const maxTextWidth = canvas.width - textX - margin - 16;
  const wrapped = [];
  text.slice(0, revealChars).split(/\\r?\\n/).forEach(sourceLine => {
    const words = sourceLine.split(/\\s+/).filter(Boolean);
    let row = "";
    words.forEach(word => {
      const test = row ? row + " " + word : word;
      if (ctx.measureText(test).width <= maxTextWidth || !row) { row = test; return; }
      wrapped.push(row);
      row = word;
      while (ctx.measureText(row).width > maxTextWidth && row.length > 1) {
        let cut = row.length - 1;
        while (cut > 1 && ctx.measureText(row.slice(0, cut)).width > maxTextWidth) cut--;
        wrapped.push(row.slice(0, cut));
        row = row.slice(cut);
      }
    });
    wrapped.push(row);
  });
  ctx.textBaseline = "alphabetic";
  wrapped.slice(0, 4).forEach((part, i) => ctx.fillText(part || " ", textX, boxY + 56 + i * Math.round((Number(ui.dialogueTextSize) || 15) * 1.45)));
  if (ui.dialogueCounter !== false) {
    ctx.font = "900 12px " + (ui.dialogueFont || "system-ui, sans-serif");
    ctx.fillText((dialogueLine + 1) + "/" + lines().length, canvas.width - margin - 44, boxY + boxH - 14);
  }
}
function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  drawBackground();
  ctx.globalAlpha = 1;
  props.forEach(prop => drawImageFrame(prop.frame, screenX(Number(prop.x) || 0), Math.round(Number(prop.y) || 0), propRect(prop).w, propRect(prop).h));
  drawSceneCharacters();
  ctx.globalAlpha = 1;
  const moving = Math.abs(actor.vx) > .08;
  const frame = !actor.grounded ? pm.jumpFrame : moving ? pm.walkFrame : pm.idleFrame;
  const ar = actorRect();
  drawImageFrame(frame, screenX(actor.x), Math.round(actor.y), ar.w, ar.h, actor.facing < 0);
  drawDialogue();
}
function step() {
  const s = scale();
  const w = artW * s;
  const h = artH * s;
  const left = keys.ArrowLeft || keys.KeyA;
  const right = keys.ArrowRight || keys.KeyD;
  const jump = keys.Space || keys.ArrowUp || keys.KeyW;
  actor.vx = dialogueActive ? 0 : right && !left ? 3 : left && !right ? -3 : 0;
  if (actor.vx) actor.facing = actor.vx > 0 ? 1 : -1;
  if (jump && actor.grounded && !dialogueActive) { actor.vy = -8; actor.grounded = false; }
  actor.vy += .45;
  actor.grounded = false;
  actor.x = Math.max(0, Math.min(worldWidth() - w, actor.x + actor.vx));
  let box = actorRect();
  solidProps.forEach(prop => { const r = propRect(prop); if (!rectsOverlap(box, r)) return; if (actor.vx > 0) actor.x = r.x - w; if (actor.vx < 0) actor.x = r.x + r.w; actor.vx = 0; box = actorRect(); });
  actor.y += actor.vy;
  box = actorRect();
  solidProps.forEach(prop => { const r = propRect(prop); if (!rectsOverlap(box, r)) return; if (actor.vy > 0) { actor.y = r.y - h; actor.grounded = true; } if (actor.vy < 0) actor.y = r.y + r.h; actor.vy = 0; box = actorRect(); });
  if (actor.y + h >= groundY()) { actor.y = groundY() - h; actor.vy = 0; actor.grounded = true; }
  updateCamera();
  tick++;
  draw();
  requestAnimationFrame(step);
}
window.addEventListener("keydown", event => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault(); if (event.code === "KeyE" || event.code === "Enter") { event.preventDefault(); advanceDialogue(); return; } keys[event.code] = true; });
window.addEventListener("keyup", event => { keys[event.code] = false; });
loadImages().then(() => { const h = artH * scale(); actor.y = groundY() - h; canvas.focus(); step(); });
</script>
</body>
</html>`;
}

// Export game
async function exportTinyPlayGame() {
  if (!playCanvas) return;
  const wasRunning = playRunning;
  if (wasRunning) setPlayRunning(false);
  try {
    const payload = buildTinyGamePayload();
    const html = buildTinyGameHtml(payload);
    const res = await window.pixelBug.saveFile({
      title: "Export Tiny Game",
      defaultPath: "pixel-bug-tiny-game.html",
      filters: [{ name: "HTML Game", extensions: ["html"] }],
      data: html
    });
    setStatus(res?.ok ? "Tiny game exported as a standalone HTML file." : "Save cancelled.");
  } catch (err) {
    setStatus(`Tiny game export failed: ${err.message}`);
  } finally {
    if (wasRunning) setPlayRunning(true);
  }
}


// Model parsing
function clampColorByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
function modelRgbToHex(r, g, b) {
  return rgbToHex(clampColorByte(r), clampColorByte(g), clampColorByte(b));
}
function modelHexToRgb(hex) {
  const n = parseInt(String(hex || "#8c8c8c").slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function parseObjVertex(parts) {
  const point = { x: Number(parts[1]), y: Number(parts[2]), z: Number(parts[3]) };
  if (parts.length >= 7) {
    const raw = parts.slice(4, 7).map(Number);
    if (raw.every(Number.isFinite)) {
      const scaled = raw.some(value => value > 1) ? raw : raw.map(value => value * 255);
      point.color = modelRgbToHex(scaled[0], scaled[1], scaled[2]);
    }
  }
  return point;
}
function parseMtlMaterials(text) {
  const materials = new Map();
  let current = null;
  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    const parts = trimmed.split(/\s+/);
    if (!parts[0] || parts[0].startsWith("#")) return;
    const tag = parts[0].toLowerCase();
    if (tag === "newmtl") {
      current = parts.slice(1).join(" ");
      if (current) materials.set(current, { color: null, textureName: null, textureCanvas: null });
      return;
    }
    if (!current) return;
    const material = materials.get(current) || { color: null, textureName: null, textureCanvas: null };
    if (["kd", "ka"].includes(tag) && !material.color) {
      const color = parts.slice(1, 4).map(Number);
      if (color.every(Number.isFinite)) material.color = modelRgbToHex(color[0] * 255, color[1] * 255, color[2] * 255);
    }
    if (tag === "map_kd") material.textureName = parts.slice(1).join(" ").split(/[\\/]/).pop();
    materials.set(current, material);
  });
  return materials;
}
function averageHexColors(colors) {
  const picked = colors.filter(Boolean);
  if (!picked.length) return null;
  const totals = picked.reduce((sum, hex) => {
    const rgb = modelHexToRgb(hex);
    sum.r += rgb.r; sum.g += rgb.g; sum.b += rgb.b;
    return sum;
  }, { r: 0, g: 0, b: 0 });
  return modelRgbToHex(totals.r / picked.length, totals.g / picked.length, totals.b / picked.length);
}
function averageVertexColor(face) {
  return averageHexColors(face.map(point => point.color));
}
async function imageFileToCanvas(file) {
  if (!file || typeof createImageBitmap !== "function") return null;
  try {
    if (file.size > MAX_MODEL_EXTRA_BYTES) return null;
    const bitmap = await createImageBitmap(file);
    if (bitmap.width * bitmap.height > MAX_MODEL_TEXTURE_PIXELS) { bitmap.close?.(); return null; }
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const cx = canvas.getContext("2d", { willReadFrequently: true });
    cx.drawImage(bitmap, 0, 0);
    return canvas;
  } catch (_) {
    return null;
  }
}
async function attachModelTextures(materials, files) {
  const images = new Map();
  for (const file of files) {
    if (!/\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)) continue;
    const canvas = await imageFileToCanvas(file);
    if (canvas) images.set(file.name.split(/[\\/]/).pop().toLowerCase(), { canvas, ctx: canvas.getContext("2d", { willReadFrequently: true }) });
  }
  materials.forEach(material => {
    if (!material?.textureName) return;
    material.textureCanvas = images.get(material.textureName.toLowerCase()) || null;
  });
}
function sampleTextureColor(textureEntry, uvs) {
  if (!textureEntry || !uvs.length) return null;
  const textureCanvas = textureEntry.canvas || textureEntry;
  const cx = textureEntry.ctx || textureCanvas.getContext("2d", { willReadFrequently: true });
  const colors = [];
  uvs.forEach(uv => {
    const u = ((Number(uv.u) % 1) + 1) % 1;
    const v = ((Number(uv.v) % 1) + 1) % 1;
    const x = Math.max(0, Math.min(textureCanvas.width - 1, Math.round(u * (textureCanvas.width - 1))));
    const y = Math.max(0, Math.min(textureCanvas.height - 1, Math.round((1 - v) * (textureCanvas.height - 1))));
    const data = cx.getImageData(x, y, 1, 1).data;
    if (data[3] > 16) colors.push(modelRgbToHex(data[0], data[1], data[2]));
  });
  return averageHexColors(colors);
}
function parseObjModel(text, materials = new Map()) {
  const vertices = [];
  const uvs = [];
  const triangles = [];
  let activeMaterial = null;
  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split(/\s+/);
    const tag = parts[0].toLowerCase();
    if (tag === "v") vertices.push(parseObjVertex(parts));
    if (tag === "vt") uvs.push({ u: Number(parts[1]), v: Number(parts[2]) });
    if (tag === "usemtl") activeMaterial = parts.slice(1).join(" ");
    if (tag === "f") {
      const refs = parts.slice(1).map(part => {
        const bits = part.split("/");
        return { vertex: Number(bits[0]), uv: Number(bits[1]) };
      }).filter(ref => Number.isFinite(ref.vertex));
      for (let i = 1; i < refs.length - 1; i++) {
        const faceRefs = [refs[0], refs[i], refs[i + 1]];
        const face = faceRefs.map(ref => vertices[ref.vertex - 1]).filter(Boolean);
        if (face.length !== 3) continue;
        const material = materials.get(activeMaterial) || null;
        const faceUvs = faceRefs.map(ref => uvs[ref.uv - 1]).filter(Boolean);
        const textureColor = sampleTextureColor(material?.textureCanvas, faceUvs);
        if (triangles.length < MAX_MODEL_TRIANGLES) triangles.push({ points: face, color: averageVertexColor(face) || textureColor || material?.color || null });
      }
    }
  });
  return triangles;
}
function parseStlModel(text) {
  const points = [...text.matchAll(/vertex\s+([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)/gi)].map(match => ({ x: Number(match[1]), y: Number(match[2]), z: Number(match[3]) }));
  const triangles = [];
  for (let i = 0; i + 2 < points.length && triangles.length < MAX_MODEL_TRIANGLES; i += 3) triangles.push({ points: [points[i], points[i + 1], points[i + 2]], color: null });
  return triangles;
}
function stlAttributeColor(attribute) {
  if (!(attribute & 0x8000)) return null;
  const r = (attribute & 0x1f) * 255 / 31;
  const g = ((attribute >> 5) & 0x1f) * 255 / 31;
  const b = ((attribute >> 10) & 0x1f) * 255 / 31;
  return modelRgbToHex(r, g, b);
}
function parseBinaryStlModel(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 84) return [];
  const count = view.getUint32(80, true);
  if (84 + count * 50 > buffer.byteLength) return [];
  const triangles = [];
  for (let i = 0; i < count && triangles.length < MAX_MODEL_TRIANGLES; i++) {
    const offset = 84 + i * 50 + 12;
    const face = [];
    for (let v = 0; v < 3; v++) {
      const pointOffset = offset + v * 12;
      face.push({ x: view.getFloat32(pointOffset, true), y: view.getFloat32(pointOffset + 4, true), z: view.getFloat32(pointOffset + 8, true) });
    }
    triangles.push({ points: face, color: stlAttributeColor(view.getUint16(84 + i * 50 + 48, true)) });
  }
  return triangles;
}
async function parseModelFile(fileOrFiles) {
  const files = Array.from(fileOrFiles?.length !== undefined ? fileOrFiles : [fileOrFiles]).filter(Boolean);
  const modelFile = files.find(file => /\.(obj|stl)$/i.test(file.name));
  if (!modelFile) throw new Error("Upload an OBJ or STL model file first.");
  if (modelFile.size > MAX_MODEL_FILE_BYTES) throw new Error("Model file is too large. Use a smaller OBJ/STL under 12 MB.");
  const mtlFiles = files.filter(file => /\.mtl$/i.test(file.name) && file.size <= MAX_MODEL_EXTRA_BYTES).slice(0, 8);
  const materials = new Map();
  for (const mtlFile of mtlFiles) parseMtlMaterials(await mtlFile.text()).forEach((value, key) => materials.set(key, value));
  await attachModelTextures(materials, files);
  let triangles = [];
  if (modelFile.name.toLowerCase().endsWith(".obj")) {
    triangles = parseObjModel(await modelFile.text(), materials);
  } else {
    const buffer = await modelFile.arrayBuffer();
    triangles = parseBinaryStlModel(buffer);
    if (!triangles.length) triangles = parseStlModel(new TextDecoder().decode(buffer));
  }
  if (!triangles.length) throw new Error("No triangles found. OBJ, ASCII STL, and binary STL files are supported.");
  return normalizeModelTriangles(triangles);
}
function trianglePoints(triangle) {
  return Array.isArray(triangle) ? triangle : triangle.points;
}
function normalizeModelTriangles(triangles) {
  const points = triangles.flatMap(trianglePoints);
  const bounds = points.reduce((box, p) => ({ minX: Math.min(box.minX, p.x), maxX: Math.max(box.maxX, p.x), minY: Math.min(box.minY, p.y), maxY: Math.max(box.maxY, p.y), minZ: Math.min(box.minZ, p.z), maxZ: Math.max(box.maxZ, p.z) }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity });
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const cz = (bounds.minZ + bounds.maxZ) / 2;
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ, 1);
  return triangles.map(triangle => ({ color: triangle.color || null, points: trianglePoints(triangle).map(p => ({ x: (p.x - cx) / span, y: (p.y - cy) / span, z: (p.z - cz) / span, color: p.color || null })) }));
}

// Model rendering
function rotateModelPoint(p, rx, ry, rz) {
  let { x, y, z } = p;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return { x, y, z };
}
function faceNormal(face) {
  const [a, b, c] = face;
  const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
  const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  return { x: nx / len, y: ny / len, z: nz / len };
}
function shadeModelColor(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = amount < 0 ? 0 : 255;
  const t = Math.abs(amount) / 100;
  const r = Math.round(((n >> 16) & 255) * (1 - t) + mix * t);
  const g = Math.round(((n >> 8) & 255) * (1 - t) + mix * t);
  const b = Math.round((n & 255) * (1 - t) + mix * t);
  return rgbToHex(r, g, b);
}
function modelConverterColorMode() {
  return modelConverterColorModeInputs.find(input => input.checked)?.value || "model";
}
function modelConverterInkColor() {
  return modelConverterInkInput?.value || color || "#000000";
}
function modelViewColor(baseColor) {
  return modelConverterColorMode() === "ink" ? modelConverterInkColor() : (baseColor || "#8c8c8c");
}
function renderModelView(triangles, view, size, shaded) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  cx.imageSmoothingEnabled = false;
  const renderTriangles = triangles.length > MAX_MODEL_RENDER_TRIANGLES ? triangles.slice(0, MAX_MODEL_RENDER_TRIANGLES) : triangles;
  const rotated = renderTriangles.map(triangle => ({ color: triangle.color || null, points: triangle.points.map(p => rotateModelPoint(p, view.rx, view.ry, view.rz)) }));
  const scale = size * 0.78;
  const projected = rotated.map(triangle => ({
    color: triangle.color,
    normal: faceNormal(triangle.points),
    depth: triangle.points.reduce((sum, p) => sum + p.z, 0) / 3,
    pts: triangle.points.map(p => ({ x: Math.round(size / 2 + p.x * scale), y: Math.round(size / 2 - p.y * scale) }))
  })).sort((a, b) => a.depth - b.depth);
  projected.forEach(item => {
    const baseColor = modelViewColor(item.color);
    const light = Math.max(0.2, Math.min(1, 0.55 + item.normal.z * 0.45));
    cx.fillStyle = shaded ? shadeModelColor(baseColor, Math.round((light - 0.55) * 70)) : baseColor;
    cx.strokeStyle = cx.fillStyle;
    cx.beginPath();
    cx.moveTo(item.pts[0].x, item.pts[0].y);
    cx.lineTo(item.pts[1].x, item.pts[1].y);
    cx.lineTo(item.pts[2].x, item.pts[2].y);
    cx.closePath();
    cx.fill();
    cx.stroke();
  });
  return canvas;
}
function canvasToTransparentPixels(sourceCanvas) {
  const cx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const data = cx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
  return Array.from({ length: sourceCanvas.height }, (_, y) => Array.from({ length: sourceCanvas.width }, (_, x) => {
    const i = (y * sourceCanvas.width + x) * 4;
    return data[i + 3] < 16 ? null : rgbToHex(data[i], data[i + 1], data[i + 2]);
  }));
}
function modelViewDefinitions() {
  const d = Math.PI / 180;
  return [
    { name: "Front", rx: 0, ry: 0, rz: 0 },
    { name: "Back", rx: 0, ry: 180 * d, rz: 0 },
    { name: "Left", rx: 0, ry: -90 * d, rz: 0 },
    { name: "Right", rx: 0, ry: 90 * d, rz: 0 },
    { name: "Top", rx: -90 * d, ry: 0, rz: 0 },
    { name: "Iso", rx: -28 * d, ry: 42 * d, rz: 0 }
  ];
}
function modelTurntableDefinition() {
  const d = Math.PI / 180;
  const rx = Number(modelConverterTurntableXInput?.value) || 0;
  const ry = Number(modelConverterTurntableYInput?.value) || 0;
  const rz = Number(modelConverterTurntableZInput?.value) || 0;
  if (modelConverterTurntableXOutput) modelConverterTurntableXOutput.textContent = `${rx}°`;
  if (modelConverterTurntableYOutput) modelConverterTurntableYOutput.textContent = `${ry}°`;
  if (modelConverterTurntableZOutput) modelConverterTurntableZOutput.textContent = `${rz}°`;
  return { name: `Turntable ${rx}/${ry}/${rz}`, rx: rx * d, ry: ry * d, rz: rz * d };
}
function scheduleModelConverterPreview() {
  cancelAnimationFrame(modelConverterPreviewFrame);
  modelConverterPreviewFrame = requestAnimationFrame(updateModelConverterPreview);
}
function updateModelConverterPreview() {
  if (!modelConverterPreviewCtx) return;
  const size = Math.max(16, Math.min(Number(modelConverterSizeInput?.value) || 48, 128));
  if (modelConverterSizeOutput) modelConverterSizeOutput.textContent = `${size} × ${size}`;
  modelConverterPreviewCtx.fillStyle = canvasBackgroundColor();
  modelConverterPreviewCtx.fillRect(0, 0, modelConverterPreviewCanvas.width, modelConverterPreviewCanvas.height);
  modelConverterViews = [];
  modelConverterTurntableView = null;
  if (!modelConverterModel) {
    modelConverterPreviewCtx.fillStyle = canvasMutedColor();
    modelConverterPreviewCtx.font = "700 14px system-ui, sans-serif";
    modelConverterPreviewCtx.fillText("Upload OBJ/STL plus MTL and texture images when needed.", 18, 36);
    modelConverterPreviewCtx.fillText("Choose model colors or force every face to a picked ink color.", 18, 58);
    modelTurntableDefinition();
    return;
  }
  const shaded = modelConverterShadingInput?.checked !== false;
  const modeLabel = modelConverterColorMode() === "ink" ? `single ink color ${modelConverterInkColor()}` : "model colors";
  modelConverterViews = modelViewDefinitions().map(view => ({ ...view, canvas: renderModelView(modelConverterModel, view, size, shaded) }));
  modelConverterViews.forEach((view, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 18 + col * 122;
    const y = 22 + row * 106;
    modelConverterPreviewCtx.drawImage(view.canvas, x, y, 80, 80);
    modelConverterPreviewCtx.fillStyle = canvasInkColor();
    modelConverterPreviewCtx.font = "800 12px system-ui, sans-serif";
    modelConverterPreviewCtx.fillText(view.name, x, y + 94);
  });
  const custom = modelTurntableDefinition();
  modelConverterTurntableView = { ...custom, canvas: renderModelView(modelConverterModel, custom, size, shaded) };
  modelConverterPreviewCtx.fillStyle = canvasMutedColor();
  modelConverterPreviewCtx.font = "800 13px system-ui, sans-serif";
  modelConverterPreviewCtx.fillText("Turntable pick", 410, 24);
  modelConverterPreviewCtx.drawImage(modelConverterTurntableView.canvas, 410, 42, 116, 116);
  modelConverterPreviewCtx.fillStyle = canvasInkColor();
  modelConverterPreviewCtx.fillText("Import only this view", 410, 178);
  modelConverterPreviewCtx.fillStyle = canvasMutedColor();
  modelConverterPreviewCtx.font = "700 12px system-ui, sans-serif";
  modelConverterPreviewCtx.fillText(`Color mode: ${modeLabel}`, 410, 198);
}
function openModelConverterModal() {
  if (!modelConverterOverlay) return;
  modelConverterOverlay.hidden = false;
  openModelConverterBtn?.setAttribute("aria-expanded", "true");
  updateModelConverterPreview();
}
function closeModelConverterModal() {
  if (!modelConverterOverlay) return;
  modelConverterOverlay.hidden = true;
  openModelConverterBtn?.setAttribute("aria-expanded", "false");
}
async function loadModelConverterFile(file) {
  if (!file) return;
  try {
    modelConverterModel = await parseModelFile(file);
    const pickedFiles = Array.from(file?.length !== undefined ? file : [file]).filter(Boolean);
    const modelFile = pickedFiles.find(item => /\.(obj|stl)$/i.test(item.name)) || pickedFiles[0];
    modelConverterFileName = modelFile?.name || "3D model";
    updateModelConverterPreview();
    setStatus(`Loaded ${modelConverterFileName}. Use Model Colors for vertex colors, MTL colors/textures, or colored STL data; use One Ink Color to pick a flat color.`);
  } catch (err) {
    modelConverterModel = null;
    updateModelConverterPreview();
    setStatus(err.message || "Could not read model file.");
  }
}
function modelLayerFromView(view, visible = true) {
  const pixels = canvasToTransparentPixels(view.canvas);
  return { name: `3D ${view.name}`, visible, opacity: 1, pixels, sourceWidth: view.canvas.width, sourceHeight: view.canvas.height, sourcePixels: copyPixels(pixels) };
}
function importModelConverterLayers() {
  if (!modelConverterModel) { setStatus("Upload an OBJ or STL model first."); return; }
  updateModelConverterPreview();
  if (!modelConverterViews.length) return;
  pushHistory();
  const size = modelConverterViews[0].canvas.width;
  state.frames.splice(state.activeFrame + 1, 0, { duration: Number(frameDurationInput.value) || 120, layers: modelConverterViews.map((view, index) => modelLayerFromView(view, index === 0)) });
  state.activeFrame++;
  state.activeLayer = 0;
  state.width = size;
  state.height = size;
  state.size = size;
  normalizeProject();
  renderAll();
  closeModelConverterModal();
  saveLocal();
  setStatus(`Created six separate ${modelConverterColorMode() === "ink" ? "single-ink" : "model-colored"} view layers from ${modelConverterFileName || "3D model"}.`);
}
function importModelConverterTurntableLayer() {
  if (!modelConverterModel) { setStatus("Upload an OBJ or STL model first."); return; }
  updateModelConverterPreview();
  if (!modelConverterTurntableView) return;
  pushHistory();
  const size = modelConverterTurntableView.canvas.width;
  state.frames.splice(state.activeFrame + 1, 0, { duration: Number(frameDurationInput.value) || 120, layers: [modelLayerFromView(modelConverterTurntableView, true)] });
  state.activeFrame++;
  state.activeLayer = 0;
  state.width = size;
  state.height = size;
  state.size = size;
  normalizeProject();
  renderAll();
  closeModelConverterModal();
  saveLocal();
  setStatus(`Imported only the selected ${modelConverterColorMode() === "ink" ? "single-ink" : "model-colored"} turntable view from ${modelConverterFileName || "3D model"}.`);
}

// Side panels
function renderFrames() {
  invalidateArtworkCaches();
  const list = $("#frames-list"); list.innerHTML = "";
  state.frames.forEach((f, i) => {
    const row = document.createElement("div");
    row.className = "frame-row" + (i === state.activeFrame ? " active" : "");
    row.draggable = true;
    row.dataset.frameIndex = String(i);
    row.innerHTML = `<button class="frame-chip" aria-label="Select frame ${i + 1}">${i + 1}</button><span>Frame ${i + 1}</span><small>${f.duration}ms</small>`;
    row.onclick = () => { state.activeFrame = i; clampActive(); syncControls(); renderAll({ persist: false }); };
    row.addEventListener("dragstart", event => {
      frameDragIndex = i;
      row.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(i));
    });
    row.addEventListener("dragend", () => { frameDragIndex = -1; row.classList.remove("dragging"); });
    row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", event => {
      event.preventDefault();
      row.classList.remove("drag-over");
      const from = frameDragIndex >= 0 ? frameDragIndex : Number(event.dataTransfer.getData("text/plain"));
      reorderFrame(from, i);
    });
    list.appendChild(row);
  });
}
// Frame order
function remapMovedFrameIndex(index, from, to) {
  const value = Number(index);
  if (!Number.isInteger(value) || value < 0) return index;
  if (value === from) return to;
  if (from < to && value > from && value <= to) return value - 1;
  if (from > to && value >= to && value < from) return value + 1;
  return value;
}

// Story export
function remapFrameReferencesAfterMove(from, to) {
  if (!state.playMode || typeof state.playMode !== "object") return;
  ["idleFrame", "walkFrame", "jumpFrame", "backgroundFrame", "sceneryFrame"].forEach(key => {
    state.playMode[key] = remapMovedFrameIndex(state.playMode[key], from, to);
  });
  (state.playMode.visualLayers || []).forEach(item => { item.frame = remapMovedFrameIndex(item.frame, from, to); });
  (state.playMode.props || []).forEach(item => { item.frame = remapMovedFrameIndex(item.frame, from, to); });
  (state.playMode.dialogue?.characters || []).forEach(item => { item.frame = remapMovedFrameIndex(item.frame, from, to); });
  (state.playMode.dialogue?.lines || []).forEach(item => { item.frame = remapMovedFrameIndex(item.frame, from, to); });
}

function reorderFrame(from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from === to || from < 0 || to < 0 || from >= state.frames.length || to >= state.frames.length) return;
  pushHistory();
  const originalActive = state.activeFrame;
  const [moved] = state.frames.splice(from, 1);
  state.frames.splice(to, 0, moved);
  state.activeFrame = remapMovedFrameIndex(originalActive, from, to);
  remapFrameReferencesAfterMove(from, to);
  clampActive();
  renderAll();
  setStatus(`Frame ${from + 1} moved to ${to + 1}. Animation exports now use the Story order.`);
}
// Layer folders
function renderLayers() {
  const list = $("#layers-list"); list.innerHTML = "";
  const f = frame();
  const groups = state.layerGroups || [];
  const layers = f.layers;

  const indexesForGroup = groupId => layers.map((item, index) => item.groupId === groupId ? index : -1).filter(index => index >= 0);
  const looseIndexes = () => layers.map((item, index) => item.groupId ? -1 : index).filter(index => index >= 0);
  const readDragIndex = event => {
    if (layerDragIndex >= 0) return layerDragIndex;
    const raw = event.dataTransfer?.getData("application/x-pixelbug-layer-index") || event.dataTransfer?.getData("text/plain");
    const index = Number(raw);
    return Number.isInteger(index) ? index : -1;
  };
  const finishLayerDrop = (event, toIndex = layers.length, groupId = null) => {
    event.preventDefault();
    event.stopPropagation();
    clearLayerDragMarkers();
    moveDraggedLayer(readDragIndex(event), toIndex, groupId);
  };
  const setDropLook = (event, item) => {
    if (layerDragIndex < 0) return false;
    event.preventDefault();
    event.stopPropagation();
    item.classList.add("drag-over");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    return true;
  };
  list.ondragover = event => {
    if (layerDragIndex < 0) return;
    event.preventDefault();
    list.classList.add("layer-drop-root");
  };
  list.ondragleave = event => { if (!list.contains(event.relatedTarget)) list.classList.remove("layer-drop-root"); };
  list.ondrop = event => {
    if (layerDragIndex < 0 || event.target.closest(".layer-row, .layer-group-row, .layer-drop-shelf")) return;
    finishLayerDrop(event, layers.length, null);
  };

  const renderRow = (l, i, hidden = false, groupId = null) => {
    const row = document.createElement("div");
    row.className = "layer-row" + (i === state.activeLayer ? " active" : "") + (hidden ? " layer-hidden-in-group" : "") + (groupId ? " grouped-layer" : " loose-layer");
    row.hidden = hidden;
    row.draggable = true;
    row.dataset.layerIndex = String(i);
    row.dataset.groupId = groupId || "";
    const grip = document.createElement("span");
    grip.className = "layer-grip";
    grip.textContent = "↕";
    grip.setAttribute("aria-hidden", "true");
    const eye = document.createElement("button");
    eye.className = "layer-eye";
    eye.type = "button";
    eye.setAttribute("aria-label", `Toggle visibility for ${l.name || `Layer ${i + 1}`}`);
    eye.textContent = l.visible ? "●" : "○";
    const input = document.createElement("input");
    input.setAttribute("aria-label", "Layer name");
    input.value = l.name || `Layer ${i + 1}`;
    const pct = document.createElement("small");
    pct.textContent = `${Math.round((l.opacity ?? 1) * 100)}%`;
    row.append(grip, eye, input, pct);
    row.onclick = e => { if (!e.target.classList.contains("layer-eye") && e.target.tagName !== "INPUT") { state.activeLayer = i; syncControls(); renderAll({ persist: false }); } };
    eye.onclick = e => { e.stopPropagation(); pushHistory(); l.visible = !l.visible; renderAll(); };
    input.onchange = e => { pushHistory(); l.name = e.target.value || `Layer ${i+1}`; renderAll(); };
    row.addEventListener("dragstart", event => {
      layerDragIndex = i;
      row.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/x-pixelbug-layer-index", String(i));
      event.dataTransfer.setData("text/plain", String(i));
      setStatus("Drag the layer onto a folder or another layer.");
    });
    row.addEventListener("dragend", () => {
      layerDragIndex = -1;
      row.classList.remove("dragging");
      clearLayerDragMarkers();
    });
    row.addEventListener("dragover", event => setDropLook(event, row));
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", event => {
      const rect = row.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      finishLayerDrop(event, i + (after ? 1 : 0), groupId || null);
    });
    list.appendChild(row);
  };

  groups.forEach(group => {
    const indexes = indexesForGroup(group.id);
    const head = document.createElement("div");
    head.className = "layer-group-row" + (indexes.includes(state.activeLayer) ? " active-group" : "");
    head.dataset.groupId = group.id;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "layer-group-toggle";
    toggle.textContent = group.collapsed ? "▸" : "▾";
    const name = document.createElement("input");
    name.value = group.name || "Folder";
    name.setAttribute("aria-label", "Folder name");
    const count = document.createElement("small");
    count.textContent = `${indexes.length} layer${indexes.length === 1 ? "" : "s"}`;
    const out = document.createElement("button");
    out.type = "button";
    out.textContent = "Empty";
    head.append(toggle, name, count, out);
    list.appendChild(head);
    toggle.onclick = () => { group.collapsed = !group.collapsed; renderLayers(); saveLocal(); };
    name.onchange = e => { pushHistory(); group.name = e.target.value || "Folder"; renderAll(); };
    out.onclick = () => { pushHistory(); indexes.forEach(i => layers[i].groupId = null); renderAll(); setStatus("Folder emptied."); };
    head.addEventListener("dragover", event => setDropLook(event, head));
    head.addEventListener("dragleave", () => head.classList.remove("drag-over"));
    head.addEventListener("drop", event => finishLayerDrop(event, layers.length, group.id));
    indexes.forEach(i => renderRow(layers[i], i, group.collapsed, group.id));
  });

  looseIndexes().forEach(i => renderRow(layers[i], i, false, null));
}

function clearLayerDragMarkers() {
  document.querySelectorAll(".layer-row.drag-over, .layer-group-row.drag-over").forEach(item => item.classList.remove("drag-over"));
  $("#layers-list")?.classList.remove("layer-drop-root");
}

function moveDraggedLayer(from, to, groupId = null) {
  const layers = frame().layers;
  if (!Number.isInteger(from) || from < 0 || from >= layers.length) return;
  const targetGroupId = groupId || null;
  const adjustedTo = Math.max(0, Math.min(Number.isInteger(to) ? to : layers.length, layers.length));
  const sameSpot = (from === adjustedTo || from + 1 === adjustedTo) && layers[from].groupId === targetGroupId;
  if (sameSpot) return;
  pushHistory();
  const [moved] = layers.splice(from, 1);
  moved.groupId = targetGroupId;
  const insertAt = Math.max(0, Math.min(from < adjustedTo ? adjustedTo - 1 : adjustedTo, layers.length));
  layers.splice(insertAt, 0, moved);
  state.activeLayer = insertAt;
  renderAll();
  setStatus(targetGroupId ? "Layer moved into folder." : "Layer moved out of folders.");
}

function addLayerGroup() {
  pushHistory();
  const id = `group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  state.layerGroups.push({ id, name: `Folder ${state.layerGroups.length + 1}`, collapsed: false });
  renderAll();
  setStatus("Folder added. Drag layers into it.");
}
function moveLayerToGroup() {
  const layers = frame().layers;
  if (!layers.length) return;
  const activeIndex = state.activeLayer;
  if (!state.layerGroups.length) {
    pushHistory();
    const id = `group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    state.layerGroups.push({ id, name: "Folder 1", collapsed: false });
  }
  const old = document.querySelector(".layer-move-popover");
  if (old) { old.remove(); return; }
  const panel = document.createElement("div");
  panel.className = "layer-move-popover";
  const title = document.createElement("strong");
  title.textContent = `Move ${layers[activeIndex]?.name || `Layer ${activeIndex + 1}`}`;
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Choose layer folder");
  const loose = document.createElement("option");
  loose.value = "";
  loose.textContent = "No folder";
  select.appendChild(loose);
  state.layerGroups.forEach(group => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name || "Folder";
    option.selected = layers[activeIndex]?.groupId === group.id;
    select.appendChild(option);
  });
  const actions = document.createElement("div");
  actions.className = "layer-move-actions";
  const apply = document.createElement("button");
  apply.type = "button";
  apply.textContent = "Move";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Close";
  actions.append(apply, cancel);
  panel.append(title, select, actions);
  $("#layers-list")?.insertAdjacentElement("afterend", panel);
  select.focus();
  cancel.onclick = () => panel.remove();
  apply.onclick = () => {
    const targetGroupId = select.value || null;
    const targetLayer = frame().layers[activeIndex];
    if (!targetLayer) { panel.remove(); return; }
    if ((targetLayer.groupId || null) === targetGroupId) { panel.remove(); return; }
    pushHistory();
    targetLayer.groupId = targetGroupId;
    renderAll();
    setStatus(targetGroupId ? "Layer moved into folder." : "Layer moved out of folders.");
  };
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
  if (layerBlendModeSelect) layerBlendModeSelect.value = normalizeBlendMode(layer().blendMode);
  syncColorInputs(color);
}


// Image pixelizer
function quantizeChannel(value, levels) {
  if (levels <= 1) return value < 128 ? 0 : 255;
  return Math.round(Math.round((value / 255) * (levels - 1)) * (255 / (levels - 1)));
}
const HEX_PAIRS = Array.from({ length: 256 }, (_value, index) => index.toString(16).padStart(2, "0"));
function rgbToHex(r, g, b) {
  return `#${HEX_PAIRS[Math.max(0, Math.min(255, r))]}${HEX_PAIRS[Math.max(0, Math.min(255, g))]}${HEX_PAIRS[Math.max(0, Math.min(255, b))]}`;
}
function rgbaWord(r, g, b, a = 255) {
  return (a << 24) | (b << 16) | (g << 8) | r;
}
function updatePixelizerLabels() {
  const size = Number(pixelizeSizeInput.value);
  const levels = Number(pixelizeColorsInput.value);
  pixelizeSizeOutput.textContent = `${size} × ${size}`;
  pixelizeColorsOutput.textContent = `${levels} levels`;
}

function pixelizerProjectSize() {
  return Math.max(8, Math.min(512, Math.max(projectWidth(), projectHeight())));
}

function syncPixelizerSizeToProject(force = false) {
  if (!pixelizeSizeInput) return;
  pixelizeSizeInput.max = "512";
  const target = pixelizerProjectSize();
  const current = Number(pixelizeSizeInput.value) || 0;
  if (force || current < target) pixelizeSizeInput.value = String(target);
  updatePixelizerLabels();
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
function ensurePixelizerCanvases(target) {
  if (!pixelizerTmpCanvas) {
    pixelizerTmpCanvas = document.createElement("canvas");
    pixelizerTmpCtx = pixelizerTmpCanvas.getContext("2d", { willReadFrequently: true });
  }
  if (pixelizerTmpCanvas.width !== target || pixelizerTmpCanvas.height !== target) {
    pixelizerTmpCanvas.width = target;
    pixelizerTmpCanvas.height = target;
    pixelizerPreviewBuffer = null;
    pixelizerPreviewImage = null;
    pixelizerPreviewBitmap = null;
  }
}
function makePixelizedPixels() {
  if (!importedImage) return null;
  const target = Math.max(1, Math.min(512, Number(pixelizeSizeInput.value) || pixelizerProjectSize()));
  const levels = Math.max(1, Math.min(256, Number(pixelizeColorsInput.value) || 2));
  const fit = pixelizeFitInput.checked;
  ensurePixelizerCanvases(target);
  const tx = pixelizerTmpCtx;
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
  const out = new Array(target);
  if (!pixelizerPreviewBuffer || pixelizerPreviewBuffer.length !== target * target) pixelizerPreviewBuffer = new Uint32Array(target * target);
  pixelizerPreviewBuffer.fill(0);
  for (let y = 0; y < target; y++) {
    const row = new Array(target);
    const rowOffset = y * target;
    for (let x = 0; x < target; x++) {
      const idx = (rowOffset + x) * 4;
      const a = data.data[idx + 3];
      if (a < 20) { row[x] = null; continue; }
      const r = quantizeChannel(data.data[idx], levels);
      const g = quantizeChannel(data.data[idx + 1], levels);
      const b = quantizeChannel(data.data[idx + 2], levels);
      row[x] = rgbToHex(r, g, b);
      pixelizerPreviewBuffer[rowOffset + x] = rgbaWord(r, g, b);
    }
    out[y] = row;
  }
  pixelizerPreviewImage = new ImageData(new Uint8ClampedArray(pixelizerPreviewBuffer.buffer), target, target);
  return out;
}
function drawPixelizerPreview() {
  updatePixelizerLabels();
  pixelizedPixels = makePixelizedPixels();
  pixelizePreviewCtx.imageSmoothingEnabled = false;
  pixelizePreviewCtx.clearRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  pixelizePreviewCtx.fillStyle = canvasBackgroundColor();
  pixelizePreviewCtx.fillRect(0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
  if (!pixelizedPixels || !pixelizerPreviewImage) return clearPixelizerPreview();
  const size = pixelizedPixels.length;
  ensurePixelizerCanvases(size);
  pixelizerTmpCtx.putImageData(pixelizerPreviewImage, 0, 0);
  pixelizePreviewCtx.drawImage(pixelizerTmpCanvas, 0, 0, pixelizePreviewCanvas.width, pixelizePreviewCanvas.height);
}
function schedulePixelizerPreview() {
  updatePixelizerLabels();
  if (!importedImage) return;
  cancelAnimationFrame(pixelizerFrame);
  pixelizerFrame = requestAnimationFrame(drawPixelizerPreview);
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
  const importedWidth = pixelizedPixels[0]?.length || pixelizedPixels.length;
  const importedHeight = pixelizedPixels.length;
  layer().pixels = resamplePixelsToProject(pixelizedPixels, projectWidth(), projectHeight());
  layer().sourceWidth = importedWidth;
  layer().sourceHeight = importedHeight;
  layer().sourceSize = Math.max(importedWidth, importedHeight);
  layer().sourcePixels = clone(pixelizedPixels);
  const colors = new Set(state.palette.map(c => c.toLowerCase()));
  pixelizedPixels.flat().forEach(c => { if (c && !colors.has(c.toLowerCase()) && state.palette.length < 64) { colors.add(c.toLowerCase()); state.palette.push(c); } });
  renderAll();
  setStatus(`Pixelized image imported at ${importedWidth} × ${importedHeight}.`);
}
function loadImageFile(file) {
  if (!file) return;
  if (file.size > MAX_IMPORT_FILE_BYTES) { setStatus("Image file too large."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      if ((img.naturalWidth || img.width) * (img.naturalHeight || img.height) > MAX_IMAGE_SOURCE_PIXELS) { setStatus("Image dimensions are too large."); return; }
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
  syncPixelizerSizeToProject();
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
  if (voxelPreviewStep() > 1 && !voxelSimplifiedStatusShown) { voxelSimplifiedStatusShown = true; setStatus(`Voxel preview simplified for ${state.size} by ${state.size}.`); }
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

// Blender export
function voxelExportMetadata(kind) {
  return {
    type: kind,
    app: "Pixel Bug",
    version: "1.0",
    canvasSize: state.size,
    previewSize: voxelPreviewSize(),
    previewStep: voxelPreviewStep(),
    voxelDepth: Number(voxelDepthInput.value),
    depthMode: voxelDepthModeSelect.value,
    mergedGeometry: voxelMergeInput.checked,
    exportedAt: new Date().toISOString()
  };
}

function voxelPixelsForFrame(sourceFrame) {
  const step = voxelPreviewStep();
  const baseDepth = Number(voxelDepthInput.value);
  const layers = sourceFrame.layers;
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
          cubes.push({ x: Math.floor(x / step), y: Math.floor(y / step), z: layerIndex * slice, w: 1, h: 1, color: colorValue, depth: slice });
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

  return voxelMergeInput.checked ? mergeVoxelRects(cubes) : cubes;
}

function blenderVoxelCubes(sourceFrame = frame()) {
  const size = voxelPreviewSize();
  return voxelPixelsForFrame(sourceFrame).filter(cube => cube.color && isHexColor(cube.color)).map((cube, index) => {
    const w = cube.w || 1;
    const h = cube.h || 1;
    const depth = cube.depth || 1;
    const x0 = cube.x - size / 2;
    const y0 = size / 2 - cube.y;
    const z0 = cube.z || 0;
    return {
      id: index + 1,
      x: cube.x,
      y: cube.y,
      z: cube.z || 0,
      w,
      h,
      depth,
      color: cube.color.toLowerCase(),
      position: [x0 + w / 2, y0 - h / 2, z0 + depth / 2],
      scale: [w, h, depth]
    };
  });
}

function blenderAnimationFrames() {
  return state.frames.map((item, index) => ({
    index,
    duration: item.duration,
    cubes: blenderVoxelCubes(item)
  }));
}

function buildVoxelNodesJSON() {
  const cubes = blenderVoxelCubes();
  const palette = [...new Set(cubes.map(cube => cube.color))].sort();
  return JSON.stringify({
    ...voxelExportMetadata("pixelbug-geometry-nodes"),
    description: "Point-style voxel data for Blender Geometry Nodes import.",
    attributes: {
      position: "Center position in Blender units.",
      scale: "Per-instance cube scale in Blender units.",
      color: "Hex color for material or color attribute."
    },
    palette,
    activeFrame: state.activeFrame,
    frames: blenderAnimationFrames(),
    cubes
  }, null, 2);
}

async function exportVoxelNodesJSON() {
  const res = await window.pixelBug.saveFile({
    title: "Export Blender Geometry Nodes Data",
    defaultPath: "pixel-bug-geometry-nodes.json",
    filters: [{ name: "Blender Geometry Nodes JSON", extensions: ["json"] }],
    data: buildVoxelNodesJSON()
  });
  setStatus(res.ok ? "Geometry Nodes JSON exported." : "Save cancelled.");
}

// Grease export
function cubeGreaseStroke(cube) {
  const x0 = cube.position[0] - cube.scale[0] / 2;
  const x1 = cube.position[0] + cube.scale[0] / 2;
  const y0 = cube.position[1] - cube.scale[1] / 2;
  const y1 = cube.position[1] + cube.scale[1] / 2;
  const z = cube.z + cube.depth + 0.02;
  return {
    id: cube.id,
    color: cube.color,
    fill: cube.color,
    points: [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]]
  };
}

function buildVoxelGreaseJSON() {
  const cubes = blenderVoxelCubes();
  const strokes = cubes.map(cubeGreaseStroke);
  const frames = blenderAnimationFrames().map(item => ({
    index: item.index,
    duration: item.duration,
    strokes: item.cubes.map(cubeGreaseStroke)
  }));
  return JSON.stringify({
    ...voxelExportMetadata("pixelbug-grease-pencil"),
    description: "Flat top-face strokes for Blender Grease Pencil tracing, inking, or 2.5D cleanup.",
    activeFrame: state.activeFrame,
    frames,
    strokes
  }, null, 2);
}

async function exportVoxelGreaseJSON() {
  const res = await window.pixelBug.saveFile({
    title: "Export Blender Grease Pencil Data",
    defaultPath: "pixel-bug-grease-pencil.json",
    filters: [{ name: "Blender Grease Pencil JSON", extensions: ["json"] }],
    data: buildVoxelGreaseJSON()
  });
  setStatus(res.ok ? "Grease Pencil JSON exported." : "Save cancelled.");
}

// Blender pack
function blenderImporterScript() {
  return "bl_info = {\n    \"name\": \"Pixel Bug Blender Bridge\",\n    \"author\": \"Pixel Bug\",\n    \"version\": (1, 1, 0),\n    \"blender\": (3, 6, 0),\n    \"location\": \"File > Import > Pixel Bug JSON\",\n    \"description\": \"Imports Pixel Bug voxel JSON, Geometry Nodes point carriers, and Grease Pencil-friendly stroke exports.\",\n    \"category\": \"Import-Export\",\n}\n\nimport json\nimport os\nimport bpy\nfrom bpy_extras.io_utils import ImportHelper\nfrom bpy.props import BoolProperty, EnumProperty, FloatProperty, StringProperty\n\n\n# Color tools\ndef hex_to_rgba(value):\n    clean = str(value or \"#ffffff\").strip().lstrip(\"#\")\n    if len(clean) != 6:\n        return (1.0, 1.0, 1.0, 1.0)\n    try:\n        return tuple(int(clean[i:i + 2], 16) / 255 for i in (0, 2, 4)) + (1.0,)\n    except ValueError:\n        return (1.0, 1.0, 1.0, 1.0)\n\n\n# Material tools\ndef material_for_color(hex_color, emission=False):\n    name = f\"PB_{str(hex_color).strip().lstrip('#').upper()}\"\n    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)\n    mat.diffuse_color = hex_to_rgba(hex_color)\n    mat.use_nodes = True\n    nodes = mat.node_tree.nodes\n    bsdf = nodes.get(\"Principled BSDF\")\n    if bsdf:\n        rgba = hex_to_rgba(hex_color)\n        bsdf.inputs[\"Base Color\"].default_value = rgba\n        if \"Emission Color\" in bsdf.inputs:\n            bsdf.inputs[\"Emission Color\"].default_value = rgba if emission else (0.0, 0.0, 0.0, 1.0)\n        if \"Emission Strength\" in bsdf.inputs:\n            bsdf.inputs[\"Emission Strength\"].default_value = 0.35 if emission else 0.0\n    return mat\n\n\n# Mesh tools\ndef create_cube_mesh(name, cubes, bevel=0.0, emission=False):\n    verts = []\n    faces = []\n    mat_slots = []\n    for cube in cubes:\n        cx, cy, cz = cube.get(\"position\", [0, 0, 0])\n        sx, sy, sz = cube.get(\"scale\", [1, 1, 1])\n        x0, x1 = cx - sx / 2, cx + sx / 2\n        y0, y1 = cy - sy / 2, cy + sy / 2\n        z0, z1 = cz - sz / 2, cz + sz / 2\n        start = len(verts)\n        verts.extend([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)])\n        faces.extend([(start, start + 1, start + 2, start + 3), (start + 4, start + 7, start + 6, start + 5), (start, start + 4, start + 5, start + 1), (start + 1, start + 5, start + 6, start + 2), (start + 2, start + 6, start + 7, start + 3), (start + 3, start + 7, start + 4, start)])\n        mat_slots.extend([cube.get(\"color\", \"#ffffff\")] * 6)\n    mesh = bpy.data.meshes.new(name)\n    mesh.from_pydata(verts, [], faces)\n    mesh.update()\n    obj = bpy.data.objects.new(name, mesh)\n    bpy.context.collection.objects.link(obj)\n    colors = []\n    for color in mat_slots:\n        if color not in colors:\n            colors.append(color)\n            obj.data.materials.append(material_for_color(color, emission))\n    index_map = {color: index for index, color in enumerate(colors)}\n    for poly, color in zip(obj.data.polygons, mat_slots):\n        poly.material_index = index_map[color]\n    if bevel > 0:\n        mod = obj.modifiers.new(\"Pixel Bug Bevel\", \"BEVEL\")\n        mod.width = bevel\n        mod.segments = 2\n        obj.modifiers.new(\"Pixel Bug Weighted Normals\", \"WEIGHTED_NORMAL\")\n    return obj\n\n\n# Point tools\ndef create_point_carrier(name, cubes):\n    mesh = bpy.data.meshes.new(name)\n    verts = [tuple(cube.get(\"position\", [0, 0, 0])) for cube in cubes]\n    mesh.from_pydata(verts, [], [])\n    mesh.update()\n    obj = bpy.data.objects.new(name, mesh)\n    bpy.context.collection.objects.link(obj)\n    obj[\"pixelbug_hint\"] = \"Use these vertices as Geometry Nodes points. Scale, color, and depth arrays are stored as custom properties.\"\n    obj[\"pb_scales\"] = [value for cube in cubes for value in cube.get(\"scale\", [1, 1, 1])]\n    obj[\"pb_colors\"] = [cube.get(\"color\", \"#ffffff\") for cube in cubes]\n    obj[\"pb_depths\"] = [cube.get(\"depth\", 1) for cube in cubes]\n    try:\n        obj.modifiers.new(\"Pixel Bug Geometry Nodes\", \"NODES\")\n    except Exception:\n        pass\n    return obj\n\n\n# Stroke tools\ndef create_curve_strokes(name, strokes, emission=False, parent=None):\n    collection = bpy.data.collections.new(name)\n    if parent:\n        parent.children.link(collection)\n    else:\n        bpy.context.scene.collection.children.link(collection)\n    for index, stroke in enumerate(strokes, start=1):\n        curve = bpy.data.curves.new(f\"PB_Stroke_{stroke.get('id', index)}\", \"CURVE\")\n        curve.dimensions = \"3D\"\n        curve.resolution_u = 1\n        curve.fill_mode = \"FULL\"\n        curve.bevel_depth = 0.015\n        spline = curve.splines.new(\"POLY\")\n        points = stroke.get(\"points\", [])\n        spline.points.add(max(0, len(points) - 1))\n        for point, co in zip(spline.points, points):\n            point.co = (co[0], co[1], co[2], 1.0)\n        obj = bpy.data.objects.new(curve.name, curve)\n        obj.data.materials.append(material_for_color(stroke.get(\"color\", \"#ffffff\"), emission))\n        collection.objects.link(obj)\n    return collection\n\n\n# Grease tools\ndef create_grease_reference(name, strokes, emission=False, frames=None):\n    # Blender 3.x and 4.x use different Grease Pencil APIs, so curves are the stable import target.\n    # The resulting curves can be converted to Grease Pencil inside Blender when needed.\n    if frames:\n        root = bpy.data.collections.new(name)\n        bpy.context.scene.collection.children.link(root)\n        for item in frames:\n            frame_collection = create_curve_strokes(f\"{name}_Frame_{item.get('index', 0) + 1}\", item.get(\"strokes\", []), emission, root)\n            hide = item.get(\"index\", 0) != 0\n            frame_collection.hide_viewport = hide\n            frame_collection.hide_render = hide\n        return root\n    return create_curve_strokes(name, strokes, emission)\n\n\n# Import operator\nclass PIXELBUG_OT_import_json(bpy.types.Operator, ImportHelper):\n    bl_idname = \"import_scene.pixelbug_json\"\n    bl_label = \"Import Pixel Bug JSON\"\n    bl_options = {\"REGISTER\", \"UNDO\"}\n\n    filename_ext = \".json\"\n    filter_glob: StringProperty(default=\"*.json\", options={\"HIDDEN\"})\n    import_mode: EnumProperty(\n        name=\"Import Mode\",\n        items=(\n            (\"AUTO\", \"Auto\", \"Choose from the Pixel Bug file type\"),\n            (\"MESH\", \"Voxel Mesh\", \"Create editable colored cube geometry\"),\n            (\"POINTS\", \"Geometry Nodes Points\", \"Create a point carrier for Geometry Nodes\"),\n            (\"BOTH\", \"Mesh + Points\", \"Create editable mesh plus point carrier\"),\n            (\"GREASE\", \"Grease Pencil Reference\", \"Create Grease Pencil-friendly curve strokes\"),\n            (\"ANIMATION\", \"Animation Frames\", \"Create frame collections for Pixel Bug animation data\"),\n        ),\n        default=\"AUTO\",\n    )\n    bevel_width: FloatProperty(name=\"Bevel Width\", default=0.0, min=0.0, max=0.5)\n    use_emission: BoolProperty(name=\"Use Emission Materials\", default=False)\n\n    def execute(self, context):\n        with open(self.filepath, \"r\", encoding=\"utf-8\") as handle:\n            data = json.load(handle)\n        kind = data.get(\"type\", \"\")\n        if kind == \"pixelbug-blender-pack\":\n            files = data.get(\"files\", {})\n            target = files.get(\"greasePencil\") if self.import_mode == \"GREASE\" else files.get(\"nodes\")\n            if not target:\n                self.report({\"ERROR\"}, \"Pack for Blender is missing the requested file entry.\")\n                return {\"CANCELLED\"}\n            target_path = os.path.join(os.path.dirname(self.filepath), target)\n            try:\n                with open(target_path, \"r\", encoding=\"utf-8\") as handle:\n                    data = json.load(handle)\n            except OSError:\n                self.report({\"ERROR\"}, f\"Could not find bundled file: {target}\")\n                return {\"CANCELLED\"}\n            kind = data.get(\"type\", \"\")\n        cubes = data.get(\"cubes\", [])\n        strokes = data.get(\"strokes\", [])\n        if kind == \"pixelbug-geometry-nodes\":\n            mode = self.import_mode\n            frames = data.get(\"frames\", [])\n            if mode == \"ANIMATION\" and frames:\n                root = bpy.data.collections.new(\"PixelBug_Animation_Frames\")\n                bpy.context.scene.collection.children.link(root)\n                for item in frames:\n                    obj = create_cube_mesh(f\"PixelBug_Frame_{item.get('index', 0) + 1}\", item.get(\"cubes\", []), self.bevel_width, self.use_emission)\n                    for collection in obj.users_collection:\n                        collection.objects.unlink(obj)\n                    root.objects.link(obj)\n                    hide = item.get(\"index\", 0) != data.get(\"activeFrame\", 0)\n                    obj.hide_viewport = hide\n                    obj.hide_render = hide\n                return {\"FINISHED\"}\n            if mode in {\"AUTO\", \"BOTH\"}:\n                create_cube_mesh(\"PixelBug_Voxel_Mesh\", cubes, self.bevel_width, self.use_emission)\n                create_point_carrier(\"PixelBug_Geometry_Nodes_Points\", cubes)\n            elif mode == \"MESH\":\n                create_cube_mesh(\"PixelBug_Voxel_Mesh\", cubes, self.bevel_width, self.use_emission)\n            elif mode == \"POINTS\":\n                create_point_carrier(\"PixelBug_Geometry_Nodes_Points\", cubes)\n            else:\n                self.report({\"ERROR\"}, \"Selected mode is not valid for Geometry Nodes JSON.\")\n                return {\"CANCELLED\"}\n            return {\"FINISHED\"}\n        if kind == \"pixelbug-grease-pencil\":\n            create_grease_reference(\"PixelBug_Grease_Pencil_Reference\", strokes, self.use_emission, data.get(\"frames\") if self.import_mode == \"ANIMATION\" else None)\n            return {\"FINISHED\"}\n        self.report({\"ERROR\"}, \"Unsupported Pixel Bug JSON type.\")\n        return {\"CANCELLED\"}\n\n\n# Menu tools\ndef menu_func_import(self, context):\n    self.layout.operator(PIXELBUG_OT_import_json.bl_idname, text=\"Pixel Bug JSON (.json)\")\n\n\n# Register tools\ndef register():\n    bpy.utils.register_class(PIXELBUG_OT_import_json)\n    bpy.types.TOPBAR_MT_file_import.append(menu_func_import)\n\n\n# Remove tools\ndef unregister():\n    bpy.types.TOPBAR_MT_file_import.remove(menu_func_import)\n    bpy.utils.unregister_class(PIXELBUG_OT_import_json)\n\n\nif __name__ == \"__main__\":\n    register()\n";
}

function blenderReadmeText() {
  return "# Pixel Bug Blender Bridge\n\nThis folder contains optional Blender integration files for Pixel Bug exports.\n\n## Files\n\n- `pixelbug_blender_importer.py` installs into Blender as an import add-on.\n- Geometry Nodes JSON exports contain voxel point, scale, depth, and palette data.\n- Grease Pencil JSON exports contain stroke-friendly outlines for Blender cleanup or animation.\n- Pack for Blender exports the Nodes JSON, Grease Pencil JSON, metadata, palette, and importer docs together so Blender import setup is easier.\n\n## Install the importer\n\n1. Open Blender.\n2. Go to Edit > Preferences > Add-ons.\n3. Choose Install.\n4. Select `pixelbug_blender_importer.py`.\n5. Enable \"Pixel Bug Blender Bridge\".\n\n## Use it\n\n1. In Pixel Bug, open Voxel Preview.\n2. Export one of these:\n   - Export 3D Model: original OBJ/MTL mesh path.\n   - Export Nodes JSON: point-style voxel data for procedural Blender workflows.\n   - Export Grease Pencil: stroke-friendly JSON for 2D/2.5D Blender work.\n   - Pack for Blender: saves the Nodes JSON, Grease Pencil JSON, metadata, palette, and importer files together.\n3. In Blender, use File > Import > Pixel Bug JSON.\n\n## Notes\n\nPack for Blender is not redundant with the separate exports. The separate buttons are quick single-purpose files; Pack for Blender is the handoff bundle for setting up a full Blender workspace.\n\nThe Geometry Nodes JSON keeps Pixel Bug data as positions, scales, colors, depth values, and frame data. The importer creates a point carrier, can create an editable mesh preview, and can build per-frame collections for animation cleanup.\n\nThe Grease Pencil export currently imports as curve strokes because Blender's Grease Pencil Python API differs between Blender versions. These curves are Grease Pencil-friendly references and can be converted or traced in Blender. Animation mode creates one collection per Pixel Bug frame.\n";
}


function buildBlenderPackMetadata() {
  return {
    ...voxelExportMetadata("pixelbug-blender-pack"),
    description: "Blender handoff bundle containing Nodes JSON, Grease Pencil JSON, palette, metadata, and importer docs.",
    packageVersion: "1.0",
    appVersion: "1.3.12",
    files: {
      nodes: "pixel-bug-geometry-nodes.json",
      greasePencil: "pixel-bug-grease-pencil.json",
      palette: "pixel-bug-palette.json",
      importer: "pixelbug_blender_importer.py",
      readme: "README_PIXELBUG_BLENDER.md"
    }
  };
}

function buildBlenderPaletteJSON() {
  const colors = Array.from(new Set([...(state.palette || []), ...blenderVoxelCubes().map(cube => cube.color)].filter(isHexColor)));
  return {
    type: "pixelbug-blender-palette",
    appVersion: "1.3.12",
    colors,
    activeColor: isHexColor(color) ? color : colors[0] || "#000000",
    presets: Array.isArray(state.palettePresets) ? state.palettePresets.map(preset => ({
      name: preset.name || "Palette",
      colors: Array.isArray(preset.colors) ? preset.colors.filter(isHexColor) : []
    })) : []
  };
}

async function exportBlenderPack() {
  const nodesData = buildVoxelNodesJSON();
  const greaseData = buildVoxelGreaseJSON();
  const packData = buildBlenderPackMetadata();
  const res = await window.pixelBug.saveFile({
    title: "Pack for Blender",
    defaultPath: "pixel-bug-blender-pack.json",
    filters: [{ name: "Pixel Bug Blender Pack", extensions: ["json"] }],
    data: JSON.stringify(packData, null, 2),
    extraFiles: [
      { filename: "pixel-bug-geometry-nodes.json", data: nodesData },
      { filename: "pixel-bug-grease-pencil.json", data: greaseData },
      { filename: "pixel-bug-palette.json", data: JSON.stringify(buildBlenderPaletteJSON(), null, 2) },
      { filename: "pixelbug_blender_importer.py", data: blenderImporterScript() },
      { filename: "README_PIXELBUG_BLENDER.md", data: blenderReadmeText() }
    ]
  });
  setStatus(res.ok ? "Blender pack exported with Nodes JSON, Grease Pencil JSON, palette, and importer." : "Save cancelled.");
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
function flattenedPixels(f) {
  const c = document.createElement("canvas");
  c.width = projectWidth();
  c.height = projectHeight();
  const cx = c.getContext("2d", { willReadFrequently: true });
  cx.imageSmoothingEnabled = false;
  drawCompositedFrame(f, 1, cx);
  const data = cx.getImageData(0, 0, c.width, c.height).data;
  const out = blankPixels(projectWidth(), projectHeight());
  for (let y = 0; y < projectHeight(); y++) for (let x = 0; x < projectWidth(); x++) {
    const idx = (y * projectWidth() + x) * 4;
    if (data[idx + 3] < 20) continue;
    out[y][x] = rgbToHex(data[idx], data[idx + 1], data[idx + 2]);
  }
  return out;
}
function pixelsToCanvas(pixels, scale=1) { const c = document.createElement("canvas"); c.width = projectWidth() * scale; c.height = projectHeight() * scale; const cx = c.getContext("2d"); cx.imageSmoothingEnabled = false; for (let y=0;y<projectHeight();y++) for (let x=0;x<projectWidth();x++) if (pixels[y]?.[x]) { cx.fillStyle = pixels[y][x]; cx.fillRect(x*scale,y*scale,scale,scale); } return c; }
function dataUrlBase64(url) { return url.replace(/^data:image\/\w+;base64,/, ""); }
async function exportPNG() { const c = pixelsToCanvas(flattenedPixels(frame()), 1); await saveBase64("Export PNG", "pixel-bug-frame.png", "PNG Image", "png", dataUrlBase64(c.toDataURL("image/png"))); }

// Export order
function animationFramesForExport() { return state.frames; }
async function exportSheet() { const exportFrames = animationFramesForExport(); const sheet = document.createElement("canvas"); sheet.width = projectWidth() * exportFrames.length; sheet.height = projectHeight(); const sx = sheet.getContext("2d"); sx.imageSmoothingEnabled = false; exportFrames.forEach((f,i)=>sx.drawImage(pixelsToCanvas(flattenedPixels(f),1), i*projectWidth(), 0)); await saveBase64("Export Spritesheet", "pixel-bug-sheet.png", "PNG Image", "png", dataUrlBase64(sheet.toDataURL("image/png"))); }
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
async function exportGIF() { const gifBytes = encodeGif(animationFramesForExport().map(f => ({ pixels: flattenedPixels(f), delay: Math.max(2, Math.round(f.duration / 10)) })), projectWidth(), projectHeight()); const b64 = bytesToBase64(gifBytes); await saveBase64("Export Animated GIF", "pixel-bug-animation.gif", "GIF Image", "gif", b64); }
function bytesToBase64(bytes) { let bin=""; bytes.forEach(b=>bin+=String.fromCharCode(b)); return btoa(bin); }
function base64ToBytes(text) { return Uint8Array.from(atob(text), ch => ch.charCodeAt(0)); }

// CRC table
const pngCrcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

// PNG metadata
function pngCrc32(bytes, start, length) {
  let c = 0xffffffff;
  for (let i = start; i < start + length; i++) c = pngCrcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Byte writing
function writeUint32(bytes, offset, value) {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
}

// Chunk writing
function makePngChunk(type, data) {
  const typeBytes = Uint8Array.from(type, ch => ch.charCodeAt(0));
  const chunk = new Uint8Array(12 + data.length);
  writeUint32(chunk, 0, data.length);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  writeUint32(chunk, 8 + data.length, pngCrc32(chunk, 4, 4 + data.length));
  return chunk;
}

// PNG density
function addPngDpiMetadata(base64, dpi) {
  const bytes = base64ToBytes(base64);
  if (bytes.length < 33 || bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) return base64;
  const pixelsPerMeter = Math.max(1, Math.round(dpi / 0.0254));
  const physData = new Uint8Array(9);
  writeUint32(physData, 0, pixelsPerMeter);
  writeUint32(physData, 4, pixelsPerMeter);
  physData[8] = 1;
  const physChunk = makePngChunk("pHYs", physData);
  const chunks = [bytes.slice(0, 8)];
  let offset = 8;
  let inserted = false;
  while (offset + 12 <= bytes.length) {
    const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const end = offset + 12 + length;
    if (end > bytes.length) return base64;
    if (type === "pHYs") {
      if (!inserted) { chunks.push(physChunk); inserted = true; }
    } else {
      chunks.push(bytes.slice(offset, end));
      if (type === "IHDR" && !inserted) { chunks.push(physChunk); inserted = true; }
    }
    offset = end;
  }
  const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(size);
  let writeAt = 0;
  for (const chunk of chunks) { output.set(chunk, writeAt); writeAt += chunk.length; }
  return bytesToBase64(output);
}

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
const DOCK_CARD_SELECTOR = ".rearrange-zone > .dock-card[data-dock-id], .rearrange-zone > .play-card[data-dock-id]";
let rearrangeMode = false;
let draggedDockCard = null;
let autoScrollFrame = null;
let latestDragEvent = null;

function dockZones() {
  return Array.from(document.querySelectorAll(".rearrange-zone"));
}

function dockCards() {
  return dockZones().flatMap(zone => Array.from(zone.querySelectorAll(DOCK_CARD_SELECTOR)));
}

function saveDockLayout() {
  const layout = {};
  dockZones().forEach(zone => {
    layout[zone.dataset.zone] = Array.from(zone.querySelectorAll(DOCK_CARD_SELECTOR)).map(card => card.dataset.dockId);
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
  setStatus(enabled ? "Rearrange individual Play Mode sections or side-panel blocks. Canvas stays fixed." : "Layout saved.");
  if (!enabled) saveDockLayout();
}

function canDropCardInZone(card, zone) {
  const isPlayCard = card?.classList.contains("play-card");
  return zone?.dataset.zone === "play" ? isPlayCard : !isPlayCard;
}

function cardAfterPointer(zone, x, y) {
  const cards = Array.from(zone.querySelectorAll(DOCK_CARD_SELECTOR)).filter(card => !card.classList.contains("dragging"));
  if (!cards.length) return null;

  if (zone.dataset.zone === "play") {
    return cards.reduce((closest, card) => {
      const box = card.getBoundingClientRect();
      const offsetY = y - box.top - box.height / 2;
      const offsetX = x - box.left - box.width / 2;
      const offset = offsetY * 10000 + offsetX;
      if (offset < 0 && offset > closest.offset) return { offset, card };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY, card: null }).card;
  }

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
  dockCards().forEach(card => card.draggable = rearrangeMode);

  dockZones().forEach(zone => {
    zone.addEventListener("dragstart", event => {
      const card = event.target.closest(DOCK_CARD_SELECTOR);
      if (!card || !zone.contains(card) || !rearrangeMode) return event.preventDefault();
      draggedDockCard = card;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.dockId || "dock-card");
      setStatus(card.classList.contains("play-card") ? "Drag one Play Mode section, like Actor Frames or Scene Size, into a new order." : "Drag blocks within or between the sidebars.");
    });

    zone.addEventListener("dragend", event => {
      const card = event.target.closest(DOCK_CARD_SELECTOR);
      if (card) card.classList.remove("dragging");
      dockCards().forEach(item => item.classList.remove("drag-over"));
      draggedDockCard = null;
      stopDockAutoScroll();
      if (rearrangeMode) saveDockLayout();
    });

    zone.addEventListener("dragenter", event => {
      if (!rearrangeMode || !draggedDockCard || !canDropCardInZone(draggedDockCard, zone)) return;
      event.preventDefault();
      zone.classList.add("zone-ready");
    });

    zone.addEventListener("dragleave", event => {
      if (!zone.contains(event.relatedTarget)) zone.classList.remove("zone-ready");
    });

    zone.addEventListener("dragover", event => {
      if (!rearrangeMode || !draggedDockCard || !canDropCardInZone(draggedDockCard, zone)) return;
      event.preventDefault();
      latestDragEvent = event;
      if (!autoScrollFrame) autoScrollFrame = requestAnimationFrame(runDockAutoScroll);

      const after = cardAfterPointer(zone, event.clientX, event.clientY);
      if (after == null) zone.appendChild(draggedDockCard);
      else zone.insertBefore(draggedDockCard, after);
    });

    zone.addEventListener("drop", event => {
      if (!rearrangeMode || !draggedDockCard || !canDropCardInZone(draggedDockCard, zone)) return;
      event.preventDefault();
      zone.classList.remove("zone-ready");
      saveDockLayout();
    });
  });
}



// Modal controls
function openPixelizerModal() {
  syncPixelizerSizeToProject();
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
  const stampCurlSpacing = cleanPrintNumber(printStampCurlSpacingInput, 0.06, 0.02, 0.3);
  const stampCurlDepth = cleanPrintNumber(printStampCurlDepthInput, 0.028, 0.005, 0.15);
  const stampEdgeDifference = cleanPrintNumber(printStampEdgeDifferenceInput, 0.5, 0, 1);
  const stampTeeth = Math.round(cleanPrintNumber(printStampTeethInput, 10, 4, 32));
  const stampRoundness = cleanPrintNumber(printStampRoundnessInput, 0.85, 0.35, 1.4);
  const stampMirrorVertical = !!printStampMirrorVerticalInput?.checked;
  const pageSize = printPageSizeSelect?.value || "none";
  const pagePreset = pageSize === "letter" ? [8.5, 11] : pageSize === "a4" ? [8.27, 11.69] : null;
  const pageWidth = pagePreset ? pagePreset[0] : cleanPrintNumber(printPageWidthInput, 8.5, 1, 60);
  const pageHeight = pagePreset ? pagePreset[1] : cleanPrintNumber(printPageHeightInput, 11, 1, 60);
  const pageMargin = cleanPrintNumber(printPageMarginInput, 0.25, 0, 2);
  const resampleMode = printResampleModeSelect?.value || "crisp";
  const showArt = printShowArtInput?.checked !== false;
  const showGuides = printShowGuidesInput?.checked !== false;
  const showCutline = printShowCutlineInput?.checked !== false;
  return { dpi, artWidth, bleed, safe, stripWidth, stripHeight, stickerCols, stickerRows, stickerGap, memoHeight, stampCurlSpacing, stampCurlDepth, stampEdgeDifference, stampTeeth, stampRoundness, stampMirrorVertical, pageSize, pageWidth, pageHeight, pageMargin, resampleMode, showArt, showGuides, showCutline, mode: printRepeatSelect.value, templateSize: !!printTemplateSizeInput?.checked, templatePlacement: printTemplatePlacementSelect?.value || "guide" };
}

function printUsesSheet(settings) {
  return settings.pageSize && settings.pageSize !== "none";
}

function sourcePrintDpi(settings, sourceCanvas) {
  return Math.round(sourceCanvas.width / Math.max(0.01, settings.artWidth));
}

function printWarnings(settings, output, sourceCanvas) {
  const warnings = [];
  const effectiveDpi = sourcePrintDpi(settings, sourceCanvas);
  if (effectiveDpi < 300 && settings.resampleMode === "smooth") warnings.push(`source art is ${effectiveDpi} DPI at this size`);
  if (settings.bleed < 0.0625 && ["single", "sticker"].includes(settings.mode)) warnings.push("bleed is under 1/16 in");
  if (output.width > 12000 || output.height > 12000) warnings.push("large export may save slowly");
  return warnings;
}

function drawPrintTile(ctxTarget, sourceCanvas, x, y, w, h, settings = null) {
  ctxTarget.imageSmoothingEnabled = settings?.resampleMode === "smooth";
  ctxTarget.drawImage(sourceCanvas, x, y, w, h);
}

function scaledStickerCanvas(sourceCanvas, sizePx, borderPx, settings = null) {
  const output = document.createElement("canvas");
  output.width = sizePx + borderPx * 2;
  output.height = sizePx + borderPx * 2;
  const out = output.getContext("2d");
  out.imageSmoothingEnabled = settings?.resampleMode === "smooth";
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


// Stamp helpers
function stampWashiLayout(settings, width, height) {
  const margin = Math.round(settings.safe * settings.dpi);
  const stripTop = Math.max(0, margin);
  const stripHeight = Math.max(1, height - margin * 2);
  const stampSize = stripHeight;
  const imageInset = stampWashiBorder(stampSize, settings.dpi);
  const artSize = Math.max(1, stampSize - imageInset * 2);
  const stamps = [];
  for (let x = 0; x < width; x += stampSize) {
    stamps.push({ x, y: stripTop, size: stampSize, inset: imageInset, artSize });
  }
  return { x: 0, y: stripTop, width, height: stripHeight, stampSize, stamps };
}

function stampWashiBorder(size, dpi) {
  return Math.max(8, Math.min(Math.round(size * 0.14), Math.round(dpi * 0.08)));
}

function stampWashiEdgeOptions(settings, length, stampSize = 0) {
  const requestedSpacing = Math.max(4, Math.round((settings.stampCurlSpacing || 0.06) * settings.dpi));
  const edgeDifference = Math.max(0, Math.min(1, settings.stampEdgeDifference ?? 0.5));
  const roundness = Math.max(0.35, Math.min(1.4, settings.stampRoundness ?? 0.85));
  const teeth = Math.max(4, Math.min(32, Math.round(settings.stampTeeth || 10)));
  const count = stampSize > 0 ? Math.max(1, Math.round(length / stampSize) * teeth) : Math.max(2, Math.round(length / requestedSpacing));
  const spacing = length / count;
  const maxDepth = Math.max(1, Math.floor(spacing * 0.42));
  const depth = Math.max(1, Math.min(Math.round((settings.stampCurlDepth || 0.028) * settings.dpi), maxDepth));
  return { spacing, depth, edgeDifference, roundness, teeth, count };
}

function stampWashiEdgePhase(options, index, mirrored = false) {
  const order = mirrored ? options.count - index - 1 : index;
  return (order % 2 === 0 ? 1 : -1) * options.depth * options.edgeDifference * 0.2;
}

function drawStampWashiHorizontalEdge(ctxTarget, x, y, width, options, side) {
  const top = side === "top";
  const sign = top ? 1 : -1;
  for (let i = 0; i < options.count; i++) {
    const sx = x + options.spacing * i;
    const ex = i === options.count - 1 ? x + width : x + options.spacing * (i + 1);
    const mx = (sx + ex) / 2;
    const depth = options.depth + stampWashiEdgePhase(options, i, !top);
    const handle = (ex - sx) * options.roundness * 0.28;
    ctxTarget.bezierCurveTo(sx + handle, y, mx - handle * 0.3, y + sign * depth, mx, y + sign * depth);
    ctxTarget.bezierCurveTo(mx + handle * 0.3, y + sign * depth, ex - handle, y, ex, y);
  }
}

function drawStampWashiVerticalDown(ctxTarget, x, y, height, options, side, mirrored = false) {
  const right = side === "right";
  const sign = right ? -1 : 1;
  for (let i = 0; i < options.count; i++) {
    const sy = y + options.spacing * i;
    const ey = i === options.count - 1 ? y + height : y + options.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const depth = options.depth + stampWashiEdgePhase(options, i, mirrored);
    const handle = (ey - sy) * options.roundness * 0.28;
    ctxTarget.bezierCurveTo(x, sy + handle, x + sign * depth, my - handle * 0.3, x + sign * depth, my);
    ctxTarget.bezierCurveTo(x + sign * depth, my + handle * 0.3, x, ey - handle, x, ey);
  }
}

function drawStampWashiVerticalUp(ctxTarget, x, y, height, options, side, mirrored = false) {
  const right = side === "right";
  const sign = right ? -1 : 1;
  for (let i = options.count - 1; i >= 0; i--) {
    const sy = y + options.spacing * i;
    const ey = i === options.count - 1 ? y + height : y + options.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const depth = options.depth + stampWashiEdgePhase(options, i, mirrored);
    const handle = (ey - sy) * options.roundness * 0.28;
    ctxTarget.bezierCurveTo(x, ey - handle, x + sign * depth, my + handle * 0.3, x + sign * depth, my);
    ctxTarget.bezierCurveTo(x + sign * depth, my - handle * 0.3, x, sy + handle, x, sy);
  }
}

function drawStampWashiSeamEdge(ctxTarget, x, y, height, options, mirrored = false) {
  ctxTarget.moveTo(x, y);
  for (let i = 0; i < options.count; i++) {
    const sy = y + options.spacing * i;
    const ey = i === options.count - 1 ? y + height : y + options.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const leftBite = i % 2 === 0;
    const direction = mirrored ? !leftBite : leftBite;
    const depth = options.depth + stampWashiEdgePhase(options, i, mirrored);
    const handle = (ey - sy) * options.roundness * 0.28;
    ctxTarget.bezierCurveTo(x, sy + handle, x + (direction ? -depth : depth), my - handle * 0.3, x + (direction ? -depth : depth), my);
    ctxTarget.bezierCurveTo(x + (direction ? -depth : depth), my + handle * 0.3, x, ey - handle, x, ey);
  }
}

function drawStampWashiStripPath(ctxTarget, x, y, width, height, options) {
  const stampSize = height;
  const horizontal = stampWashiEdgeOptions(options, width, stampSize);
  const vertical = stampWashiEdgeOptions(options, height, stampSize);
  const mirrorRight = options.stampMirrorVertical !== false;
  ctxTarget.beginPath();
  ctxTarget.moveTo(x, y);
  drawStampWashiHorizontalEdge(ctxTarget, x, y, width, horizontal, "top");
  drawStampWashiVerticalDown(ctxTarget, x + width, y, height, vertical, "right", mirrorRight);
  for (let i = horizontal.count - 1; i >= 0; i--) {
    const sx = x + horizontal.spacing * i;
    const ex = i === horizontal.count - 1 ? x + width : x + horizontal.spacing * (i + 1);
    const mx = (sx + ex) / 2;
    const depth = horizontal.depth + stampWashiEdgePhase(horizontal, i, true);
    const handle = (ex - sx) * horizontal.roundness * 0.28;
    ctxTarget.bezierCurveTo(ex - handle, y + height, mx + handle * 0.3, y + height - depth, mx, y + height - depth);
    ctxTarget.bezierCurveTo(mx - handle * 0.3, y + height - depth, sx + handle, y + height, sx, y + height);
  }
  drawStampWashiVerticalUp(ctxTarget, x, y, height, vertical, "left", false);
  ctxTarget.closePath();
}

function drawStampWashiSeam(ctxTarget, x, y, height, options, mirrored = false) {
  const vertical = stampWashiEdgeOptions(options, height, height);
  ctxTarget.beginPath();
  drawStampWashiSeamEdge(ctxTarget, x, y, height, vertical, mirrored);
}

function svgMove(parts, x, y) {
  parts.push(`M${x.toFixed(2)} ${y.toFixed(2)}`);
}

function svgQuad(parts, cx, cy, x, y) {
  parts.push(`Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`);
}

function svgCubic(parts, c1x, c1y, c2x, c2y, x, y) {
  parts.push(`C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`);
}

function stampWashiStripSVGPath(x, y, width, height, options) {
  const stampSize = height;
  const horizontal = stampWashiEdgeOptions(options, width, stampSize);
  const vertical = stampWashiEdgeOptions(options, height, stampSize);
  const mirrorRight = options.stampMirrorVertical !== false;
  const parts = [];
  svgMove(parts, x, y);
  for (let i = 0; i < horizontal.count; i++) {
    const sx = x + horizontal.spacing * i;
    const ex = i === horizontal.count - 1 ? x + width : x + horizontal.spacing * (i + 1);
    const mx = (sx + ex) / 2;
    const depth = horizontal.depth + stampWashiEdgePhase(horizontal, i, false);
    const handle = (ex - sx) * horizontal.roundness * 0.28;
    svgCubic(parts, sx + handle, y, mx - handle * 0.3, y + depth, mx, y + depth);
    svgCubic(parts, mx + handle * 0.3, y + depth, ex - handle, y, ex, y);
  }
  for (let i = 0; i < vertical.count; i++) {
    const sy = y + vertical.spacing * i;
    const ey = i === vertical.count - 1 ? y + height : y + vertical.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const depth = vertical.depth + stampWashiEdgePhase(vertical, i, mirrorRight);
    const handle = (ey - sy) * vertical.roundness * 0.28;
    svgCubic(parts, x + width, sy + handle, x + width - depth, my - handle * 0.3, x + width - depth, my);
    svgCubic(parts, x + width - depth, my + handle * 0.3, x + width, ey - handle, x + width, ey);
  }
  for (let i = horizontal.count - 1; i >= 0; i--) {
    const sx = x + horizontal.spacing * i;
    const ex = i === horizontal.count - 1 ? x + width : x + horizontal.spacing * (i + 1);
    const mx = (sx + ex) / 2;
    const depth = horizontal.depth + stampWashiEdgePhase(horizontal, i, true);
    const handle = (ex - sx) * horizontal.roundness * 0.28;
    svgCubic(parts, ex - handle, y + height, mx + handle * 0.3, y + height - depth, mx, y + height - depth);
    svgCubic(parts, mx - handle * 0.3, y + height - depth, sx + handle, y + height, sx, y + height);
  }
  for (let i = vertical.count - 1; i >= 0; i--) {
    const sy = y + vertical.spacing * i;
    const ey = i === vertical.count - 1 ? y + height : y + vertical.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const depth = vertical.depth + stampWashiEdgePhase(vertical, i, false);
    const handle = (ey - sy) * vertical.roundness * 0.28;
    svgCubic(parts, x, ey - handle, x + depth, my + handle * 0.3, x + depth, my);
    svgCubic(parts, x + depth, my - handle * 0.3, x, sy + handle, x, sy);
  }
  parts.push("Z");
  return parts.join(" ");
}

function stampWashiSeamSVGPath(x, y, height, options, mirrored = false) {
  const vertical = stampWashiEdgeOptions(options, height, height);
  const parts = [];
  svgMove(parts, x, y);
  for (let i = 0; i < vertical.count; i++) {
    const sy = y + vertical.spacing * i;
    const ey = i === vertical.count - 1 ? y + height : y + vertical.spacing * (i + 1);
    const my = (sy + ey) / 2;
    const leftBite = i % 2 === 0;
    const direction = mirrored ? !leftBite : leftBite;
    const depth = vertical.depth + stampWashiEdgePhase(vertical, i, mirrored);
    const handle = (ey - sy) * vertical.roundness * 0.28;
    svgCubic(parts, x, sy + handle, x + (direction ? -depth : depth), my - handle * 0.3, x + (direction ? -depth : depth), my);
    svgCubic(parts, x + (direction ? -depth : depth), my + handle * 0.3, x, ey - handle, x, ey);
  }
  return parts.join(" ");
}

function makeStampWashiCutlineSVG(settings) {
  const widthPx = Math.max(1, Math.round(settings.stripWidth * settings.dpi));
  const heightPx = Math.max(1, Math.round(settings.stripHeight * settings.dpi));
  const layout = stampWashiLayout(settings, widthPx, heightPx);
  const paths = [stampWashiStripSVGPath(layout.x, layout.y, layout.width, layout.height, settings)];
  for (const [index, stamp] of layout.stamps.slice(1).entries()) {
    paths.push(stampWashiSeamSVGPath(stamp.x, layout.y, layout.height, settings, index % 2 === 1));
  }
  const widthIn = (widthPx / settings.dpi).toFixed(3);
  const heightIn = (heightPx / settings.dpi).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${widthPx} ${heightPx}"><path d="${paths.join(" ")}" fill="none" stroke="#ff00ff" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}

function makePrintArtCanvas(settings) {
  const source = compositedFrameCanvas(state.activeFrame);
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
  if (settings.mode !== "stamp-washi") {
    out.fillStyle = "#fff";
    out.fillRect(0, 0, output.width, output.height);
  } else {
    out.clearRect(0, 0, output.width, output.height);
  }
  if (settings.mode === "single") {
    if (settings.showArt !== false) drawPrintTile(out, source, bleedPixels, bleedPixels, artPixels, artPixels, settings);
  } else if (settings.mode === "tile") {
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if (settings.showArt !== false) drawPrintTile(out, source, bleedPixels + x * artPixels, bleedPixels + y * artPixels, artPixels, artPixels, settings);
  } else if (settings.mode === "washi") {
    const tileSize = output.height;
    for (let x = 0; x < output.width; x += tileSize) if (settings.showArt !== false) drawPrintTile(out, source, x, 0, tileSize, output.height, settings);
  } else if (settings.mode === "stamp-washi") {
    const layout = stampWashiLayout(settings, output.width, output.height);

    // Strip backing
    out.save();
    drawStampWashiStripPath(out, layout.x, layout.y, layout.width, layout.height, settings);
    out.fillStyle = "#fff";
    out.fill();
    out.restore();

    // Stamp artwork
    for (const stamp of layout.stamps) {
      const artX = stamp.x + stamp.inset;
      const artY = stamp.y + stamp.inset;
      if (settings.showArt !== false) drawPrintTile(out, source, artX, artY, stamp.artSize, stamp.artSize, settings);
    }

    // Cut preview
    if (settings.showCutline !== false) {
      out.save();
      out.strokeStyle = "rgba(0,0,0,0.55)";
      out.lineWidth = Math.max(1, Math.round(settings.dpi / 300));
      drawStampWashiStripPath(out, layout.x, layout.y, layout.width, layout.height, settings);
      out.stroke();
      for (const [index, stamp] of layout.stamps.slice(1).entries()) {
        drawStampWashiSeam(out, stamp.x, layout.y, layout.height, settings, index % 2 === 1);
        out.stroke();
      }
      out.restore();
    }
  } else if (settings.mode === "sticker") {
    const sticker = scaledStickerCanvas(source, artPixels, bleedPixels, settings);
    for (let y = 0; y < settings.stickerRows; y++) for (let x = 0; x < settings.stickerCols; x++) {
      const px = x * (tilePixels + gapPixels);
      const py = y * (tilePixels + gapPixels);
      if (settings.showArt !== false) out.drawImage(sticker, px, py);
    }
    if (settings.showCutline !== false) drawPrintCutlinePreview(out, settings, output.width, output.height);
  } else if (settings.mode === "memo") {
    const header = Math.min(artPixels, Math.round(output.height * 0.32));
    if (settings.showArt !== false) drawPrintTile(out, source, bleedPixels, bleedPixels, header, header, settings);
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

function drawPrintCutlinePreview(ctxTarget, settings, width, height) {
  ctxTarget.save();
  ctxTarget.strokeStyle = "rgba(255,0,180,0.72)";
  ctxTarget.lineWidth = Math.max(1, Math.round(settings.dpi / 300));
  ctxTarget.setLineDash([Math.max(4, Math.round(settings.dpi * 0.025)), Math.max(3, Math.round(settings.dpi * 0.018))]);
  if (settings.mode === "sticker") {
    const artPixels = Math.max(1, Math.round(settings.artWidth * settings.dpi));
    const bleedPixels = Math.round(settings.bleed * settings.dpi);
    const gapPixels = Math.round(settings.stickerGap * settings.dpi);
    const tilePixels = artPixels + bleedPixels * 2;
    for (let row = 0; row < settings.stickerRows; row++) for (let col = 0; col < settings.stickerCols; col++) {
      ctxTarget.strokeRect(col * (tilePixels + gapPixels) + 0.5, row * (tilePixels + gapPixels) + 0.5, tilePixels - 1, tilePixels - 1);
    }
  } else if (settings.mode === "stamp-washi") {
    const layout = stampWashiLayout(settings, width, height);
    drawStampWashiStripPath(ctxTarget, layout.x, layout.y, layout.width, layout.height, settings);
    ctxTarget.stroke();
    for (const [index, stamp] of layout.stamps.slice(1).entries()) {
      drawStampWashiSeam(ctxTarget, stamp.x, layout.y, layout.height, settings, index % 2 === 1);
      ctxTarget.stroke();
    }
  } else {
    ctxTarget.strokeRect(0.5, 0.5, width - 1, height - 1);
  }
  ctxTarget.restore();
}

function makePrintSheetCanvas(art, settings, includeGuide = false) {
  const width = Math.max(1, Math.round(settings.pageWidth * settings.dpi));
  const height = Math.max(1, Math.round(settings.pageHeight * settings.dpi));
  const margin = Math.round(settings.pageMargin * settings.dpi);
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const out = output.getContext("2d");
  out.imageSmoothingEnabled = settings.resampleMode === "smooth";
  out.fillStyle = "#fff";
  out.fillRect(0, 0, width, height);
  const usableW = Math.max(1, width - margin * 2);
  const usableH = Math.max(1, height - margin * 2);
  let x = margin;
  let y = margin;
  let placed = 0;
  const gap = Math.max(0, Math.round((settings.mode === "sticker" ? settings.stickerGap : 0.2) * settings.dpi));
  while (y + art.height <= margin + usableH && placed < 500) {
    while (x + art.width <= margin + usableW && placed < 500) {
      out.drawImage(art, x, y);
      x += art.width + gap;
      placed++;
      if (["washi", "stamp-washi", "memo"].includes(settings.mode)) break;
    }
    x = margin;
    y += art.height + gap;
    if (["washi", "stamp-washi", "memo"].includes(settings.mode)) break;
  }
  if (includeGuide) {
    out.save();
    out.strokeStyle = "rgba(0,0,0,0.45)";
    out.setLineDash([12, 8]);
    out.strokeRect(margin + 0.5, margin + 0.5, usableW - 1, usableH - 1);
    out.restore();
  }
  output.dataset.placedItems = String(placed);
  return output;
}

function makeCalibrationCanvas(settings) {
  const width = Math.max(1, Math.round(8.5 * settings.dpi));
  const height = Math.max(1, Math.round(11 * settings.dpi));
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const out = output.getContext("2d");
  out.fillStyle = "#fff";
  out.fillRect(0, 0, width, height);
  out.fillStyle = "#000";
  out.font = `${Math.max(12, Math.round(settings.dpi * 0.06))}px sans-serif`;
  out.fillText(`PixelBug calibration page - ${settings.dpi} DPI`, settings.dpi * 0.5, settings.dpi * 0.45);
  out.lineWidth = Math.max(1, Math.round(settings.dpi / 300));
  const startX = Math.round(settings.dpi * 0.5);
  const startY = Math.round(settings.dpi * 0.8);
  out.beginPath();
  out.moveTo(startX, startY);
  out.lineTo(startX + settings.dpi, startY);
  out.moveTo(startX, startY + settings.dpi * 0.2);
  out.lineTo(startX + Math.round(settings.dpi / 25.4 * 100), startY + settings.dpi * 0.2);
  out.stroke();
  out.fillText("1 inch", startX, startY - 8);
  out.fillText("100 mm", startX, startY + settings.dpi * 0.2 - 8);
  for (let i = 0; i <= 10; i++) {
    const x = startX + Math.round(i * settings.dpi / 10);
    out.beginPath();
    out.moveTo(x, startY - 10);
    out.lineTo(x, startY + 10);
    out.stroke();
  }
  const box = Math.round(settings.dpi);
  out.strokeRect(startX, startY + Math.round(settings.dpi * 0.55), box, box);
  out.fillText("This square should measure exactly 1 × 1 inch.", startX + box + 16, startY + Math.round(settings.dpi * 1.05));
  return output;
}

function makePrintCanvas(settings, includeGuide = false) {
  const art = makePrintArtCanvas(settings);
  if (printUsesSheet(settings)) return makePrintSheetCanvas(art, settings, includeGuide);
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
  if (settings.mode === "washi") {
    ctxTarget.strokeRect(1, 1, previewCanvas.width - 2, previewCanvas.height - 2);
  } else if (settings.mode !== "sticker" && settings.mode !== "stamp-washi") {
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
  exportCutlineBtn.hidden = !(mode === "sticker" || mode === "stamp-washi");
  const locked = printPageSizeSelect && ["letter", "a4"].includes(printPageSizeSelect.value);
  if (printPageWidthInput) printPageWidthInput.disabled = !!locked;
  if (printPageHeightInput) printPageHeightInput.disabled = !!locked;
}


function printCacheKey(settings, includeGuide = true) {
  return JSON.stringify({ settings, includeGuide, frame: state.activeFrame, signature: activeFrameSignature(state.activeFrame), template: !!printTemplateImage });
}
function getPrintCanvas(settings, includeGuide = true) {
  const key = printCacheKey(settings, includeGuide);
  if (printCanvasCache && printCanvasCache.key === key) return printCanvasCache.canvas;
  const canvasOut = makePrintCanvas(settings, includeGuide);
  printCanvasCache = { key, canvas: canvasOut };
  return canvasOut;
}
function drawPrintPreview() {
  updatePrintFields();
  const settings = printSettings();
  const output = getPrintCanvas(settings, true);
  largePrintPreviewCache = output;
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
  if (settings.showGuides) drawPrintGuides({ width: drawW, height: drawH }, settings, drawW / output.width, drawH / output.height);
  printPreviewCtx.restore();
  const widthIn = output.width / settings.dpi;
  const heightIn = output.height / settings.dpi;
  const warnings = printWarnings(settings, output, compositedFrameCanvas(state.activeFrame));
  const placed = output.dataset.placedItems ? `, ${output.dataset.placedItems} item(s) placed` : "";
  printPreviewInfoCache = `${output.width} × ${output.height} px, ${widthIn.toFixed(2)} × ${heightIn.toFixed(2)} in at ${settings.dpi} DPI${placed}.${warnings.length ? ` Warning: ${warnings.join("; ")}.` : " Print-ready."}`;
  printInfo.textContent = printPreviewInfoCache;
}


function syncPrintPreviewZoomControl() {
  if (!printPreviewZoomInput || !printPreviewZoomOutput) return;
  printPreviewZoomInput.value = String(Math.round(printPreviewZoom * 100));
  printPreviewZoomOutput.textContent = `${Math.round(printPreviewZoom * 100)}%`;
}

// Preview bounds
function clampLargePrintPreviewPan(drawW, drawH) {
  const maxW = largePrintPreviewCanvas.width;
  const maxH = largePrintPreviewCanvas.height;
  const limitX = Math.max(0, (drawW - maxW) / 2);
  const limitY = Math.max(0, (drawH - maxH) / 2);
  printPreviewPanX = Math.max(-limitX, Math.min(limitX, printPreviewPanX));
  printPreviewPanY = Math.max(-limitY, Math.min(limitY, printPreviewPanY));
}

// Preview cache
function ensureLargePrintPreviewCache() {
  if (!largePrintPreviewCache) largePrintPreviewCache = getPrintCanvas(printSettings(), true);
  return largePrintPreviewCache;
}

// Preview render
function drawLargePrintPreview() {
  const output = ensureLargePrintPreviewCache();
  const maxW = largePrintPreviewCanvas.width;
  const maxH = largePrintPreviewCanvas.height;
  const fitScale = Math.min(maxW / output.width, maxH / output.height);
  const scale = fitScale * printPreviewZoom;
  const drawW = Math.max(1, Math.round(output.width * scale));
  const drawH = Math.max(1, Math.round(output.height * scale));
  clampLargePrintPreviewPan(drawW, drawH);
  const x = Math.floor((maxW - drawW) / 2 + printPreviewPanX);
  const y = Math.floor((maxH - drawH) / 2 + printPreviewPanY);
  largePrintPreviewCtx.imageSmoothingEnabled = false;
  largePrintPreviewCtx.fillStyle = canvasBackgroundColor();
  largePrintPreviewCtx.fillRect(0, 0, maxW, maxH);
  largePrintPreviewCtx.drawImage(output, x, y, drawW, drawH);
  syncPrintPreviewZoomControl();
}

// Preview frame
function scheduleLargePrintPreviewDraw() {
  cancelAnimationFrame(largePrintPreviewFrame);
  largePrintPreviewFrame = requestAnimationFrame(drawLargePrintPreview);
}

// Preview zoom
function setLargePrintPreviewZoom(value, keepPan = false) {
  printPreviewZoom = Math.max(0.25, Math.min(8, value));
  if (!keepPan && printPreviewZoom <= 1) {
    printPreviewPanX = 0;
    printPreviewPanY = 0;
  }
  syncPrintPreviewZoomControl();
  scheduleLargePrintPreviewDraw();
}

// Preview open
function openLargePrintPreview() {
  printPreviewZoom = 1;
  printPreviewPanX = 0;
  printPreviewPanY = 0;
  if (!largePrintPreviewCache) drawPrintPreview();
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
  largePrintPreviewCache = null;
  cancelAnimationFrame(printFrame);
  printFrame = requestAnimationFrame(() => {
    drawPrintPreview();
    if (!printPreviewOverlay.hidden) scheduleLargePrintPreviewDraw();
  });
}

function setPrintMode(enabled) {
  if (enabled && modMode) setModMode(false);
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
  if (settings.mode === "stamp-washi") return makeStampWashiCutlineSVG(settings);
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
  const isStampWashi = settings.mode === "stamp-washi";
  const filename = isStampWashi ? "pixel-bug-stamp-washi-cutline.svg" : "pixel-bug-sticker-cutline.svg";
  const res = await window.pixelBug.saveFile({ title: isStampWashi ? "Export Stamp Washi Cutline" : "Export Sticker Cutline", defaultPath: filename, filters: [{ name: "SVG Cutline", extensions: ["svg"] }], data: svg, encoding: "utf8" });
  setStatus(res.ok ? `Saved ${filename}.` : "Save cancelled.");
}

async function exportCalibrationPNG() {
  const settings = printSettings();
  const output = makeCalibrationCanvas(settings);
  const printPng = addPngDpiMetadata(dataUrlBase64(output.toDataURL("image/png")), settings.dpi);
  await saveBase64("Export Calibration PNG", "pixel-bug-calibration-page.png", "PNG Image", "png", printPng);
}

async function exportPrintPNG() {
  const settings = { ...printSettings(), showGuides: false, showCutline: false };
  const output = makePrintCanvas(settings, false);
  const filename = settings.mode === "washi" || settings.mode === "stamp-washi" ? "pixel-bug-washi-print.png" : settings.mode === "sticker" ? "pixel-bug-sticker-sheet.png" : settings.mode === "memo" ? "pixel-bug-memo-pad.png" : "pixel-bug-print.png";
  const printPng = addPngDpiMetadata(dataUrlBase64(output.toDataURL("image/png")), settings.dpi);
  await saveBase64("Export Print PNG", filename, "PNG Image", "png", printPng);
  setStatus(`Exported ${output.width}×${output.height}px at ${settings.dpi} DPI (${(output.width/settings.dpi).toFixed(2)}×${(output.height/settings.dpi).toFixed(2)} in).`);
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
layerOpacityInput.oninput = e => { layer().opacity = Number(e.target.value)/100; invalidateArtworkCaches(); drawCanvas(); renderLayers(); };
layerOpacityInput.onchange = () => { pushHistory(); saveLocal(); };
layerBlendModeSelect && (layerBlendModeSelect.onchange = e => { pushHistory(); layer().blendMode = normalizeBlendMode(e.target.value); invalidateArtworkCaches(); drawCanvas(); renderLayers(); saveLocal(); });
$("#toggle-grid-btn").onclick = e => { showGrid=!showGrid; e.target.textContent=showGrid?"Grid On":"Grid Off"; e.target.setAttribute("aria-pressed", String(showGrid)); drawCanvas(); saveLocal(); };
$("#toggle-onion-btn").onclick = e => { showOnion=!showOnion; e.target.textContent=showOnion?"Onion On":"Onion Off"; e.target.setAttribute("aria-pressed", String(showOnion)); drawCanvas(); saveLocal(); };
$("#undo-btn").onclick = () => { if(!undoStack.length) return; redoStack.push(clone(state)); restore(undoStack.pop()); };
$("#redo-btn").onclick = () => { if(!redoStack.length) return; undoStack.push(clone(state)); restore(redoStack.pop()); };
$("#new-project-btn").onclick = openNewProjectConfirm; $("#save-project-btn").onclick = saveProject; $("#open-project-btn").onclick = openProject;
exportMenuBtn && (exportMenuBtn.onclick = openExportModal);
closeExportBtn && (closeExportBtn.onclick = closeExportModal);
exportOverlay && exportOverlay.addEventListener("click", e => { if (e.target === exportOverlay) closeExportModal(); });
$("#export-png-btn").onclick = () => runExportAction(exportPNG); $("#export-sheet-btn").onclick = () => runExportAction(exportSheet); $("#export-gif-btn").onclick = () => runExportAction(exportGIF);
confirmNewProjectBtn && (confirmNewProjectBtn.onclick = confirmNewProject);
cancelNewProjectBtn && (cancelNewProjectBtn.onclick = closeNewProjectConfirm);
keepCurrentProjectBtn && (keepCurrentProjectBtn.onclick = closeNewProjectConfirm);
newProjectOverlay && newProjectOverlay.addEventListener("click", e => { if (e.target === newProjectOverlay) closeNewProjectConfirm(); });
$("#add-frame-btn").onclick = () => addFrame(false); $("#duplicate-frame-btn").onclick = () => addFrame(true); $("#delete-frame-btn").onclick = deleteFrame;
$("#add-layer-btn").onclick = () => addLayer(false); $("#duplicate-layer-btn").onclick = () => addLayer(true); $("#delete-layer-btn").onclick = deleteLayer; $("#layer-up-btn").onclick = () => moveLayer(1); $("#layer-down-btn").onclick = () => moveLayer(-1); addLayerGroupBtn && (addLayerGroupBtn.onclick = addLayerGroup); moveLayerGroupBtn && (moveLayerGroupBtn.onclick = moveLayerToGroup);
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
exportVoxelNodesBtn.onclick = exportVoxelNodesJSON;
exportVoxelGpBtn.onclick = exportVoxelGreaseJSON;
exportBlenderPackBtn.onclick = exportBlenderPack;
voxelOverlay.addEventListener("click", e => { if (e.target === voxelOverlay) closeVoxelModal(); });
openModelConverterBtn?.setAttribute("aria-haspopup", "dialog");
openModelConverterBtn?.setAttribute("aria-expanded", "false");
if (openModelConverterBtn) openModelConverterBtn.onclick = openModelConverterModal;
if (closeModelConverterBtn) closeModelConverterBtn.onclick = closeModelConverterModal;
if (modelConverterOverlay) modelConverterOverlay.addEventListener("click", e => { if (e.target === modelConverterOverlay) closeModelConverterModal(); });
if (modelConverterInput) modelConverterInput.onchange = e => loadModelConverterFile(e.target.files);
[modelConverterSizeInput, modelConverterShadingInput, modelConverterInkInput, ...modelConverterColorModeInputs, modelConverterTurntableXInput, modelConverterTurntableYInput, modelConverterTurntableZInput].filter(Boolean).forEach(input => { input.oninput = scheduleModelConverterPreview; input.onchange = scheduleModelConverterPreview; });
if (modelConverterImportBtn) modelConverterImportBtn.onclick = importModelConverterLayers;
if (modelConverterImportTurntableBtn) modelConverterImportTurntableBtn.onclick = importModelConverterTurntableLayer;
let resizeFrame = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    editorCanvasMetricsCache = "";
    drawCanvas();
    if (printMode) schedulePrintPreview();
    if (printPreviewOverlay && !printPreviewOverlay.hidden) scheduleLargePrintPreviewDraw();
  });
});
function invalidateVoxelGeometry() {
  voxelPixelCache = null;
  voxelNeighborCache = null;
  voxelSimplifiedStatusShown = false;
}
[voxelDepthInput, voxelScaleInput, voxelRotationXInput, voxelRotationYInput, voxelRotationZInput].forEach(input => input.oninput = () => { if (input === voxelDepthInput) invalidateVoxelGeometry(); scheduleVoxelPreview(); });
voxelFloorInput.onchange = scheduleVoxelPreview;
voxelMergeInput.onchange = () => { invalidateVoxelGeometry(); scheduleVoxelPreview(); };
voxelDepthModeSelect.onchange = () => { invalidateVoxelGeometry(); scheduleVoxelPreview(); };
customSizeBtn.setAttribute("aria-haspopup", "dialog");
customSizeBtn.setAttribute("aria-expanded", "false");
customSizeBtn.onclick = openCustomSizeModal;
closeCustomSizeBtn.onclick = closeCustomSizeModal;
applyCustomSizeBtn.onclick = applyCustomSize;
customSizeInput.addEventListener("keydown", e => { if (e.key === "Enter") applyCustomSize(); });
settingsBtn?.addEventListener("click", openSettingsModal);
closeSettingsBtn?.addEventListener("click", closeSettingsModal);
settingsOverlay?.addEventListener("click", e => { if (e.target === settingsOverlay) closeSettingsModal(); });
resetShortcutsBtn?.addEventListener("click", () => { shortcuts = { ...DEFAULT_SHORTCUTS }; saveShortcuts(); setupTools(); renderShortcutSettings(); setStatus("Shortcuts reset."); });
settingsThemeSelect?.addEventListener("change", changeInterfaceTheme);
Object.values(INTERFACE_COLOR_FIELDS).forEach(input => {
  input?.addEventListener("input", saveInterfaceColors);
  input?.addEventListener("change", () => {
    clearTimeout(interfaceColorSaveTimer);
    prepareCustomInterfaceEditing();
    const colors = flushInterfaceColorApply();
    localStorage.setItem(STORAGE_INTERFACE_COLORS_KEY, JSON.stringify(colors));
    document.documentElement.classList.remove("theme-editing");
  });
});
resetInterfaceColorsBtn?.addEventListener("click", resetInterfaceColors);
interfaceLightBtn?.addEventListener("click", () => setOriginalInterfaceTheme("light"));
interfaceDarkBtn?.addEventListener("click", () => setOriginalInterfaceTheme("dark"));
saveInterfacePaletteBtn?.addEventListener("click", saveCurrentInterfacePalette);
applyInterfacePaletteBtn?.addEventListener("click", applySavedInterfacePalette);
deleteInterfacePaletteBtn?.addEventListener("click", deleteSavedInterfacePalette);
customInterfacePaletteSelect?.addEventListener("change", () => {
  const palettes = loadInterfacePalettes();
  const selected = Number(customInterfacePaletteSelect.value);
  if (Number.isInteger(selected) && palettes[selected] && customInterfacePaletteName) customInterfacePaletteName.value = palettes[selected].name;
});
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
if (printPreviewZoomInput) printPreviewZoomInput.oninput = e => setLargePrintPreviewZoom(Number(e.target.value) / 100, true);
if (printPreviewZoomInBtn) printPreviewZoomInBtn.onclick = () => setLargePrintPreviewZoom(printPreviewZoom + 0.25, true);
if (printPreviewZoomOutBtn) printPreviewZoomOutBtn.onclick = () => setLargePrintPreviewZoom(printPreviewZoom - 0.25, true);
if (printPreviewZoomResetBtn) printPreviewZoomResetBtn.onclick = () => { printPreviewPanX = 0; printPreviewPanY = 0; setLargePrintPreviewZoom(1); };
largePrintPreviewCanvas.addEventListener("wheel", e => {
  e.preventDefault();
  const step = e.deltaY < 0 ? 0.25 : -0.25;
  setLargePrintPreviewZoom(printPreviewZoom + step, true);
}, { passive: false });
largePrintPreviewCanvas.addEventListener("pointerdown", e => {
  printPreviewDragging = true;
  printPreviewDragStartX = e.clientX;
  printPreviewDragStartY = e.clientY;
  printPreviewStartPanX = printPreviewPanX;
  printPreviewStartPanY = printPreviewPanY;
  largePrintPreviewCanvas.setPointerCapture(e.pointerId);
});
largePrintPreviewCanvas.addEventListener("pointermove", e => {
  if (!printPreviewDragging) return;
  printPreviewPanX = printPreviewStartPanX + e.clientX - printPreviewDragStartX;
  printPreviewPanY = printPreviewStartPanY + e.clientY - printPreviewDragStartY;
  scheduleLargePrintPreviewDraw();
});
largePrintPreviewCanvas.addEventListener("pointerup", e => {
  printPreviewDragging = false;
  if (largePrintPreviewCanvas.hasPointerCapture(e.pointerId)) largePrintPreviewCanvas.releasePointerCapture(e.pointerId);
});
largePrintPreviewCanvas.addEventListener("pointercancel", () => { printPreviewDragging = false; });
exportPrintBtn.onclick = exportPrintPNG;
exportCutlineBtn.onclick = exportCutlineSVG;
if (exportCalibrationBtn) exportCalibrationBtn.onclick = exportCalibrationPNG;
printTemplateInput.onchange = e => loadPrintTemplate(e.target.files?.[0]);
printTemplateSizeInput.onchange = schedulePrintPreview;
printTemplatePlacementSelect.onchange = schedulePrintPreview;
clearPrintTemplateBtn.onclick = clearPrintTemplate;

function updateStampPerforationLabels() {
  if (printStampTeethValue && printStampTeethInput) printStampTeethValue.value = String(Math.round(Number(printStampTeethInput.value) || 10));
  if (printStampRoundnessValue && printStampRoundnessInput) printStampRoundnessValue.value = String(Number(printStampRoundnessInput.value || 0.85).toFixed(2));
}
[printDpiInput, printWidthInput, printBleedInput, printSafeInput, printPageWidthInput, printPageHeightInput, printPageMarginInput, printStripWidthInput, printStripHeightInput, printStampCurlSpacingInput, printStampCurlDepthInput, printStampEdgeDifferenceInput, printStampTeethInput, printStampRoundnessInput, printStickerColsInput, printStickerRowsInput, printStickerGapInput, printMemoHeightInput].filter(Boolean).forEach(input => input.oninput = () => { updateStampPerforationLabels(); updatePrintFields(); schedulePrintPreview(); });
[printPageSizeSelect, printResampleModeSelect, printShowArtInput, printShowGuidesInput, printShowCutlineInput].filter(Boolean).forEach(input => input.onchange = () => { updatePrintFields(); schedulePrintPreview(); });
if (printStampMirrorVerticalInput) printStampMirrorVerticalInput.onchange = schedulePrintPreview;
updateStampPerforationLabels();
printRepeatSelect.onchange = () => { updatePrintFields(); schedulePrintPreview(); };
openPrivacyBtn?.setAttribute("aria-haspopup", "dialog");
openPrivacyBtn?.setAttribute("aria-expanded", "false");
if (openPrivacyBtn) openPrivacyBtn.onclick = openPrivacyModal;
if (closePrivacyBtn) closePrivacyBtn.onclick = closePrivacyModal;
privacyOverlay.addEventListener("click", e => { if (e.target === privacyOverlay) closePrivacyModal(); });
imageImportInput.onchange = e => loadImageFile(e.target.files[0]);
pixelizeSizeInput.oninput = schedulePixelizerPreview;
pixelizeColorsInput.oninput = schedulePixelizerPreview;
pixelizeFitInput.onchange = schedulePixelizerPreview;
if (pixelTextScaleInput) pixelTextScaleInput.oninput = updatePixelTextLabel;
$("#pixelize-import-btn").onclick = importPixelizedImage;

if (characterNameInput) characterNameInput.oninput = saveCharacterEdits;
[characterFrameSelect, characterPositionSelect, characterScaleInput, characterFlipInput, characterStartLineSelect].filter(Boolean).forEach(input => {
  input.oninput = saveCharacterEdits;
  input.onchange = saveCharacterEdits;
});
if (characterAddBtn) characterAddBtn.onclick = () => addDialogueCharacter(false);
if (characterDuplicateBtn) characterDuplicateBtn.onclick = () => addDialogueCharacter(true);
if (characterDeleteBtn) characterDeleteBtn.onclick = deleteDialogueCharacter;

if (dialogueEnabledInput) dialogueEnabledInput.onchange = saveDialogueEdits;
if (dialogueLineSelect) dialogueLineSelect.onchange = () => selectDialogueLine(dialogueLineSelect.value);
if (dialogueCharacterSelect) dialogueCharacterSelect.onchange = () => {
  applyDialogueCharacterToCurrentLine(dialogueCharacterSelect.value);
  renderDialogueControls();
};
if (dialogueSpeakerInput) {
  dialogueSpeakerInput.oninput = () => { saveDialogueEdits(); };
  dialogueSpeakerInput.onchange = () => { saveDialogueEdits(); };
}
if (dialogueFrameSelect) {
  dialogueFrameSelect.oninput = applyDialoguePortraitFrameToCurrentLine;
  dialogueFrameSelect.onchange = applyDialoguePortraitFrameToCurrentLine;
}
if (dialogueTextInput) {
  dialogueTextInput.onkeydown = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      splitDialogueLineAtCursor();
    }
  };
  dialogueTextInput.oninput = () => { dialogueDraftText = dialogueTextInput.value; saveDialogueEdits({ render: false }); renderDialogueNodeTree(); drawPlayScene(); saveLocal(); };
  dialogueTextInput.onchange = () => { dialogueDraftText = dialogueTextInput.value; saveDialogueEdits({ splitMultiline: true }); renderDialogueControls(); };
}
if (dialoguePrevBtn) dialoguePrevBtn.onclick = () => selectDialogueLine(state.playMode.dialogue.currentLine - 1);
if (dialogueNextBtn) dialogueNextBtn.onclick = () => selectDialogueLine(state.playMode.dialogue.currentLine + 1);
if (dialogueAddBtn) {
  dialogueAddBtn.onpointerdown = () => { dialogueAddClickText = String(dialogueTextInput?.value ?? dialogueDraftText ?? ""); };
  dialogueAddBtn.onclick = () => addDialogueLine(false);
}
if (dialogueDuplicateBtn) dialogueDuplicateBtn.onclick = () => addDialogueLine(true);
if (dialogueDeleteBtn) dialogueDeleteBtn.onclick = deleteDialogueLine;
if (dialogueTypewriterBtn) dialogueTypewriterBtn.onclick = () => {
  state.playMode.dialogue.typewriter = state.playMode.dialogue.typewriter === false;
  resetDialogueTypewriter();
  renderDialogueControls();
  drawPlayScene();
  saveLocal();
};

if (playCanvas) {
  playRunBtn.onclick = () => setPlayRunning(!playRunning);
  if (dialogueInteractBtn) dialogueInteractBtn.onclick = () => playDialogueActive ? advanceDialogueRuntime() : startInteractionDialogue();
  playResetBtn.onclick = () => { setPlayRunning(false); resetPlayActor(); };
  playModeCenterBtn.onclick = centerPlayActor;
  if (playExportPngBtn) playExportPngBtn.onclick = exportPlayScenePNG;
  if (playExportGifBtn) playExportGifBtn.onclick = exportPlaySceneGIF;
  if (playExportGameBtn) playExportGameBtn.onclick = exportTinyPlayGame;
  playAddPropBtn.onclick = addPlayProp;
  playUseActiveBtn.onclick = () => { playPropFrameSelect.value = String(state.activeFrame); setStatus("Active frame selected for Play Mode placement."); };
  playDeletePropBtn.onclick = deleteSelectedPlayProp;
  if (playToggleCollisionBtn) playToggleCollisionBtn.onclick = toggleSelectedPlayPropCollision;
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
    state.playMode.sceneryY = clampFiniteNumber(playSceneryYInput?.value, state.playMode.sceneryY ?? 0, -1024, 2160);
    drawPlayScene();
    saveLocal();
  });
  if (playLayerFrameSelect) playLayerFrameSelect.onchange = () => { pushHistory(); updateSelectedPlayLayer(); setStatus("Play Mode visual layer updated."); };
  [playLayerScaleInput, playLayerParallaxInput, playLayerYInput, playLayerOpacityInput, playLayerRepeatInput, playLayerVisibleInput].filter(Boolean).forEach(input => {
    input.oninput = updateSelectedPlayLayer;
    input.onchange = updateSelectedPlayLayer;
  });
  if (playActorScaleInput) {
    const applyActorScale = () => {
      state.playMode.actorScale = Math.max(0.5, Math.min(Number(playActorScaleInput.value) || Number(state.playMode.actorScale) || 3, 32));
      normalizeProject();
      const ground = Math.max(32, Math.min(Number(state.playMode.groundY) || playCanvas.height - 48, playCanvas.height - 8));
      const actorScale = playScale();
      const actorW = projectWidth() * actorScale;
      const actorH = projectHeight() * actorScale;
      playActor.x = Math.max(0, Math.min(playWorldWidth() - actorW, playActor.x));
      playActor.y = ground - actorH;
      playActor.vy = 0;
      playActor.grounded = true;
      drawPlayScene();
      saveLocal();
    };
    playActorScaleInput.oninput = applyActorScale;
    playActorScaleInput.onchange = applyActorScale;
  }
  [playPropXInput, playPropYInput, playPropScaleInput].filter(Boolean).forEach(input => input.oninput = () => {
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
  if (playPropDialogueSelect) playPropDialogueSelect.onchange = () => {
    const prop = state.playMode.props[selectedPlayProp];
    if (prop) { pushHistory(); prop.dialogueCharacterId = playPropDialogueSelect.value; renderPlayPropList(); renderDialogueNodeTree(); drawPlayScene(); saveLocal(); }
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
  if (e.key === "Escape" && selectionBox && (pixelizerOverlay.hidden && voxelOverlay.hidden && customSizeOverlay.hidden && privacyOverlay.hidden && (!newProjectOverlay || newProjectOverlay.hidden) && (!exportOverlay || exportOverlay.hidden) && (!settingsOverlay || settingsOverlay.hidden))) { e.preventDefault(); selectionAction("clear"); return; }
  if (e.key === "Escape" && !pixelizerOverlay.hidden) { closePixelizerModal(); return; }
  if (e.key === "Escape" && !voxelOverlay.hidden) { closeVoxelModal(); return; }
  if (e.key === "Escape" && !customSizeOverlay.hidden) { closeCustomSizeModal(); return; }
  if (e.key === "Escape" && !privacyOverlay.hidden) { closePrivacyModal(); return; }
  if (e.key === "Escape" && newProjectOverlay && !newProjectOverlay.hidden) { closeNewProjectConfirm(); return; }
  if (e.key === "Escape" && exportOverlay && !exportOverlay.hidden) { closeExportModal(); return; }
  if (listeningShortcut) {
    const combo = normalizeShortcutEvent(e);
    if (combo) { e.preventDefault(); shortcuts[listeningShortcut] = combo; listeningShortcut = null; saveShortcuts(); setupTools(); renderShortcutSettings(); setStatus("Shortcut updated."); }
    return;
  }
  if (settingsOverlay && !settingsOverlay.hidden && e.key === "Escape") { e.preventDefault(); closeSettingsModal(); return; }
  if (shortcutMatches(e, shortcuts.settings)) { e.preventDefault(); openSettingsModal(); return; }
  if (shortcutMatches(e, shortcuts.save)) { e.preventDefault(); saveProject(); return; }
  if (shortcutMatches(e, shortcuts.open)) { e.preventDefault(); openProject(); return; }
  if (shortcutMatches(e, shortcuts.undo)) { e.preventDefault(); $("#undo-btn").click(); return; }
  if (shortcutMatches(e, shortcuts.redo) || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")) { e.preventDefault(); $("#redo-btn").click(); return; }
  if (shortcutMatches(e, shortcuts.copy)) { e.preventDefault(); selectionAction("copy"); return; }
  if (shortcutMatches(e, shortcuts.cut)) { e.preventDefault(); selectionAction("cut"); return; }
  if (shortcutMatches(e, shortcuts.paste)) { e.preventDefault(); selectionAction("paste"); return; }
  if (shortcutMatches(e, shortcuts.deleteSelection) || e.key === "Backspace") { if (selectionBox) { e.preventDefault(); selectionAction("delete"); return; } }
  Object.entries(TOOL_SHORTCUT_ACTIONS).some(([action, toolId]) => {
    if (shortcutMatches(e, shortcuts[action])) { e.preventDefault(); setTool(toolId); return true; }
    return false;
  });
});

window.addEventListener("keydown", e => {
  if (!playRunning) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)) e.preventDefault();
  if (e.code === "KeyE") { e.preventDefault(); playDialogueActive ? advanceDialogueRuntime() : startInteractionDialogue(); return; }
  if (e.code === "Enter") { e.preventDefault(); advanceDialogueRuntime(); return; }
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
modPlayUiApplyBtn?.addEventListener("click", () => applyModPlayUi(true));
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

loadDockLayout();
loadTouchMode();
if (loadLocal()) setStatus("Restored local autosave.");
setupTools();
syncControls();
updatePixelTextLabel();
requestAnimationFrame(() => renderAll({ persist: false }));
runStartupTasks([
  loadExtensionPrefs,
  loadLocalTileLibrary,
  renderBrushLab,
  renderTilemapPanel,
  
  syncEffectSelect,
  renderPluginAssets,
  setupDockRearrange,
  updatePixelizerLabels,
  updateVoxelLabels,
  clearPixelizerPreview
]);
const themeObserver = new MutationObserver(() => {
  gridPathCache = null;
  drawCanvas();
  drawPlayPreview();
  clearPixelizerPreview();
  drawVoxelPreview?.();
  drawPrintPreview?.();
  invalidateArtworkCaches();
  if (printPreviewOverlay && !printPreviewOverlay.hidden) scheduleLargePrintPreviewDraw?.();
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

symmetryModeSelect?.addEventListener("change", e => {
  symmetryMode = ["off", "vertical", "horizontal", "both", "quad"].includes(e.target.value) ? e.target.value : "off";
  setStatus(symmetryMode === "off" ? "Symmetry off." : `${e.target.options[e.target.selectedIndex].textContent} symmetry on.`);
});
tilemapSelect?.addEventListener("change", e => { state.tilemap.activeTileId = e.target.value; activeTileId = e.target.value; renderTilemapPanel(); saveLocal(); });
tilemapSaveBtn?.addEventListener("click", saveSelectionAsTile);
tilemapDeleteBtn?.addEventListener("click", deleteActiveTile);
tilemapStampBtn?.addEventListener("click", () => { tileStampMode = !tileStampMode; renderTilemapPanel(); setStatus(tileStampMode ? "Tile stamping on." : "Tile stamping off."); });

touchToggleBtn?.addEventListener("click", () => setTouchMode(!touchMode, true, touchMode ? (leftHandTouchMode ? "left" : "right") : (leftHandTouchMode ? "left" : "right")));
leftHandedToggleBtn?.addEventListener("click", () => {
  if (!touchMode) return;
  setTouchMode(true, true, leftHandTouchMode ? "right" : "left");
});
window.addEventListener("blur", resetTouchPointers);


// Card collapse
function setupCollapsibleCards(selector, titleSelector, storagePrefix) {
  document.querySelectorAll(selector).forEach((card, index) => {
    if (card.dataset.collapseReady === "1") return;
    const title = card.querySelector(titleSelector);
    if (!title) return;

    const labelText = title.textContent.replace("↕", "").trim() || "Section";
    const key = `${storagePrefix}-${card.dataset.dockId || index}`;
    const header = document.createElement("div");
    header.className = "dock-header";

    const label = document.createElement("span");
    label.className = "dock-header-title";
    label.textContent = labelText;

    const toggle = document.createElement("button");
    toggle.className = "collapse-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", `Collapse ${labelText}`);

    card.classList.add("collapsible");
    card.dataset.collapseReady = "1";
    title.hidden = true;
    header.append(label, toggle);
    card.prepend(header);

    const setCollapsed = collapsed => {
      card.classList.toggle("collapsed", collapsed);
      toggle.textContent = collapsed ? "▸" : "▾";
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${labelText}`);
      localStorage.setItem(key, collapsed ? "1" : "0");
    };

    setCollapsed(localStorage.getItem(key) === "1");
    header.addEventListener("click", event => {
      event.preventDefault();
      setCollapsed(!card.classList.contains("collapsed"));
    });
  });
}

// Section toggles
window.addEventListener("DOMContentLoaded", () => {
  setupCollapsibleCards(".play-section-grid > .play-card", "h3", "pixelbug-play-collapse");
});
