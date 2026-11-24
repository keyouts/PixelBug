"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const session = require("../src/modules/play-session-state.js");
const rules = require("../src/modules/play-rule-runtime.js");
const builder = require("../src/modules/tiny-game-export.js");
const modes = { home:"sidescroller", cave:"voxel3d" };
const sample = (sceneId="home") => ({ sceneId, mode:modes[sceneId],
  variables:{opened:"true",score:"80"}, inventory:["key","map"],
  actor:{x:40.5,y:12.5,z:2.25,vx:1,vy:0,grounded:true,facing:-1},
  camera:{x:15,yaw:1.2,pitch:.6,cellSize:38},
  checkpoint:{sceneId:"home",x:14,y:9,z:0},randomState:12345,tick:155,
  queue:[{id:"delayed",seen:["event","gate"],remaining:30,sequence:3}],
  entered:["plate-1"],finished:false,
  dialogue:{active:true,line:1,characterId:"guide",continuationId:"after-dialogue",continuationSeen:["event","guide"]},message:"Remember the key." });

test("game saves round-trip actor, dialogue, queued rules and seeded state",()=>{
  const previous=session.snapshot(sample(),modes);
  const actual=session.unpackSave(session.packSave(previous,modes),modes);
  assert.deepEqual(actual,previous);
  assert.equal(actual.queue[0].remaining,30);
  assert.equal(actual.dialogue.continuationId,"after-dialogue");
});
test("recordings span world modes and keep their ordered frames",()=>{
  const recorder=session.createRecorder(modes);
  assert.ok(recorder.push(sample("home")));
  assert.ok(recorder.push(sample("cave")));
  assert.ok(recorder.push({...sample("home"),actor:{x:89,y:30}}));
  const tape=session.unpackTape(session.packTape(recorder.stop(),modes),modes);
  assert.deepEqual(tape.frames.map(frame=>frame.sceneId),["home","cave","home"]);
  assert.equal(tape.frames.at(-1).actor.x,89);
});
test("saves reject unknown scenes, type mismatch and altered bytes",()=>{
  assert.throws(()=>session.packSave(sample("missing"),modes),/Unknown saved scene/);
  assert.throws(()=>session.packSave({...sample(),mode:"voxel3d"},modes),/scene type/);
  const valid=session.packSave(sample(),modes);
  assert.throws(()=>session.unpackSave(valid.replace("opened","closed"),modes),/integrity/);
  assert.throws(()=>session.unpackSave("garbage",modes));
  assert.throws(()=>session.unpackTape(valid,modes),/Unsupported session format/);
});
test("untrusted state cannot inject prototype keys or extreme values",()=>{
  const malicious=JSON.parse('{"sceneId":"home","mode":"sidescroller","variables":{"__proto__":"yes","constructor":"oops","valid":true},"inventory":["key","key"],"actor":{"x":1e200,"y":"10","grounded":1},"camera":{"cellSize":-4},"queue":[{"id":"next","remaining":1e9}]}');
  const clean=session.snapshot(malicious,modes);
  assert.deepEqual(clean.variables,{valid:"true"});
  assert.deepEqual(clean.inventory,["key"]);
  assert.equal(clean.actor.x,100000);
  assert.equal(clean.actor.y,0);
  assert.equal(clean.actor.grounded,false);
  assert.equal(clean.queue[0].remaining,36000);
  assert.equal(Object.prototype.polluted,undefined);
});
test("storage slots are isolated by game identity",()=>{
  const map=new Map();
  const store={setItem(k,v){map.set(k,v);},getItem(k){return map.get(k)??null;},removeItem(k){map.delete(k);}};
  const a=session.createStorage(store,"game-one"),b=session.createStorage(store,"game-two");
  a.save(1,sample(),modes);
  assert.equal(b.load(1,modes),null);
  assert.equal(a.load(1,modes).variables.score,"80");
  assert.throws(()=>a.save(4,sample(),modes),/Save slot/);
  a.erase(1);
  assert.equal(a.load(1,modes),null);
});
test("pending rule continuations survive queue serialization with exact ticks",()=>{
  const queue=rules.createRuleQueue();
  queue.schedule("next",new Set(["start"]),4,500,100);
  const stored=queue.snapshot(105,4);
  assert.equal(stored[0].remaining,25);
  const resumed=rules.createRuleQueue();
  resumed.restore(stored,200,19);
  assert.equal(resumed.takeReady(224,19).length,0);
  assert.equal(resumed.takeReady(225,19)[0].id,"next");
});
test("browser and module implementations encode the same versioned saves",()=>{
  const counterpart=vm.runInNewContext(session.standaloneSource);
  const json=session.packSave(sample(),modes);
  assert.equal(counterpart.packSave(sample(),modes),json);
  assert.equal(JSON.stringify(counterpart.unpackSave(json,modes)),JSON.stringify(session.unpackSave(json,modes)));
});
test("exported games include accessible saving and session controls",()=>{
  const base={title:"Game",exportWidth:320,exportHeight:240,artWidth:16,artHeight:16,spriteFrames:{actor:{},object:{}}};
  const scenes=[{id:"home",worldType:"sidescroller",sceneWidth:320,sceneHeight:240},{id:"cave",worldType:"voxel3d",voxelWorld:{}}];
  for(const playMode of [
    {worldType:"sidescroller",scenes:scenes.slice(0,1)},
    {worldType:"voxel3d",scenes:scenes.slice(1)},
    {worldType:"sidescroller",scenes}]){
    const html=builder.buildTinyGameHtml({...base,playMode});
    assert.match(html,/Save game/);
    assert.match(html,/Replay session/);
    assert.match(html,/aria-live="polite"/);
    assert.match(html,/Import save file/);
    assert.match(html,/sandbox="allow-scripts"|sessionStartStandalone/);
  }
});
test("replay size and scene limits reject oversized or unrelated inputs",()=>{
  assert.throws(()=>session.packTape({frames:[]},modes),/replay length/);
  assert.throws(()=>session.packTape({frames:[sample("home"),sample("missing")]},modes),/Unknown saved scene/);
  assert.throws(()=>session.unpackSave("x".repeat(262500),modes),/too large/);
});
test("source checks continue validating section-header conventions",()=>{
  const root=path.join(__dirname,"..");
  const checker=fs.readFileSync(path.join(root,"scripts","source-check.js"),"utf8");
  assert.match(checker,/CommentPolicy\.validate/);
  assert.match(checker,/spawnSync/);
});
test("export dimensions reject markup and invalid values before entering HTML",()=>{
  const payload={title:'Safe <Title>',exportWidth:'640" onmouseover="alert(1)',exportHeight:'</style><script>bad()</script>',
    artWidth:16,artHeight:16,playMode:{worldType:'sidescroller',scenes:[]},spriteFrames:{actor:{},object:{}}};
  const html=builder.buildTinyGameHtml(payload);
  assert.match(html,/width="640" height="360"/);
  assert.match(html,/aspect-ratio:640 \/ 360/);
  assert.doesNotMatch(html,/<script>bad\(\)<\/script>/);
  assert.doesNotMatch(html,/onmouseover="alert/);
  assert.match(html,/<title>Safe &lt;Title&gt;<\/title>/);
});

test("portable files reject a different project identity",()=>{
  const save=session.packSave(sample(),modes,"world-a");
  const tape=session.packTape({frames:[sample()]},modes,"world-a");
  assert.equal(session.unpackSave(save,modes,"world-a").sceneId,"home");
  assert.equal(session.unpackTape(tape,modes,"world-a").frames.length,1);
  assert.throws(()=>session.unpackSave(save,modes,"world-b"),/different game/);
  assert.throws(()=>session.unpackTape(tape,modes,"world-b"),/different game/);
});
