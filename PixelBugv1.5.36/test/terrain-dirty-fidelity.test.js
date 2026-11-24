"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const Height=require("../src/modules/terrain-heightmap.js");
const Repeat=require("../src/modules/renderer/tile-repeat-workflow.js");
const Placement=require("../src/modules/terrain-placement-resolver.js");
const Paint=require("../src/modules/terrain-paint-layers.js");
const Dirty=require("../src/modules/terrain-dirty-regions.js");
const Preview=require("../src/modules/renderer/terrain-preview-renderer.js");
const tile=(id,w=2,h=1)=>({id,w,h,name:id,pixels:Array.from({length:h},()=>Array(w).fill("#aabbcc"))});
function resolver(width,height,tiles,terrain,repeat){
  return Placement.create({width,height,tiles,terrain,activeTileId:tiles[0].id,repeat,planRepeat:Repeat.planRepeat});
}
test("repeat painting updates just the affected visible cells",()=>{
  const t=tile("a"),terrain=Height.normalize({},[t]);
  const r=resolver(8,1,[t],terrain,{mode:"count",columns:3,rows:1,gapX:1});
  const index=Dirty.create(r,8,1);
  assert.deepEqual([...index.affected([{tileId:"a",w:2,h:1,x:0,y:0,radius:0,individual:false}])],[0,3,6]);
  assert.deepEqual([...index.affected([{tileId:"a",placementKey:"repeat:3:0",w:2,h:1,x:0,y:0,radius:0,individual:true}])],[3]);
  assert.equal(index.affected([{tileId:"a",w:2,h:1,x:0,y:0,radius:1,individual:false}],1),null);
  assert.equal(Dirty.create(r,8,1,7),null);
});
test("biome and material masks override only the selected repeat occurrence",()=>{
  const t=tile("a",1,1),terrain=Height.normalize({colorMode:"biome"},[t]);
  Paint.ensure(terrain,"biome",t)[0]=1;
  Paint.ensure(terrain,"material",t)[0]=1;
  const key="repeat:1:0";
  Paint.placement(terrain,"biome",t,key)[0]=3;
  Paint.placement(terrain,"material",t,key)[0]=4;
  let columns=Height.columns({width:2,height:1,tiles:[t],activeTileId:t.id,terrain,repeat:{mode:"count",columns:2,rows:1},planRepeat:Repeat.planRepeat});
  assert.deepEqual(columns.map(c=>c.biome),[1,3]);
  assert.deepEqual(columns.map(c=>c.material),[1,4]);
  Paint.placement(terrain,"material",t,key)[0]=0;
  columns=Height.columns({width:2,height:1,tiles:[t],activeTileId:t.id,terrain,repeat:{mode:"count",columns:2,rows:1},planRepeat:Repeat.planRepeat});
  assert.deepEqual(columns.map(c=>c.material),[1,0]);
  const saved=Height.normalize(JSON.parse(JSON.stringify(terrain)),[t]);
  assert.deepEqual(saved.placementPaintLayers.biome[key],[3]);
  assert.deepEqual(saved.placementPaintLayers.material[key],[0]);
});
test("malformed placement masks are ignored on project normalization",()=>{
  const t=tile("a",2,2);
  const terrain=Height.normalize({placementPaintLayers:{biome:{"random":[3],"repeat:0:0":[999,2,3,4]},material:{"repeat:1:1":[1]}}},[t]);
  assert.equal(terrain.placementPaintLayers.biome.random,undefined);
  assert.deepEqual(terrain.placementPaintLayers.biome["repeat:0:0"],[4,2,3,4]);
  assert.equal(terrain.placementPaintLayers.material["repeat:1:1"],undefined);
});
test("preview top colors and strata are derived from final voxel colors",()=>{
  const t=tile("a",1,1),terrain=Height.normalize({base:1,peak:9,style:"natural",detail:0,solid:true,strata:true,colorMode:"biome"},[t]);
  terrain.exactHeights.a=[9];
  Paint.ensure(terrain,"material",t)[0]=2;
  const columns=Height.columns({width:1,height:1,tiles:[t],activeTileId:"a",terrain,repeat:{mode:"fill"},planRepeat:Repeat.planRepeat});
  const plan=Height.voxelPlan(columns,1,1,16,terrain);
  const surface=plan.cubes.find(v=>v.z===8),stone=plan.cubes.find(v=>v.z===0);
  assert.equal(surface.color,"#bba36e");
  const faces=Preview.buildGeometry({columns,width:1,height:1,depth:16,settings:terrain});
  assert.equal(faces[0].color,"rgb(211,184,124)");
  assert.ok(faces.some(f=>f.color!==faces[0].color));
  assert.ok(stone.color!==surface.color);
  const first=Preview.geometryFor({columns,width:1,height:1,depth:16,settings:terrain});
  assert.equal(first,Preview.geometryFor({columns,width:1,height:1,depth:16,settings:terrain}));
  const shell={...terrain,solid:false};
  const shellFaces=Preview.buildGeometry({columns,width:1,height:1,depth:16,settings:shell});
  assert.equal(shellFaces.length,1);
  assert.equal(Height.voxelPlan(columns,1,1,16,shell).voxelCount,1);
});
test("sandboxed terrain modules initialize without CommonJS",()=>{
  const vm=require("node:vm");
  const files=["terrain-placement-resolver.js","terrain-heightmap.js","terrain-paint-layers.js","terrain-edit-history.js","terrain-dirty-regions.js","terrain-canvas-view.js","renderer/tile-repeat-workflow.js","renderer/terrain-layer-renderer.js","renderer/terrain-preview-renderer.js","renderer/terrain-paint-workflow.js"];
  const sandbox={};sandbox.globalThis=sandbox;vm.createContext(sandbox);
  for(const file of files)vm.runInContext(fs.readFileSync(path.join(__dirname,"../src/modules",file),"utf8"),sandbox,{filename:file});
  assert.equal(typeof sandbox.PixelBugTerrainDirtyRegions.create,"function");
  assert.equal(typeof sandbox.PixelBugTerrainPaintWorkflow.create,"function");
});
