"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "src", "styles.css"), "utf8");
const renderer = fs.readFileSync(path.join(root, "src", "renderer.js"), "utf8");
const commands = fs.readFileSync(path.join(root, "src", "modules", "renderer", "command-workflow.js"), "utf8");
const documents = fs.readFileSync(path.join(root, "src", "modules", "renderer", "document-workflow.js"), "utf8");

test("command search stays keyboard first", () => {
  assert.doesNotMatch(html, /id="command-palette-btn"/);
  assert.match(html, /id="command-palette-overlay"/);
  assert.match(renderer, /Ctrl\+K|Meta\+K|command/i);
  assert.match(commands, /returnFocus/);
  assert.match(commands, /returnFocus\?\.isConnected/);
});

test("project tabs update and expose active state", () => {
  assert.match(documents, /function projectSnapshot\(project\)/);
  assert.match(documents, /JSON\.parse\(JSON\.stringify\(project\)\)/);
  assert.match(documents, /document-tab\$\{active \? " active" : ""\}/);
  assert.match(documents, /main\.setAttribute\("aria-selected", String\(active\)\)/);
  assert.match(documents, /focusDocumentTab\(next\.id\)/);
  assert.match(css, /\.document-tab\.active\s*\{/);
  assert.match(css, /\.document-tab-close\s*\{/);
});

test("touch layout is limited to base mode", () => {
  assert.match(renderer, /return touchMode && !printMode && !playModeScreen && !voxelModeScreen && !modMode/);
  assert.match(renderer, /function syncTouchLayout\(\)/);
  assert.match(renderer, /moveTouchUtilityDock\(active\)/);
  assert.match(renderer, /moveTouchToggle\(active\)/);
  assert.match(renderer, /touchHandPanel\.insertBefore\(touchToggleBtn, leftHandedToggleBtn \|\| null\)/);
  assert.match(renderer, /touchToggleHomeParent\.insertBefore\(touchToggleBtn, anchor\)/);
  ["setModMode", "setPlayModeScreen", "setVoxelModeScreen", "setPrintMode"].forEach(name => {
    const start = renderer.indexOf(`function ${name}`);
    assert.ok(start >= 0, `${name} is missing`);
    assert.match(renderer.slice(start, start + 900), /syncTouchLayout\(\)/, `${name} must restore the base touch layout`);
  });
  assert.match(css, /--touch-rail-height:\s*144px/);
  assert.match(css, /scrollbar-gutter:\s*stable/);
});

test("pixelizer accepts the same image repeatedly", () => {
  assert.match(renderer, /imageImportInput\.onchange = e => \{[\s\S]*?const file = e\.target\.files\[0\];[\s\S]*?e\.target\.value = "";[\s\S]*?loadImageFile\(file\);[\s\S]*?\};/);
  assert.match(renderer, /function openPixelizerModal\(\) \{[\s\S]*?if \(importedImage\) schedulePixelizerPreview\(\);[\s\S]*?else clearPixelizerPreview\(\);/);
});

test("timeline and voxel controls use balanced layouts", () => {
  assert.match(html, /aria-describedby="timeline-settings-help"/);
  assert.match(html, /id="timeline-settings-help"/);
  assert.match(css, /\.timeline-settings\s*\{[\s\S]*?border:\s*3px solid var\(--ink\)/);
  assert.match(css, /\.timeline-settings\[open\] summary\s*\{/);
  assert.match(css, /\.voxel-tool-groups\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.voxel-tool-group:nth-child\(2\) \.voxel-tool-row,[\s\S]*?repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.voxel-camera-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /#voxel-mode-turntable-btn\s*\{[\s\S]*?grid-column:\s*1 \/ -1;[\s\S]*?width:\s*100%/);
});
