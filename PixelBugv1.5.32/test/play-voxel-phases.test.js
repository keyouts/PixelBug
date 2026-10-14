"use strict";

// Integration coverage
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const voxel = require("../src/modules/play-voxel-assets.js");
const baking = require("../src/modules/play-voxel-baking.js");
const parts = require("../src/modules/play-voxel-part-import.js");
const game = require("../src/modules/tiny-game-export.js");
const root = path.join(__dirname, "..", "src");
const renderer = fs.readFileSync(path.join(root, "renderer.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles-workspaces.css"), "utf8");

function tools() {
  let current = { shift: 0 };
  return {
    maxCubes: 24000,
    readPose: () => ({ ...current }),
    applyPose: pose => { current = { ...pose }; },
    transformPoint: (_cube, point) => ({ ...point, x: point.x + (current.shift || 0) })
  };
}
function model() {
  return {
    cubes: [
      { x: 0, y: 0, z: 0, color: "#ff0000", partId: "tree" },
      { x: 2, y: 0, z: 0, color: "#00ff00", partId: "house" },
      { x: 3, y: 1, z: 0, color: "#00ff00", partId: "house" }
    ],
    parts: [{ id: "tree", name: "Tree" }, { id: "house", name: "House" }],
    poseLibrary: [{ name: "Wave", poses: { shift: 1 } }],
    animationFrames: [], rigPreview: false
  };
}

test("voxel mode parts import into independent reusable assets with pose frames", () => {
  const source = model();
  const output = parts.create(source, parts.targets(source, "", true), baking, voxel, tools(), 32, []);
  assert.deepEqual(output.map(a => a.name), ["Tree", "House"]);
  assert.deepEqual(output.map(a => a.cubes.length), [1, 2]);
  assert.notEqual(output[0].id, output[1].id);
  assert.equal(output[0].poses[0].name, "Pose: Wave");
  assert.equal(output[1].poses[0].cubes.length, 2);
  assert.equal(source.cubes.length, 3);
  assert.equal(source.rigPreview, false);
  assert.deepEqual(parts.targets(source, "house").map(p => p.name), ["House"]);
  assert.throws(() => parts.create(source, parts.targets(source, "", true), baking, voxel, tools(), 1, []), /Only 1/);
});

test("repeated object instances share a cached model even after normalization", () => {
  const asset = voxel.normalizeAsset({ id: "tree", width: 2, height: 2, depth: 2, cubes: model().cubes.slice(0, 1) });
  assert.equal(voxel.normalizeAsset(asset), asset);
  const forged = { ...asset, __voxelAssetReady: true, cubes: [{x: -9, y:0,z:0,color:"#123456"}] };
  assert.notEqual(voxel.normalizeAsset(forged), forged);
  assert.equal(voxel.normalizeAsset(forged).cubes.length, 0);
  let count = 0;
  const doc = { createElement: () => { count++; return { width: 0, height: 0, getContext: () => ({scale(){}, translate(){}, beginPath(){}, moveTo(){}, lineTo(){}, closePath(){}, fill(){}}) }; } };
  const a = voxel.metrics([voxel.normalizeAsset(asset)], { voxelAssetId: "tree", scale: 2 }, doc);
  const b = voxel.metrics([voxel.normalizeAsset(asset)], { voxelAssetId: "tree", scale: 3 }, doc);
  assert.equal(a.canvas, b.canvas);
  assert.equal(count, 1);
});

test("voxel background rendering supports four modes and large camera scroll offsets", () => {
  const result = [];
  const ctx = { save(){}, restore(){}, drawImage(...args) { result.push(args); }, set imageSmoothingEnabled(_) {} };
  const image = { width: 36, height: 24 };
  for (const mode of ["cover", "contain", "tile", "stretch"]) {
    result.length = 0;
    assert.equal(voxel.drawBackdrop(ctx, image, 640, 360, mode, 9000), true);
    assert.ok(result.length >= 1 && result.length <= 128);
    assert.ok(result.some(args => args[1] < 640 && args[1] + args[3] >= 0), `${mode} still covers the viewport at the far end of the world`);
  }
});

test("import keeps parts atomic if a later rig pose fails", () => {
  const source = model();
  const before = JSON.stringify(source);
  const broken = { bake(_source, _tools, partId) { if (partId === "house") throw new Error("Broken rig"); return { width:1,height:1,depth:1,cubes:[{x:0,y:0,z:0,color:"#123456"}],poses:[] }; } };
  assert.throws(() => parts.create(source, parts.targets(source, "", true), broken, voxel, tools(), 32, []), /Broken rig/);
  assert.equal(JSON.stringify(source), before);
});

test("voxel backgrounds and node rules survive the standalone HTML export", () => {
  const data = voxel.normalizeAsset({ id: "hill", width:2, height:2, depth:2, cubes:[{x:0,y:0,z:0,color:"#ff0000"}] });
  const payload = { title:"Voxel landscape", exportWidth: 640, exportHeight: 360, playMode: {
    voxelAssets: [data], voxelBackgroundAssetId:"hill", voxelBackgroundYaw:2, backgroundScale:"tile", sceneWidth:640, sceneHeight:360,
    props:[{frame:0,voxelAssetId:"hill", x:180,y:200,solid:true,voxelInFront:true,nodeTriggerId:"hill-touch"}],
    scenes:[{id:"first",voxelBackgroundAssetId:"hill",voxelBackgroundYaw:2,props:[{frame:0,voxelAssetId:"hill",x:180,y:200,solid:true,voxelInFront:true,nodeTriggerId:"hill-touch"}]}],
    activeSceneId:"first", nodeEditor:{nodes:[{id:"touch",type:"eventObjectTouch",next:"say",data:{objectId:"hill-touch"}},{id:"say",type:"actionMessage",next:"",data:{message:"The hill is here"}}]}
  }};
  const exported = game.buildTinyGameHtml(payload);
  assert.match(exported, /"voxelBackgroundAssetId":"hill"/);
  assert.match(exported, /VOXEL\.drawBackdrop\(ctx/);
  assert.match(exported, /RULES\.eventMatches/);
  assert.match(exported, /"hill-touch"/);
  assert.match(exported, /"voxelInFront":true/);
  assert.doesNotThrow(() => new vm.Script(exported.match(/<script>([\s\S]*)<\/script>/)?.[1] || ""));
  assert.match(renderer, /voxelBackgroundAssetId: String\(source\.voxelBackgroundAssetId/);
  assert.match(renderer, /"voxelBackgroundAssetId", "voxelBackgroundYaw"/);
});

test("play editor places full-width preview above tool controls and retains the node editor", () => {
  assert.match(css, /\.play-workspace-body\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(html, /class="play-workspace-preview-pane"[\s\S]*?id="play-workspace-preview-host"[\s\S]*?id="play-workspace-controls"/);
  for (const id of ["play-workspace-voxels-btn", "play-voxel-import-part-btn", "play-voxel-import-all-parts-btn", "play-voxel-background", "play-voxel-part-select", "play-canvas", "play-run-btn", "play-export-game-btn"]) assert.ok(html.includes(`id="${id}"`), id);
  assert.match(html, /data-play-workspace-switch="voxels"/);
  assert.match(renderer, /drawPlayVisualLayers\("foreground"\)/);
  assert.match(fs.readFileSync(path.join(root, "modules", "node-editor.js"), "utf8"), /card.id = "node-editor-card"/);
});


test("the player draws between back and front voxel objects without tinting the HUD", () => {
  const exported = game.buildTinyGameHtml({ title: "Depth", exportWidth: 320, exportHeight: 240, playMode: { props: [
    { frame:0, x:20, y:30, voxelInFront:false }, { frame:0, x:60, y:30, voxelInFront:true }
  ] } });
  const script = exported.match(/<script>([\s\S]*)<\/script>/)?.[1] || "";
  const drawing = script.slice(script.indexOf("function draw() {"), script.indexOf("function step(") );
  assert.ok(drawing.indexOf("drawObjectsAtDepth(false);") < drawing.indexOf("const moving ="));
  assert.ok(drawing.indexOf("const moving =") < drawing.indexOf("drawObjectsAtDepth(true);"));
  assert.match(drawing, /drawObjectsAtDepth\(true\);\s*ctx\.globalAlpha = 1;\s*drawLayers\("foreground"\)/);
  assert.match(renderer, /drawObjectsAtDepth\(false\);[\s\S]*?playCtx\.drawImage[\s\S]*?drawObjectsAtDepth\(true\)/);
  assert.match(renderer, /voxelInFront: prop\.voxelInFront === true/);
  assert.match(html, /<select id="play-prop-depth"[^>]*>[\s\S]*?Behind Player[\s\S]*?In Front of Player/);
  assert.doesNotThrow(() => new vm.Script(script));
});

test("workspace navigation includes a single row of tools at large screen sizes", () => {
  assert.match(css, /\.play-workspace-switcher\s*\{\s*grid-template-columns: repeat\(9, minmax\(82px, 1fr\)\)/);
  assert.match(css, /\.play-workspace-body\s*\{[\s\S]*?overflow-y: auto/);
  assert.match(css, /\.play-workspace-dialog \.play-stage-layout\s*\{\s*grid-template-columns: minmax\(0, 1fr\)/);
});
