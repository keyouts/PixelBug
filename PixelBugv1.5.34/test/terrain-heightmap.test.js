"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Heightmap = require("../src/modules/terrain-heightmap.js");
const Repeat = require("../src/modules/renderer/tile-repeat-workflow.js");
const Bridge = require("../src/modules/terrain-voxel-bridge.js");

const tile = (id, w = 4, h = 4, color = "#00aa66") => ({ id, name: id, w, h, pixels: Array.from({ length: h }, () => Array(w).fill(color)) });
const setup = (tiles = [tile("grass")]) => ({ tiles, terrain: Heightmap.normalize({}, tiles), repeat: Repeat.normalizeSettings({ mode: "fill" }) });

test("terrain height painting wraps seamlessly across saved tile edges and does not affect artwork", () => {
  const { tiles, terrain } = setup();
  const source = tiles[0];
  const heights = Heightmap.ensureHeights(terrain, source);
  assert.equal(heights.length, 16);
  assert.ok(Heightmap.paint(heights, 4, 4, 0, 0, { brush: "raise", radius: 2, strength: 100 }));
  assert.ok(heights[0] > Heightmap.DEFAULT_VALUE);
  assert.ok(heights[3] > Heightmap.DEFAULT_VALUE);
  assert.ok(heights[12] > Heightmap.DEFAULT_VALUE);
  assert.equal(source.pixels[0][0], "#00aa66");
  Heightmap.paint(heights, 4, 4, 0, 0, { brush: "lower", radius: 1, strength: 100 });
  assert.ok(heights[0] < 128);
});

test("tile weight data and settings survive normalization, with malformed values bounded", () => {
  const { tiles, terrain } = setup();
  Heightmap.ensureHeights(terrain, tiles[0])[0] = 220;
  terrain.relief = 9999;
  terrain.base = -123;
  terrain.source = "map";
  const roundtrip = Heightmap.normalize(JSON.parse(JSON.stringify(terrain)), tiles);
  assert.equal(roundtrip.heights.grass.values[0], 220);
  assert.equal(roundtrip.relief, 63);
  assert.equal(roundtrip.base, 0);
  assert.equal(roundtrip.source, "map");
  assert.equal(Heightmap.normalize({ heights: { grass: { w: 500, h: 500, values: [1] } } }, tiles).heights.grass, undefined);
});

test("repeating weights become a 3D heightfield, retaining tile surface colors", () => {
  const { tiles, terrain, repeat } = setup([tile("stone", 2, 2, "#8f796c")]);
  const heights = Heightmap.ensureHeights(terrain, tiles[0]);
  heights.splice(0, 4, 0, 255, 128, 0);
  terrain.base = 1; terrain.relief = 3;
  const fields = Heightmap.columns({ width: 4, height: 4, tiles, activeTileId: "stone", terrain, repeat, planRepeat: Repeat.planRepeat });
  assert.deepEqual(fields.map(f => f?.weight), [0, 255, 0, 255, 128, 0, 128, 0, 0, 255, 0, 255, 128, 0, 128, 0]);
  const mesh = Heightmap.voxelPlan(fields, 4, 4, 8, terrain);
  assert.equal(mesh.columnsCount, 16);
  assert.equal(mesh.overflow, false);
  assert.ok(mesh.cubes.some(c => c.z === 3 && c.x === 1 && c.color === "#8f796c"));
  assert.ok(mesh.cubes.some(c => c.z === 0 && c.x === 1));
});

test("tilemap layouts repeat multiple tiles and honor visible layers", () => {
  const tiles = [tile("low", 1, 1), tile("high", 1, 1)];
  const terrain = Heightmap.normalize({ source: "map" }, tiles);
  Heightmap.ensureHeights(terrain, tiles[0])[0] = 5;
  Heightmap.ensureHeights(terrain, tiles[1])[0] = 250;
  const map = { width: 2, height: 1, cellWidth: 1, cellHeight: 1, layers: [{ visible: true, cells: [[{ tileId: "low" }, { tileId: "high" }]] }] };
  const grid = Heightmap.columns({ width: 6, height: 2, tiles, terrain, map });
  assert.deepEqual(grid.slice(0, 6).map(c => c?.weight), [5, 250, 5, 250, 5, 250]);
  map.layers[0].visible = false;
  assert.ok(Heightmap.columns({ width: 6, height: 2, tiles, terrain, map }).every(c => c === null));
});

test("transparent pixels optionally create terrain gaps, and bounds prevent excessive generation", () => {
  const tiles = [tile("holes", 2, 1)];
  tiles[0].pixels[0][1] = null;
  const terrain = Heightmap.normalize({ transparent: true }, tiles);
  const grid = Heightmap.columns({ width: 4, height: 1, tiles, terrain, activeTileId: "holes", repeat: Repeat.normalizeSettings({}), planRepeat: Repeat.planRepeat });
  assert.equal(grid[1], null);
  assert.equal(grid[2]?.weight, Heightmap.DEFAULT_VALUE);
  terrain.solid = true;
  assert.equal(Heightmap.voxelPlan([{ weight: 255, color: "#abcdef" }], 1, 1, 64, { ...terrain, base: 63, relief: 63 }, 12).overflow, true);
  assert.equal(Heightmap.voxelPlan([{ weight: 255, color: "#abcdef" }], 1, 1, 64, { ...terrain, base: 63, relief: 63, solid: false }, 12).voxelCount, 1);
});

test("Voxel Mode merge preserves existing voxels, uses one history commit, and can be undone", () => {
  let map = new Map([["0,0,0", { x: 0, y: 0, z: 0, color: "#000000" }]]);
  let before = null, after = null, started = 0, committed = 0, entered = 0;
  const callbacks = {
    getModel: () => ({ width: 3, height: 3, depth: 4 }), getMap: () => map,
    setCube: (x, y, z, color) => { map.set(`${x},${y},${z}`, { x, y, z, color }); return true; },
    begin: () => { started++; before = new Map(map); },
    commit: () => { committed++; after = new Map(map); },
    sync: () => {}, enter: () => { entered++; }, render: () => {}, abort: () => {}
  };
  const added = Bridge.apply([{ x: 0, y: 0, z: 0, color: "#ffffff" }, { x: 1, y: 0, z: 1, color: "#00ff00" }, { x: 20, y: 0, z: 0, color: "#ff0000" }], callbacks);
  assert.equal(added, 1);
  assert.equal(map.get("0,0,0").color, "#000000");
  assert.equal(started, 1); assert.equal(committed, 1); assert.equal(entered, 1);
  assert.notDeepEqual(after, before);
  map = new Map(before);
  assert.equal(map.has("1,0,1"), false);
  assert.equal(Bridge.apply([{ x: 0, y: 0, z: 0, color: "#ffffff" }], callbacks), 0);
  assert.equal(started, 1);
});

test("terrain controls remain inside optional overlay and leave Base Mode canvas untouched", () => {
  const root = path.join(__dirname, "../src");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const start = html.indexOf('<section aria-label="Pixel canvas area" class="stage-panel">');
  const tileSidebar = html.slice(html.indexOf('<section class="dock-card" data-dock-id="tilemap">'), start);
  const overlay = html.slice(start, html.indexOf('<div class="canvas-frame" data-fit-mode="workspace">', start));
  assert.ok(start >= 0);
  assert.match(overlay, /id="tile-terrain-details"/);
  assert.match(overlay, /id="tile-terrain-paint"/);
  assert.match(overlay, /id="tile-terrain-preview"/);
  assert.match(overlay, /id="tile-terrain-generate"/);
  assert.doesNotMatch(tileSidebar, /tile-terrain-paint|tile-terrain-preview/);
  assert.match(html.slice(start), /<div class="canvas-frame" data-fit-mode="workspace">\s*<canvas[^>]+id="pixel-canvas"/);
});
test("untrusted reserved tile IDs do not alter terrain map prototypes",()=>{
  const Paint=require("../src/modules/terrain-paint-layers.js");
  for(const id of ["__proto__","constructor","toString"]){
    const source=tile(id,2,2);
    const terrain=Heightmap.normalize({},[source]);
    const weights=Heightmap.ensureHeights(terrain,source);
    assert.equal(weights.length,4);
    assert.equal(Object.hasOwn(terrain.heights,id),true);
    assert.equal(Paint.ensure(terrain,"biome",source).length,4);
    assert.equal(Object.hasOwn(terrain.paintLayers.biome,id),true);
    const json=JSON.parse(JSON.stringify(terrain));
    assert.equal(json.heights[id].values.length,4);
    assert.equal(json.paintLayers.biome[id].length,4);
    assert.equal(Object.prototype.values,undefined);
  }
});
