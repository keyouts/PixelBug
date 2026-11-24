"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const layer = require("../src/modules/play-layered-character.js");
const voxels = require("../src/modules/play-voxel-assets.js");
const scene = require("../src/modules/renderer/play-scene-model.js");
const root = path.resolve(__dirname, "..", "src");
function makeFrame(color, visible = true) {
  return { layers: [
    { visible, opacity: 1, pixels: [[color,null],[null,"#00FF00"]] },
    { visible: true, opacity: 1, pixels: [[null,"#0000ff"],[null,null]] }
  ]};
}
const options = { firstFrame:0,poseCount:2,width:2,height:2,size:16,thickness:2,name:"Layer Hero" };
test("Base layers become depth slices and frames become aligned voxel poses", () => {
  const frames=[makeFrame("#FF0000"),makeFrame("#FFFF00")];
  const before=JSON.stringify(frames);
  const model=layer.create(frames,options);
  assert.equal(model.width,2);assert.equal(model.height,2);assert.equal(model.depth,4);
  assert.equal(model.poses.length,2);assert.equal(model.poses[0].cubes.length,6);
  assert.deepEqual(model.poses[0].cubes.find(c=>c.color==="#ff0000"),{x:0,y:1,z:0,color:"#ff0000"});
  assert.equal(model.poses[0].cubes.filter(c=>c.color==="#0000ff").length,2);
  assert.equal(model.poses[1].cubes.find(c=>c.x===0&&c.y===1).color,"#ffff00");
  assert.equal(JSON.stringify(frames),before);
  assert.equal(voxels.normalizeAsset(model).poses.length,2);
});
test("invisible layers are excluded without breaking reusable pose dimensions", () => {
  const source=[makeFrame("#ff0000"),makeFrame("#ff00ff",false)];
  const model=layer.create(source,options);
  assert.equal(model.depth,4);
  assert.equal(model.poses[1].cubes.length,2);
});
test("bounds reject invalid layer grids, excessive counts and empty frames", () => {
  assert.throws(()=>layer.create([makeFrame("#fff")],{...options,poseCount:2}),/Not enough/);
  assert.throws(()=>layer.create([{layers:[{pixels:[]}]}],{...options,poseCount:1}),/invalid layer grid/);
  assert.throws(()=>layer.create([{layers:[{visible:false,pixels:[[null,null],[null,null]]}]}],{...options,poseCount:1}),/no visible layers/);
  assert.throws(()=>layer.create([makeFrame("#ffffff")],{...options,poseCount:30}),/Not enough|poses|poseCount/);
  assert.throws(()=>layer.create([makeFrame("#ffffff")],{...options,poseCount:1,width:0}),/Invalid width|invalid layer grid|no colored/);
});
test("shared voxel animation selects bounded, deterministic poses and legacy fallbacks", () => {
  const pm={voxelIdlePoseId:"idle",voxelWalkPoseId:"old",voxelWalkPoseClip:"p1,p2,p3",voxelPoseClipTicks:4};
  assert.equal(voxels.selectActorPose(pm,"voxelWalkPoseId",0),"p1");
  assert.equal(voxels.selectActorPose(pm,"voxelWalkPoseId",4),"p2");
  assert.equal(voxels.selectActorPose(pm,"voxelWalkPoseId",12),"p1");
  assert.equal(voxels.selectActorPose(pm,"voxelIdlePoseId",55),"idle");
  assert.equal(voxels.selectActorPose({...pm,voxelWalkPoseClip:"<svg>,safe"},"voxelWalkPoseId",0),"safe");
});
test("voxel actor and its animation settings round-trip through the scene model", () => {
  const clone=x=>JSON.parse(JSON.stringify(x));
  const deps={sceneId:id=>id,parseClip:()=>[],quarterTurn:n=>Number(n)||0,clone,
    defaultVisualLayers:()=>[],defaultDialogue:()=>({}),defaultUi:()=>({}),
    normalizeWorld:()=>null,normalizeAudio:()=>({})};
  const state={voxelActorAssetId:"hero",voxelIdlePoseId:"p1",voxelWalkPoseId:"p2",voxelJumpPoseId:"p3",voxelIdlePoseClip:"p1",voxelWalkPoseClip:"p2,p3",voxelPoseClipTicks:5};
  const saved=scene.snapshot(state,"one","One",deps);
  const pm={};scene.apply(pm,saved,deps);
  for(const key of Object.keys(state))assert.equal(pm[key],state[key]);
  const legacy={...saved};for(const key of Object.keys(state))delete legacy[key];
  scene.apply(pm,legacy,deps);assert.equal(pm.voxelActorAssetId,"hero");
});
test("editor and self-contained HTML export use the same voxel pose playback policy", () => {
  const editor=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
  const exporter=fs.readFileSync(path.join(root,"modules/tiny-game-export.js"),"utf8");
  assert.match(editor,/PixelBugPlayVoxelAssets\.selectActorPose\(/);
  assert.match(exporter,/VOXEL\.selectActorPose\(/);
  assert.match(exporter,/VOXEL\.actorVolume\(/);
  assert.match(editor,/PixelBugPlayVoxelAssets\.actorVolume\(/);
  assert.match(fs.readFileSync(path.join(root,"modules/play-voxel-assets.js"),"utf8"),/function actorSprite\(/);
  assert.match(fs.readFileSync(path.join(root,"index.html"),"utf8"),/play-layer-voxel-use/);
});

test("layered pixel conversion refuses oversized pose payloads and embedded markup", () => {
  const pixels = Array.from({ length: 32 }, () => Array(32).fill("#123456"));
  const frames = Array.from({ length: 12 }, () => ({ layers: Array.from({ length: 4 }, () => ({ visible: true, pixels })) }));
  assert.throws(() => layer.create(frames, { firstFrame: 0, poseCount: 12, width: 32, height: 32, size: 32, thickness: 1 }), /safe voxel budget/);
  const candidate = layer.create([makeFrame("<script>")], { ...options, poseCount: 1, name: "<script>character</script>" });
  assert.doesNotMatch(candidate.name, /[<>]/);
  assert.equal(candidate.poses[0].cubes.some(c => c.color.includes("script")), false);
});
