"use strict";

// Editor sessions
const test = require("node:test");
const assert = require("node:assert/strict");
const editor = require("../src/modules/play-editor-session.js");
const session = require("../src/modules/play-session-state.js");
const rules = require("../src/modules/play-rule-runtime.js");

function harness() {
  const authored = { marker:"original", scenes:[
    {id:"home",worldType:"sidescroller"},
    {id:"cave",worldType:"voxel3d"}
  ] };
  const project = structuredClone(authored);
  const runtime = {sceneId:"home", mode:"sidescroller", x:14, tick:61, paused:false,
    dialogue:{active:true,line:1,characterId:"guide",revealChars:4}, finished:false,
    entered:["switch"],camera:{x:8},message:"Hello"};
  const playMode = {scenes:project.scenes,activeSceneId:runtime.sceneId,worldType:runtime.mode,
    nodeEditor:{runtime:{variables:{score:"20"},inventory:["key"],checkpoint:null}},
    dialogue:{currentLine:1},variables:{score:"20"},inventory:["key"],checkpoint:null};
  const queue=rules.createRuleQueue();
  queue.schedule("after-dialogue",new Set(["event"]),2,500,61);
  const rng=rules.createSeededRandom(1234);
  const calls=[];
  const hooks={title:()=>"Release Test",playMode:()=>playMode,running:()=>true,
    rules:()=>({captureSession:tick=>({queue:queue.snapshot(tick,2), randomState:rng.getState(),
      entered:[...runtime.entered],continuation:{id:"after-dialogue",seen:["event"]}}),
      restoreSession:(raw,tick,replay)=>{calls.push(["restore-rules",raw,tick,replay]);}}),
    actor:()=>({x:runtime.x,y:40,z:0,vx:2,vy:0,grounded:true,facing:1}),
    camera:()=>runtime.camera,entered:()=>runtime.entered,checkpoint:()=>null,
    dialogue:()=>runtime.dialogue,message:()=>runtime.message,finished:()=>runtime.finished,
    tick:()=>runtime.tick,setTick:n=>{runtime.tick=n;},setFinished:b=>{runtime.finished=b;},
    pause:value=>{runtime.paused=value;calls.push(["pause",value]);},
    changeScene:id=>{playMode.activeSceneId=id;playMode.worldType=project.scenes.find(s=>s.id===id).worldType;calls.push(["scene",id]);},
    applyActor:actor=>{runtime.x=actor.x;},applyCamera:camera=>{runtime.camera=camera;},
    applyDialogue:dialogue=>{runtime.dialogue=dialogue;},applyMessage:value=>{runtime.message=value;},
    finishRestore:(value,replay)=>{calls.push(["finish",value.sceneId,replay]);},
    container:()=>null,document:{},window:{},savePortable:()=>true};
  return {engine:editor.create(hooks),playMode,runtime,authored,project,calls,hooks};
}

test("editor captures the same portable snapshot as exported games",()=>{
  const {engine}=harness();
  const state=engine.capture();
  assert.equal(state.sceneId,"home");
  assert.equal(state.actor.x,14);
  assert.equal(state.queue[0].remaining,30);
  assert.equal(state.dialogue.continuationId,"after-dialogue");
  assert.equal(state.randomState,1234);
  const saved=session.packSave(state,engine.modes(),engine.gameId());
  assert.deepEqual(session.unpackSave(saved,engine.modes(),engine.gameId()),state);
});

test("editor applies a cross-mode save without touching authored scene data",()=>{
  const {engine,playMode,runtime,authored,project,calls}=harness();
  const stored={...engine.capture(),sceneId:"cave",mode:"voxel3d",actor:{x:27,y:4,z:2},
    variables:{score:"80"},inventory:["key","gem"],tick:400};
  assert.equal(engine.restore(stored),true);
  assert.equal(playMode.activeSceneId,"cave");
  assert.equal(playMode.worldType,"voxel3d");
  assert.equal(runtime.x,27);
  assert.equal(runtime.tick,400);
  assert.equal(playMode.nodeEditor.runtime.variables.score,"80");
  assert.deepEqual(playMode.nodeEditor.runtime.inventory,["key","gem"]);
  assert.equal(calls.filter(row=>row[0]==="restore-rules")[0][1].queue.length,1);
  assert.deepEqual(project,authored);
});

test("replay excludes queued side effects and does not change authored rules",()=>{
  const {engine,calls}=harness();
  engine.restore(engine.capture(),true);
  const rulesRestored=calls.find(row=>row[0]==="restore-rules");
  assert.equal(rulesRestored[3],true);
  assert.equal(calls.at(-1)[0],"finish");
});

test("unknown scenes fail validation before changing live editor state",()=>{
  const {engine,calls,playMode}=harness();
  assert.throws(()=>engine.restore({...engine.capture(),sceneId:"foreign"}),/Unknown saved scene/);
  assert.equal(calls.length,0);
  assert.equal(playMode.activeSceneId,"home");
});

test("editor rejects saved scenes from a changed game mode",()=>{
  const {engine,calls}=harness();
  assert.throws(()=>engine.restore({...engine.capture(),mode:"voxel3d"}),/scene type/);
  assert.equal(calls.length,0);
});
