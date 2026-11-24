"use strict";

// World contracts
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const map = require("../src/modules/play-scene-rule-map.js");
const workspace = require("../src/modules/renderer/play-workspace.js");
const portal = require("../src/modules/play-scene-portal.js");
const sprite = require("../src/modules/renderer/play-sprite-source-controller.js");
const rules = require("../src/modules/play-rule-runtime.js");
const exporter = require("../src/modules/tiny-game-export.js");
function project() {
  const nodes = [
    { id:"touch",type:"eventTrigger",name:"Grab Key",next:"add",data:{sceneId:"village",trigger:"key"} },
    { id:"add",type:"actionAddItem",next:"gate",data:{item:"gem"} },
    { id:"gate",type:"actionScene",data:{sceneId:"dungeon"} },
    { id:"npc",type:"eventInteract",name:"Talk",next:"hello",data:{sceneId:"dungeon",character:"sage"} },
    { id:"hello",type:"actionMessage",data:{message:"Welcome"} },
    { id:"exit",type:"eventTrigger",name:"Leave",next:"return",data:{sceneId:"dungeon",trigger:"exit"} },
    { id:"return",type:"actionScene",data:{sceneId:"village"} }
  ];
  return {activeSceneId:"village",worldType:"sidescroller",idleFrame:1,walkFrame:1,jumpFrame:1,
    props:[{nodeTriggerId:"key",frame:1,targetSceneId:"dungeon",targetX:4,targetY:9}], dialogue:{characters:[]},
    scenes:[
      {id:"village",name:"Village",worldType:"sidescroller",props:[{nodeTriggerId:"stale",frame:0}],idleFrame:1,walkFrame:1,jumpFrame:1},
      {id:"dungeon",name:"Dungeon",worldType:"voxel3d",idleFrame:0,walkFrame:1,jumpFrame:2,
        props:[{nodeTriggerId:"ghost",frame:0}],voxelWorld:{blocks:[{x:1,y:0,z:1}],markers:[
          {kind:"trigger",id:"exit-marker",triggerId:"exit",name:"Exit"},
          {kind:"npc",id:"sage-marker",characterId:"sage",name:"Sage"}]},
        dialogue:{characters:[{id:"sage",name:"Sage",role:"npc"}]}}
    ],nodeEditor:{nodes},variables:{},audioLibrary:[]};
}
test("world connections use the live authored 2D scene and show matching voxel rule routes", () => {
  const pm=project(), result=map.analyze(pm,4);
  assert.equal(result.scenes.length,2);
  assert.deepEqual(result.scenes.map(s=>s.mode),["sidescroller","voxel3d"]);
  assert.deepEqual(result.scenes[0].triggers.map(t=>t.id),["key"]);
  assert.deepEqual(result.scenes[1].triggers.map(t=>t.id),["exit"]);
  assert.equal(result.scenes[1].blocks,1);
  assert.equal(result.issues.length,0,JSON.stringify(result.issues));
  assert.ok(result.links.some(link=>link.from==="village"&&link.to==="dungeon"&&link.event==="eventTrigger"&&link.crossDimension));
  assert.ok(result.links.some(link=>link.from==="village"&&link.to==="dungeon"&&link.event==="objectPortal"));
  assert.ok(result.links.some(link=>link.from==="dungeon"&&link.to==="village"&&link.crossDimension));
  assert.equal(workspace.triggerOptions(pm,"village")[0].id,"key");
  assert.deepEqual(workspace.triggerOptions(pm,"dungeon").map(o=>o.id),["exit"]);
  assert.equal(workspace.validate(pm).errors.length,0);
});
test("world mapping rejects stale links, mismatched NPCs, duplicate voxel IDs and missing sprite frames", () => {
  const pm=project();
  pm.scenes[1].voxelWorld.markers.push({kind:"trigger",id:"other",triggerId:"exit"});
  pm.scenes[1].voxelWorld.markers.push({kind:"npc",id:"bad",characterId:"missing"});
  pm.scenes[1].jumpFrame=12;
  pm.nodeEditor.nodes.push({id:"bad-destination",type:"actionScene",data:{sceneId:"deleted"}});
  const issues=map.analyze(pm,4).issues.map(issue=>issue.type);
  for(const kind of ["duplicate-trigger","unbound-npc","missing-sprite","missing-destination"])assert.ok(issues.includes(kind),kind);
});
test("world map does not claim that a globally scoped touch event fires in worlds without that object", () => {
  const pm=project();pm.nodeEditor.nodes.push({id:"global",type:"eventTrigger",next:"hello",data:{trigger:"key"}});
  const result=map.analyze(pm,4);
  assert.ok(!result.issues.some(item=>item.ruleId==="global"&&item.type==="missing-trigger"));
  assert.ok(result.links.every(link=>link.rootId!=="global"||link.from!=="dungeon"), "Global touch links should only appear where their target can exist");
});
test("scene-specific trigger aliases match the actual editor and exported event payloads", () => {
  const pm=project();
  pm.nodeEditor.nodes.push({id:"voxel-alias",type:"eventTrigger",next:"return",data:{sceneId:"dungeon",trigger:"exit-marker"}});
  pm.nodeEditor.nodes.push({id:"2d-alias",type:"eventTrigger",next:"gate",data:{sceneId:"village",trigger:"prop-1"}});
  const result=map.analyze(pm,4);
  assert.ok(result.links.some(link=>link.rootId==="voxel-alias"&&link.from==="dungeon"));
  assert.ok(result.links.some(link=>link.rootId==="2d-alias"&&link.from==="village"));
  assert.ok(!result.issues.some(issue=>issue.type==="missing-trigger"));
});
test("2D portals and voxel entry coordinates are dimension-safe and preserve empty coordinates", () => {
  assert.deepEqual(portal.entry({targetX:4,targetY:9},{worldType:"voxel3d"}),{x:4,z:9});
  assert.deepEqual(portal.entry({targetX:400,targetY:200},{worldType:"sidescroller"}),{x:400,y:200});
  assert.deepEqual(portal.entry({targetX:null,targetY:""},{worldType:"voxel3d"}),{x:null,z:null});
  assert.deepEqual(portal.entry({targetX:"NaN",targetY:Infinity},{worldType:"voxel3d"}),{x:null,z:null});
});
test("current base drawing can be assigned to the 2D and voxel player without altering authored image frames", () => {
  const pm=project(), before=pm.scenes[1].voxelWorld;
  assert.equal(sprite.selectPlayerFrame(pm,3,4),true);
  assert.deepEqual([pm.idleFrame,pm.walkFrame,pm.jumpFrame],[3,3,3]);
  assert.equal(sprite.selectPlayerFrame(pm,99,4),false);
  assert.equal(pm.scenes[1].voxelWorld,before);
});
test("shared event matcher scopes the 2D prop and voxel marker triggers separately", () => {
  const pm=project();
  assert.equal(rules.eventMatches(pm.nodeEditor.nodes[0],"triggerEnter",{id:"key",ids:["key"]},"village"),true);
  assert.equal(rules.eventMatches(pm.nodeEditor.nodes[0],"triggerEnter",{id:"key",ids:["key"]},"dungeon"),false);
  assert.equal(rules.eventMatches(pm.nodeEditor.nodes[5],"triggerEnter",{id:"exit",ids:["exit","exit-marker"]},"dungeon"),true);
});
test("hybrid export embeds the shared scene portal mapper and a sandboxed scene handoff", () => {
  const pm=project();
  const html=exporter.buildTinyGameHtml({title:"Village > Dungeon",exportWidth:640,exportHeight:360,artWidth:16,artHeight:16,sceneBackground:"#000",frames:{},spriteFrames:{actor:{},object:{}},playMode:pm,playUi:{}});
  assert.match(html,/function createPlayScenePortal/);
  assert.match(html,/PORTAL\.entry\(portal/);
  assert.match(html,/sandbox="allow-scripts"/);
  assert.match(html,/event\.source !== runtime\.contentWindow/);
  assert.doesNotMatch(html,/<script>.*Village > Dungeon.*<\/script>/s);
});
test("new game-building buttons and connections follow the established editor markup", () => {
  const html=fs.readFileSync(path.join(root,"src/index.html"),"utf8");
  const rulesSource=fs.readFileSync(path.join(root,"src/modules/node-editor.js"),"utf8");
  assert.match(html,/id="play-player-from-base"/);
  assert.match(html,/id="play-use-active-btn" class="play-source-action"/);
  assert.match(html,/play-scene-rule-map\.js/);
  assert.match(rulesSource,/function renderWorldConnections/);
  assert.match(rulesSource,/PixelBugPlayWorldDiagramController\?\.render/);
  assert.match(html,/play-world-diagram\.js/);
  const renderer=fs.readFileSync(path.join(root,"src/renderer.js"),"utf8");
  assert.match(renderer,/selectPlayScene: sceneId => !playRunning && switchPlayScene\(sceneId, false\)/);
  assert.match(html,/id="play-build-voxel-world"/);
  assert.match(renderer,/addPlayScene\(false\)/);
});
