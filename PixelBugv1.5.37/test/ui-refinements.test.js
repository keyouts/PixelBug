"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("rule editor keeps compact branching and focused map layout", () => {
  const editor = read("src/modules/node-editor.js");
  const styles = read("src/styles-workspaces.css");
  assert.doesNotMatch(editor, /Not three yet\. Touch it again\./);
  assert.match(editor, /Keep going\. Move away, then return to the counter\./);
  assert.match(styles, /\.node-editor-ports \{ display:grid; grid-template-columns:1fr;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-details > \.node-editor-workspace \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: minmax\(0, 1fr\) 264px;[\s\S]*?overflow: hidden;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-details \{[\s\S]*?position: absolute;[\s\S]*?inset: 9px;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-details > \.node-editor-workspace \{[\s\S]*?position: absolute;[\s\S]*?inset: 0;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-column \{[\s\S]*?width: 100%;[\s\S]*?height: auto;/);
  assert.match(styles, /\.node-editor-inspector \{[\s\S]*?contain: inline-size;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-inspector \{[\s\S]*?flex: 0 0 264px;[\s\S]*?width: 264px;[\s\S]*?min-width: 264px;[\s\S]*?max-width: 264px;/);
  assert.doesNotMatch(editor, /data-node-editor-focus-exit/);
  assert.match(editor, /button\(overlayMapFocus \? "Exit Focus" : "Focus Map"/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-lens \{[\s\S]*?position: relative;/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-lens\[open\] \{[\s\S]*?height: min\(164px, 26vh\);[\s\S]*?min-height: min\(164px, 26vh\);/);
  assert.match(styles, /\.node-editor-map-focus \.node-editor-map-column \{[\s\S]*?height: auto;[\s\S]*?overflow: hidden;/);
  assert.doesNotMatch(styles, /\.node-editor-map-focus \.node-editor-map-column \{[\s\S]*?contain: size/);
  assert.doesNotMatch(styles, /\.node-editor-map-focus \.node-editor-large-board \{[\s\S]*?contain: size/);
  assert.match(styles, /\.node-editor-node\.concept-outcome \{[\s\S]*?background: var\(--accent, var\(--warn\)\);/);
});

test("voxel slice focus reuses the live editors", () => {
  const html = read("src/index.html");
  const focus = read("src/modules/voxel-slice-focus.js");
  const styles = read("src/styles-workspaces.css");
  assert.match(html, /id="voxel-slice-focus-btn"/);
  assert.match(html, /modules\/voxel-slice-focus\.js/);
  assert.match(focus, /document\.body\.classList\.toggle\("voxel-slice-focus"/);
  assert.match(focus, /event\.key !== "Escape"/);
  assert.match(styles, /body\.voxel-mode\.voxel-slice-focus \.voxel-mode-layout > \.voxel-preview-card/);
  assert.match(styles, /body\.voxel-mode\.voxel-slice-focus \.voxel-preview-card > :not\(\.voxel-preview-head\):not\(\.voxel-mode-stage\)/);
  assert.equal((html.match(/id="voxel-mode-preview"/g) || []).length, 1);
  assert.equal((html.match(/id="voxel-paint-canvas"/g) || []).length, 1);
});

test("voxel preview tools can collapse without replacing the live preview", () => {
  const html = read("src/index.html");
  const focus = read("src/modules/voxel-slice-focus.js");
  const styles = read("src/styles-workspaces.css");
  assert.match(html, /id="voxel-preview-tools-toggle"[^>]*>Minimize Tools<\/button>/);
  assert.match(html, /id="voxel-preview-toolbar"/);
  assert.match(focus, /classList\.toggle\("voxel-preview-tools-collapsed"/);
  assert.match(focus, /previewToolsButton\.setAttribute\("aria-expanded"/);
  assert.match(styles, /\.voxel-preview-card\.voxel-preview-tools-collapsed > \.voxel-preview-toolbar \{[\s\S]*?display: none;/);
  assert.equal((html.match(/id="voxel-mode-preview"/g) || []).length, 1);
});

test("selects and scene setup use the revised visual hierarchy", () => {
  const styles = read("src/styles-workspaces.css");
  assert.match(styles, /\.play-scene-setup-layout \{[\s\S]*?grid-template-columns: 1fr;/);
  assert.match(styles, /\/\* Select styling \*\/[\s\S]*?color-scheme: light;/);
  assert.match(styles, /:root\[data-theme="dark"\] select \{[\s\S]*?color-scheme: dark;/);
  assert.match(styles, /\/\* Select styling \*\/[\s\S]*?select,[\s\S]*?transform: none;[\s\S]*?transition: background-color/);
  assert.doesNotMatch(read("src/styles.css"), /button:hover,[\s\S]{0,120}select:hover/);
  assert.doesNotMatch(read("src/styles.css"), /button:active,[\s\S]{0,120}select:active/);
  assert.doesNotMatch(styles, /select option,[\s\S]{0,180}font-weight:/);
  assert.match(styles, /\.voxel-preview-card \{[\s\S]*?"preview-stage preview-toolbar"/);
});
