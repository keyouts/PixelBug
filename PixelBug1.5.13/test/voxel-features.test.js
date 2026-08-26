const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const features = require("../src/modules/voxel-features.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
const renderer = fs.readFileSync(path.join(root, "src", "renderer.js"), "utf8");

test("connected selection stays on one island", () => {
  const cubes = [
    { x: 0, y: 0, z: 0, color: "#ffffff" },
    { x: 1, y: 0, z: 0, color: "#ffffff" },
    { x: 5, y: 0, z: 0, color: "#ffffff" }
  ];
  assert.deepEqual(features.connected(cubes, cubes[0]).map(features.key).sort(), ["0,0,0", "1,0,0"]);
  assert.equal(features.byColor([...cubes, { x: 2, y: 0, z: 0, color: "#000000" }], "#ffffff").length, 3);
});

test("voxel primitives support hollow shapes", () => {
  const box = { minX: 0, minY: 0, minZ: 0, maxX: 4, maxY: 4, maxZ: 4 };
  const solid = features.primitive("box", box);
  const hollow = features.primitive("box", box, { hollow: true, thickness: 1 });
  const cylinder = features.primitive("cylinder", box, { axis: "y" });
  assert.equal(solid.length, 125);
  assert.ok(hollow.length < solid.length);
  assert.ok(hollow.length > 0);
  assert.ok(cylinder.length > 0 && cylinder.length < solid.length);
});

test("mirror and pose interpolation preserve data", () => {
  const mirrored = features.mirror([{ x: 2, y: 3, z: 4, color: "#123456", partId: "arm" }], "x", { x: 5 });
  assert.deepEqual(mirrored[0], { x: 8, y: 3, z: 4, color: "#123456", partId: "arm" });
  const pose = features.poseLerp(
    { arm: { translation: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } } },
    { arm: { translation: { x: 10, y: 2, z: -2 }, rotation: { x: 90, y: 0, z: 0 }, scale: { x: 2, y: 1, z: 1 } } },
    0.5
  );
  assert.equal(pose.arm.translation.x, 5);
  assert.equal(pose.arm.rotation.x, 45);
  assert.equal(pose.arm.scale.x, 1.5);
});

test("camera views are bounded and cleaned", () => {
  const view = features.cameraView({ name: "Bad<>/View", yaw: 999, pitch: 999, zoom: 99, panX: 99999, panY: -99999, projection: "perspective" });
  assert.equal(view.name, "BadView");
  assert.equal(view.projection, "perspective");
  assert.ok(view.yaw <= Math.PI * 8);
  assert.ok(view.pitch <= Math.PI / 2);
  assert.equal(view.zoom, 5);
  assert.equal(view.panX, 4000);
  assert.equal(view.panY, -4000);
});

test("voxel expansion controls are connected", () => {
  [
    "voxel-mode-select-connected-btn",
    "voxel-mode-select-color-btn",
    "voxel-mode-shape-fill",
    "voxel-mode-cylinder-axis",
    "voxel-mode-part-duplicate-btn",
    "voxel-mode-part-solo-btn",
    "voxel-mode-pose-save-btn",
    "voxel-mode-animation-interpolation",
    "voxel-mode-camera-view-save-btn",
    "voxel-mode-focus-selection-btn"
  ].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  [
    "selectConnectedVoxelModeCubes",
    "mirrorCopyVoxelModeSelection",
    "duplicateVoxelModePart",
    "toggleVoxelModeSoloPart",
    "saveVoxelModePose",
    "focusVoxelModeSelection",
    "saveVoxelModeCameraView",
    "VoxelFeatures.poseLerp"
  ].forEach(name => assert.match(renderer, new RegExp(name.replace(".", "\\."))));
});

test("voxel expansion adds no package dependency", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(packageJson.dependencies, undefined);
  assert.deepEqual(Object.keys(packageJson.devDependencies).sort(), ["electron", "electron-builder"]);
});
