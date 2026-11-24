'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const output=process.env.PIXELBUG_BROWSER_FIXTURE_DIR || path.join(root,'browser-test-output');fs.mkdirSync(output,{recursive:true});
const {buildTinyGameHtml}=require(path.join(root,'src/modules/tiny-game-export.js'));
const V=require(path.join(root,'src/modules/play-voxel-world.js'));
const n=(id,type,next='',data={},alt='')=>({id,type,next,alt,data,name:id});
function scene(id,type){const w=V.empty();w.start={x:7.5,y:1,z:7.5};for(let x=6;x<10;x++)for(let z=6;z<10;z++)V.setBlock(w,x,0,z,'#7cba94');return{id,name:id,worldType:type,voxelWorld:w,props:[],sceneWidth:640,sceneHeight:360,worldWidth:900,groundY:310,idleFrame:0,walkFrame:0,jumpFrame:0,actorScale:2};}
function payload(sequence,opts={}){
 const scenes=sequence.map(([id,type])=>scene(id,type));
 const nodes=[];
 for(let i=0;i<scenes.length;i++){
  const sc=scenes[i];
  nodes.push(n('start-'+i,'eventStart','set-'+i,{sceneId:sc.id}));
  nodes.push(n('set-'+i,'actionSetVariable','item-'+i,{variable:'arrived'+i,value:'yes'}));
  nodes.push(n('item-'+i,'actionAddItem',i===scenes.length-1?'':'jump-'+i,{item:'key'+i}));
  if(i<scenes.length-1)nodes.push(n('jump-'+i,'actionScene','',{sceneId:scenes[i+1].id}));
 }
 return {title:'Hybrid test',exportWidth:640,exportHeight:360,artWidth:16,artHeight:16,playMode:{worldType:scenes[0].worldType,scenes,activeSceneId:scenes[0].id,nodeEditor:{nodes},variables:{},inventory:[],ruleSeed:1234,idleFrame:0,walkFrame:0,jumpFrame:0,actorScale:2, ...opts},spriteFrames:{actor:{},object:{}}};
}
fs.writeFileSync(path.join(output,'hybrid-2d-voxel-2d.html'),buildTinyGameHtml(payload([['s0','sidescroller'],['s1','voxel3d'],['s2','sidescroller']])));
fs.writeFileSync(path.join(output,'hybrid-voxel-2d-voxel.html'),buildTinyGameHtml(payload([['s0','voxel3d'],['s1','sidescroller'],['s2','voxel3d']])));
fs.writeFileSync(path.join(output,'hybrid-loop.html'),buildTinyGameHtml(payload([['s0','sidescroller'],['s1','voxel3d']],{nodeEditor:{nodes:[n('a','eventStart','go-b',{sceneId:'s0'}),n('go-b','actionScene','',{sceneId:'s1'}),n('b','eventStart','go-a',{sceneId:'s1'}),n('go-a','actionScene','',{sceneId:'s0'})]}})));
const rollScenes=[['s0','sidescroller'],['s1','voxel3d'],['s2','sidescroller']];
const randomNodes=[];
for(let i=0;i<3;i++){
 randomNodes.push(n('start-'+i,'eventStart','roll-'+i,{sceneId:'s'+i}));
 randomNodes.push(n('roll-'+i,'actionRollNumber',i<2?'switch-'+i:'',{variable:'roll'+i,rollMin:1,rollMax:1000}));
 if(i<2)randomNodes.push(n('switch-'+i,'actionScene','',{sceneId:'s'+(i+1)}));
}
fs.writeFileSync(path.join(output,'hybrid-random.html'),buildTinyGameHtml(payload(rollScenes,{nodeEditor:{nodes:randomNodes}})));
const checkpointNodes=[
 n('start-a','eventStart','check',{sceneId:'s0'}),
 n('check','logicVariable','end',{variable:'returning',equals:'yes'},'cp'),
 n('cp','actionCheckpoint','set'),
 n('set','actionSetVariable','switch',{variable:'returning',value:'yes'}),
 n('switch','actionScene','',{sceneId:'s1'}),
 n('end','actionSetVariable','',{variable:'restored',value:'yes'})
];
fs.writeFileSync(path.join(output,'hybrid-checkpoint.html'),buildTinyGameHtml(payload([['s0','sidescroller'],['s1','voxel3d']],{nodeEditor:{nodes:checkpointNodes}})));
console.log('hybrid fixtures generated');
