"use strict";

// Scale regression
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const baking = require("../src/modules/play-voxel-baking.js");
const voxel = require("../src/modules/play-voxel-assets.js");
const importer = require("../src/modules/play-voxel-part-import.js");

const root = path.join(__dirname, "..", "src");

function tools() {
  let current = {};
  return { maxCubes: voxel.MAX_CUBES, readPose() { return current; }, applyPose(pose) { current = pose; }, transformPoint(_cube, point) { return point; } };
}

function model(width, height, depth) {
  const cubes = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) for (let z = 0; z < depth; z++) {
    cubes.push({ x, y, z, color: "#d07512", partId: "one" });
  }
  return { width, height, depth, cubes, parts: [{ id: "one", name: "High resolution part" }], poseLibrary: [], animationFrames: [], rigPreview: false };
}

test("sparse 512-wide high-resolution voxel assets keep their actual coordinates", () => {
  const sparse = voxel.normalizeAsset({ width: 512, height: 512, depth: 64, cubes: [
    { x: 511, y: 511, z: 63, color: "#ff00aa" },
    { x: 0, y: 0, z: 0, color: "#00ff99" }
  ] });
  assert.equal(sparse.cubes.length, 2);
  assert.equal(sparse.width, 512);
  assert.equal(sparse.height, 512);
  assert.equal(sparse.cubes[0].x, 511);
});

test("dense high-resolution parts compact at import, without truncating the tail", () => {
  const source = model(200, 150, 2);
  const imported = importer.create(source, importer.targets(source, "one"), baking, voxel, tools(), 32, []);
  assert.equal(imported.length, 1);
  assert.ok(imported[0].detailStep >= 2);
  assert.ok(imported[0].cubes.length <= voxel.MAX_CUBES);
  assert.ok(imported[0].cubes.some(cube => cube.x > 70), "geometry at the far side of the original model is represented");
  assert.equal(imported[0].poses.length, 0);
  assert.equal(source.cubes.length, 60000);
  assert.equal(source.rigPreview, false);
});

test("high voxel count above safe import budget fails clearly instead of truncating", () => {
  const source = model(512, 512, 2);
  assert.throws(() => importer.capture(source, "large", "Large", baking, voxel, tools(), []), /Split the model into smaller named parts/);
  assert.equal(source.rigPreview, false);
});

test("voxel images use a bounded per-asset cache and a separate higher-detail background", () => {
  let created = 0;
  const doc = { createElement: tag => {
    assert.equal(tag, "canvas");
    created++;
    return { width: 0, height: 0, getContext: () => ({scale(){}, translate(){}, beginPath(){}, moveTo(){}, lineTo(){}, closePath(){}, fill(){}}) };
  } };
  const asset = voxel.normalizeAsset({ width: 100, height: 1, depth: 1, cubes: [{ x: 0, y: 0, z: 0, color: "#aabbcc" }, { x: 99, y: 0, z: 0, color: "#aabbcc" }] });
  const basic = voxel.getCanvas(asset, 0, doc);
  const backdrop = voxel.getCanvas(asset, 0, doc, "", "background");
  assert.ok(backdrop.width > basic.width);
  assert.equal(voxel.getCanvas(asset, 0, doc), basic);
  assert.equal(voxel.getCanvas(asset, 0, doc, "", "background"), backdrop);
  assert.equal(created, 2);
});

test("play workspace uses an intrinsic preview height and a single scrolling column", () => {
  const css = fs.readFileSync(path.join(root, "styles-workspaces.css"), "utf8");
  const body = css.match(/\.play-workspace-body\s*\{([^}]+)\}/)?.[1] || "";
  const preview = css.match(/\.play-workspace-preview-pane\s*\{([^}]+)\}/)?.[1] || "";
  assert.match(body, /display:\s*block/);
  assert.match(body, /overflow-y:\s*auto/);
  assert.match(preview, /height:\s*auto/);
  assert.match(preview, /min-height:\s*max-content/);
  assert.match(preview, /margin-bottom:\s*18px/);
});
