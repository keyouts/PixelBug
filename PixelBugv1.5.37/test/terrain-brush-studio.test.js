"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Terrain = require("../src/modules/terrain-heightmap.js");
const defaults = {brush:"raise",radius:2,strength:100,sensitivity:18,shape:"circle",falloff:"soft"};
const map = (w=13,h=13) => Array(w*h).fill(80);
const at = (values,x,y,w=13) => values[y*w+x];

test("sensitivity makes a low intensity stroke gradual and cumulative between strokes", () => {
  const low=map(), high=map();
  const stroke = new Map();
  const fine={...defaults,radius:1,sensitivity:5,stroke};
  assert.ok(Terrain.paint(low,13,13,6,6,fine));
  const first=at(low,6,6);
  for(let i=0;i<100;i++)Terrain.paint(low,13,13,6,6,fine);
  assert.equal(at(low,6,6),first,"a long or repeated dab cannot stack within one stroke");
  assert.ok(first>=81 && first<=82,"low sensitivity changes at most a couple of heightmap steps");
  Terrain.paint(low,13,13,6,6,{...fine,stroke:new Map()});
  assert.ok(at(low,6,6)>first,"lifting the pen allows another controlled pass");
  Terrain.paint(high,13,13,6,6,{...fine,sensitivity:100,stroke:new Map()});
  assert.ok(at(high,6,6) >= at(low,6,6)+35,"higher sensitivity produces a much larger change");
});

test("brush shapes and edge falloff affect the painted footprint", () => {
  const circle=map(),square=map(),diamond=map();
  for(const [values,shape] of [[circle,"circle"],[square,"square"],[diamond,"diamond"]])
    Terrain.paint(values,13,13,6,6,{...defaults,shape,radius:3,sensitivity:100,falloff:"hard"});
  assert.equal(at(circle,9,9),80);
  assert.ok(at(square,9,9)>80);
  assert.ok(at(circle,8,8)>80);
  assert.equal(at(diamond,8,8),80);
  const soft=map(),hard=map();
  Terrain.paint(soft,13,13,6,6,{...defaults,radius:3,sensitivity:100,falloff:"soft"});
  Terrain.paint(hard,13,13,6,6,{...defaults,radius:3,sensitivity:100,falloff:"hard"});
  assert.ok(at(hard,9,6)>at(soft,9,6));
});

test("additional sculpt brushes produce distinct elevations with bounded values", () => {
  for(const brush of ["flatten","terrace","noise","sharpen","smooth","erode","paint","exact"]){
    const values=map();
    values[6*13+6]=175;
    values[6*13+7]=35;
    const changed=Terrain.paint(values,13,13,6,6,{...defaults,brush,radius:2,sensitivity:75,level:90,base:2,peak:14,exactHeight:9,terraces:4});
    assert.equal(typeof changed,"boolean");
    assert.ok(values.every(value=>Number.isInteger(value) && value>=0 && value<=255),`${brush} always stays in the saved heightmap range`);
  }
  const values=map(); values[6*13+6]=200;values[6*13+7]=40;
  const brush={...defaults,brush:"flatten",sensitivity:100,strength:100,radius:1,falloff:"hard",stroke:new Map()};
  Terrain.paint(values,13,13,6,6,brush);
  Terrain.paint(values,13,13,7,6,brush);
  assert.equal(values[6*13+7],200,"flatten keeps the original sampled height throughout the stroke");
});

test("overlay palette is saved and changes painting colors without modifying voxel material colors", () => {
  const tile={id:"tile",w:1,h:1,pixels:[["#39c485"]]};
  const terrain=Terrain.normalize({overlayPalette:"neon",sensitivity:7,shape:"diamond",falloff:"hard",brush:"terrace"},[tile]);
  const saved=Terrain.normalize(JSON.parse(JSON.stringify(terrain)),[tile]);
  assert.equal(saved.overlayPalette,"neon");
  assert.equal(saved.sensitivity,7);
  assert.equal(saved.shape,"diamond");
  assert.equal(saved.falloff,"hard");
  assert.equal(saved.brush,"terrace");
  for(const name of Object.keys(Terrain.overlayPalettes))
    assert.match(Terrain.overlayColor(120,name),/^#[0-9a-f]{6}$/);
  assert.notEqual(Terrain.overlayColor(120,"heat"),Terrain.overlayColor(120,"grayscale"));
  const item={weight:80,color:"#39c485",biome:0,material:0};
  const original=Terrain.surfaceColor(item,80,0,{...saved,colorMode:"tile"});
  assert.equal(original,"#39c485");
  assert.equal(Terrain.surfaceColor(item,80,0,{...saved,overlayPalette:"contrast",colorMode:"tile"}),original);
  assert.equal(Terrain.normalize({sensitivity:900,shape:"bad",falloff:"bad",overlayPalette:"bad"},[tile]).sensitivity,100);
});

test("studio includes new brush controls and new visual styling", () => {
  const root=path.join(__dirname,"../src");
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const css=fs.readFileSync(path.join(root,"styles-workspaces.css"),"utf8");
  for(const id of ["tile-terrain-sensitivity","tile-terrain-shape","tile-terrain-falloff","tile-terrain-overlay-palette","tile-terrain-palette-strip"])
    assert.ok(html.includes(`id="${id}"`),id);
  assert.match(css,/\.tile-studio input\[type="checkbox"\]:checked/);
  assert.match(css,/\.tile-studio select\s*\{/);
  assert.match(css,/\.tile-studio \.tile-terrain-palette-strip\[data-palette="heat"\]/);
});
