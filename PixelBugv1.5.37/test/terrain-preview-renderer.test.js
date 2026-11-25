"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { render3d } = require("../src/modules/renderer/terrain-preview-renderer.js");
test("preview renderer tolerates empty terrain", () => {
  let cleared = 0;
  const ctx = { clearRect(){cleared++;}, fillRect(){}, set fillStyle(value){} };
  render3d({canvas:{width:440,height:270,getContext:()=>ctx},columns:[],width:0,height:0,depth:0,settings:{},cameraAngle:0,cameraZoom:1,cameraTilt:.6});
  assert.equal(cleared,1);
});
test("preview renderer draws sampled columns", () => {
  let filled=0;
  const ctx={clearRect(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){filled++;},set fillStyle(value){}};
  render3d({canvas:{width:440,height:270,getContext:()=>ctx},columns:[{weight:200,color:"#559944"}],width:1,height:1,depth:16,settings:{base:1,relief:9,style:"natural",colorMode:"source",detail:0},cameraAngle:-.7,cameraZoom:1,cameraTilt:.64});
  assert.ok(filled>0);
});
