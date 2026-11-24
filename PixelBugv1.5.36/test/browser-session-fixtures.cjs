'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=process.env.PIXELBUG_BROWSER_FIXTURE_DIR || path.join(root,'browser-test-output');
fs.mkdirSync(out,{recursive:true});
const build=require(path.join(root,'src/modules/tiny-game-export.js')).buildTinyGameHtml;
const V=require(path.join(root,'src/modules/play-voxel-world.js'));
const world=V.empty();
world.start={x:7.5,y:1,z:7.5};
for(let x=5;x<11;x++) for(let z=5;z<11;z++) V.setBlock(world,x,0,z,'#86c6a7');
const side={id:'home',name:'Home',worldType:'sidescroller',props:[],sceneWidth:640,sceneHeight:360,groundY:300,worldWidth:960,actorScale:2};
const voxel={id:'cave',name:'Cave',worldType:'voxel3d',voxelWorld:world,props:[]};
const base={title:'Session test',exportWidth:640,exportHeight:360,artWidth:16,artHeight:16,spriteFrames:{actor:{},object:{}}};
const rules={nodes:[]};
const variants={
  'hybrid-session.html':{worldType:'sidescroller',activeSceneId:'home',scenes:[side,voxel],nodeEditor:rules,variables:{saved:'start'},inventory:['key'],ruleSeed:42},
  '2d-session.html':{worldType:'sidescroller',activeSceneId:'home',scenes:[side],nodeEditor:rules,variables:{saved:'start'},inventory:['key'],ruleSeed:42},
  'voxel-session.html':{worldType:'voxel3d',activeSceneId:'cave',scenes:[voxel],nodeEditor:rules,variables:{saved:'start'},inventory:['key'],ruleSeed:42}
};
for(const [name,playMode] of Object.entries(variants)) fs.writeFileSync(path.join(out,name),build({...base,playMode}));
