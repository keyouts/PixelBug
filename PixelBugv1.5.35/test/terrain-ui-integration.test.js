"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Height=require("../src/modules/terrain-heightmap.js");
const Workflow=require("../src/modules/renderer/terrain-paint-workflow.js");
function fakeDOM(){
  const elements=new Map();
  function node(id){
    if(elements.has(id))return elements.get(id);
    const commands=[], handlers=new Map(), ctx={commands,clearRect(...a){commands.push(["clear",...a]);},fillRect(...a){commands.push(["fill",...a]);},fillText(){},
      drawImage(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},set fillStyle(v){this.lastColor=v;},get fillStyle(){return this.lastColor;}};
    const el={id,style:{},hidden:false,checked:false,value:"",width:16,height:16,offsetLeft:0,offsetTop:0,
      clientWidth:16,clientHeight:16,clientLeft:0,clientTop:0,textContent:"",disabled:false,
      getContext:()=>ctx,getBoundingClientRect(){return {left:0,top:0,width:this.width,height:this.height};},
      addEventListener(name,fn){handlers.set(name,fn);},fire(name,arg){handlers.get(name)?.(arg);},
      replaceChildren(){},appendChild(){},setAttribute(){},focus(){},setPointerCapture(){},hasPointerCapture(){return true;},releasePointerCapture(){}};
    elements.set(id,el);return el;
  }
  return {node,document:{getElementById:node,body:{classList:{contains:()=>false}},activeElement:null,
    createElement:(name)=>{const el=node(`new-${elements.size}`);el.tagName=name;return el;}}};
}
test("terrain UI paints one placement, redraws dirty cells and preserves Base artwork",()=>{
  const earlierDoc=global.document,earlierWindow=global.window,earlierRAF=global.requestAnimationFrame;
  const {node,document}=fakeDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=callback=>callback();
  try{
    node("pixel-canvas").width=16;node("pixel-canvas").height=16;
    node("tile-terrain-editor-overlay").width=16;node("tile-terrain-editor-overlay").height=16;
    node("tile-terrain-preview").width=288;node("tile-terrain-preview").height=160;
    node("tile-terrain-3d").width=440;node("tile-terrain-3d").height=270;
    node("tile-terrain-main-layer").checked=true;
    node("tile-terrain-focus-tile").checked=false;
    node("tile-terrain-placement").checked=true;
    node("tile-terrain-show-art").checked=true;
    node("tile-terrain-opacity").value="55";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    node("tile-terrain-active-layer").value="material";
    node("tile-terrain-layer-value").value="2";
    const tile={id:"a",name:"a",w:16,h:16,pixels:Array.from({length:16},()=>Array(16).fill("#abcdef"))};
    const originalPixels=JSON.stringify(tile.pixels);
    const state={width:16,height:16,tilemap:{tiles:[tile],activeTileId:"a",terrain:Height.normalize({radius:1,source:"repeat"},[tile]),repeat:{mode:"fill"}}};
    let saved=0;
    const controller=Workflow.create({getState:()=>state,getTile:()=>tile,getProjectDimensions:()=>({width:16,height:16}),getVoxelDimensions:()=>({width:8,height:8,depth:16}),
      getVoxelCount:()=>0,applyTerrain:()=>0,saveLocal:()=>{saved++;},setStatus:()=>{}});
    controller.setup();
    const overlay=node("tile-terrain-editor-overlay"),ctx=overlay.getContext("2d");
    assert.ok(ctx.commands.some(c=>c[0]==="clear"&&c[3]===16));
    ctx.commands.length=0;
    const event={button:0,buttons:1,pointerId:1,clientX:6.1,clientY:6.1,preventDefault(){}};
    overlay.fire("pointerdown",event);overlay.fire("pointerup",event);
    assert.equal(saved,1);
    assert.equal(state.tilemap.terrain.placementPaintLayers.material["repeat:0:0"][6*16+6],2);
    assert.equal(state.tilemap.terrain.paintLayers.material.a[6*16+6],0);
    assert.equal(JSON.stringify(tile.pixels),originalPixels);
    assert.ok(ctx.commands.some(c=>c[0]==="clear"&&c[3]===1&&c[4]===1));
    assert.ok(!ctx.commands.some(c=>c[0]==="clear"&&c[3]===16&&c[4]===16));
    document.activeElement=node("tile-terrain-radius");
    assert.equal(controller.terrainShortcut({},false),false);
    document.activeElement=node("tile-terrain-editor-overlay");
    assert.equal(controller.terrainShortcut({},false),true);
    assert.equal(state.tilemap.terrain.placementPaintLayers.material["repeat:0:0"][6*16+6],0);
  }finally{
    global.document=earlierDoc;global.window=earlierWindow;global.requestAnimationFrame=earlierRAF;
  }
});
test("large canvas focuses the selected tile without altering pixels; layout switch preserves placement editing",()=>{
  const previousDoc=global.document,previousWindow=global.window,previousRAF=global.requestAnimationFrame;
  const {node,document}=fakeDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=callback=>callback();
  try{
    const source={id:"focus-tile",name:"focus-tile",w:4,h:2,pixels:Array.from({length:2},()=>Array(4).fill("#aabbcc"))};
    const pixels=JSON.stringify(source.pixels);
    const state={width:16,height:16,tilemap:{tiles:[source],activeTileId:source.id,
      repeat:{mode:"count",columns:3,rows:1,originX:2,originY:1,gapX:1},
      terrain:Height.normalize({source:"repeat",radius:1},[source])}};
    const base=node("pixel-canvas");base.width=256;base.height=256;base.clientWidth=256;base.clientHeight=256;
    node("tile-terrain-main-layer").checked=true;
    node("tile-terrain-focus-tile").checked=true;
    node("tile-terrain-show-art").checked=true;
    node("tile-terrain-active-layer").value="material";
    node("tile-terrain-layer-value").value="3";
    node("tile-terrain-opacity").value="55";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    let saveCount=0;
    const workflow=Workflow.create({getState:()=>state,getTile:()=>source,getProjectDimensions:()=>({width:16,height:16}),
      getVoxelDimensions:()=>({width:16,height:16,depth:16}),getVoxelCount:()=>0,applyTerrain:()=>0,saveLocal:()=>{saveCount++;},setStatus:()=>{}});
    workflow.setup();
    const overlay=node("tile-terrain-editor-overlay"),art=node("tile-terrain-editor-art"),back=node("tile-terrain-focus-backdrop");
    assert.equal(overlay.width,4);assert.equal(overlay.height,2);
    assert.equal(overlay.style.width,"256px");assert.equal(overlay.style.height,"128px");
    assert.equal(art.hidden,false);assert.equal(back.hidden,false);
    assert.ok(art.getContext("2d").commands.some(c=>c[0]==="fill"&&c[3]===1&&c[4]===1));
    let event={button:0,buttons:1,pointerId:9,clientX:1.1,clientY:1.1,preventDefault(){}};
    overlay.fire("pointerdown",event);overlay.fire("pointerup",event);
    assert.equal(state.tilemap.terrain.paintLayers.material[source.id][1*4+1],3);
    assert.equal(JSON.stringify(source.pixels),pixels);
    assert.equal(saveCount,1);
    node("tile-terrain-focus-tile").checked=false;
    node("tile-terrain-focus-tile").fire("input",{});
    assert.equal(overlay.width,16);assert.equal(overlay.height,16);
    assert.equal(art.hidden,true);assert.equal(back.hidden,true);
    node("tile-terrain-placement").checked=true;
    event={button:0,buttons:1,pointerId:10,clientX:2.1,clientY:1.1,preventDefault(){}};
    overlay.fire("pointerdown",event);overlay.fire("pointerup",event);
    assert.equal(state.tilemap.terrain.placementPaintLayers.material["repeat:2:1"][0],3);
    assert.equal(JSON.stringify(source.pixels),pixels);
    node("tile-terrain-source").value="map";
    node("tile-terrain-source").fire("input",{target:{value:"map"}});
    assert.equal(node("tile-terrain-focus-tile").disabled,true);
    assert.equal(overlay.width,16);
  }finally{global.document=previousDoc;global.window=previousWindow;global.requestAnimationFrame=previousRAF;}
});
test("terrain surfaces support keyboard navigation, painting, undo and camera controls",()=>{
  const oldDoc=global.document,oldWindow=global.window,oldRAF=global.requestAnimationFrame;
  const {node,document}=fakeDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=callback=>callback();
  try{
    const source={id:"tile-keys",name:"tile-keys",w:4,h:4,pixels:Array.from({length:4},()=>Array(4).fill("#abc123"))};
    const initial=JSON.stringify(source.pixels);
    const state={width:16,height:16,tilemap:{tiles:[source],activeTileId:source.id,repeat:{mode:"fill"},terrain:Height.normalize({radius:1},[source])}};
    const base=node("pixel-canvas");base.clientWidth=128;base.clientHeight=128;
    node("tile-terrain-main-layer").checked=true;
    node("tile-terrain-focus-tile").checked=true;
    node("tile-terrain-active-layer").value="material";
    node("tile-terrain-layer-value").value="2";
    node("tile-terrain-opacity").value="55";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    let saved=0;
    const workflow=Workflow.create({getState:()=>state,getTile:()=>source,getProjectDimensions:()=>({width:16,height:16}),
      getVoxelDimensions:()=>({width:16,height:16,depth:16}),getVoxelCount:()=>0,applyTerrain:()=>0,saveLocal:()=>saved++,setStatus:()=>{}});
    workflow.setup();
    const canvas=node("tile-terrain-editor-overlay"),live=node("tile-terrain-accessibility-status");
    let prevented=0,stopped=0;
    const key=k=>canvas.fire("keydown",{key:k,preventDefault(){prevented++;},stopPropagation(){stopped++;}});
    key("ArrowRight");key("Enter");
    assert.equal(state.tilemap.terrain.paintLayers.material[source.id][2*4+3],2);
    assert.equal(JSON.stringify(source.pixels),initial);
    assert.ok(live.textContent.includes("Undo available"));
    assert.ok(prevented>=2 && stopped>=2);
    assert.equal(saved,1);
    node("tile-terrain-undo").fire("click");
    assert.equal(state.tilemap.terrain.paintLayers.material[source.id][2*4+3],0);
    const view=node("tile-terrain-3d");
    view.fire("keydown",{key:"ArrowRight",preventDefault(){prevented++;},stopPropagation(){stopped++;}});
    assert.equal(live.textContent,"Terrain camera adjusted.");
    view.fire("keydown",{key:"0",preventDefault(){},stopPropagation(){}});
    assert.equal(live.textContent,"Terrain camera reset.");
  }finally{global.document=oldDoc;global.window=oldWindow;global.requestAnimationFrame=oldRAF;}
});

test("default raise and lower canvas strokes change visible voxel elevation and refresh the live 3D preview",()=>{
  const priorDoc=global.document,priorWindow=global.window,priorRAF=global.requestAnimationFrame;
  const {node,document}=fakeDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=fn=>fn();
  try{
    const tile={id:"paintable",w:8,h:8,name:"Paintable",pixels:Array.from({length:8},()=>Array(8).fill("#449977"))};
    const options=Height.normalize({base:2,peak:14,detail:0,brush:"raise",radius:1},[tile]);
    const state={width:8,height:8,tilemap:{tiles:[tile],activeTileId:tile.id,repeat:{mode:"fill"},terrain:options}};
    node("pixel-canvas").clientWidth=160;node("pixel-canvas").clientHeight=160;
    node("tile-terrain-main-layer").checked=true;
    node("tile-terrain-focus-tile").checked=true;
    node("tile-terrain-show-art").checked=true;
    node("tile-terrain-active-layer").value="height";
    node("tile-terrain-transfer-mode").value="replace";
    node("tile-terrain-opacity").value="55";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    const preview=node("tile-terrain-3d"),view=preview.getContext("2d"),canvas=node("tile-terrain-paint");
    let saved=0;
    const w=Workflow.create({getState:()=>state,getTile:()=>tile,getProjectDimensions:()=>({width:8,height:8}),getVoxelDimensions:()=>({width:8,height:8,depth:14}),
      getVoxelCount:()=>0,applyTerrain:()=>0,importTerrain:()=>0,saveLocal:()=>saved++,setStatus:()=>{}});
    w.setup();
    const weight=()=>Height.ensureHeights(options,tile)[4*8+4];
    const voxelHeight=()=>Height.heightFor(weight(),options,14);
    const oldHeight=voxelHeight(),oldCommands=view.commands.length;
    const point={button:0,buttons:1,pointerId:2,clientX:4.5,clientY:4.5,preventDefault(){}};
    canvas.fire("pointerdown",point);canvas.fire("pointerup",point);
    assert.ok(weight()>80,"raise must actually change the stored height weight");
    assert.ok(voxelHeight()>oldHeight,"default brush must affect integer-height preview in one stroke");
    assert.ok(view.commands.length>oldCommands,"3D terrain renderer must redraw after the brush stroke");
    assert.equal(saved,1);
    node("tile-terrain-undo").fire("click");
    assert.equal(weight(),80);
    const b=node("tile-terrain-brush");b.value="lower";b.fire("input",{target:b});
    const beforeLower=voxelHeight();
    canvas.fire("pointerdown",point);canvas.fire("pointerup",point);
    assert.ok(voxelHeight()<beforeLower,"lower brush must change the live voxel height");
    assert.deepEqual(tile.pixels,Array.from({length:8},()=>Array(8).fill("#449977")),"Base pixels stay intact");
  }finally{global.document=priorDoc;global.window=priorWindow;global.requestAnimationFrame=priorRAF;}
});

test("one terrain transfer button selects replacement or merging without discarding tile edits",()=>{
  const priorDoc=global.document,priorWindow=global.window,priorRAF=global.requestAnimationFrame;
  const {node,document}=fakeDOM();
  global.document=document;global.window={confirm:()=>true};global.requestAnimationFrame=fn=>fn();
  try{
    const tile={id:"transfer",w:4,h:4,name:"Transfer",pixels:Array.from({length:4},()=>Array(4).fill("#335577"))};
    const terrain=Height.normalize({base:2,peak:8},[tile]);
    const state={width:4,height:4,tilemap:{tiles:[tile],activeTileId:tile.id,repeat:{mode:"fill"},terrain}};
    node("tile-terrain-active-layer").value="height";
    node("tile-terrain-show-art").checked=true;
    node("tile-terrain-main-layer").checked=false;
    node("tile-terrain-opacity").value="55";
    node("tile-terrain-transfer-mode").value="replace";
    for(const kind of ["height","biome","material"])node(`tile-terrain-visible-${kind}`).checked=true;
    let replaced=0,merged=0;
    const workflow=Workflow.create({getState:()=>state,getTile:()=>tile,getProjectDimensions:()=>({width:4,height:4}),getVoxelDimensions:()=>({width:4,height:4,depth:8}),
      getVoxelCount:()=>0,applyTerrain:cubes=>{merged++;return cubes.length;},importTerrain:cubes=>{replaced++;return cubes.length;},saveLocal:()=>{},setStatus:()=>{}});
    workflow.setup();
    node("tile-terrain-import").fire("click");
    assert.equal(replaced,1);assert.equal(merged,0);
    const selector=node("tile-terrain-transfer-mode");selector.value="merge";selector.fire("change");
    node("tile-terrain-import").fire("click");
    assert.equal(replaced,1);assert.equal(merged,1);
    assert.equal(state.tilemap.terrain,terrain);
  }finally{global.document=priorDoc;global.window=priorWindow;global.requestAnimationFrame=priorRAF;}
});
