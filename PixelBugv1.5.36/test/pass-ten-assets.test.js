"use strict";
// Custom importing
const test=require("node:test"), assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const api=require("../src/modules/play-custom-asset-import.js");
const voxel=require("../src/modules/play-voxel-world.js");
const root=path.join(__dirname,"..");
function model(){return {name:"Imported <World>",width:4,height:3,depth:4,cubes:Array.from({length:16},(_,i)=>({x:i%4,y:0,z:Math.floor(i/4),color:"#99cc33"}))};}
function voxFixture(){
 const part=(name,data,children=Buffer.alloc(0))=>{const header=Buffer.alloc(12);header.write(name,0);header.writeUInt32LE(data.length,4);header.writeUInt32LE(children.length,8);return Buffer.concat([header,data,children]);};
 const size=Buffer.alloc(12);size.writeUInt32LE(4,0);size.writeUInt32LE(4,4);size.writeUInt32LE(3,8);
 const cells=Buffer.alloc(4+16*4);cells.writeUInt32LE(16,0);for(let i=0;i<16;i++){const off=4+i*4;cells[off]=i%4;cells[off+1]=Math.floor(i/4);cells[off+2]=0;cells[off+3]=1;}
 const palette=Buffer.alloc(1024);palette[0]=10;palette[1]=120;palette[2]=220;palette[3]=255;
 const main=part("MAIN",Buffer.alloc(0),Buffer.concat([part("SIZE",size),part("XYZI",cells),part("RGBA",palette)]));
 const header=Buffer.alloc(8);header.write("VOX ",0);header.writeUInt32LE(150,4);return Buffer.concat([header,main]);
}
test("PixelBug model JSON imports into a reusable voxel with clean name and preserved colors",()=>{
 const item=api.checkedVoxelData(model());assert.equal(item.cubes.length,16);assert.equal(item.name,"Imported World");
 const asset=api.asAsset(item,"tree-1","Test Tree");
 const normalized=require("../src/modules/play-voxel-assets.js").normalizeAsset(asset);
 assert.equal(normalized.cubes.length,16);assert.equal(normalized.cubes[0].color,"#99cc33");
});
test("playable world conversion sets a supported accessible start and survives world normalization",()=>{
 const item=api.checkedVoxelData(model());const world=voxel.normalize(api.asWorld(item));
 assert.equal(world.blocks.length,16);assert.equal(world.width,4);assert.equal(world.depth,4);
 const {x,y,z}=world.start;assert.equal(y,1);
 assert.equal(world.blocks.some(b=>b.x===Math.floor(x)&&b.y===Math.floor(y)&&b.z===Math.floor(z)),false);
});
test("MagicaVoxel VOX imports XYZI cells and RGBA palette using Z as world elevation",()=>{
 const input=voxFixture(),item=api.parseVox(input);
 assert.equal(item.width,4);assert.equal(item.height,3);assert.equal(item.depth,4);
 assert.equal(item.cubes.length,16);assert.equal(item.cubes[0].color,"#0a78dc");
 assert.equal(api.asWorld(item).blocks.length,16);
});
test("malformed or oversized imports fail closed instead of silently truncating",()=>{
 assert.throws(()=>api.parseVox(Buffer.from("not-a-vox")),/MagicaVoxel/);
 assert.throws(()=>api.checkedVoxelData({cubes:[{x:0,y:0,z:0,color:"invalid"}]}),/no valid colored/);
 assert.throws(()=>api.checkedVoxelData({cubes:Array(100000).fill({x:0,y:0,z:0,color:"#abcdef"})}),/too many cells/);
 const tooMany={width:96,height:24,depth:96,cubes:[]};for(let x=0;x<96;x++)for(let z=0;z<96;z++)for(let y=0;y<2;y++)tooMany.cubes.push({x,y,z,color:"#ffcc00"});
 assert.throws(()=>api.asWorld(tooMany),/16,384 playable blocks/);
});
test("asset file validation rejects disguised image markup and malformed sprite bytes",()=>{
 assert.equal(api.imageSignature(Uint8Array.from([137,80,78,71,13,10,26,10])),"png");
 assert.equal(api.imageSignature(Uint8Array.from([255,216,255])),"jpeg");
 assert.throws(()=>api.imageSignature(Buffer.from("<svg onload=alert(1)>")),/Unsupported or unrecognized image/);
});
test("imported sprite asset frame references survive base frame edits",()=>{
 const pm={spriteAssets:[{id:"sprite",name:"Sprite",frames:[2,3,4],columns:3,rows:1}]};
 api.remapSpriteAssets(pm,index=>index>=1?index+1:index);
 assert.deepEqual(pm.spriteAssets[0].frames,[3,4,5]);
 api.remapSpriteAssets(pm,index=>index===4?null:index>4?index-1:index);
 assert.deepEqual(pm.spriteAssets[0].frames,[3,4]);
});
test("sprite-sheet slicing retains alpha and maps each cell into editable project pixels",()=>{
 const layout=api.sheetLayout(4,2,2,1,240,0);
 const bytes=new Uint8ClampedArray(4*2*4);
 for(let i=0;i<8;i++){bytes[i*4]=i<2||i>=4&&i<6?255:0;bytes[i*4+3]=i===0?0:255;}
 const frames=api.extractSheet({width:4,height:2,data:bytes},layout,2,2);
 assert.equal(frames.length,2);assert.equal(frames[0][0][0],null);assert.equal(frames[0][0][1],"#ff0000");assert.equal(frames[1][0][0],"#000000");
 assert.throws(()=>api.sheetLayout(9,9,2,2),/divide evenly/);
 assert.throws(()=>api.sheetLayout(8,8,4,4,240,230),/Not enough Base Mode/);
});
test("sprite-set assignment provides directional clips without changing save schema",()=>{
 const assets=api.normalizeSpriteAssets([{id:"hero",name:"Hero",frames:[2,3,4,5,6,7,8,9],columns:2,rows:4}],12);
 assert.equal(assets.length,1);const result=api.animationAssignment(assets[0].frames,2,4);
 assert.equal(result.leftClip,"4,5");assert.equal(result.rightClip,"6,7");assert.equal(result.upClip,"8,9");
 assert.equal(result.idleFrame,2);
});
test("new importer and controller are editor-only, ahead of renderer bootstrap",()=>{
 const html=fs.readFileSync(path.join(root,"src/index.html"),"utf8");
 for(const name of ["play-custom-asset-import.js","play-custom-asset-controller.js"])assert.ok(html.indexOf(name)>=0&&html.indexOf(name)<html.indexOf("./renderer.js"));
 for(const id of ["play-import-voxel-world","play-import-voxel-object","play-import-sprite-frames","play-import-sprite-player","play-import-sprite-library"])assert.match(html,new RegExp(`id="${id}"`));
 const exportModule=fs.readFileSync(path.join(root,"src/modules/tiny-game-export.js"),"utf8");assert.doesNotMatch(exportModule,/PixelBugPlayCustomAssetController/);
});
