"use strict";
// Rendering benchmark
// Bounded workloads
const {performance}=require("node:perf_hooks");
const VOXEL=require("../src/modules/play-voxel-assets.js");
const WORLD=require("../src/modules/play-voxel-world.js");
const GEOMETRY=require("../src/modules/play-voxel-character-geometry.js");
const world=WORLD.empty();world.cellSize=38;
const actor={x:8,y:0,z:8,grounded:true,moving:true,direction:"down",facing:1};
const ctx={canvas:{width:640,height:360},save(){},restore(){},setTransform(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},ellipse(){},rect(){},arc(){},fillText(){},drawImage(){}};
const median=arr=>{const sorted=arr.toSorted((a,b)=>a-b);return sorted[Math.floor(sorted.length/2)];};
const p95=arr=>{const sorted=arr.toSorted((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)];};
function model(width,height,depth) {
 const cubes=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let z=0;z<depth;z++) {
  if(y < height*.4 && x>=width*.35 && x<width*.65)continue;
  cubes.push({x,y,z,color:y>height*.7?"#d8cba2":"#5878af"});
 }
 return VOXEL.normalizeAsset({id:"test-hero",width,height,depth,cubes,rig:{enabled:true,interpolate:true,swing:16,bob:4}});
}
function run(width,height,depth) {
 const asset=model(width,height,depth);
 const scene={voxelActorAssetId:asset.id};
 const times=[];
 let cubes=0;
 for(let step=0;step<32;step++){
  actor.direction=["down","right","up","left"][step%4];
  const start=performance.now();
  const vol=VOXEL.actorVolume([asset],scene,actor,step);
  WORLD.draw(ctx,world,actor,vol,{follow:true,tick:step});
  const duration=performance.now()-start;
  if(step>=6) times.push(duration);
  cubes=vol.cubes.length;
 }
 return {inputVoxels:asset.cubes.length,drawnVisibleCells:cubes,cap:GEOMETRY.MAX_DRAW_CELLS,
   javascriptMedianMs:+median(times).toFixed(3),javascriptP95Ms:+p95(times).toFixed(3)};
}
const results={benchmark:"Canvas world-space voxel actor draw path (stub context)", node:process.version,
 renderer:"depth-sorted 3D voxel faces, not WebGL; Canvas rasterization excluded",sampleFrames:26,
 cases:[run(8,12,4),run(16,24,8),run(24,32,10)]};
process.stdout.write(JSON.stringify(results,null,2)+"\n");
