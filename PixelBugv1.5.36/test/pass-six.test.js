"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const voxel=require('../src/modules/play-voxel-world.js');
const chunks=require('../src/modules/play-voxel-chunks.js');
const enemies=require('../src/modules/play-voxel-enemies.js');
const motion=require('../src/modules/play-component-motion.js');
const platform=require('../src/modules/play-platform-navigation.js');
const obstacles=require('../src/modules/play-component-obstacles.js');
const pieces=require('../src/modules/play-gameplay-components.js');
const editor=require('../src/modules/renderer/play-component-editor-controller.js');
const timeline=require('../src/modules/renderer/play-animation-timeline-controller.js');
const exportGame=require('../src/modules/tiny-game-export.js');
function canvas(){const ctx={canvas:{width:900,height:600}};
  for(const method of ['save','restore','setTransform','fillRect','beginPath','moveTo','lineTo','closePath','fill','stroke','ellipse','arc','rect','roundRect','fillText','drawImage','translate','scale'])ctx[method]=()=>{};
  return ctx;
}
function terrain(){const world=voxel.empty();world.width=96;world.depth=96;world.height=8;world.cellSize=30;
  for(let x=0;x<96;x++)for(let z=0;z<96;z++)if((x*13+z*11)%4!==0)world.blocks.push({x,y:0,z,color:'#4a8956'});
  return world;
}
test('screen-space streaming skips distant buckets and reuses ordered viewport commands',()=>{
  const world=terrain(),ctx=canvas(),actor=voxel.initialActor(world);actor.x=3;actor.z=3;
  voxel.draw(ctx,world,actor,null,{follow:true,tick:1});const first=voxel.regionStats(world);
  assert.ok(first.loads>0);assert.ok(first.candidateRegions<first.totalRegions,JSON.stringify(first));
  voxel.draw(ctx,world,actor,null,{follow:true,tick:2});const second=voxel.regionStats(world);
  assert.ok(second.reusedViews>=1,JSON.stringify(second));assert.equal(first.sorts,second.sorts);
  assert.ok(second.residentRegions<=second.maxResident);
});
test('view command reuse invalidates on authored block edit and camera rotation',()=>{
  const world=voxel.demo(),ctx=canvas();voxel.draw(ctx,world,null,null);
  voxel.draw(ctx,world,null,null);assert.ok(voxel.regionStats(world).reusedViews>0);
  voxel.setBlock(world,2,0,2,'#11aaff');assert.equal(voxel.regionStats(world).loads,0);
  voxel.draw(ctx,world,null,null);assert.equal(voxel.regionStats(world).sorts,1);
  voxel.orbit(world,0.3);assert.equal(voxel.regionStats(world).loads,0);
});
test('3D navigation climbs supported one-block ledges and traverses their tops',()=>{
  const world=voxel.empty();world.width=10;world.depth=5;world.height=5;
  world.blocks=[];for(let x=3;x<=7;x++)world.blocks.push({x,y:0,z:2,color:'#559955'});
  const occupied=new Set(world.blocks.map(b=>`${b.x},${b.y},${b.z}`));
  const path=enemies.route(world,{x:1.5,y:0,z:2.5},{x:7.5,y:1,z:2.5},occupied);
  assert.ok(path.length>=6,JSON.stringify(path));
  assert.ok(path.some(point=>point.y===1),JSON.stringify(path));
  assert.ok(path.every(p=>enemies.standing(world,occupied,Math.floor(p.x),p.y,Math.floor(p.z))));
  const down=enemies.route(world,{x:7.5,y:1,z:2.5},{x:1.5,y:0,z:2.5},occupied);
  assert.ok(down.some(p=>p.y===0));
});
test('moving voxel enemy pursues player across elevation without editing authored marker',()=>{
  const world=voxel.empty();world.width=12;world.depth=5;world.height=5;
  for(let x=3;x<=8;x++)world.blocks.push({x,y:0,z:2,color:'#559955'});
  const marker={componentKind:'enemy',componentBehavior:'chase',componentPatrolRange:12,
    componentPatrolSpeed:4,componentAggroRange:12,x:1,y:0,z:2};world.markers=[marker];
  let position;
  for(let tick=1;tick<=185;tick++){
    position=voxel.markerPosition(world,marker,tick,{x:8.5,y:1,z:2.5});
    assert.ok(!world.blocks.some(b=>b.x===Math.floor(position.x)&&b.y===Math.floor(position.y)&&b.z===Math.floor(position.z)),JSON.stringify(position));
  }
  assert.ok(position.x>6 && position.y===1,JSON.stringify(position));
  assert.equal(marker.x,1);assert.equal(marker.y,0);
});
test('opt-in 2D enemy jumping uses gravity, clears obstacles, lands, and is deterministic',()=>{
  const obstacle={x:100,y:124,w:24,h:56},nav={width:260,height:210,groundY:180,bodyW:16,bodyH:24,obstacles:[obstacle]};
  const enemy={x:40,y:156,componentKind:'enemy',componentBehavior:'chase',componentAvoidObstacles:true,
    componentPlatformJump:true,componentPatrolRange:220,componentPatrolSpeed:140,componentAggroRange:400};
  const sample=()=>{
    motion.reset(enemy);let minY=156,positions=[];
    for(let tick=1;tick<=180;tick++){
      const p=motion.position(enemy,tick,260,{actorX:195,actorY:156,navigation:nav});
      minY=Math.min(minY,p.y);
      assert.ok(!(p.x<124&&p.x+16>100&&p.y<180&&p.y+24>124),JSON.stringify(p));
      if(tick%15===0)positions.push([+p.x.toFixed(3),+p.y.toFixed(3)]);
    }
    return {minY,positions};
  };
  const a=sample(),b=sample();assert.deepEqual(a,b);
  assert.ok(a.minY<100);assert.ok(a.positions.at(-1)[0]>=190);
  assert.equal(a.positions.at(-1)[1],156);assert.equal(enemy.x,40);
});
test('legacy pathfinding remains the default when platform jumping is disabled',()=>{
  const classic=motion.settings({componentAvoidObstacles:true});
  assert.equal(classic.componentPlatformJump,false);
  const active={x:30,y:152,componentAvoidObstacles:true};
  const nav=obstacles.context([active,{x:90,y:130,solid:true}],active,()=>({w:16,h:28}),300,210,180,()=>false);
  assert.equal(nav.navigation.bodyH,28);
  assert.equal(nav.navigation.obstacles.length,1);
  assert.equal(platform.tick(platform.create(10,152),10,{speed:0},{groundY:180,bodyW:16,bodyH:28}).y,152);
});
test('editable gameplay piece persists opt-in jump settings and preserves generated rule IDs',()=>{
  const pm={worldType:'2d',activeSceneId:'scene-main',props:[],variables:{},nodeEditor:{nodes:[]},voxelWorld:voxel.empty()};
  const created=editor.place(pm,{kind:'enemy',frame:0,x:20,y:120,scale:2,patrolRange:180,patrolSpeed:120,
    behavior:'chase',platformJump:true,avoidObstacles:true},pieces);
  assert.equal(created.ok,true);assert.equal(pm.props[0].componentPlatformJump,true);
  const ids=pm.nodeEditor.nodes.map(n=>n.id);
  const update=editor.update(pm,pm.props[0],{kind:'enemy',behavior:'guard',damage:3,patrolRange:200,patrolSpeed:90,platformJump:false,avoidObstacles:true},pieces);
  assert.equal(update.ok,true);assert.equal(pm.props[0].componentPlatformJump,false);
  assert.deepEqual(pm.nodeEditor.nodes.map(n=>n.id),ids);
  assert.equal(editor.inspect(pm,pm.props[0]).platformJump,false);
});
test('animation timeline preserves old clip keys and reorders without modifying original arrays',()=>{
  const frames=[0,3,5,7];const copy=frames.slice();assert.deepEqual(timeline.reorder(frames,1,3),[0,5,7,3]);
  assert.deepEqual(frames,copy);assert.ok(timeline.keys.includes('upRunClip'));
  const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
  assert.match(html,/id="play-anim-preview-canvas"/);assert.match(html,/id="play-anim-append"/);
  assert.ok(html.indexOf('play-animation-timeline-controller.js')<html.indexOf('renderer.js'));
});
test('standalone exports include platform physics and streamed voxel navigation inline',()=>{
  const html=exportGame.buildTinyGameHtml({title:'Pass 6',frames:{},artWidth:8,artHeight:8,
    playMode:{worldType:'voxel3d',voxelWorld:voxel.demo(),props:[],nodeEditor:{nodes:[]}}});
  assert.match(html,/createPlayVoxelEnemies/);assert.match(html,/screenIndex/);
  const twoD=exportGame.buildTinyGameHtml({title:'Pass 6 2D',frames:{},artWidth:8,artHeight:8,
    playMode:{worldType:'sideScroller',props:[],nodeEditor:{nodes:[]}}});
  assert.match(twoD,/createPlayPlatformNavigation/);assert.match(twoD,/createPlayComponentObstacles/);
  assert.doesNotMatch(html,/src="\.\/modules\/play-platform-navigation\.js"/);
});
