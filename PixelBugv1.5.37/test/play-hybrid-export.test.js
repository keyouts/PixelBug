"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const exporter = require('../src/modules/tiny-game-export.js');
const voxel = require('../src/modules/play-voxel-world.js');
const rules = require('../src/modules/play-rule-runtime.js');

function game() {
  const world = voxel.empty();
  const scene2d={id:'home',worldType:'sidescroller',sceneWidth:320,sceneHeight:240,props:[],worldWidth:500,groundY:200};
  const sceneVoxel={id:'cave',worldType:'voxel3d',voxelWorld:world};
  return {title:'Hybrid <game>',exportWidth:320,exportHeight:240,artWidth:16,artHeight:16,
    playMode:{worldType:'sidescroller',activeSceneId:'home',scenes:[scene2d,sceneVoxel],nodeEditor:{nodes:[]},variables:{v:'abc'},inventory:['key'],ruleSeed:4242},
    spriteFrames:{actor:{},object:{}}};
}

test('hybrid export includes both native worlds and a validated state bridge',()=>{
  const output=exporter.buildTinyGameHtml(game());
  assert.match(output,/id="runtime"/);
  assert.match(output,/sandbox="allow-scripts"/);
  assert.match(output,/const HYBRID_MODES =/);
  assert.match(output,/pixelbug-hybrid-v1/);
  assert.match(output,/handoffHistory\.length>=12/);
  assert.match(output,/id="hybrid-restart"/);
  assert.match(output,/voxel3d/);
  assert.match(output,/sidescroller/);
  assert.match(output,/RULES\.evaluateNode/);
  assert.match(output,/WORLD\.normalize/);
  assert.match(output,/function loadRuntimeScene/);
  assert.doesNotMatch(output,/<title>Hybrid <game><\/title>/);
  assert.match(output,/<title>Hybrid &lt;game&gt;<\/title>/);
});

test('normal 2D and voxel-only exports keep their original runtime shape',()=>{
  const payload=game();
  for(const worldType of ['sidescroller','voxel3d']) {
    const playMode={...payload.playMode,worldType,scenes:payload.playMode.scenes.filter(s=>s.worldType===worldType)};
    const output=exporter.buildTinyGameHtml({...payload,playMode});
    assert.doesNotMatch(output,/id="runtime"/);
    assert.match(output,/id="game"/);
  }
});

test('seed state continues across runtime boundaries without rerolling',()=>{
  const standalone=vm.runInNewContext(rules.standaloneSource);
  for(const randomModule of [rules,standalone]) {
    const original=randomModule.createSeededRandom(9217);
    const first=[original(),original(),original()];
    const snapshot=original.getState();
    const next=[original(),original()];
    const restored=randomModule.createSeededRandom(1);
    restored.setState(snapshot);
    assert.deepEqual([restored(),restored()],next);
    assert.ok(first.every(v=>v>=0&&v<1));
    restored.setState('not valid');
    assert.equal(restored.getState(),original.getState());
  }
});

test('hybrid markup escapes project-supplied script and HTML delimiters',()=>{
  const payload=game();
  payload.title='</script><script>window.pwned=true</script>';
  payload.playMode.variables={note:'</script><img src=x onerror=alert(1)>'};
  const html=exporter.buildTinyGameHtml(payload);
  assert.doesNotMatch(html, /<script>window\.pwned/);
  assert.match(html, /\\u003c/);
  assert.match(html, /&lt;\/script&gt;/);
});
