"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const world = require("../src/modules/play-voxel-world.js");
const exporter = require("../src/modules/tiny-game-export.js");

const root = path.join(__dirname,"..");

test("voxel worlds sanitize saved data and preserve distinct XYZ blocks", () => {
  const data=world.normalize({width:8,depth:8,height:4,yaw:2,start:{x:2.5,y:0,z:3.5},blocks:[
    {x:1,y:0,z:2,color:"#ABCDEF"},{x:1,y:0,z:2,color:"#000000"},
    {x:2,y:9,z:2,color:"#123456"},{x:3,y:0,z:3,color:"red"},
    {x:3.3,y:0,z:4,color:"#123456"},{x:2,y:1,z:2,color:"#112233"}
  ]});
  assert.equal(data.blocks.length,2);
  assert.equal(data.blocks[0].color,"#abcdef");
  assert.equal(data.width,8);
  assert.deepEqual(data.start,{x:2.5,y:0,z:3.5});
  assert.ok(world.standaloneSource.includes("createPlayVoxelWorld"));
});

test("voxel picking round trips across every orthographic camera rotation", () => {
  const data=world.demo();
  for(let yaw=0;yaw<4;yaw++) {
    data.yaw=yaw;
    for(const [x,y,z] of [[1,0,2],[7,0,8],[12,3,5]]) {
      const point=world.screen(data,x+.5,y,z+.5,world.view(data,640,360));
      assert.deepEqual(world.pick(data,point.x,point.y,640,360,y),{x,y,z});
    }
  }
});

test("block painting and voxel asset stamping are bounded and removable", () => {
  const data=world.empty();
  assert.equal(world.setBlock(data,2,0,3,"#ff00ff"),true);
  assert.equal(world.setBlock(data,2,0,3,"#ff00ff"),false);
  assert.equal(world.setBlock(data,-1,0,3,"#ff00ff"),false);
  assert.equal(world.setBlock(data,2,0,3,null),true);
  assert.equal(data.blocks.length,0);
  const asset={width:2,height:2,depth:2,cubes:[{x:0,y:0,z:0,color:"#aa0000"},{x:1,y:1,z:1,color:"#00aaff"}]};
  assert.equal(world.stampAsset(data,asset,5,6),2);
  assert.ok(data.blocks.some(b=>b.x===6&&b.y===1&&b.z===7));
  assert.equal(world.stampAsset(data,asset,100,100),0);
});

test("voxel character moves on both ground axes and cannot walk through cubes", () => {
  const data=world.empty();
  data.start={x:7.5,y:0,z:7.5};
  world.setBlock(data,8,0,7,"#ff0000");
  const actor=world.initialActor(data);
  for(let i=0;i<90;i++)world.step(data,actor,{right:true},1/60);
  assert.ok(actor.x<7.76,`Wall collision must hold actor at ${actor.x}`);
  assert.equal(actor.grounded,true);
  for(let i=0;i<90;i++)world.step(data,actor,{down:true},1/60);
  assert.ok(actor.z>10);
});

test("jumping can clear a one-cell obstruction and land back at ground level", () => {
  const data=world.empty();
  data.start={x:7.5,y:0,z:7.5};
  world.setBlock(data,8,0,7,"#eebbaa");
  const actor=world.initialActor(data);
  world.step(data,actor,{},1/60);
  let height=0;
  for(let i=0;i<180;i++) {
    world.step(data,actor,{right:true,jump:i===0},1/60);
    height=Math.max(height,actor.y);
  }
  assert.ok(height>1);
  assert.ok(actor.x>9);
  assert.equal(actor.y,0);
  assert.equal(actor.grounded,true);
});

test("voxel exports embed a functioning standalone runtime without changing 2D builder", () => {
  const payload={title:"Sample <Test>",exportWidth:640,exportHeight:360,
    playMode:{worldType:"voxel3d",voxelWorld:world.demo(),actorScale:2,idleFrame:0,walkFrame:0,jumpFrame:0},spriteFrames:{actor:{}}};
  const html=exporter.buildTinyGameHtml(payload);
  assert.match(html,/const WORLD = /);
  assert.match(html,/WORLD\.step\(world,actor/);
  assert.match(html,/voxel world/i);
  assert.match(html,/<title>Sample &lt;Test&gt;<\/title>/);
  assert.doesNotMatch(html,/<title>Sample <Test>/);
  const renderer=fs.readFileSync(path.join(root,"src","renderer.js"),"utf8");
  assert.match(renderer,/worldType === "voxel3d"/);
  assert.match(renderer,/captureActivePlayScene\(\)/);
  assert.match(fs.readFileSync(path.join(root,"src","index.html"),"utf8"),/play-world-type/);
});

test("voxel camera orbits smoothly and cell picking respects arbitrary yaw and tilt", () => {
  const data=world.demo();
  world.orbit(data,.43,.17);
  assert.ok(data.cameraAngle>.4&&data.cameraAngle<.5);
  assert.ok(data.cameraTilt>.65&&data.cameraTilt<.7);
  for(const [x,y,z] of [[1,0,2],[7,0,8],[12,3,5]]) {
    const point=world.screen(data,x+.5,y,z+.5,world.view(data,800,480));
    assert.deepEqual(world.pick(data,point.x,point.y,800,480,y),{x,y,z});
  }
  world.orbit(data,15,20);
  assert.ok(data.cameraTilt<=1.05);
  assert.ok(data.cameraAngle>=0&&data.cameraAngle<Math.PI*2);
});

test("voxel interaction markers persist through sanitization and can be found near the actor", () => {
  const data=world.normalize({turntable:true,markers:[
    {id:"door",kind:"trigger",x:3,y:0,z:4,name:"Entrance",triggerId:"door"},
    {id:"shopkeeper",kind:"npc",x:8,y:0,z:9,name:"Merchant",characterId:"npc-1"},
    {id:"door",kind:"trigger",x:4,y:0,z:5},
    {id:"invalid",kind:"trigger",x:150,y:0,z:4}
  ]});
  assert.equal(data.turntable,true);
  assert.equal(data.markers.length,2);
  assert.equal(world.markerAt(data,{x:3,y:0,z:4}).triggerId,"door");
  assert.equal(world.markerNear(data,{x:8.5,y:0,z:9.5},"npc")?.characterId,"npc-1");
  assert.equal(world.markerNear(data,{x:2,y:0,z:2},"npc"),null);
});

test("voxel export includes rules, multi-scene transitions and turntable controls", () => {
  const w=world.demo();w.turntable=true;
  const payload={title:"Rule Export",exportWidth:640,exportHeight:360,
    playMode:{worldType:"voxel3d",voxelWorld:w,activeSceneId:"scene-a",nodeEditor:{nodes:[
      {id:"on-enter",type:"eventStart",next:"give-item",data:{sceneId:"scene-a"}},
      {id:"give-item",type:"actionAddItem",next:"portal",data:{item:"key"}},
      {id:"portal",type:"actionScene",next:"",data:{sceneId:"scene-b"}}
    ]},scenes:[{id:"scene-a",name:"A",worldType:"voxel3d",voxelWorld:w},{id:"scene-b",name:"B",worldType:"voxel3d",voxelWorld:world.empty()}]},spriteFrames:{actor:{}}};
  const html=exporter.buildTinyGameHtml(payload);
  assert.match(html,/RULES\.eventMatches/);
  assert.match(html,/inventory=result\.state\.inventory/);
  assert.match(html,/function loadScene\(/);
  assert.match(html,/triggerMarkers\(/);
  assert.match(html,/Turntable: Off/);
  assert.match(html,/world\.turntable\=!world\.turntable/);
  assert.match(html,/"scene-b"/);
  assert.match(html,/"give-item"/);
});
