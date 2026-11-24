'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const exportGame=require(path.join(root,'src/modules/tiny-game-export.js'));
const voxel=require(path.join(root,'src/modules/play-voxel-world.js'));
const out=process.env.PIXELBUG_BROWSER_FIXTURE_DIR || path.join(root,'browser-test-output');fs.mkdirSync(out,{recursive:true});
const n=(id,type,next='',data={},alt='')=>({id,type,next,alt,data,name:id});
const sceneNodes=[
 n('start-a','eventStart','give',{sceneId:'scene-a'}),
 n('give','actionAddItem','has',{item:'magic_key'}),
 n('has','logicHasItem','set',{item:'magic_key'},'bad'),
 n('set','actionSetVariable','math',{variable:'score',value:'7'}),
 n('math','actionMathNumber','compare',{variable:'score',mathOperation:'multiply',operand:3}),
 n('compare','logicCompareNumber','go',{variable:'score',operator:'>=',compare:21},'bad'),
 n('go','actionScene','',{sceneId:'scene-b'}),
 n('bad','actionSetVariable','',{variable:'failure',value:'yes'}),
 n('start-b','eventStart','arrived',{sceneId:'scene-b'}),
 n('arrived','actionSetVariable','',{variable:'arrived',value:'yes'})
];
const multiStartNodes=[
 n('start-first','eventStart','switch',{sceneId:'scene-a'}),
 n('switch','actionScene','',{sceneId:'scene-b'}),
 n('start-second','eventStart','stale-event',{sceneId:'scene-a'}),
 n('stale-event','actionSetVariable','',{variable:'staleEvent',value:'yes'}),
 n('start-b','eventStart','arrived',{sceneId:'scene-b'}),
 n('arrived','actionSetVariable','',{variable:'arrived',value:'yes'})
];
const staleNodes=[
 n('start-a','eventStart','say',{sceneId:'scene-a'}),
 n('say','actionMessage','late',{message:'Delay then set'}),
 n('late','actionSetVariable','',{variable:'stale',value:'yes'}),
 n('start-b','eventStart','arrived',{sceneId:'scene-b'}),
 n('arrived','actionSetVariable','',{variable:'arrived',value:'yes'})
];
const loopNodes=[
 n('start-a','eventStart','go-b',{sceneId:'scene-a'}),
 n('go-b','actionScene','',{sceneId:'scene-b'}),
 n('start-b','eventStart','go-a',{sceneId:'scene-b'}),
 n('go-a','actionScene','',{sceneId:'scene-a'})
];
const triggerNodes=[
 n('start-a','eventStart','init',{sceneId:'scene-a'}),
 n('init','actionSetVariable','',{variable:'ready',value:'yes'}),
 n('touch','eventTrigger','gift',{sceneId:'scene-a',trigger:'portal'}),
 n('gift','actionAddItem','go',{item:'portal_key'}),
 n('go','actionScene','',{sceneId:'scene-b'}),
 n('start-b','eventStart','arrived',{sceneId:'scene-b'}),
 n('arrived','actionSetVariable','',{variable:'arrived',value:'yes'})
];
function getWorld(){const w=voxel.empty(); w.start={x:7.5,y:1,z:7.5};for(let x=5;x<11;x++)for(let z=5;z<11;z++)voxel.setBlock(w,x,0,z,'#abc4df');return w;}
function getPayload(kind,nodes,mode) {
 const isVoxel=kind==='voxel', w=getWorld();
 const a={id:'scene-a',name:'A',worldType:isVoxel?'voxel3d':'side2d',voxelWorld:w,sceneWidth:640,sceneHeight:360,worldWidth:900,groundY:300,props:[]};
 const b={...a,id:'scene-b',name:'B',voxelWorld:getWorld()};
 if(mode==='trigger')a.voxelWorld.markers=[{id:'portal-marker',kind:'trigger',x:7,y:1,z:7,triggerId:'portal',name:'Portal'}];
 return {title:`Browser ${kind} ${mode}`,exportWidth:640,exportHeight:360,artWidth:16,artHeight:16,
   playMode:{worldType:isVoxel?'voxel3d':'side2d',sceneWidth:640,sceneHeight:360,groundY:300,worldWidth:900,idleFrame:0,walkFrame:0,jumpFrame:0,
   actorScale:2,activeSceneId:'scene-a',scenes:[a,b],nodeEditor:{nodes},variables:{},inventory:[],voxelWorld:a.voxelWorld},spriteFrames:{actor:{},object:{}}};
}
for(const kind of ['voxel','2d'])for(const [mode,nodes] of [['rules',sceneNodes],['stale',staleNodes],['trigger',triggerNodes],['loop',loopNodes],['multi',multiStartNodes]]){
 if(kind==='2d'&&mode==='trigger')continue;
 const html=exportGame.buildTinyGameHtml(getPayload(kind,nodes,mode));
 fs.writeFileSync(path.join(out,`${kind}-${mode}.html`),html);
 console.log(`${kind}-${mode}: ${html.length} bytes`);
}
