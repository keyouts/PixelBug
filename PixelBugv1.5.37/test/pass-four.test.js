"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const chunks = require("../src/modules/play-voxel-chunks.js");
const worldAPI = require("../src/modules/play-voxel-world.js");
const landscapes = require("../src/modules/play-voxel-landscapes.js");
const motion = require("../src/modules/play-component-motion.js");
const core = require("../src/modules/play-runtime-core.js");
const pieces = require("../src/modules/play-gameplay-components.js");
const editor = require("../src/modules/renderer/play-component-editor-controller.js");
const exportRuntime = require("../src/modules/tiny-game-export.js");

test("chunk view omits distant cells and does not lose visible geometry", () => {
  const world = worldAPI.normalize({width:96,depth:96,height:12,blocks:[]});
  const source = [];
  for (let x=0;x<96;x+=4) for(let z=0;z<96;z+=4) {
    const rotated = worldAPI.rotate(world,x+.5,z+.5);
    source.push({kind:"ground",x,z,y:-1,depth:rotated.x+rotated.z});
  }
  const indexed = chunks.index(source,world,worldAPI.project);
  assert.equal(indexed.total,576);
  assert.equal(indexed.chunks.length,64);
  const anchor = worldAPI.view(world,640,360,{x:4,y:0,z:4});
  const seen = chunks.visible(indexed,anchor,640,360,world.cellSize*2);
  assert.ok(seen.commands.length > 0);
  assert.ok(seen.commands.length < source.length);
  assert.ok(seen.visibleChunks < seen.totalChunks);
  for (const c of source) {
    const p = worldAPI.screen(world,c.x+.5,0,c.z+.5,anchor);
    if (p.x >= 0 && p.x <= 640 && p.y >= 0 && p.y <= 360) assert.ok(seen.commands.includes(c));
  }
});

test("chunk bounds track rotated cameras and elevated blocks", () => {
  const world = worldAPI.normalize({width:96,depth:96,height:24,cameraAngle:Math.PI/3});
  const item = {kind:"block",block:{x:4,y:20,z:4},depth:0,y:20};
  const indexed = chunks.index([item],world,worldAPI.project);
  const offset = worldAPI.view(world,640,360,{x:4,y:20,z:4});
  assert.ok(chunks.visible(indexed,offset,640,360,world.cellSize).commands.includes(item));
});

test("larger generated voxel landscapes survive normalization and have safe spawn", () => {
  const wide = landscapes.generate({preset:"snow",seed:2026,width:72,depth:72,height:20});
  assert.equal(wide.width,72);
  assert.equal(wide.depth,72);
  assert.ok(wide.blocks.length > 4096);
  assert.ok(wide.blocks.length <= worldAPI.MAX_BLOCKS);
  const normalized = worldAPI.normalize(wide);
  assert.equal(normalized.blocks.length,wide.blocks.length);
  assert.deepEqual(worldAPI.spawnIssues(normalized),[]);
});

test("oversized untrusted worlds remain bounded", () => {
  const blocks = Array.from({length:20000},(_,n)=>({x:n%96,y:Math.floor(n/9216),z:Math.floor(n/96)%96,color:"#123456"}));
  const world = worldAPI.normalize({width:999,depth:999,height:999,blocks});
  assert.equal(world.width,96);
  assert.equal(world.depth,96);
  assert.equal(world.height,24);
  assert.ok(world.blocks.length <= worldAPI.MAX_BLOCKS);
});

test("chasing and guarding have bounded speed and deterministic tick sampling", () => {
  const chase={x:100,y:40,nodeTriggerId:"guard-1",componentBehavior:"chase",componentPatrolRange:80,componentPatrolSpeed:60,componentAggroRange:200};
  assert.equal(motion.position(chase,0,1000,{actorX:160,actorY:40}).x,100);
  const first=motion.position(chase,30,1000,{actorX:160,actorY:40}).x;
  assert.equal(first,130);
  assert.equal(motion.position(chase,30,1000,{actorX:160,actorY:40}).x,first);
  assert.equal(motion.position(chase,60,1000,{actorX:999,actorY:40}).x,first);
  motion.reset(chase);
  assert.equal(motion.position(chase,0,1000,{actorX:160,actorY:40}).x,100);
  const guard={...chase,componentBehavior:"guard"};
  motion.position(guard,0,1000,{actorX:160});
  motion.position(guard,60,1000,{actorX:160});
  assert.equal(motion.position(guard,120,1000,{actorX:999}).x,100);
});

test("wander and sentry preserve authored positions", () => {
  const p={x:65,y:70,nodeTriggerId:"e-2",componentPatrolRange:40,componentPatrolSpeed:50,componentBehavior:"wander"};
  const a=motion.position(p,80,300);const b=motion.position(p,80,300);
  assert.deepEqual(a,b);
  assert.equal(p.x,65);
  assert.equal(motion.position({...p,componentBehavior:"sentry"},80,300).x,65);
});

test("directional sprite clips take precedence over reflected fallback", () => {
  assert.deepEqual(core.frameSelection({grounded:true,facing:-1,vx:-1},{leftClip:"3,4",runClip:"1,2",clipFrameTicks:4},4),
    {frame:4,flip:false,direction:"left",directional:true,state:"run"});
  const original=core.frameSelection({grounded:true,facing:-1,vx:-1},{runClip:"1,2",clipFrameTicks:4},4);
  assert.equal(original.frame,2);
  assert.equal(original.flip,true);
  const jumping=core.frameSelection({grounded:false,vy:-8,direction:"up"},{upClip:"9",riseFrame:7},10);
  assert.equal(jumping.frame,7);
  assert.equal(jumping.directional,false);
  assert.equal(core.animatedFrame({grounded:true,direction:"down"},{downClip:"6"},0),6);
});

test("component visual inspector edits existing generated rules without replacing graph", () => {
  const pm={worldType:"sidescroller",activeSceneId:"scene-main",props:[],variables:{},nodeEditor:{nodes:[]}};
  const options={kind:"enemy",damage:2,patrolRange:120,patrolSpeed:50,behavior:"chase",aggroRange:140,frame:0,x:25,y:30,scale:2};
  assert.equal(editor.place(pm,{...options,dryRun:true},pieces).ok,true);
  assert.equal(pm.nodeEditor.nodes.length,0);
  const result=editor.place(pm,options,pieces);
  assert.equal(result.ok,true);
  assert.equal(pm.props[0].componentBehavior,"chase");
  const count=pm.nodeEditor.nodes.length;
  const warning=pm.nodeEditor.nodes.find(n=>n.name==="Damage Warning");
  warning.name="Custom damage warning";
  assert.equal(editor.inspect(pm,pm.props[0]).damage,2);
  const updated=editor.update(pm,pm.props[0],{...options,damage:3,behavior:"guard",aggroRange:90},pieces);
  assert.equal(updated.ok,true);
  assert.equal(pm.props[0].componentBehavior,"guard");
  assert.equal(pm.props[0].componentAggroRange,90);
  assert.equal(pm.nodeEditor.nodes.length,count);
  assert.equal(warning.name,"Custom damage warning");
  assert.equal(pm.nodeEditor.nodes.find(n=>n.data?.variable==="health"&&n.type==="actionChangeNumber").data.amount,-3);
});

test("voxel standalone runtime embeds self-contained chunk module", () => {
  const html=exportRuntime.buildTinyGameHtml({title:"Culling",exportWidth:320,exportHeight:180,
    artWidth:1,artHeight:1,frames:{},spriteFrames:{actor:{},object:{}},
    playMode:{worldType:"voxel3d",voxelWorld:worldAPI.demo(),props:[],variables:{},inventory:[],scenes:[]}});
  assert.match(html,/const WORLD =/);
  assert.match(html,/CHUNK_SIZE = 12/);
  assert.match(html,/function visible\(/);
});

test("scene serialization keeps directional clips and legacy scene fields", () => {
  const model = require("../src/modules/renderer/play-scene-model.js");
  const deps = {
    sceneId:value=>value, clone:value=>structuredClone(value),
    defaultVisualLayers:()=>[], defaultDialogue:()=>({lines:[],characters:[]}),defaultUi:()=>({}),
    normalizeAudio:value=>value, parseClip:core.parseClip,
    quarterTurn:value=>Number(value)||0, normalizeWorld:worldAPI.normalize
  };
  const source={idleFrame:0,walkFrame:1,jumpFrame:2,leftClip:"3,4",rightClip:"5,6",upClip:"7",downClip:"8",
    voxelBackgroundAssetId:"mountain",sceneWidth:640,sceneHeight:360,worldWidth:960,
    worldType:"voxel3d",voxelWorld:worldAPI.demo(),props:[{componentKind:"enemy",componentBehavior:"guard",componentAggroRange:99}],
    visualLayers:[],dialogue:{lines:[],characters:[]},ui:{},audio:{}};
  const snap=model.snapshot(source,"scene-ridge","Ridge",deps);
  assert.equal(snap.leftClip,"3,4");
  assert.equal(snap.downClip,"8");
  const next={};model.apply(next,snap,deps);
  assert.equal(next.activeSceneId,"scene-ridge");
  assert.equal(next.voxelBackgroundAssetId,"mountain");
  assert.equal(next.props[0].componentBehavior,"guard");
  assert.equal(next.voxelWorld.blocks.length,source.voxelWorld.blocks.length);
});
