"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const voxel = require("../src/modules/play-voxel-assets.js");
const baking = require("../src/modules/play-voxel-baking.js");
const controls = require("../src/modules/play-voxel-controls.js");
const exporter = require("../src/modules/tiny-game-export.js");

// Rig snapshots
test("saved poses bake into independent frames and leave the original rig untouched", () => {
  const rig = { arms: { translation: { x: 0 } } };
  const source = {
    rigPreview: false,
    cubes: [{ x: 1, y: 1, z: 1, color: "#ff0099" }],
    poseLibrary: [{ name: "Jump", poses: { arms: { translation: { x: 2 } } } }],
    animationFrames: [{ cubes: [{ x: 1, y: 2, z: 1, color: "#ff0099" }], poses: { arms: { translation: { x: 1 } } } }]
  };
  let pose = JSON.parse(JSON.stringify(rig));
  const tools = {
    maxCubes: 24000,
    readPose: () => JSON.parse(JSON.stringify(pose)),
    applyPose: next => { pose = JSON.parse(JSON.stringify(next)); },
    transformPoint: (_, point) => ({ ...point, x: point.x + Number(pose.arms.translation.x) })
  };
  const baked = baking.bake(source, tools);
  assert.equal(baked.poses.length, 2);
  assert.deepEqual(baked.poses.map(p => p.name), ["Pose: Jump", "Frame 1"]);
  assert.deepEqual(baked.poses.map(p => p.cubes[0].x), [2, 1]);
  assert.equal(baked.cubes[0].x, 0);
  assert.equal(pose.arms.translation.x, 0);
  assert.equal(source.rigPreview, false);
  const asset = voxel.normalizeAsset({ id: "hero", name: "Hero", ...baked });
  assert.equal(asset.poses.length, 2);
  assert.equal(asset.poses[0].cubes[0].color, "#ff0099");
});

test("pose baking always restores the original even if a rig transformation fails", () => {
  const source = { rigPreview: false, cubes: [{ x: 0, y: 0, z: 0, color: "#abcdef" }], poseLibrary: [{ name: "Broken", poses: { moved: true } }] };
  let pose = { moved: false };
  const tools = { maxCubes: 24000, readPose: () => ({ ...pose }), applyPose: next => { pose = { ...next }; }, transformPoint: (_, point) => {
    if (pose.moved) throw new Error("rig failed");
    return point;
  } };
  assert.throws(() => baking.bake(source, tools), /rig failed/);
  assert.equal(pose.moved, false);
  assert.equal(source.rigPreview, false);
});

// Pose rendering
test("different pose frames get independent cached voxel renders", () => {
  const asset = voxel.normalizeAsset({ id: "hero", width: 3, height: 3, depth: 2, cubes: [{ x: 0, y: 0, z: 0, color: "#ff0000" }], poses: [
    { id: "jump", name: "Jump", cubes: [{ x: 1, y: 2, z: 0, color: "#ff0000" }] }
  ] });
  const doc = { createElement() {
    return { width: 0, height: 0, getContext() { return { scale() {}, translate() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {} }; } };
  } };
  const base = voxel.getCanvas(asset, 0, doc, "");
  const jump = voxel.getCanvas(asset, 0, doc, "jump");
  assert.notEqual(base, jump);
  assert.equal(voxel.getCanvas(asset, 0, doc, "jump"), jump);
  assert.equal(voxel.metrics([asset], { voxelAssetId: "hero", voxelPoseId: "jump", scale: 3 }, doc).canvas, jump);
  assert.equal(voxel.metrics([asset], { voxelAssetId: "hero", voxelPoseId: "missing", scale: 3 }, doc).canvas !== null, true);
});

// Selector controls
test("voxel library exposes separate reusable assets and player pose choices", () => {
  const oldOption = global.Option;
  global.Option = class { constructor(text, value) { this.text = text; this.value = value; } };
  const select = () => ({ value: "", options: [], replaceChildren(...values) { this.options = [...values]; this.value = values[0]?.value || ""; }, add(value) { this.options.push(value); } });
  try {
    const librarySelect = select(), objectSelect = select(), idleSelect = select(), jumpSelect = select(), walkSelect = select();
    const asset = { id: "hero", name: "Hero", cubes: [{x:0,y:0,z:0}], poses: [{id:"jump",name:"Pose: Jump",cubes:[{x:0,y:0,z:0}]}] };
    const settings = { voxelActorAssetId: "hero", voxelIdlePoseId: "", voxelJumpPoseId: "jump", voxelWalkPoseId: "" };
    const controlsSet = { assetSelect: objectSelect, librarySelect, nameInput: { value: "" }, updateBtn: {}, deleteBtn: {}, poseSelect: select(), summary: { textContent: "" } };
    controls.renderLibrary(controlsSet, [asset], null);
    assert.equal(objectSelect.options.length, 2);
    assert.equal(librarySelect.options[1].value, "hero");
    controls.renderActor({assetSelect: select(), idleSelect, jumpSelect, walkSelect}, [asset], settings);
    assert.equal(jumpSelect.value, "jump");
    assert.equal(walkSelect.disabled, false);
    assert.equal(idleSelect.options.length, 2);
  } finally { global.Option = oldOption; }
});

// Export coverage
test("voxel character and saved pose choices are preserved in the exported runtime", () => {
  const source = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");
  const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  const asset = voxel.normalizeAsset({ id:"hero", width:1, height:1, depth:1, cubes:[{x:0,y:0,z:0,color:"#ff0000"}], poses:[{id:"jump",name:"Jump",cubes:[{x:0,y:0,z:0,color:"#ffff00"}]}] });
  const game = exporter.buildTinyGameHtml({ title: "Rig Game", artWidth:16, artHeight:16, exportWidth:320, exportHeight:240, playMode: { voxelActorAssetId:"hero", voxelIdlePoseId:"", voxelJumpPoseId:"jump", voxelAssets:[asset], props:[] } });
  assert.match(game, /"voxelJumpPoseId":"jump"/);
  assert.match(game, /poseField = !actor.grounded/);
  assert.match(game, /metrics.voxel/);
  assert.match(source, /voxelPoseId: String\(prop.voxelPoseId/);
  assert.match(source, /voxelPoseId: String\(item.prop\?\.voxelPoseId/);
  for (const id of ["play-workspace-voxels-btn", "play-voxel-library-select", "play-voxel-actor-asset", "play-voxel-idle-pose", "play-voxel-jump-pose", "play-voxel-walk-pose", "play-voxel-place-btn"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

// Comment policy
test("source comments use exactly two word section headings", () => {
  const root = path.join(__dirname, "..");
  function visit(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, item.name);
      if (item.isDirectory()) { visit(filename); continue; }
      if (!/\.(?:js|css|html|py)$/.test(filename)) continue;
      const source = fs.readFileSync(filename, "utf8");
      let comments = [];
      if (/\.css$/.test(filename)) comments = [...source.matchAll(/\/\*([\s\S]*?)\*\//g)].map(match => match[1]);
      else if (/\.html$/.test(filename)) comments = [...source.matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1]);
      else comments = [...source.matchAll(/^\s*(?:\/\/|#)(.*)$/gm)].map(match => match[1]);
      for (const comment of comments) assert.match(comment.trim(), /^[a-z][\w-]*\s+[a-z][\w-]*$/i, `${filename}: ${comment}`);
    }
  }
  for (const relative of ["src", "scripts", "integrations"]) visit(path.join(root, relative));
});
