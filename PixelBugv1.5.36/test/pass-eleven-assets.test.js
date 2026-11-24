"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const core=require("../src/modules/play-custom-asset-import.js");
const sceneReader=require("../src/modules/play-vox-scene.js");
const library=require("../src/modules/play-import-asset-library.js");
const preview=require("../src/modules/play-import-asset-preview.js");
const root=path.join(__dirname,"..");
function chunk(name,content=Buffer.alloc(0),children=Buffer.alloc(0)){
 const header=Buffer.alloc(12);header.write(name);header.writeUInt32LE(content.length,4);header.writeUInt32LE(children.length,8);
 return Buffer.concat([header,content,children]);
}
function dictionary(entries={}){
 const pairs=Object.entries(entries),size=Buffer.alloc(4);size.writeInt32LE(pairs.length);
 const parts=[size];
 for(const [k,v]of pairs){for(const s of [k,v]){const b=Buffer.from(s);const len=Buffer.alloc(4);len.writeInt32LE(b.length);parts.push(len,b);}}
 return Buffer.concat(parts);
}
const i32=n=>{const b=Buffer.alloc(4);b.writeInt32LE(n);return b;};
const vec=(x,y,z)=>{const b=Buffer.alloc(12);b.writeUInt32LE(x,0);b.writeUInt32LE(y,4);b.writeUInt32LE(z,8);return b;};
function vox(cells,scene=Buffer.alloc(0)){
 let parts=[];
 for(const entry of cells){
   parts.push(chunk("SIZE",vec(...entry.size)));
   parts.push(chunk("XYZI",Buffer.concat([i32(entry.cells.length),Buffer.from(entry.cells.flat())])));
 }
 const rgba=Buffer.alloc(1024);rgba.set([21,85,170,255,244,102,17,255]);parts.push(chunk("RGBA",rgba));
 const main=chunk("MAIN",Buffer.alloc(0),Buffer.concat([...parts,scene]));
 return Buffer.concat([Buffer.from("VOX "),Buffer.from([150,0,0,0]),main]);
}
function graph(){
 const root=chunk("nGRP",Buffer.concat([i32(0),dictionary(),i32(2),i32(1),i32(2)]));
 function trn(id,child,x,rot="4"){
   return chunk("nTRN",Buffer.concat([i32(id),dictionary(),i32(child),i32(-1),i32(0),i32(1),dictionary({_t:`${x} 0 0`,_r:rot})]));
 }
 function shp(id,model){return chunk("nSHP",Buffer.concat([i32(id),dictionary(),i32(1),i32(model),dictionary()]));}
 return Buffer.concat([root,trn(1,3,0),trn(2,4,5),shp(3,0),shp(4,1)]);
}
test("multi-model VOX scene graph places all shape instances using translations",()=>{
 const item=core.parseVox(vox([{size:[2,2,2],cells:[[0,0,0,1]]},{size:[2,2,2],cells:[[1,0,0,2]]}],graph()));
 assert.equal(item.modelCount,2);assert.equal(item.instanceCount,2);assert.equal(item.sceneGraph,true);
 assert.deepEqual(item.cubes.map(c=>[c.x,c.y,c.z,c.color]),[[0,0,0,"#1555aa"],[6,0,0,"#f46611"]]);
 assert.equal(item.width,7);assert.equal(core.asWorld(item).blocks.length,2);
});
test("multi-model files without scene nodes lay out all models rather than dropping later ones",()=>{
 const item=core.parseVox(vox([{size:[2,1,1],cells:[[0,0,0,1]]},{size:[3,1,1],cells:[[0,0,0,2]]}]));
 assert.equal(item.cubes.length,2);assert.equal(item.cubes[1].x,3);assert.equal(item.multipleModels,true);
});
test("VOX rotation matrix applies to shape instances and retains normalized coordinates",()=>{
 const matrix=sceneReader.parseRotation(33);
 assert.deepEqual(matrix,[[0,1,0],[-1,0,0],[0,0,1]]);
 const item=core.parseVox(vox([{size:[2,2,2],cells:[[0,0,0,1]]},{size:[2,2,2],cells:[[1,0,0,2]]}],graph().toString("binary")?Buffer.concat([
 chunk("nGRP",Buffer.concat([i32(0),dictionary(),i32(2),i32(1),i32(2)])),
 chunk("nTRN",Buffer.concat([i32(1),dictionary(),i32(3),i32(-1),i32(0),i32(1),dictionary({_t:"0 0 0",_r:"4"})])),
 chunk("nTRN",Buffer.concat([i32(2),dictionary(),i32(4),i32(-1),i32(0),i32(1),dictionary({_t:"5 0 0",_r:"33"})])),
 chunk("nSHP",Buffer.concat([i32(3),dictionary(),i32(1),i32(0),dictionary()])),
 chunk("nSHP",Buffer.concat([i32(4),dictionary(),i32(1),i32(1),dictionary()])),
 ]):Buffer.alloc(0)));
 assert.equal(item.cubes.length,2);assert.equal(item.cubes[1].x,5);
});
test("VOX scene import rejects malformed shape references and unsafe offsets",()=>{
 const invalid=chunk("nSHP",Buffer.concat([i32(1),dictionary(),i32(1),i32(55),dictionary()]));
 assert.throws(()=>core.parseVox(vox([{size:[1,1,1],cells:[[0,0,0,1]]}],invalid)),/absent model/);
 const offset=chunk("nTRN",Buffer.concat([i32(0),dictionary(),i32(1),i32(-1),i32(0),i32(1),dictionary({_t:"999999 0 0"})]));
 const shape=chunk("nSHP",Buffer.concat([i32(1),dictionary(),i32(1),i32(0),dictionary()]));
 assert.throws(()=>core.parseVox(vox([{size:[1,1,1],cells:[[0,0,0,1]]}],Buffer.concat([offset,shape]))),/Invalid VOX translation/);
});
test("sprite alignment offsets preserve transparent pixels and stay in editable bounds",()=>{
 const pixels=[[null,"#ff0000",null],[null,"#00ff00",null]];
 assert.deepEqual(core.shiftFramePixels(pixels,1,0),[[null,null,"#ff0000"],[null,null,"#00ff00"]]);
 assert.deepEqual(core.shiftFramePixels(pixels,0,1),[[null,null,null],[null,"#ff0000",null]]);
 const layout=core.sheetLayout(2,1,1,1),raw={width:2,height:1,data:Uint8Array.from([255,0,0,255,0,255,0,255])};
 assert.deepEqual(core.extractSheet(raw,layout,2,1,{offsetX:1})[0],[ [null,"#ff0000"] ]);
});
test("custom direction rows and per-state ticks preserve the established save fields",()=>{
 const frameIds=Array.from({length:20},(_,i)=>i+20);
 const a=core.animationAssignment(frameIds,4,5,{idleRow:4,runRow:2,directionRows:{down:4,left:3,right:2,up:1},idleTicks:12,runTicks:3});
 assert.equal(a.idleClip,"36,37,38,39");assert.equal(a.runClip,"28,29,30,31");
 assert.equal(a.leftClip,"32,33,34,35");assert.equal(a.downIdleClip,"36");assert.equal(a.idleClipTicks,12);assert.equal(a.runClipTicks,3);
});
test("scene-scoped sprite assignments do not overwrite unrelated worlds",()=>{
 const playMode={activeSceneId:"a",scenes:[{id:"a",name:"Village",idleClip:"1",props:[]},{id:"b",name:"Dungeon",idleClip:"2",props:[]},{id:"c",name:"Tower",idleClip:"3",props:[]}],idleClip:"1"};
 assert.deepEqual(library.assignSpriteToScenes(playMode,"b",{idleClip:"42,43",idleClipTicks:9}),["b"]);
 assert.equal(playMode.idleClip,"1");assert.equal(playMode.scenes[0].idleClip,"1");assert.equal(playMode.scenes[1].idleClip,"42,43");
 assert.equal(playMode.scenes[2].idleClip,"3");
 library.assignSpriteToScenes(playMode,"all",{idleClip:"44,45"});
 assert.equal(playMode.scenes[2].idleClip,"44,45");assert.equal(playMode.idleClip,"44,45");
});
test("scene usage remains correct for sprite clips, props and voxel appearance IDs",()=>{
 const pm={scenes:[{id:"a",name:"Village",idleClip:"4,5",props:[]},{id:"b",name:"Dungeon",props:[{frame:8,voxelAssetId:"tree"}],voxelActorAssetId:"tree"},{id:"c",name:"Hill",props:[]}]};
 assert.deepEqual(library.spriteUsage(pm,{frames:[5,8]}).map(x=>x.id),["a","b"]);
 assert.deepEqual(library.voxelUsage(pm,"tree").map(x=>x.id),["b"]);
 assert.equal(library.sanitizeName("<danger>\n"),"danger");
});
test("preview thumbnail hit testing selects correct saved frame without mutating art",()=>{
 const canvas={width:224,height:126};const asset={columns:4,frames:[0,1,2,3,4,5,6,7]};
 assert.equal(preview.spriteIndexAt(canvas,asset,110,25),1);
 assert.equal(preview.spriteIndexAt(canvas,asset,165,90),6);
 assert.equal(preview.spriteIndexAt(canvas,asset,221,90),7);
});
test("Pass 11 modules load before renderer; exports stay editor-module independent",()=>{
 const html=fs.readFileSync(path.join(root,"src/index.html"),"utf8");
 for(const file of ["play-vox-scene.js","play-import-asset-library.js","play-import-asset-preview.js"])
   assert.ok(html.indexOf(file)>0&&html.indexOf(file)<html.indexOf("./renderer.js"));
 for(const id of ["play-import-voxel-yaw","play-import-sprite-offset-x","play-import-sprite-library-preview","play-import-target-scene","play-import-row-left"])
   assert.ok(html.includes(`id="${id}"`),id);
 const exported=fs.readFileSync(path.join(root,"src/modules/tiny-game-export.js"),"utf8");
 assert.doesNotMatch(exported,/PixelBugPlayVoxScene|PixelBugPlayImportAssetLibrary|PixelBugPlayImportAssetPreview/);
});
test("sprite renderer selection policy is reusable outside the monolithic renderer",()=>{
 const api=require("../src/modules/play-sprite-layer-policy.js");
 const layers=[{name:"Background",color:1},{name:"Hero",color:2},{name:"Detail",color:3}];
 const deps={nameText:l=>l.name,hasActorPixels:l=>l.color===2,isSceneArtLayer:l=>l.name==="Background"};
 assert.deepEqual(api.selectLayers({layers},true,deps).map(x=>x.name),["Hero"]);
 assert.equal(api.selectLayers({layers},false,deps).length,3);
});
