"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const CanvasView=require("../src/modules/terrain-canvas-view.js");
const tile={id:"a",w:8,h:4,pixels:[]};
test("tile focus addresses selected tile pixels, irrespective of Base frame dimensions",()=>{
 const view=CanvasView.create({tile,focus:true,projectWidth:64,projectHeight:32});
 assert.equal(view.width,8);assert.equal(view.height,4);
 assert.deepEqual(view.hit(7,3),{tile,px:7,py:3,placementKey:null});
 assert.equal(view.hit(8,0),null);assert.equal(view.hit(-1,1),null);
});
test("layout mode always uses real project coordinates rather than display buffer pixels",()=>{
 const hits=[];const layoutResolver={hit(x,y){hits.push([x,y]);return {px:x,py:y};}};
 const view=CanvasView.create({tile,focus:false,projectWidth:32,projectHeight:24,layoutResolver});
 assert.equal(view.width,32);assert.equal(view.height,24);
 assert.deepEqual(view.hit(31,23),{px:31,py:23});
 assert.equal(view.hit(32,23),null);assert.deepEqual(hits,[[31,23]]);
});
test("focused tile is aspect-fitted and centered without stretching pixels",()=>{
 assert.deepEqual(CanvasView.fittedBox(600,600,16,32),{x:150,y:0,width:300,height:600});
 assert.deepEqual(CanvasView.fittedBox(600,400,16,16),{x:100,y:0,width:400,height:400});
});
