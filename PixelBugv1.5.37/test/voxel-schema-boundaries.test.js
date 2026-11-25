"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Schema = require("../src/modules/renderer/voxel-model-schema.js");
const VoxelWeighting = require("../src/modules/renderer/../voxel-weighting.js");

function schema() {
  return Schema.create({
    VOXEL_MODE_VIEW_LABELS:["Front","Right","Back","Left","Top","Bottom"],
    VOXEL_MODE_CAMERA_PRESETS:[{yaw:0,pitch:0},{yaw:Math.PI/2,pitch:0},
      {yaw:Math.PI,pitch:0},{yaw:-Math.PI/2,pitch:0},
      {yaw:0,pitch:-Math.PI/2},{yaw:0,pitch:Math.PI/2},
      {yaw:Math.PI/4,pitch:-Math.PI/6}],
    VOXEL_MODE_TOOLS:["paint","erase","orbit"],
    VOXEL_MODE_MATERIALS:["matte","metal","glass","glow","unlit"],
    MAX_PROJECT_FRAMES:240,MAX_VOXEL_MODE_CANVAS_DIMENSION:512,
    MAX_VOXEL_MODE_DEPTH:64,MAX_VOXEL_MODE_CUBES:3200000,
    VoxelWeighting,VoxelFeatures:null,
    isHexColor:value=>/^#[0-9a-f]{6}$/i.test(value)
  });
}

test("voxel schema loads before renderer without globals leaking into UI",()=>{
  const root=path.join(__dirname,"../src");
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const renderer=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
  const load=html.indexOf('./modules/renderer/voxel-model-schema.js');
  const start=html.indexOf('./renderer.js');
  assert.ok(load>0 && start>load);
  assert.match(renderer,/PixelBugVoxelModelSchema\.create/);
  assert.doesNotMatch(renderer,/function normalizeVoxelModel\(/);
  assert.ok(renderer.split("\n").length<20000);
});

test("voxel schema normalizes geometry and orthogonal camera views",()=>{
  const api=schema();
  const model=api.defaultVoxelModel(32);
  assert.equal(model.viewCanvases.length,6);
  assert.equal(model.parts.length,1);
  assert.equal(model.parts[0].rigBone,false);
  const loaded=api.normalizeVoxelModel({...model,sourceId:"test-shape",width:5,height:4,depth:3,
    activeSlice:999, activeMaterial:"nope",tool:"missing", cubes:[
      {x:2,y:1,z:1,color:"#ee1100",material:"metal"},
      {x:2,y:1,z:1,color:"#aaccee",material:"matte"},
      {x:2,y:1,z:2,color:"not-a-color"},
      {x:200,y:200,z:200,color:"#ffffff"}
    ]});
  assert.equal(loaded.width,5);
  assert.equal(loaded.height,4);
  assert.equal(loaded.depth,4);
  assert.equal(loaded.cubes.length,1);
  assert.equal(loaded.cubes[0].color,"#aaccee");
  assert.equal(loaded.tool,"paint");
  assert.equal(loaded.activeMaterial,"matte");
  assert.ok(loaded.activeSlice>=0 && loaded.activeSlice<loaded.depth);
});

test("voxel schema removes invalid parent cycles and pose references",()=>{
  const api=schema();
  const parts=api.normalizeVoxelParts([
    {id:"alpha",parentId:"beta"},{id:"beta",parentId:"alpha"},
    {id:"alpha",parentId:"alpha"}
  ],16,16,16);
  assert.equal(new Set(parts.map(p=>p.id)).size,parts.length);
  for(const p of parts){
    const visited=new Set([p.id]);
    let parent=p.parentId;
    while(parent){assert.equal(visited.has(parent),false);visited.add(parent);parent=parts.find(x=>x.id===parent)?.parentId || "";}
  }
  const poses=api.normalizeVoxelModePoseSnapshot({missing:{translation:{x:1}},alpha:{rotation:{x:90}}},parts);
  assert.equal(Object.hasOwn(poses,"missing"),false);
  assert.equal(poses.alpha.rotation.x,90);
});

test("varied voxel models preserve shape invariants through normalization",()=>{
  const api=schema();
  let random=0x12345678;
  const next=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random/4294967296;};
  for(let seed=0;seed<180;seed++){
    const width=4+Math.floor(next()*24),height=4+Math.floor(next()*24),depth=4+Math.floor(next()*24);
    const cubes=Array.from({length:180},(_,index)=>({x:Math.floor(next()*(width+5))-2,
      y:Math.floor(next()*(height+5))-2,z:Math.floor(next()*(depth+5))-2,
      color:index%7===0?"bad":"#112233"}));
    const project=api.normalizeVoxelModel({sourceId:`shape-${seed}`,width,height,depth,cubes});
    assert.equal(project.width,width);assert.equal(project.height,height);assert.equal(project.depth,depth);
    const positions=new Set();
    for(const block of project.cubes){
      assert.ok(block.x>=0&&block.x<width&&block.y>=0&&block.y<height&&block.z>=0&&block.z<depth);
      const key=`${block.x},${block.y},${block.z}`;
      assert.equal(positions.has(key),false);positions.add(key);
    }
    assert.deepEqual(api.normalizeVoxelModel(project).cubes,project.cubes);
  }
});

test("large voxel normalization handles thirty thousand cubes within memory budget",()=>{
  const api=schema();
  const cubes=Array.from({length:30000},(_,i)=>({x:i%100,y:Math.floor(i/100)%30,z:Math.floor(i/3000),color:"#0088cc"}));
  const started=performance.now();
  const result=api.normalizeVoxelModel({sourceId:"performance-sample",width:100,height:30,depth:16,cubes});
  const elapsed=performance.now()-started;
  assert.equal(result.cubes.length,30000);
  assert.ok(elapsed<12000,`Large scene normalization took ${Math.round(elapsed)} ms`);
});
