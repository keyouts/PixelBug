"use strict";
// World connections
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const author=require("../src/modules/play-world-connection-authoring.js");
const layout=require("../src/modules/play-world-diagram-model.js");
const preview=require("../src/modules/play-world-preview.js");
const map=require("../src/modules/play-scene-rule-map.js");
const root=path.join(__dirname,"..");
const clone=o=>JSON.parse(JSON.stringify(o));
function fixture(){
 const pm={activeSceneId:"home",worldType:"sidescroller",sceneWidth:640,sceneHeight:360,idleFrame:1,props:[],
  scenes:[{id:"home",name:"Home",worldType:"sidescroller",sceneWidth:640,sceneHeight:360,props:[]},
   {id:"ridge",name:"Ridge",worldType:"voxel3d",voxelWorld:{width:16,depth:16,height:12,start:{x:3,y:1,z:4},
     blocks:[{x:3,y:0,z:4,color:"#88bb44"}],markers:[]},props:[]},
   {id:"town",name:"Town",worldType:"sidescroller",props:[]}],nodeEditor:{nodes:[]}};
 return pm;
}
test("drag-created rule connections use real scene-scoped touch graph nodes",()=>{
 const pm=fixture(),snap=clone(pm.scenes[0]);let i=0;
 const result=author.create(pm,"home","ridge",{makeId:p=>`${p}-${++i}`});
 assert.equal(result.ok,true);assert.equal(result.mode,"rule");
 assert.equal(pm.props.length,1);assert.equal(pm.props[0].targetSceneId,"");
 assert.equal(pm.props[0].nodeTriggerId,result.triggerId);
 assert.deepEqual(pm.scenes[0],snap,"active scene snapshot is left to the history/capture adapter");
 assert.equal(pm.nodeEditor.nodes.length,2);
 assert.equal(pm.nodeEditor.nodes[0].next,result.actionId);
 assert.equal(pm.nodeEditor.nodes[0].data.sceneId,"home");
 assert.equal(pm.nodeEditor.nodes[1].data.sceneId,"ridge");
 assert.ok(map.analyze(pm,4).links.some(link=>link.from==="home"&&link.to==="ridge"&&link.actionId===result.actionId));
});
test("native 2D portal connection creates one transition without redundant action nodes",()=>{
 const pm=fixture();const result=author.create(pm,"home","town",{mode:"portal",makeId:()=>"portal-safe"});
 assert.equal(result.ok,true);assert.equal(result.mode,"portal");
 assert.equal(pm.props[0].targetSceneId,"town");assert.equal(pm.props[0].solid,false);
 assert.equal(pm.nodeEditor.nodes.length,0);
 assert.ok(map.analyze(pm,4).links.some(link=>link.event==="objectPortal"&&link.from==="home"&&link.to==="town"));
});
test("voxel graph connections place a supported trigger marker without mutating source snapshots",()=>{
 const pm=fixture(),saved=clone(pm.scenes[1]);let seq=0;
 const result=author.create(pm,"ridge","home",{mode:"portal",makeId:p=>`${p}-${++seq}`});
 assert.equal(result.ok,true);assert.equal(result.mode,"rule");
 assert.deepEqual(pm.scenes[1].voxelWorld.markers[0],{id:result.triggerId,triggerId:result.triggerId,
  kind:"trigger",name:"Portal to Home",x:3,y:1,z:4});
 assert.equal(saved.voxelWorld.markers.length,0);
 const report=map.analyze(pm,4);
 assert.ok(report.links.some(link=>link.from==="ridge"&&link.to==="home"&&link.actionId===result.actionId));
});
test("connection authoring refuses bad ids, self loops and exhausted node budgets",()=>{
 const pm=fixture();assert.equal(author.create(pm,"missing","home").ok,false);
 assert.equal(author.create(pm,"home","home").ok,false);
 pm.nodeEditor.nodes=Array.from({length:99},(_,i)=>({id:`node-${i}`,type:"actionMessage"}));
 assert.equal(author.create(pm,"home","ridge").ok,false);assert.equal(pm.props.length,0);
});
test("collision-aware orthogonal arrows detour around obstructing scene cards",()=>{
 const positions={from:{x:20,y:200},middle:{x:385,y:200},to:{x:750,y:200}};
 const points=layout.routePoints({from:"from",to:"to"},positions);
 assert.ok(points.length>=4);
 const obstacle={left:377,right:613,top:192,bottom:456};
 for(let i=2;i<points.length-1;i++){
   const a=points[i-1],b=points[i];
   const overlap=a.x===b.x?a.x>obstacle.left&&a.x<obstacle.right&&Math.max(a.y,b.y)>obstacle.top&&Math.min(a.y,b.y)<obstacle.bottom:
     a.y>obstacle.top&&a.y<obstacle.bottom&&Math.max(a.x,b.x)>obstacle.left&&Math.min(a.x,b.x)<obstacle.right;
   assert.equal(overlap,false,JSON.stringify({points,index:i}));
 }
 assert.match(layout.curve({from:"from",to:"to"},positions),/^M \d+ \d+ L /);
});
test("2D and voxel preview renderers read authored geometry and report selectable targets",()=>{
 let draws=0;const ctx={clearRect(){draws++},fillRect(){draws++},strokeRect(){},beginPath(){},arc(){},lineTo(){},moveTo(){},closePath(){},fill(){draws++},stroke(){},drawImage(){draws++}};
 const canvas={width:220,height:130,getContext:()=>ctx};
 const pm=fixture();pm.props=[{name:"Door",nodeTriggerId:"door",frame:1,x:220,y:230}];
 const two=preview.render(canvas,preview.actualScene(pm,"home"),{getFrameCanvas:()=>({width:16,height:16})});
 const three=preview.render(canvas,preview.actualScene(pm,"ridge"));
 assert.equal(two[0].id,"door");assert.deepEqual(three,[]);
 pm.scenes[1].voxelWorld.markers.push({kind:"trigger",id:"exit",triggerId:"exit",name:"Exit",x:3,y:1,z:4});
 assert.equal(preview.render(canvas,preview.actualScene(pm,"ridge"),{},2)[0].id,"exit");
 assert.ok(draws>5);
});
test("new world-creation and preview modules load before the node editor, not in standalone HTML",()=>{
 const html=fs.readFileSync(path.join(root,"src/index.html"),"utf8");
 for(const name of ["play-world-connection-authoring","play-world-preview","play-world-diagram-controller"])
  assert.ok(html.indexOf(name+".js")>=0&&html.indexOf(name+".js")<html.indexOf("node-editor.js"));
 const exportSource=fs.readFileSync(path.join(root,"src/modules/tiny-game-export.js"),"utf8");
 assert.doesNotMatch(exportSource,/PixelBugPlayWorldConnectionAuthoring|PixelBugPlayWorldPreview/);
});
test("scene collection creation and deletion preserve authoring snapshots and unlink old portals",()=>{
 const scenes=require('../src/modules/play-scene-collection.js');
 const pm=fixture();pm.activeSceneId='home';pm.scenes[2].props=[{targetSceneId:'ridge'}];
 const copy=scenes.add(pm,true,name=>name+'-new',(source,id,name)=>({...source,id,name}));
 assert.equal(copy.name,'Home Copy');assert.equal(copy.id,'Scene 4-new');
 pm.activeSceneId='ridge';const next=scenes.removeActive(pm);
 assert.equal(next.id,'town');assert.equal(pm.scenes.some(s=>s.id==='ridge'),false);
 assert.equal(pm.scenes.find(s=>s.id==='town').props[0].targetSceneId,'');
});
