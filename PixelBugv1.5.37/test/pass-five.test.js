"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.join(__dirname,'..');
const chunks=require('../src/modules/play-voxel-chunks.js');
const voxel=require('../src/modules/play-voxel-world.js');
const enemies=require('../src/modules/play-voxel-enemies.js');
const navigation=require('../src/modules/play-component-navigation.js');
const motion=require('../src/modules/play-component-motion.js');
const core=require('../src/modules/play-runtime-core.js');
const pieces=require('../src/modules/play-gameplay-components.js');
const editor=require('../src/modules/renderer/play-component-editor-controller.js');
const animationEditor=require('../src/modules/renderer/play-animation-editor-controller.js');
const exportGame=require('../src/modules/tiny-game-export.js');
function canvas(w=900,h=640){
  const ctx={canvas:{width:w,height:h},imageSmoothingEnabled:false};
  for(const k of ['save','restore','setTransform','fillRect','beginPath','moveTo','lineTo','closePath','fill','stroke','ellipse','arc','rect','roundRect','fillText','drawImage','translate','scale'])ctx[k]=()=>{};
  return ctx;
}
function world96(){
  const world=voxel.empty();world.width=96;world.depth=96;world.height=8;world.cellSize=32;
  world.blocks=[];
  for(let x=0;x<96;x++)for(let z=0;z<96;z++) {
    world.blocks.push({x,z,y:0,color:'#2a7c52'});
    if((x+z)%3===0)world.blocks.push({x,z,y:1,color:'#479b65'});
  }
  return world;
}
test('streamed region index starts unloaded and bounds the hot cache',()=>{
  const world=world96(),ctx=canvas();
  assert.equal(voxel.regionStats(world).loads,0);
  const actor=voxel.initialActor(world);
  for(let i=0;i<48;i++){
    actor.x=1+(i%12)*8;actor.z=1+Math.floor(i/12)*22;
    voxel.draw(ctx,world,actor,null,{follow:true,tick:i});
    const stat=voxel.regionStats(world);
    assert.ok(stat.residentRegions<=56,JSON.stringify(stat));
  }
  const stats=voxel.regionStats(world);
  assert.equal(stats.totalRegions,64);
  assert.ok(stats.loads>0);
  assert.ok(stats.evictions>0);
  assert.ok(stats.visibleRegions<=stats.totalRegions);
});
test('stream cache invalidates after voxel edit and camera orbit',()=>{
  const w=voxel.demo(),ctx=canvas();voxel.draw(ctx,w,null,null);let original=voxel.regionStats(w);
  assert.ok(original.loads>0);
  voxel.setBlock(w,2,0,2,'#ff4400');
  assert.equal(voxel.regionStats(w).loads,0);
  voxel.draw(ctx,w,null,null);assert.ok(voxel.regionStats(w).loads>0);
  voxel.orbit(w,Math.PI/4);
  assert.equal(voxel.regionStats(w).loads,0);
});
test('lazy regions produce same ordered static commands as eager index',()=>{
  const w=voxel.demo(),occupied=new Set(w.blocks.map(b=>`${b.x},${b.y},${b.z}`));
  const idx=chunks.indexRegions(w,voxel.project,voxel.rotate,occupied);
  const all=chunks.visibleRegions(idx,{x:5000,y:5000},10000,10000,5000).commands;
  assert.equal(all.filter(c=>c.kind==='ground').length,w.width*w.depth-w.blocks.filter(b=>b.y===0).length);
  assert.ok(all.some(c=>c.kind==='block'));
  assert.ok(all.every((command,i)=>!i||chunks.commandOrder(all[i-1],command)<=0));
});
test('2D obstacle navigator finds deterministic corridor detours',()=>{
  const obstacles=[{x:75,y:40,w:20,h:80}];
  const options={width:260,height:220,minX:0,maxX:250,obstacles};
  const a=navigation.route({x:30,y:90},{x:170,y:90},options);
  assert.ok(a.length>0,JSON.stringify(a));
  assert.deepEqual(a,navigation.route({x:30,y:90},{x:170,y:90},options));
  assert.ok(a.every(p=>!(p.x>67&&p.x<103&&p.y>32&&p.y<128)));
});
test('2D chase uses navigated vertical route without editing authoring coordinates',()=>{
  const enemy={x:30,y:90,componentKind:'enemy',componentBehavior:'chase',componentAvoidObstacles:true,
    componentPatrolRange:220,componentPatrolSpeed:120,componentAggroRange:300};
  const obstacle={x:75,y:40,w:20,h:80};
  let output;
  for(let tick=1;tick<=180;tick++){
    output=motion.position(enemy,tick,260,{actorX:170,actorY:90,navigation:{width:260,height:220,obstacles:[obstacle]}});
    assert.ok(!(output.x>67&&output.x<103&&output.y>32&&output.y<128));
  }
  assert.ok(output.x>120,JSON.stringify(output));
  assert.equal(enemy.x,30);assert.equal(enemy.y,90);
});
test('voxel obstacle-aware enemy routes around an impassable straight line',()=>{
  const w=voxel.empty();w.width=12;w.depth=10;w.height=4;w.blocks=[];
  for(let z=1;z<=5;z++)w.blocks.push({x:4,z,y:0,color:'#cc3322'});
  const occupied=new Set(w.blocks.map(b=>`${b.x},${b.y},${b.z}`));
  const planned=enemies.route(w,{x:1.5,z:3.5},{x:8.5,z:3.5},occupied,0);
  assert.ok(planned.length>=7);
  assert.ok(planned.every(p=>enemies.standing(w,occupied,Math.floor(p.x),p.y,Math.floor(p.z))));
  const marker={x:1,y:0,z:3,componentKind:'enemy',componentBehavior:'chase',componentPatrolRange:10,componentPatrolSpeed:3,componentAggroRange:12};
  w.markers=[marker];
  let loc;
  for(let tick=1;tick<=240;tick++){
    loc=voxel.markerPosition(w,marker,tick,{x:8.5,z:3.5,y:0});
    assert.ok(!occupied.has(`${Math.floor(loc.x)},${Math.floor(loc.y)},${Math.floor(loc.z)}`));
  }
  assert.ok(loc.x>5,JSON.stringify(loc));
  assert.equal(marker.x,1);
});
test('voxel normalize retains optional enemy navigation and old marker IDs',()=>{
  const old=voxel.normalize({markers:[{id:'enemy-1',triggerId:'enemy-1',componentKind:'enemy',kind:'trigger',x:3,y:0,z:3}]});
  assert.equal(old.markers[0].componentBehavior,'sentry');
  const newer=voxel.normalize({...old,markers:[{...old.markers[0],componentBehavior:'guard',componentPatrolRange:3.5,componentPatrolSpeed:1.25,componentAggroRange:7}]});
  assert.equal(newer.markers[0].componentPatrolSpeed,1.25);
  assert.equal(newer.markers[0].triggerId,'enemy-1');
});
test('voxel marker inspector updates generated rule nodes without replacing their IDs',()=>{
  const pm={worldType:'voxel3d',activeSceneId:'scene-main',props:[],variables:{},nodeEditor:{nodes:[]},voxelWorld:voxel.empty()};
  const result=editor.place(pm,{kind:'enemy',selectedCell:{x:4,y:0,z:4},behavior:'chase',patrolRange:64,patrolSpeed:32,aggroRange:192,damage:2},pieces);
  assert.equal(result.ok,true);const marker=pm.voxelWorld.markers[0];
  assert.equal(marker.componentPatrolRange,2);assert.equal(marker.componentPatrolSpeed,1);
  const ids=pm.nodeEditor.nodes.map(n=>n.id);
  const updated=editor.updateMarker(pm,marker,{damage:5,behavior:'guard',patrolRange:3.5,patrolSpeed:1.25,aggroRange:8},pieces);
  assert.equal(updated.ok,true);
  assert.deepEqual(pm.nodeEditor.nodes.map(n=>n.id),ids);
  assert.equal(pm.nodeEditor.nodes.find(n=>n.type==='actionChangeNumber').data.amount,-5);
  assert.equal(marker.componentPatrolSpeed,1.25);
  assert.equal(marker.triggerId,'enemy-1');
  assert.equal(editor.inspectMarker(pm,marker).damage,5);
});
test('direction and state-specific sprite clips and holds override legacy playback',()=>{
  const mode={leftClip:'4',leftRunClip:'5,6',leftIdleClip:'1,2',runClip:'3',riseClip:'7,8',
    runClipTicks:3,idleClipTicks:9,airClipTicks:2,clipFrameTicks:8};
  assert.equal(core.frameSelection({grounded:true,direction:'left',vx:-2},mode,3).frame,6);
  assert.equal(core.frameSelection({grounded:true,direction:'left',vx:0},mode,9).frame,2);
  assert.equal(core.frameSelection({grounded:false,direction:'left',vy:-4},mode,2).frame,8);
  assert.equal(core.frameSelection({grounded:true,direction:'right',vx:2},mode,0).frame,3);
  assert.equal(animationEditor.CLIPS.includes('upRunClip'),true);
  assert.ok(animationEditor.SELECTORS.leftRunClip.startsWith('#play-'));
});
test('standalone source embeds lazy regions and navigation modules without external requests',()=>{
  assert.match(voxel.standaloneSource,/indexRegions/);
  assert.match(voxel.standaloneSource,/createPlayVoxelEnemies/);
  assert.match(motion.standaloneSource,/createPlayComponentNavigation/);
  const html=exportGame.buildTinyGameHtml({title:'Pass 5',frames:{},artWidth:8,artHeight:8,playMode:{worldType:'voxel3d',voxelWorld:voxel.demo(),props:[],nodeEditor:{nodes:[]}}});
  assert.match(html,/visibleRegions/);assert.match(motion.standaloneSource,/componentAvoidObstacles/);assert.match(html,/frameSelection/);
  assert.doesNotMatch(html,/src="\.\/modules\/play-voxel-enemies\.js"/);
});
