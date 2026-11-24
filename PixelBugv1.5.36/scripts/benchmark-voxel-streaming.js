"use strict";
// Voxel benchmark
const {performance}=require('node:perf_hooks');
const WORLD=require('../src/modules/play-voxel-world.js');
const path=require('node:path');
function scene(size,seed,engine=WORLD){
  const world=engine.empty();world.width=size;world.depth=size;world.height=8;world.cellSize=32;
  const colors=['#698c72','#b4aa79','#8d92bd'];let count=0;
  for(let x=0;x<size;x++)for(let z=0;z<size;z++){
    const hash=(Math.imul(x+seed,73856093)^Math.imul(z+7,19349663))>>>0;
    const layers=1+(hash%3===0?1:0);
    for(let y=0;y<layers;y++){
      if(count>=engine.MAX_BLOCKS)break;
      world.blocks.push({x,y,z,color:colors[(hash+y)%3]});count++;
    }
  }
  world.start={x:size/2,y:2,z:size/2};
  return world;
}
function canvas(width=1280,height=720){
  const ctx={canvas:{width,height}};
  for(const key of ['save','restore','setTransform','fillRect','beginPath','moveTo','lineTo','closePath','fill','stroke','arc','ellipse','rect','roundRect','fillText','drawImage','translate','scale'])ctx[key]=()=>{};
  return ctx;
}
function percentile(values,q){const valuesSorted=[...values].sort((a,b)=>a-b);return Math.round(valuesSorted[Math.floor((valuesSorted.length-1)*q)]*1000)/1000;}
function benchmark(size,engine=WORLD,pattern="travel"){
  const world=scene(size,11,engine),ctx=canvas();
  const actor=engine.initialActor(world);
  let first=0;const durations=[];
  const count=120;
  for(let i=0;i<count;i++){
    const progress=(i%40)/39;
    actor.x=pattern==="stationary"?size/2:Math.min(size-.5,Math.max(.5,.5+(size-1)*progress));
    actor.z=pattern==="stationary"?size/2:Math.min(size-.5,Math.max(.5,.5+(size-1)*(Math.floor(i/40)%2?1-progress:progress)));
    const begin=performance.now();
    engine.draw(ctx,world,actor,null,{follow:true,tick:i});
    const elapsed=performance.now()-begin;
    if(i===0)first=elapsed;
    if(i>=20)durations.push(elapsed);
  }
  const stats=engine.regionStats ? engine.regionStats(world) : null;
  return {pattern,dimensions:`${size}x${size}`,blocks:world.blocks.length,
    samples:durations.length,coldMs:Math.round(first*1000)/1000,
    p50Ms:percentile(durations,.5),p95Ms:percentile(durations,.95),
    p99Ms:percentile(durations,.99),maxResident:stats?.maxResident ?? null,
    resident:stats?.residentRegions ?? null,totalRegions:stats?.totalRegions ?? null,
    loads:stats?.loads ?? null,hits:stats?.hits ?? null,evictions:stats?.evictions ?? null,
    sorts:stats?.sorts ?? null,reusedViews:stats?.reusedViews ?? null,
    candidateRegions:stats?.candidateRegions ?? null,prefetchLoads:stats?.prefetchLoads ?? null};
}
const sizes=[16,48,96];
const baselinePath=process.argv[2];
const baseline=baselinePath ? require(path.resolve(baselinePath,'src/modules/play-voxel-world.js')) : null;
const baselineMeasurements=baseline ? sizes.map(size=>benchmark(size,baseline)) : null;
const measurements=sizes.map(size=>benchmark(size,WORLD));
const stationaryMeasurements=sizes.map(size=>benchmark(size,WORLD,"stationary"));
const baselineStationary=baseline ? sizes.map(size=>benchmark(size,baseline,"stationary")) : null;
const relative=baselineMeasurements?.map((before,index)=>({dimensions:before.dimensions,
  baselineP50Ms:before.p50Ms,currentP50Ms:measurements[index].p50Ms,
  baselineP95Ms:before.p95Ms,currentP95Ms:measurements[index].p95Ms}));
process.stdout.write(JSON.stringify({method:'Node Canvas-API stub: measures JavaScript draw pipeline without rasterization; 120 camera-follow frames per world, first 20 excluded from percentiles. Process/JIT variability; not GPU or production frame rates.',
  measurements,baselineMeasurements,relative,
  stationaryMeasurements,baselineStationary},null,2)+'\n');
