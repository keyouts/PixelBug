"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const world = require("../src/modules/play-voxel-world.js");

const cube = (w, x, y, z) => world.setBlock(w, x, y, z, "#aabbcc");

function settledOnPlatform(rate, frames = 4000) {
  const w = world.empty();
  for (let x = 6; x < 10; x++) for (let z = 6; z < 10; z++) cube(w, x, 0, z);
  w.start = { x:7.5, y:1, z:7.5 };
  const actor = world.initialActor(w);
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < frames; i++) {
    world.step(w, actor, {}, 1/rate);
    min = Math.min(min, actor.y);
    max = Math.max(max, actor.y);
    assert.equal(actor.grounded, true, `Lost ground at step ${i}/${rate}`);
  }
  return { min, max, actor };
}

test("voxel standing height is exactly stable over thousands of 30/60/120/240fps frames", () => {
  for (const rate of [30, 60, 120, 240]) {
    const {min,max,actor} = settledOnPlatform(rate);
    assert.equal(min, 1);
    assert.equal(max, 1);
    assert.equal(actor.vy, 0);
  }
});

test("landing from jumps snaps exactly to the platform and stays stable", () => {
  for (const rate of [30,60,120,240]) {
    const w = world.empty();
    for(let x=5;x<11;x++)for(let z=5;z<11;z++)cube(w,x,0,z);
    w.start = { x:7.5, y:1, z:7.5 };
    const actor = world.initialActor(w);
    let apex = 1, landed = false;
    for (let i=0;i<rate*5;i++) {
      world.step(w,actor,{ jump:i===0 },1/rate);
      apex=Math.max(apex,actor.y);
      if(i>5&&actor.grounded){landed=true;break;}
    }
    assert.ok(apex>1.7, `Jump was too small at ${rate}fps: ${apex}`);
    assert.ok(landed, `Did not land at ${rate}fps`);
    assert.equal(actor.y,1);
    for(let i=0;i<rate*5;i++) {
      world.step(w,actor,{},1/rate);
      assert.equal(actor.y,1,`Post-landing jitter at ${rate}fps / ${i}`);
    }
  }
});

test("holding jump never triggers automatic re-jumps until the key is released", () => {
  const w=world.empty(), actor=world.initialActor(w);
  let peaks=0, rising=false;
  for(let i=0;i<660;i++) {
    world.step(w,actor,{jump:true},1/60);
    if(actor.vy>0&&!rising)peaks++;
    rising=actor.vy>0;
  }
  assert.equal(peaks,1);
  assert.equal(actor.y,0);
  assert.equal(actor.grounded,true);
  world.step(w,actor,{jump:false},1/60);
  world.step(w,actor,{jump:true},1/60);
  assert.ok(actor.y>0);
});

test("walking off an elevated ledge falls; entering a platform from above lands", () => {
  const w=world.empty();
  for(let x=5;x<8;x++)for(let z=5;z<8;z++)cube(w,x,2,z);
  w.start={x:6.5,y:3,z:6.5};
  const actor=world.initialActor(w);
  world.step(w,actor,{},1/60);
  assert.equal(actor.y,3);
  for(let i=0;i<60;i++)world.step(w,actor,{right:true},1/60);
  assert.ok(actor.x>8.2);
  for(let i=0;i<180;i++)world.step(w,actor,{},1/60);
  assert.equal(actor.y,0);
  assert.equal(actor.grounded,true);
  actor.x=6.5;actor.z=6.5;actor.y=5;actor.vy=0;
  for(let i=0;i<180;i++)world.step(w,actor,{},1/60);
  assert.equal(actor.y,3);
  assert.equal(actor.grounded,true);
});

test("ceiling contact cancels upward velocity without entering solid blocks", () => {
  const w=world.empty();
  for(let x=6;x<9;x++)for(let z=6;z<9;z++)cube(w,x,3,z);
  w.start={x:7.5,y:0,z:7.5};
  const actor=world.initialActor(w);
  let highest=0;
  for(let i=0;i<180;i++) {
    world.step(w,actor,{jump:i===0},1/60);
    highest=Math.max(highest,actor.y);
    assert.equal(world.collides(w,world.blockMap(w),actor.x,actor.y,actor.z),false);
  }
  assert.ok(highest<1.55,`Passed through ceiling: ${highest}`);
  assert.equal(actor.y,0);
});

test("voxel simulation rejects variable or malformed delta times", () => {
  const w=world.empty();const actor=world.initialActor(w);
  for(const dt of [-10,0,NaN,Infinity])world.step(w,actor,{},dt);
  assert.equal(actor.y,0);
  assert.equal(actor.grounded,true);
  for(let i=0;i<500;i++)world.step(w,actor,{right:true,down:true},i%3===0?.05:.001);
  assert.ok(actor.x<=w.width-.25&&actor.z<=w.depth-.25);
  assert.ok(Number.isFinite(actor.y)&&Number.isFinite(actor.vy));
});
