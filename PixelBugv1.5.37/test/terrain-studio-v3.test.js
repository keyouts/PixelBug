"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const Height=require("../src/modules/terrain-heightmap.js");
const Bridge=require("../src/modules/terrain-voxel-bridge.js");
const Workflow=require("../src/modules/renderer/terrain-paint-workflow.js");
const root=path.join(__dirname,"../src");

test("brush gradient range continuously adjusts edge pressure while retaining center strength and saved precision",()=>{
  const result=[];
  for (const fade of [0,25,50,75,100]){
    const values=Array(225).fill(80);
    Height.paint(values,15,15,7,7,{brush:"raise",radius:4,strength:100,sensitivity:100,falloff:"soft",falloffGradient:fade});
    result.push({center:values[7*15+7],edge:values[7*15+11]});
  }
  assert.ok(result.every(({center})=>center===result[0].center));
  assert.ok(result.every((r,i)=>i===0 || r.edge < result[i-1].edge));
  assert.ok(result[0].edge>result[4].edge);
  const tile={id:"t",w:1,h:1,pixels:[["#aa77bb"]]};
  const data=Height.normalize({falloffGradient:37.5,sensitivity:2.5},[tile]);
  const back=Height.normalize(JSON.parse(JSON.stringify(data)),[tile]);
  assert.equal(back.falloffGradient,37.5);assert.equal(back.sensitivity,2.5);
  assert.equal(Height.normalize({falloffGradient:-20},[tile]).falloffGradient,0);
  assert.equal(Height.normalize({falloffGradient:500},[tile]).falloffGradient,100);
});

test("all biome palette choices change live 3D material colors even on steep surfaces, while tile colors remain unchanged",()=>{
  const surface={weight:152,color:"#aa77bb",biome:0,material:0};
  const color=(palette)=>Height.surfaceColor(surface,152,55,{biomePalette:palette,colorMode:"biome"});
  assert.equal(new Set(["classic","lush","arid","alpine","coastal"].map(color)).size,5);
  assert.equal(Height.surfaceColor(surface,152,55,{biomePalette:"coastal",colorMode:"tile"}),"#aa77bb");
  const painted={...surface,biome:4};
  assert.equal(Height.surfaceColor(painted,152,0,{biomePalette:"classic",colorMode:"tile"}),color("coastal"));
  const saved=Height.normalize({colorMode:"biome",biomePalette:"coastal"},[{id:"t",w:1,h:1,pixels:[["#aa77bb"]]}]);
  assert.equal(saved.biomePalette,"coastal");
});

test("terrain-only voxel transfer makes X/Z floor and Y elevation; generic preview import is untouched",()=>{
  assert.deepEqual(Bridge.toVoxelMode({x:3,y:2,z:8,color:"#aabbcc"},12),{x:3,y:3,z:2,color:"#aabbcc"});
  const map=new Map();let began=0,committed=0,entered=0;
  const count=Bridge.apply([{x:1,y:2,z:9,color:"#ffcc00"},{x:1,y:3,z:9,color:"#ffffff"}],{
    getModel:()=>({width:4,height:12,depth:3}),getMap:()=>map,
    setCube:(x,y,z,color)=>{map.set(`${x},${y},${z}`,{x,y,z,color});return true;},
    begin:()=>began++,commit:()=>committed++,sync:()=>{},enter:()=>entered++,render:()=>{},abort:()=>{}
  });
  assert.equal(count,1);assert.equal(began,1);assert.equal(committed,1);assert.equal(entered,1);
  assert.deepEqual(map.get("1,2,2"),{x:1,y:2,z:2,color:"#ffcc00"});
  const source=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
  const oldImport=source.slice(source.indexOf("function importVoxelPreviewToVoxelMode()"),source.indexOf("function voxelModeFrameCubesFromPreview"));
  assert.match(oldImport,/voxelPixels\(\{ merge: false, fresh: true \}\)/);
  assert.doesNotMatch(oldImport,/toVoxelMode/);
});

test("terrain studio offers a dedicated flat-ground import and explicitly switches biome palettes to topographic mode",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const workflow=fs.readFileSync(path.join(root,"modules/renderer/terrain-paint-workflow.js"),"utf8");
  const renderer=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
  const css=fs.readFileSync(path.join(root,"styles-workspaces.css"),"utf8");
  for(const id of ["tile-terrain-falloff-gradient","tile-terrain-falloff-gradient-output","tile-terrain-gradient-preview","tile-terrain-biome-strip","tile-terrain-import"])
    assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(html,/option value="coastal"/);
  assert.match(workflow,/if\(key === "biomePalette"\) current\.colorMode="biome"/);
  assert.match(workflow,/importTerrain\(result\.plan\.cubes, result\.dims\)/);
  assert.match(renderer,/function importTerrainStudioToVoxelMode\(cubes,dims\)/);
  const importer=fs.readFileSync(path.join(root,"modules/renderer/terrain-voxel-import-workflow.js"),"utf8");
  assert.match(importer,/function run\(terrainCubes, dimensions, host\)/);
  assert.match(renderer,/height: voxelModel\(\)\.depth, depth: Math\.min\(64,voxelModel\(\)\.height\)/);
  assert.match(css,/tile-terrain-palette-strip\[data-biome="coastal"\]/);
});

test("terrain importer builds an X/Z landscape model, selects top editing and does not change other importers",()=>{
  const Import=require("../src/modules/renderer/terrain-voxel-import-workflow.js");
  let saved=null,entered=0,committed=0,snapshots=0;
  const original={width:4,height:4,depth:4,renderer:"canvas",projection:"orthographic",lightingPreset:"studio"};
  const host={
    clampWidth:(n,fb)=>Math.max(4,Math.min(512,Number(n)||fb)),clampDepth:(n,fb)=>Math.max(4,Math.min(64,Number(n)||fb)),projectWidth:()=>12,projectHeight:()=>20,
    maxCubes:50000,historyLimit:10000,toVoxelMode:Bridge.toVoxelMode,
    getModel:()=>original,getCount:()=>0,confirm:()=>true,snapshot:(can)=>{snapshots++;return can?{old:true}:null;},
    defaultModel:()=>({cubes:[]}),defaultOrigin:(w,h,d)=>({x:Math.floor(w/2),y:Math.floor(h/2),z:Math.floor(d/2)}),
    defaultViews:()=>Array.from({length:6},()=>({plane:"xz",slice:0})),
    defaultParts:()=>[{id:"part-root"}],defaultArmature:()=>({bones:[{id:"bone-root"}]}),
    normalizeModel:x=>x,storeModel:x=>{saved=x;},finish:before=>{committed++;assert.deepEqual(before,{old:true});},enter:()=>{entered++;}
  };
  const result=Import.run([{x:2,y:7,z:9,color:"#ABCDEF"}],{width:12,height:20,depth:16},host);
  assert.equal(result,1);
  assert.equal(saved.width,12);assert.equal(saved.height,16);assert.equal(saved.depth,20);
  assert.equal(saved.activePlane,"xz");assert.equal(saved.activeViewCanvas,4);
  assert.equal(saved.cubes[0].x,2);assert.equal(saved.cubes[0].y,6);
  assert.equal(saved.activeSlice,6);
  assert.equal(saved.viewCanvases[4].slice,6);assert.equal(saved.cubes[0].z,7);
  assert.equal(saved.cubes[0].color,"#abcdef");
  assert.equal(saved.renderer,"canvas");assert.equal(entered,1);assert.equal(snapshots,1);assert.equal(committed,1);
  saved=null;
  assert.equal(Import.run([{x:3,y:70,z:9,color:"#ABCDEF"}],{width:12,height:20,depth:16},host),0);
  assert.equal(saved,null,"out of bounds terrain must not replace the model");
});

function studioDOM(){
  const elements=new Map();
  function node(id){
    if(elements.has(id))return elements.get(id);
    const handlers=new Map(),ctx={clearRect(){},fillRect(){},fillText(){},drawImage(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},set fillStyle(v){this.last=v;},get fillStyle(){return this.last;}};
    const el={id,style:{},dataset:{},hidden:false,checked:false,value:"",width:16,height:16,offsetLeft:0,offsetTop:0,clientWidth:16,clientHeight:16,clientLeft:0,clientTop:0,textContent:"",disabled:false,
      getContext:()=>ctx,getBoundingClientRect(){return {left:0,top:0,width:this.width,height:this.height};},
      addEventListener:(event,fn)=>handlers.set(event,fn),fire:(event,value)=>handlers.get(event)?.(value),replaceChildren(){},appendChild(){},setAttribute(){},focus(){},setPointerCapture(){},hasPointerCapture(){return true;},releasePointerCapture(){}};
    elements.set(id,el);return el;
  }
  return {node,document:{getElementById:node,body:{classList:{contains:()=>false}},activeElement:null,createElement:()=>node(`new-${elements.size}`)}};
}

test("biome selector updates the actual 3D color mode and terrain import uses its own source",()=>{
  const oldDoc=global.document,oldWindow=global.window,oldRAF=global.requestAnimationFrame;
  const {node,document}=studioDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=callback=>callback();
  try{
    node("tile-terrain-main-layer").checked=false;
    node("tile-terrain-focus-tile").checked=true;
    node("tile-terrain-show-art").checked=true;
    node("tile-terrain-opacity").value="55";
    node("tile-terrain-active-layer").value="height";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    const tile={id:"test-tile",w:4,h:4,name:"test-tile",pixels:Array.from({length:4},()=>Array(4).fill("#7f5f3f"))};
    const state={width:8,height:8,tilemap:{tiles:[tile],activeTileId:tile.id,repeat:{mode:"fill"},terrain:Height.normalize({},[tile])}};
    let imported=null;
    const controls=Workflow.create({getState:()=>state,getTile:()=>tile,getProjectDimensions:()=>({width:8,height:8}),getVoxelDimensions:()=>({width:8,height:8,depth:16}),
      getVoxelCount:()=>0,applyTerrain:()=>0,importTerrain:(cubes,dims)=>{imported={cubes,dims};return cubes.length;},saveLocal:()=>{},setStatus:()=>{}});
    controls.setup();
    const palette=node("tile-terrain-biome-palette");palette.value="arid";palette.fire("input",{target:palette});
    assert.equal(state.tilemap.terrain.biomePalette,"arid");
    assert.equal(state.tilemap.terrain.colorMode,"biome");
    assert.equal(node("tile-terrain-colors").value,"biome");
    assert.equal(node("tile-terrain-biome-strip").dataset.biome,"arid");
    const grad=node("tile-terrain-falloff-gradient");grad.value="27.5";grad.fire("input",{target:grad});
    assert.equal(state.tilemap.terrain.falloffGradient,27.5);
    node("tile-terrain-import").fire("click");
    assert.equal(imported.dims.width,8);assert.equal(imported.dims.height,8);assert.equal(imported.dims.depth,14);
    assert.ok(imported.cubes.length>0);
    assert.ok(imported.cubes.some(c=>c.z>0&&c.y>0));
  }finally{global.document=oldDoc;global.window=oldWindow;global.requestAnimationFrame=oldRAF;}
});

test("landscape transfer places painted surface above bottom voxels in Voxel Mode Y-down coordinates",()=>{
  const modelHeight=12;
  const cubes=[{x:1,y:2,z:0,color:"#625b50"},{x:1,y:2,z:1,color:"#afa65c"},{x:1,y:2,z:2,color:"#64aa73"}];
  const mapped=cubes.map(c=>Bridge.toVoxelMode(c,modelHeight));
  assert.deepEqual(mapped.map(c=>c.y),[11,10,9]);
  assert.ok(mapped[2].y < mapped[0].y,"terrain top needs smaller Y than terrain base in Voxel Mode");
  assert.deepEqual(mapped.map(c=>c.z),[2,2,2]);
  const model={width:4,height:modelHeight,depth:4},map=new Map();
  const added=Bridge.apply(cubes,{getModel:()=>model,getMap:()=>map,setCube:(x,y,z,color)=>{map.set(`${x},${y},${z}`,color);return true;},begin:()=>{},commit:()=>{},sync:()=>{},enter:()=>{},render:()=>{},abort:()=>{}});
  assert.equal(added,3);assert.equal(map.get("1,9,2"),"#64aa73");assert.equal(map.get("1,11,2"),"#625b50");
});

test("default sensitivity sculpts one discrete preview level while the fine setting stays gradual",()=>{
  const terrain=Height.normalize({base:2,peak:14,detail:0,brush:"raise",radius:1},[]),values=Array(64).fill(80);
  const before=Height.heightFor(80,terrain,14);
  assert.equal(Height.paint(values,8,8,4,4,terrain),true);
  assert.ok(Height.heightFor(values[4*8+4],terrain,14)>before);
  const fine=Array(64).fill(80);
  Height.paint(fine,8,8,4,4,{...terrain,sensitivity:.1});
  assert.ok(fine[4*8+4]>80 && fine[4*8+4]<values[4*8+4]);
  assert.equal(Height.heightFor(fine[4*8+4],terrain,14),before);
});
