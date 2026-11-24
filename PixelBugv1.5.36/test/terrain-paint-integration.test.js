"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const Placement=require("../src/modules/terrain-placement-resolver.js");
const Height=require("../src/modules/terrain-heightmap.js");
const Repeat=require("../src/modules/renderer/tile-repeat-workflow.js");
const History=require("../src/modules/terrain-edit-history.js");
const tile=(id,w=2,h=2,color="#abcdef")=>({id,w,h,name:id,pixels:Array.from({length:h},()=>Array(w).fill(color))});
const resolver=(o)=>Placement.create({planRepeat:Repeat.planRepeat,...o});

test("main-canvas placement addressing honors repeat origins and leaves gaps unpainted",()=>{
  const source=tile("a"),terrain=Height.normalize({},[source]);
  const r=resolver({width:9,height:8,tiles:[source],activeTileId:"a",terrain,repeat:{mode:"count",originX:1,originY:2,gapX:1,gapY:2,columns:3,rows:2}});
  assert.equal(r.hit(0,2),null);
  assert.equal(r.hit(1,2).px,0);
  assert.equal(r.hit(2,3).py,1);
  assert.equal(r.hit(3,2),null);
  assert.equal(r.hit(4,2).px,0);
  assert.equal(r.hit(1,4),null);
  assert.equal(r.hit(1,6).placementKey,"repeat:1:6");
});

test("staggered repeats map brush coordinates to visible stamped tile",()=>{
  const source=tile("a",4,2), terrain=Height.normalize({},[source]);
  const r=resolver({width:16,height:6,tiles:[source],activeTileId:"a",terrain,repeat:{mode:"count",gapX:2,stagger:"brick",columns:3,rows:3}});
  assert.equal(r.hit(0,0).placementKey,"repeat:0:0");
  assert.equal(r.hit(3,2).placementKey,"repeat:3:2");
  assert.equal(r.hit(3,2).px,0);
  assert.equal(r.hit(1,2),null);
});

test("tilemap cursor targets actual tile instead of active selection and honors transforms",()=>{
  const a=tile("a",2,1),b=tile("b",2,1),terrain=Height.normalize({source:"map"},[a,b]);
  const map={width:2,height:1,cellWidth:2,cellHeight:1,layers:[{visible:true,cells:[[{tileId:"a"},{tileId:"b",flipH:true}]]}]};
  const r=resolver({width:4,height:1,tiles:[a,b],activeTileId:"a",terrain,map});
  assert.equal(r.hit(2,0).tile.id,"b");
  assert.equal(r.hit(2,0).px,1);
  assert.equal(r.hit(3,0).px,0);
  assert.equal(r.hit(0,0).tile.id,"a");
});

test("transparent top map tile falls through to lower layer when transparency means a hole",()=>{
  const under=tile("under",1,1,"#ffaa00"),top=tile("top",1,1,null);
  const tiles=[under,top],terrain=Height.normalize({source:"map",transparent:true},tiles);
  const map={width:1,height:1,cellWidth:1,cellHeight:1,layers:[{visible:true,cells:[[{tileId:"under"}]]},{visible:true,cells:[[{tileId:"top"}]]}]};
  const r=resolver({width:1,height:1,tiles,terrain,map});
  assert.equal(r.hit(0,0).tile.id,"under");
  assert.equal(Height.columns({width:1,height:1,tiles,terrain,map})[0].color,"#ffaa00");
  terrain.transparent=false;
  assert.equal(resolver({width:1,height:1,tiles,terrain,map}).hit(0,0).tile.id,"top");
});

test("voxel generator respects single-placement height overrides and gaps",()=>{
  const source=tile("a",1,1),tiles=[source],terrain=Height.normalize({base:1,peak:10,detail:0},tiles);
  Height.ensureHeights(terrain,source)[0]=0;
  const repeat={mode:"count",originX:1,gapX:1,columns:2,rows:1};
  terrain.placementHeights["repeat:3:0"]=[255];
  const columns=Height.columns({width:5,height:1,tiles,terrain,repeat,activeTileId:"a",planRepeat:Repeat.planRepeat});
  assert.equal(columns[0],null);
  assert.equal(columns[2],null);
  assert.equal(columns[1].weight,0);
  assert.equal(columns[3].weight,255);
});

test("exact-height stamps survive normalization and override procedural noise in generated voxels",()=>{
  const tiles=[tile("a",1,1)],terrain=Height.normalize({peak:14,base:2,detail:100,style:"rugged",seed:10},tiles);
  terrain.exactHeights.a=[9];
  const round=Height.normalize(JSON.parse(JSON.stringify(terrain)),tiles);
  const columns=Height.columns({width:3,height:3,tiles,terrain:round,activeTileId:"a",repeat:{mode:"fill"},planRepeat:Repeat.planRepeat});
  const plan=Height.voxelPlan(columns,3,3,20,round);
  assert.equal(plan.voxelCount,81);
  assert.ok(plan.cubes.every(c=>c.z<9));
  assert.equal(Height.columnHeight(columns[0],0,0,3,3,round,20),9);
});

test("exact-height values keep per-placement overrides independent",()=>{
  const source=tile("a",1,1),tiles=[source],terrain=Height.normalize({base:2,peak:12},tiles);
  terrain.exactHeights.a=[4];
  terrain.placementExactHeights["repeat:1:0"]=[9];
  const columns=Height.columns({width:2,height:1,tiles,terrain,activeTileId:"a",repeat:{mode:"count",columns:2,rows:1},planRepeat:Repeat.planRepeat});
  assert.deepEqual(columns.map(c=>c.exactHeight),[4,9]);
});

test("terrain undo stores stroke deltas, supports redo, and invalidates redo on repaint",()=>{
  const values=[0,1,2,3],history=History.create(2),resolve=key=>key==="a"?values:null;
  history.begin();history.touch("a",values);values[0]=5;values[1]=6;
  assert.equal(history.commit(resolve),true);
  assert.equal(history.undo(resolve),true);
  assert.deepEqual(values,[0,1,2,3]);
  assert.equal(history.redo(resolve),true);
  assert.deepEqual(values,[5,6,2,3]);
  assert.equal(history.undo(resolve),true);
  history.begin();history.touch("a",values);values[2]=8;history.commit(resolve);
  assert.equal(history.canRedo(),false);
  assert.deepEqual(values,[0,1,8,3]);
});

test("terrain undo groups changes across tiles into one stroke",()=>{
  const values={one:[1,1],two:[2,2]},h=History.create(3),resolve=k=>values[k];
  h.begin();h.touch("one",values.one);values.one[0]=5;
  h.touch("two",values.two);values.two[1]=9;
  h.commit(resolve);h.undo(resolve);
  assert.deepEqual(values,{one:[1,1],two:[2,2]});
  h.redo(resolve);assert.deepEqual(values,{one:[5,1],two:[2,9]});
});

test("terrain history rejects removed or resized targets atomically",()=>{
  const values={a:[0,1],b:[2,3]},h=History.create(),resolve=k=>values[k];
  h.begin();h.touch("a",values.a);h.touch("b",values.b);values.a[0]=9;values.b[1]=8;h.commit(resolve);
  delete values.b;
  assert.equal(h.undo(resolve),false);
  assert.deepEqual(values.a,[9,1]);
});

test("renderer loads terrain modules through sandbox-safe browser globals",()=>{
  const root=path.join(__dirname,"../src");
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const source=fs.readFileSync(path.join(root,"modules/renderer/terrain-paint-workflow.js"),"utf8");
  for(const file of ["terrain-placement-resolver.js","terrain-edit-history.js"]){
    assert.match(html,new RegExp(`<script src="\\./modules/${file.replaceAll(".","\\.")}"></script>`));
  }
  assert.match(source,/globalThis\.PixelBugTerrainPlacementResolver/);
  assert.match(source,/typeof require === "function"/);
});

test("exact brush sets full-strength weight even with a low softness setting",()=>{
  const terrain=Height.normalize({base:2,peak:14,brush:"exact",exactHeight:9,strength:1,radius:1},[]);
  const values=[80,80,80,80,80,80,80,80,80];
  assert.equal(Height.paint(values,3,3,1,1,terrain),true);
  const calculated=Height.heightFor(values[4],terrain,64);
  assert.equal(calculated,9);
});

test("terraced and rugged generation still honor explicit heights",()=>{
  for(const style of ["natural","terraced","rugged"]){
    const terrain=Height.normalize({style,detail:100,terraces:3,base:2,peak:14},[]);
    const column={weight:90,exactHeight:9,color:"#336655"};
    assert.equal(Height.columnHeight(column,0,0,1,1,terrain,20),9);
    assert.equal(Height.voxelPlan([column],1,1,20,terrain).voxelCount,9);
  }
});

test("terrain workflow initializes its dependencies in a sandbox without CommonJS require",()=>{
  const vm=require("node:vm");
  const root=path.join(__dirname,"../src/modules");
  const sandbox={}; sandbox.globalThis=sandbox;
  vm.createContext(sandbox);
  for(const moduleName of [
    "terrain-placement-resolver.js", "terrain-heightmap.js", "terrain-edit-history.js",
    "renderer/tile-repeat-workflow.js", "renderer/terrain-layer-renderer.js",
    "terrain-paint-layers.js", "renderer/terrain-preview-renderer.js", "renderer/terrain-paint-workflow.js"
  ])vm.runInContext(fs.readFileSync(path.join(root,moduleName),"utf8"),sandbox,{filename:moduleName});
  assert.equal(typeof sandbox.PixelBugTerrainPaintWorkflow.create,"function");
});
