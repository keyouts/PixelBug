"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const geom=require("../src/modules/play-voxel-character-geometry.js");
const voxel=require("../src/modules/play-voxel-assets.js");
const volume=require("../src/modules/play-voxel-volume-draw.js");
const world=require("../src/modules/play-voxel-world.js");
const exportGame=require("../src/modules/tiny-game-export.js");
const model=()=>voxel.normalizeAsset({id:"hero",width:2,height:3,depth:2,cubes:[{x:0,y:0,z:0,color:"#ff0000"},{x:1,y:1,z:1,color:"#0000ff"}],
 poses:[{id:"a",cubes:[{x:0,y:0,z:0,color:"#ff0000"}]},{id:"b",cubes:[{x:0,y:0,z:0,color:"#0000ff"}]}],
 rig:{enabled:true,interpolate:true,swing:16,bob:4}});
const settings={voxelActorAssetId:"hero",voxelIdlePoseId:"a",voxelWalkPoseId:"a",voxelWalkPoseClip:"a,b",voxelPoseClipTicks:8};
const actor={x:8,y:0,z:8,moving:true,grounded:true,direction:"down"};
test("rig presets sanitize untrusted settings and remain optional",()=>{
 const asset=model();assert.equal(asset.rig.enabled,true);assert.equal(asset.rig.interpolate,true);
 assert.deepEqual(geom.normalizeRig({enabled:true,interpolate:true,swing:Infinity,bob:-99}),{enabled:true,interpolate:true,swing:14,bob:0,type:"biped"});
 assert.equal(geom.normalizeRig({}).enabled,false);
 assert.equal(voxel.actorVolume([voxel.normalizeAsset({id:"empty",width:2,height:2,depth:2,cubes:[]})],{voxelActorAssetId:"empty"},actor,0),null);
 const normalized=voxel.normalizeAsset({...asset,rig:{enabled:false,interpolate:false}});
 assert.equal(normalized.rig.enabled,false);
});
test("voxel actor geometry lives in world-space and turns with actor facing",()=>{
 const asset=model();const front=voxel.actorVolume([asset],settings,actor,3);
 const right=voxel.actorVolume([asset],settings,{...actor,direction:"right"},3);
 assert.equal(front.voxelVolume,true);assert.ok(front.cubes.length>0);
 assert.notDeepEqual(front.cubes.map(c=>[c.x,c.z]),right.cubes.map(c=>[c.x,c.z]));
 assert.ok(front.cubes.every(c=>c.size>0&&c.size<1&&c.x>7&&c.x<9&&c.y>=0&&c.y<2&&c.z>7&&c.z<9));
 assert.ok(front.cubes.every(c=>/^#[0-9a-f]{6}$/.test(c.color)));
});
test("pose interpolation produces deterministic in-between voxel colors",()=>{
 const asset=model();asset.rig={enabled:false,interpolate:true,swing:0,bob:0};
 const sample=t=>geom.sample(asset,settings,actor,t)[0];
 assert.equal(sample(0).color,"#ff0000");
 assert.equal(sample(4).color,"#800080");
 assert.equal(sample(8).color,"#0000ff");
 assert.deepEqual(geom.sample(asset,settings,actor,4),geom.sample(asset,settings,actor,4));
});
test("joint movement interpolates limb positions while leaving static rigs unchanged",()=>{
 const asset=voxel.normalizeAsset({id:"hero",width:8,height:16,depth:4,cubes:[{x:0,y:7,z:1,color:"#fedcba"}]});
 const setting={voxelActorAssetId:"hero"};
 const stable=geom.sample(asset,setting,actor,4)[0];
 asset.rig={enabled:true,interpolate:false,swing:35,bob:10};
 const moved=geom.sample(asset,setting,actor,4)[0];
 assert.notDeepEqual([stable.y,stable.z],[moved.y,moved.z]);
});
test("geometry skips enclosed blocks and limits maximum per-frame draw commands",()=>{
 const cubes=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)for(let z=0;z<16;z++)cubes.push({x,y,z,color:"#abcdef"});
 const asset=voxel.normalizeAsset({id:"hero",width:16,height:16,depth:16,cubes});
 const rendered=geom.sample(asset,{voxelIdlePoseId:""},actor,0);
 assert.ok(rendered.length<4096);assert.ok(rendered.length<=geom.MAX_DRAW_CELLS);
 assert.ok(rendered.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.y)&&Number.isFinite(c.z)));
 const malicious=volume.commands(world.empty(),actor,{voxelVolume:true,cubes:[{x:Infinity,y:0,z:0,size:1,color:"#ffffff"},{x:1,y:1,z:1,size:1,color:"javascript:alert(1)"}]},world.rotate);
 assert.equal(malicious.length,0);
});
test("world render depth-sorts volume cubes without drawing a flat actor image",()=>{
 const w=world.empty(),a=world.initialActor(w);a.grounded=true;
 const asset=model();const vol=voxel.actorVolume([asset],settings,{...actor,grounded:true},4);
 const counters={drawImage:0,poly:0};
 const ctx={canvas:{width:640,height:360},save(){},restore(){},setTransform(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){counters.poly++;},fill(){},stroke(){},ellipse(){},fillText(){},drawImage(){counters.drawImage++;}};
 world.draw(ctx,w,a,vol,{follow:true,tick:4});
 assert.ok(counters.poly>20);assert.equal(counters.drawImage,0);
});
test("standalone voxel export embeds the geometry and volume draw modules",()=>{
 const data={title:"Voxel",artWidth:4,artHeight:4,exportWidth:640,exportHeight:360,frames:[{pixels:[["#ffffff"]]}],playMode:{worldType:"voxel3d",voxelWorld:world.empty(),voxelAssets:[model()],...settings}};
 const html=exportGame.buildTinyGameHtml(data);
 assert.match(html,/createVoxelCharacterGeometry/);
 assert.match(html,/createVoxelVolumeDraw/);
 assert.match(html,/voxelVolume/);
 assert.doesNotMatch(html,/<script[^>]*src=/i);
});
test("browser script load order and editor/export source contracts include rigging",()=>{
 const root=path.join(__dirname,"../src");const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
 assert.ok(html.indexOf("play-voxel-character-geometry.js")<html.indexOf("play-voxel-assets.js"));
 assert.ok(html.indexOf("play-voxel-volume-draw.js")<html.indexOf("play-voxel-world.js"));
 assert.match(html,/id="play-rig-apply"/);
 const editor=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
 assert.match(editor,/PixelBugPlayVoxelRigEditor\.mount/);
 assert.match(editor,/PixelBugPlayVoxelAssets\.actorVolume/);
 assert.match(fs.readFileSync(path.join(root,"modules/tiny-game-export.js"),"utf8"),/VOXEL\.actorVolume/);
});
