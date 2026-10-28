"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const voxel = require("../src/modules/play-voxel-assets.js");
const exporter = require("../src/modules/tiny-game-export.js");

function fakeDocument() {
  const canvases = [];
  return {
    canvases,
    createElement(tag) {
      assert.equal(tag, "canvas");
      const fills = [];
      const canvas = {
        width: 0, height: 0, fills,
        getContext() {
          return {
            scale() {}, translate() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {},
            set fillStyle(value) { this.color = value; },
            fill() { fills.push(this.color); }
          };
        }
      };
      canvases.push(canvas);
      return canvas;
    }
  };
}

test("voxel assets are separate from placed scene instances and normalized safely", () => {
  const asset = voxel.normalizeAsset({ id: "blue house!", name: "House", width: 3, height: 2, depth: 3, cubes: [
    { x: 1, y: 0, z: 1, color: "#ff0000" },
    { x: 1, y: 0, z: 1, color: "#0000ff" },
    { x: 999, y: 0, z: 1, color: "#ffffff" },
    { x: 0, y: 1, z: 0, color: "red" }
  ] });
  assert.equal(asset.id, "blue-house-");
  assert.equal(asset.cubes.length, 1);
  const first = { voxelAssetId: asset.id, voxelYaw: 0, scale: 2, x: 10, y: 20 };
  const second = { ...first, x: 170, voxelYaw: 1 };
  assert.equal(voxel.findAsset([asset], first), asset);
  assert.equal(voxel.findAsset([asset], second), asset);
  assert.equal(voxel.findAsset([asset], { voxelAssetId: "missing" }), null);
  assert.equal(voxel.quarterTurn(5), 1);
  assert.equal(voxel.quarterTurn(-1), 3);
});

test("isometric voxel renderer hides interior faces and caches rotated models", () => {
  const asset = voxel.normalizeAsset({ width: 3, height: 3, depth: 3, cubes: [
    { x: 0, y: 0, z: 0, color: "#e00000" },
    { x: 1, y: 0, z: 0, color: "#0090e0" }
  ] });
  const doc = fakeDocument();
  const canvas = voxel.getCanvas(asset, 0, doc);
  assert.ok(canvas.width > 0 && canvas.height > 0);
  // Face counts
  assert.equal(canvas.fills.length, 5);
  assert.equal(voxel.getCanvas(asset, 0, doc), canvas);
  const rotated = voxel.getCanvas(asset, 1, doc);
  assert.notEqual(rotated, canvas);
  const measured = voxel.metrics([asset], { voxelAssetId: asset.id, voxelYaw: 1, scale: 3 }, doc);
  assert.equal(measured.canvas, rotated);
  assert.equal(measured.w, rotated.width * 3);
});

test("exporter embeds self-contained voxel runtime alongside existing 2D game runtime", () => {
  const html = exporter.buildTinyGameHtml({ title: "Mixed game", exportWidth: 320, exportHeight: 180,
    frames: {}, spriteFrames: {}, playMode: { voxelAssets: [voxel.normalizeAsset({ name: "Cube", width: 1, height: 1, depth: 1, cubes: [{ x:0,y:0,z:0,color:"#abcdef" }] })], props: [] } });
  assert.match(html, /const VOXEL =/);
  assert.match(html, /function voxelPropMetrics/);
  assert.match(html, /voxelMetrics\.canvas/);
  assert.match(html, /"voxelAssets"/);
  const runtime = vm.runInNewContext(voxel.standaloneSource);
  assert.equal(runtime.normalizeAsset({ width: 1, height: 1, depth: 1, cubes: [] }).cubes.length, 0);
});

test("voxel controls, project normalization and scene renderer are wired", () => {
  const root = path.join(__dirname, "..", "src");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const renderer = fs.readFileSync(path.join(root, "renderer.js"), "utf8");
  ["play-voxel-asset-select", "play-voxel-name", "play-voxel-yaw", "play-voxel-capture-btn", "play-voxel-update-btn", "play-voxel-delete-btn", "play-voxel-apply-btn"].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.ok(html.indexOf("play-voxel-assets.js") < html.indexOf("tiny-game-export.js"));
  assert.match(renderer, /voxelAssetId: String\(prop\.voxelAssetId/);
  assert.match(renderer, /playVoxelPropMetrics\(prop\)/);
  assert.match(renderer, /voxelAssets: \[\]/);
  assert.match(renderer, /renderPlayVoxelLibrary\(\)/);
});
