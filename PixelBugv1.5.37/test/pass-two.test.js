"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..", "src");
const Pieces = require("../src/modules/play-gameplay-components.js");
const Rules = require("../src/modules/play-rule-runtime.js");
const Core = require("../src/modules/play-runtime-core.js");
const Viewport = require("../src/modules/renderer/play-viewport-controller.js");
const Boundary = require("../src/modules/renderer/play-authoring-boundary.js");

test("five gameplay presets generate valid editable event graphs", () => {
  for (const kind of Pieces.KINDS) {
    const piece = Pieces.build(kind, { sceneId:"scene-main", trigger:`${kind}-1`, item:"ruby" });
    assert.equal(piece.nodes[0].type, "eventTrigger");
    assert.equal(piece.nodes[0].data.trigger, `${kind}-1`);
    assert.equal(piece.nodes[0].data.sceneId, "scene-main");
    assert.equal(piece.prop.nodeTriggerId, `${kind}-1`);
    assert.equal(piece.marker.triggerId, `${kind}-1`);
    assert.equal(new Set(piece.nodes.map(node=>node.id)).size, piece.nodes.length);
    for (const node of piece.nodes) {
      assert.ok(!node.next || piece.nodes.some(candidate=>candidate.id===node.next));
      assert.ok(!node.alt || piece.nodes.some(candidate=>candidate.id===node.alt));
    }
    const hit = Rules.eventMatches(piece.nodes[0], "triggerEnter", {id:`${kind}-1`, sceneId:"scene-main"}, "scene-main");
    assert.ok(hit, kind);
    assert.equal(Rules.eventMatches(piece.nodes[0], "triggerEnter", {id:"other",sceneId:"scene-main"}, "scene-main"), false);
    assert.deepEqual(Rules.analyzeGraph(piece.nodes).filter(issue=>issue.severity==="error"), [], kind);
  }
});

test("collectible, enemy, locked door, checkpoint and goal affect shared rule state", () => {
  const build = kind => Pieces.build(kind,{sceneId:"s",trigger:`${kind}-2`,item:"ruby"});
  const trace = (piece, initial={variables:{},inventory:[]}) => {
    let state=initial, current=piece.nodes[0].next, effects=[];
    for(let i=0;i<12&&current;i++){
      const node=piece.nodes.find(n=>n.id===current); assert.ok(node);
      const next=Rules.evaluateNode(node,state);
      state=next.state; effects.push(...next.effects); current=next.nextId;
    }
    return {state,effects};
  };
  assert.ok(trace(build("collectible")).state.inventory.includes("ruby"));
  assert.equal(trace(build("collectible"),{variables:{},inventory:["ruby"]}).state.inventory.length,1);
  assert.equal(trace(build("enemy"),{variables:{health:"3"},inventory:[]}).state.variables.health,"2");
  const door=build("door");
  assert.notEqual(trace(door).state.variables[door.prop.openVariable], "true");
  assert.equal(trace(door,{variables:{},inventory:["ruby"]}).state.variables[door.prop.openVariable], "true");
  assert.ok(trace(build("checkpoint")).effects.some(effect=>effect.type==="checkpoint"));
  assert.ok(trace(build("goal")).effects.some(effect=>effect.type==="finish"));
  assert.equal(Pieces.collected(build("collectible").prop,["ruby"]), true);
  assert.equal(Pieces.collected(build("collectible").prop,[]), false);
});

test("the shared 2D movement helper preserves legacy movement and enables optional ease", () => {
  assert.equal(Core.horizontalVelocity(20,1,180,1/60,{}),180);
  assert.equal(Core.horizontalVelocity(180,0,180,1/60,{}),0);
  assert.equal(Core.horizontalVelocity(0,1,180,1/60,{acceleration:12}),12);
  assert.equal(Core.horizontalVelocity(100,0,180,1/60,{friction:16}),84);
  assert.ok(Math.abs(Core.releasedJumpVelocity(-100,false,{variableJump:true}) + 55) < 1e-9);
  assert.equal(Core.releasedJumpVelocity(-100,false,{}),-100);
  assert.deepEqual(Core.animationState({grounded:false,vy:10},{jumpFrame:2,fallFrame:6}),{state:"fall",frame:6});
  assert.equal(Core.animationState({grounded:true,vx:40},{walkFrame:4}).frame,4);
  assert.equal(Core.animationState({grounded:false,vy:-10},{jumpFrame:5}).frame,5);
  const standalone=vm.runInNewContext(Core.standaloneSource);
  assert.equal(standalone.horizontalVelocity(0,1,180,1/60,{acceleration:12}),12);
});

test("Play viewport controller follows, clamps and round-trips coordinates", () => {
  assert.equal(Viewport.clampCamera(99999,1600,640),960);
  assert.equal(Viewport.screenX(250,100),150);
  assert.equal(Viewport.worldX(150,100),250);
  const result=Viewport.updateCamera({cameraX:0,actorX:700,actorWidth:32,canvasWidth:640,maxWorldWidth:1600,running:false,follow:true});
  assert.ok(result.cameraX>0 && result.cameraX<=960);
  const standalone=vm.runInNewContext(Viewport.standaloneSource);
  assert.equal(standalone.screenX(250,100),150);
});

test("authoring state remains immutable while a game session is active", () => {
  const boundary=Boundary.create(value=>JSON.parse(JSON.stringify(value)));
  const original={props:[{x:5}],inventory:["ruby"]};
  const runtime=boundary.enter(original,{selectedPlayProp:2});
  runtime.props[0].x=99;
  assert.equal(original.props[0].x,5);
  assert.equal(boundary.original,original);
  assert.equal(boundary.active,true);
  const result=boundary.exit();
  assert.equal(result.mode,original);
  assert.equal(result.selection.selectedPlayProp,2);
  assert.equal(boundary.active,false);
});

test("both editor and standalone exports use shared movement and viewport contracts", () => {
  const renderer=fs.readFileSync(path.join(root,"renderer.js"),"utf8");
  const builder=fs.readFileSync(path.join(root,"modules","tiny-game-export.js"),"utf8");
  assert.match(renderer,/PixelBugPlayRuntimeCore\.horizontalVelocity/);
  assert.match(builder,/CORE\.horizontalVelocity/);
  assert.match(renderer,/PixelBugPlayViewportController\.updateCamera/);
  assert.match(builder,/VIEWPORT\.updateCamera/);
  assert.match(renderer,/PixelBugPlayComponentEditor\.place/);
  assert.match(builder,/propCollected\(prop\)/);
});
