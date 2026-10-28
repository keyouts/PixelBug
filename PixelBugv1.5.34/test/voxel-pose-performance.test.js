"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const history = require("../src/modules/voxel-pose-history.js");
const src = path.join(__dirname, "../src");
const renderer = fs.readFileSync(path.join(src, "renderer.js"), "utf8");
const html = fs.readFileSync(path.join(src, "index.html"), "utf8");
const css = fs.readFileSync(path.join(src, "styles-workspaces.css"), "utf8");
const workspace = fs.readFileSync(path.join(src, "modules/voxel-workspaces.js"), "utf8");

// Pose history
test("pose undo stores only part transforms, not large voxel geometry", () => {
  const cubes = Array.from({ length: 80000 }, (_, n) => ({ x: n % 200, y: Math.floor(n / 200) % 200, z: Math.floor(n / 40000), color: "#223344" }));
  const model = { cubes, parts: [{ id: "arm", translation: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }], rigVisible: true, rigPreview: true };
  const before = history.capture(model);
  assert.equal(JSON.stringify(before).length < 250, true);
  assert.equal(Object.hasOwn(before, "cubes"), false);
  model.parts[0].rotation.x = 45;
  const after = history.capture(model);
  assert.equal(history.changed(before, after), true);
  assert.equal(history.restore(model, before), true);
  assert.equal(model.parts[0].rotation.x, 0);
  assert.strictEqual(model.cubes, cubes);
  assert.equal(model.cubes.length, 80000);
  assert.equal(history.restore(model, after), true);
  assert.equal(model.parts[0].rotation.x, 45);
});

test("pose history restores parts by ID even when part order changes", () => {
  const model = { parts: [{ id: "left", rotation: { x: 0 } }, { id: "right", rotation: { x: 25 } }], rigVisible: false, rigPreview: false };
  const saved = history.capture(model);
  model.parts.reverse();
  model.parts[0].rotation.x = 90;
  model.rigVisible = true;
  assert.equal(history.restore(model, saved), true);
  assert.equal(model.parts.find(part => part.id === "right").rotation.x, 25);
  assert.equal(model.parts.find(part => part.id === "left").rotation.x, 0);
  assert.equal(model.rigVisible, false);
  assert.equal(model.rigPreview, false);
  assert.equal(history.changed(saved, history.capture({ ...model, parts: [model.parts[1], model.parts[0]] })), false);
});

test("pose history ignores missing parts and preserves unrelated properties", () => {
  const model = { cubes: [{ id: "cube" }], parts: [{ id: "head", name: "Head", custom: 42, translation: { x: 3 } }] };
  const saved = history.capture(model);
  assert.equal(history.restore(model, { ...saved, parts: [{ id: "missing", rotation: { x: 12 } }] }), false);
  assert.equal(model.parts[0].name, "Head");
  assert.equal(model.parts[0].custom, 42);
  assert.equal(history.changed(saved, saved), false);
});

// Render quality
test("high-resolution posing uses temporary lighter preview and bounded pixel density", () => {
  assert.match(renderer, /voxelModePoseFastPreview && cubeCount > VOXEL_MODE_HEAVY_CUBE_LIMIT && options\.exporting !== true/);
  assert.match(renderer, /voxelModePoseFastPreview \? 4500 : VOXEL_MODE_DRAFT_DOT_LIMIT/);
  assert.match(renderer, /voxelModeIsHeavy\(\) \? 1\.5 : 2/);
  assert.match(renderer, /if \(mode === "pose-bone"\) \{ voxelModePoseFastPreview = false; clearVoxelModePreviewSchedule\(\); \}/);
  assert.match(renderer, /__pixelBugVoxelPose/);
  assert.match(renderer, /restoreVoxelModePoseHistory\(entry\.before\)/);
  assert.match(renderer, /restoreVoxelModePoseHistory\(entry\.after\)/);
});

// Rig layout
test("quick pose and pose library move into a distinct accessible sidebar beside the model", () => {
  assert.match(html, /aria-label="Live voxel pose controls"[^>]*class="voxel-workspace-pose-sidebar"/);
  assert.match(workspace, /source\.querySelector\("\.voxel-quick-pose"\)/);
  assert.match(workspace, /source\.querySelector\("\.voxel-pose-section"\)/);
  assert.match(workspace, /restoreNodes\(activePoseNodes\)/);
  assert.match(css, /data-active-workspace="rigging"\] \.voxel-workspace-preview-pane\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) minmax\(255px, 318px\);/);
  assert.match(css, /data-active-workspace="rigging"\] \.voxel-workspace-pose-sidebar:not\(\[hidden\]\)/);
});

// Slider layout
test("quick pose rotation slider gets its own full-width row and accessible degree readout", () => {
  assert.match(html, /class="voxel-quick-pose-reading"[\s\S]*?<label for="voxel-mode-quick-pose-rotation">Rotation<\/label>[\s\S]*?id="voxel-mode-quick-pose-output"/);
  assert.match(html, /id="voxel-mode-quick-pose-rotation"[\s\S]*?class="voxel-quick-pose-actions"/);
  assert.match(css, /\.voxel-quick-pose-controls\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /\.voxel-quick-pose-actions\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.voxel-quick-pose input\[type="range"\]\s*\{[^}]*touch-action:\s*none/);
});
