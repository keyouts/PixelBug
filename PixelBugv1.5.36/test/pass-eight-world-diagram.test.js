"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const model = require('../src/modules/play-world-diagram-model.js');
const map = require('../src/modules/play-scene-rule-map.js');
const root = path.resolve(__dirname,'..');
function fixture() {
  const pm = {activeSceneId:'village',worldType:'sidescroller',
    props:[{id:'gate',name:'Gate',frame:2,nodeTriggerId:'gate',targetSceneId:'cave',targetX:4,targetY:8}],
    scenes:[{id:'village',name:'Village',worldType:'sidescroller',props:[{id:'gate',nodeTriggerId:'stale'}]},
      {id:'cave',name:'Cave',worldType:'voxel3d',voxelWorld:{width:18,depth:20,blocks:[{x:1,y:0,z:1}],markers:[{id:'exit-marker',kind:'trigger',triggerId:'exit',name:'Exit',x:3,y:1,z:4}]},dialogue:{characters:[]}},
      {id:'tower',name:'Tower',worldType:'sidescroller',props:[]}],
    nodeEditor:{nodes:[
      {id:'touch-gate',type:'eventTrigger',name:'Touch Gate',next:'go',data:{sceneId:'village',trigger:'gate'}},
      {id:'go',type:'actionScene',name:'Go Cave',data:{sceneId:'cave'}},
      {id:'exit-event',type:'eventTrigger',next:'back',data:{sceneId:'cave',trigger:'exit-marker'}},
      {id:'back',type:'actionScene',name:'Return',data:{sceneId:'village'}},
      {id:'global',type:'eventTrigger',name:'Global Exit',next:'back',data:{trigger:'exit'}}
    ]}}
  return pm;
}
test('world layout clamps untrusted saved positions and supports per-scene drag geometry',()=>{
  const scenes=[{id:'first'},{id:'second'},{id:'third'},{id:'__proto__'}];
  const positions=model.positions(scenes,{'first':{x:9000,y:-12},'second':{x:'75',y:'84'}});
  assert.equal(positions.first.x,2400);
  assert.equal(positions.first.y,12);
  assert.deepEqual(positions.second,{x:75,y:84});
  assert.equal(Object.getPrototypeOf(positions),null);
  assert.ok(model.dimensions(positions).width>2400);
  assert.match(model.curve({from:'first',to:'second'},positions),/^M /);
  assert.match(model.curve({from:'first',to:'first'},positions),/^M /);
  assert.equal(model.curve({from:'missing',to:'second'},positions),'');
});
test('editable portal arrows mutate only source prop and allow valid destination worlds',()=>{
  const pm=fixture(),result=map.analyze(pm,4);
  const portal=result.links.find(link=>link.event==='objectPortal');
  assert.equal(portal.propIndex,0);assert.equal(portal.entryX,4);assert.equal(portal.entryY,8);
  assert.equal(model.editDestination(pm,portal,'absent'),false);
  assert.equal(model.editDestination(pm,portal,'tower'),true);
  assert.equal(pm.props[0].targetSceneId,'tower');
  assert.equal(pm.scenes[0].props[0].nodeTriggerId,'stale','stale snapshots remain untouched until capture');
  assert.equal(model.editDestination(pm,portal,'tower'),false);
  assert.equal(model.editEntry(pm,portal,'0',''),true);
  assert.equal(pm.props[0].targetX,0);assert.equal(pm.props[0].targetY,null);
  assert.equal(model.editEntry(pm,portal,'NaN','6'),true);
  assert.equal(pm.props[0].targetX,null);assert.equal(pm.props[0].targetY,6);
  assert.equal(model.editEntry(pm,{...portal,event:'eventTrigger'},3,3),false);
});
test('rule-arrow rewiring preserves action IDs and changes only shared destination',()=>{
  const pm=fixture(), report=map.analyze(pm,4);
  const link=report.links.find(item=>item.actionId==='go');
  assert.equal(model.editDestination(pm,link,'tower'),true);
  assert.equal(pm.nodeEditor.nodes.find(node=>node.id==='go').data.sceneId,'tower');
  assert.equal(pm.nodeEditor.nodes.find(node=>node.id==='touch-gate').next,'go');
  assert.ok(map.analyze(pm,4).links.some(item=>item.from==='village'&&item.to==='tower'&&item.actionId==='go'));
});
test('sprite and voxel target bindings include scene-scoped, global and alias match rules',()=>{
  const pm=fixture(),report=map.analyze(pm,4);
  assert.equal(report.scenes[0].triggers[0].frame,2);
  assert.equal(report.scenes[0].triggers[0].kind,'sprite');
  assert.equal(report.scenes[1].triggers[0].kind,'voxel');
  assert.equal(report.scenes[1].width,18);
  const caveRules=model.boundRules(pm,report.scenes[1],report.scenes[1].triggers[0]);
  assert.deepEqual(caveRules.map(item=>item.id),['exit-event','global']);
  assert.deepEqual(model.boundRules(pm,report.scenes[0],report.scenes[0].triggers[0]).map(item=>item.id),['touch-gate']);
  assert.ok(report.links.some(link=>link.from==='cave'&&link.to==='village'&&link.rootId==='global'));
});
test('world diagram is modular and editor-only: source order and standalone builder remain separate',()=>{
  const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8');
  const node=fs.readFileSync(path.join(root,'src/modules/node-editor.js'),'utf8');
  const renderer=fs.readFileSync(path.join(root,'src/renderer.js'),'utf8');
  assert.ok(html.indexOf('play-world-diagram-model.js')<html.indexOf('node-editor.js'));
  assert.ok(html.indexOf('play-world-diagram.js')<html.indexOf('node-editor.js'));
  assert.match(node,/PixelBugPlayWorldDiagramController\?\.render/);
  assert.match(fs.readFileSync(path.join(root,'src/modules/play-world-diagram-controller.js'),'utf8'),/diagram\.render\(host/);
  assert.match(renderer,/getPlayFrameCanvas:/);
  const exporter=fs.readFileSync(path.join(root,'src/modules/tiny-game-export.js'),'utf8');
  assert.doesNotMatch(exporter,/PixelBugPlayWorldDiagram/);
});
