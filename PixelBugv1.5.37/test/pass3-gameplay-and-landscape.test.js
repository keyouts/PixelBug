"use strict";
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const motion=require('../src/modules/play-component-motion');
const components=require('../src/modules/play-gameplay-components');
const core=require('../src/modules/play-runtime-core');
const landscape=require('../src/modules/play-voxel-landscapes');
const world=require('../src/modules/play-voxel-world');
const workspace=require('../src/modules/renderer/play-workspace');
const pkg=require('../src/modules/project-package');
const presenter=require('../src/modules/renderer/play-scene-presenter');

test('component movement remains deterministic and bounded across restores',()=>{
  const prop={x:44,y:50,componentPatrolRange:90,componentPatrolSpeed:45,componentBobHeight:6};
  assert.equal(motion.position(prop,0).x,44);
  assert.equal(motion.position(prop,60).x,89);
  assert.equal(motion.position(prop,120).x,134);
  assert.equal(motion.position(prop,180).x,89);
  assert.deepEqual(motion.position(prop,300),motion.position(prop,300));
  assert.equal(prop.x,44);
  assert.equal(motion.position(prop,120,100).x,99);
  assert.ok(motion.position(prop,33).y<50);
});
test('component settings sanitize out-of-range frame and hostile numeric input',()=>{
  assert.equal(motion.settings({componentPatrolRange:999999,componentPatrolSpeed:-40}).componentPatrolRange,1024);
  assert.equal(motion.settings({componentAltFrame:99},4).componentAltFrame,null);
  assert.equal(motion.frame({frame:2,componentAltFrame:1,componentFrameTicks:12},12),1);
  assert.equal(motion.frame({frame:2,componentAltFrame:1,componentFrameTicks:12},24),2);
});
test('custom collectible and enemy generate valid reusable rule actions',()=>{
  const collect=components.build('collectible',{sceneId:'s1',trigger:'gem',item:'ruby',score:35});
  const enemy=components.build('enemy',{sceneId:'s1',trigger:'enemy-a',damage:2,patrolRange:80,patrolSpeed:40,altFrame:1});
  assert.equal(collect.nodes.find(n=>n.name==='Increase Score').data.amount,35);
  assert.equal(enemy.nodes.find(n=>n.name==='Lose Health').data.amount,-2);
  assert.equal(enemy.prop.componentPatrolRange,80);
  assert.equal(enemy.prop.componentPatrolSpeed,40);
  assert.equal(enemy.marker.componentKind,'enemy');
  assert.equal(world.normalize({...world.empty(),markers:[{...enemy.marker,x:3,y:0,z:3}]}).markers[0].componentKind,'enemy');
});
test('animation clips respect state, tick and backwards-compatible fallback',()=>{
  assert.deepEqual(core.parseClip('1,foo,02,3,99999,-2',4),[1,2,3]);
  const run={vx:12,vy:0,grounded:true};
  assert.equal(core.animatedFrame(run,{walkFrame:2},1),2);
  assert.equal(core.animatedFrame(run,{runClip:'0,1,2',clipFrameTicks:5},0),0);
  assert.equal(core.animatedFrame(run,{runClip:'0,1,2',clipFrameTicks:5},5),1);
  assert.equal(core.animatedFrame(run,{runClip:'0,1,2',clipFrameTicks:5},15),0);
  assert.equal(core.animatedFrame({...run,vx:0},{idleClip:'3,4',clipFrameTicks:3},3),4);
  assert.equal(core.animatedFrame({grounded:false,vy:-3},{riseFrame:6},9),6);
});
test('procedural landscapes are deterministic, bounded and spawn-safe',()=>{
  for(const preset of landscape.PRESETS){
    const options={preset,seed:2026,width:22,depth:19,height:11};
    const w=world.normalize(landscape.generate(options));
    assert.deepEqual(w.blocks,world.normalize(landscape.generate(options)).blocks);
    assert.ok(w.blocks.length>100&&w.blocks.length<=world.MAX_BLOCKS);
    assert.deepEqual(world.spawnIssues(w),[],preset);
    assert.ok(w.blocks.every(b=>world.inBounds(w,b.x,b.y,b.z)));
  }
  const a=landscape.generate({seed:31}),b=landscape.generate({seed:32});
  assert.notDeepEqual(a.blocks,b.blocks);
});
test('maximum-size procedural world obeys geometry and spawn bounds',()=>{
  const w=world.normalize(landscape.generate({width:48,depth:48,height:24,seed:4}));
  assert.ok(w.blocks.length<=world.MAX_BLOCKS);
  assert.deepEqual(world.spawnIssues(w),[]);
});
test('presenter isolates sprite flips with retained context state',()=>{
  const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')},translate(x,y){calls.push(['translate',x,y])},scale(x,y){calls.push(['scale',x,y])},drawImage(...args){calls.push(['image',...args.slice(-4)])}};
  const metrics={canvas:{width:10,height:20},sw:10,sh:20,w:20,h:40};
  assert.equal(presenter.actor(ctx,metrics,metrics,30,50,-1),true);
  assert.ok(calls.some(call=>Array.isArray(call)&&call[0]==='scale'&&call[1]===-1));
  assert.equal(calls.at(-1),'restore');
});
test('Crystal Ridge hybrid starter round-trips and binds every rule trigger',()=>{
  const name=path.join(__dirname,'../examples/Crystal-Ridge-Hybrid-Adventure-Pass-3.pxbuild');
  const input=fs.readFileSync(name,'utf8');
  const project=pkg.unpack(JSON.parse(input));
  assert.equal(project.name,'Crystal Ridge — A Hybrid Adventure');
  assert.equal(project.playMode.scenes.length,2);
  assert.deepEqual(project.playMode.scenes.map(scene=>scene.worldType),['sidescroller','voxel3d']);
  assert.deepEqual(workspace.validate(project.playMode).errors,[]);
  assert.equal(project.playMode.scenes[0].props.filter(prop=>prop.componentKind).length,4);
  assert.equal(project.playMode.scenes[1].voxelWorld.markers.find(m=>m.componentKind==='goal').componentKind,'goal');
  assert.deepEqual(world.spawnIssues(world.normalize(project.playMode.scenes[1].voxelWorld)),[]);
  assert.deepEqual(pkg.unpack(JSON.parse(pkg.stringify(project))),project);
});
