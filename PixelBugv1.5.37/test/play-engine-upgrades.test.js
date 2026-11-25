"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Core = require("../src/modules/play-runtime-core.js");
const Frame = require("../src/modules/renderer/play-frame-controller.js");
const Input = require("../src/modules/renderer/play-input-controller.js");
const Editor = require("../src/modules/renderer/play-voxel-editor-controller.js");
const Voxel = require("../src/modules/play-voxel-world.js");
const Terrain = require("../src/modules/terrain-play-world.js");
const Export = require("../src/modules/tiny-game-export.js");
const root = path.join(__dirname, "..");

test("a catch-up frame simulates fixed ticks but draws and schedules only once", () => {
  const clock = Core.createSimulationClock();
  let ticks = 0, draws = 0, inspections = 0, scheduled = 0;
  const options = { clock, core: Core, now: 1000, simulate: () => { ticks++; },
    draw: () => { draws++; }, inspect: () => { inspections++; }, schedule: () => { scheduled++; } };
  assert.equal(Frame.advance(options).steps, 1);
  assert.equal(Frame.advance({ ...options, now: 1166.7 }).steps, Core.MAX_CATCH_UP_STEPS);
  assert.deepEqual([ticks, draws, inspections, scheduled], [9, 2, 2, 2]);
  Frame.advance({ ...options, now: 1200, paused: true });
  assert.deepEqual([ticks, draws, inspections, scheduled], [9, 3, 3, 3]);
  Frame.singleStep({ now: 1200, simulate: options.simulate, draw: options.draw, inspect: options.inspect });
  assert.deepEqual([ticks, draws, inspections, scheduled], [10, 4, 4, 3]);
});

test("analog stick and D-pad support up/down without causing unwanted jumps", () => {
  const empty = Input.readGamepad([]);
  assert.deepEqual(empty, { left: false, right: false, up: false, down: false, jump: false, interact: false });
  const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
  assert.equal(Input.readGamepad([{ axes: [0, -.8], buttons }]).up, true);
  assert.equal(Input.readGamepad([{ axes: [0, -.8], buttons }]).jump, false);
  buttons[13].pressed = true;
  assert.equal(Input.readGamepad([{ axes: [0, 0], buttons }]).down, true);
  buttons[0].pressed = true;
  const directions = Input.directions({ KeyW: true }, Input.readGamepad([{ axes: [.8, 0], buttons }]));
  assert.equal(directions.up, true);
  assert.equal(directions.right, true);
  assert.equal(directions.jump, true);
  assert.deepEqual(Input.directions({}, { up: true, jump: true }, true), { left: false, right: false, up: false, down: false, jump: false });
  const standalone = vm.runInNewContext(Input.standaloneSource);
  assert.equal(standalone.readGamepad([{ axes: [0, -.8], buttons }]).up, true);
});

test("jump assistance allows late coyote jumps and buffered pre-landing jumps", () => {
  const coyote = Core.createJumpAssist();
  assert.equal(Core.assistedJump(coyote, false, true), false);
  assert.equal(Core.assistedJump(coyote, false, false), false);
  assert.equal(Core.assistedJump(coyote, true, false), true);
  for (let i = 0; i < 20; i++) Core.assistedJump(coyote, false, false);
  assert.equal(Core.assistedJump(coyote, true, false), false);
  Core.resetJumpAssist(coyote);
  Core.assistedJump(coyote, true, false);
  for (let i = 0; i < 3; i++) Core.assistedJump(coyote, false, false);
  assert.equal(Core.assistedJump(coyote, false, true), true);
  assert.equal(Core.assistedJump(coyote, false, true), false);
  Core.resetJumpAssist(coyote);
  assert.equal(Core.assistedJump(coyote, true, true, true), false);
  assert.equal(Core.assistedJump(coyote, true, true), false);
  assert.deepEqual({ ...coyote }, { held: true, coyote: Core.COYOTE_TICKS, buffer: 0 });
  const standalone = vm.runInNewContext(Core.standaloneSource);
  const helper = standalone.createJumpAssist();
  assert.equal(standalone.assistedJump(helper, true, true), true);
});

test("terrain elevations and painted colors create a legal playable world", () => {
  const columns = Array.from({ length: 16 * 16 }, (_, index) => ({
    weight: index % 2 ? 255 : 0, color: index % 2 ? "#aabbcc" : "#44aa66" }));
  const params = { width: 16, depth: 16, height: 12 };
  const options = { base: 2, peak: 6, colorMode: "tile", solid: true };
  const result = Terrain.convert(columns, params, options);
  assert.equal(result.columns, 256);
  assert.ok(result.blocks > 256 && result.blocks <= Voxel.MAX_BLOCKS);
  assert.equal(result.world.width, 16);
  assert.equal(result.world.depth, 16);
  assert.ok(result.world.blocks.some(block => block.color === "#aabbcc"));
  assert.deepEqual(Voxel.spawnIssues(result.world), []);
  assert.deepEqual(Terrain.convert(columns, params, options), result);
  const surface = Terrain.convert(columns, params, { ...options, solid: false });
  assert.equal(surface.blocks, surface.columns);
  assert.equal(surface.surfaceOnly, true);
  assert.equal(Terrain.convert([], params, options), null);
});

test("maximum terrain size preserves the complete surface and stays under voxel limit", () => {
  const columns = Array.from({ length: 48 * 48 }, () => ({ weight: 255, color: "#889977" }));
  const result = Terrain.convert(columns, { width: 48, depth: 48, height: 24 }, { base: 22, peak: 24, colorMode: "tile" });
  assert.equal(result.blocks, Voxel.MAX_BLOCKS);
  assert.equal(result.columns, 48 * 48);
  assert.equal(result.limited, true);
  assert.equal(new Set(result.world.blocks.filter(block => block.y === 23).map(b => `${b.x},${b.z}`)).size, 48 * 48);
  assert.deepEqual(Voxel.spawnIssues(result.world), []);
});

test("voxel occupancy cache invalidates for edits, replacement arrays, and explicit mutation", () => {
  const world = Voxel.empty();
  const actor = Voxel.initialActor(world);
  assert.equal(actor.grounded, false);
  Voxel.step(world, actor, {}, 0);
  assert.equal(Voxel.spawnIssues(world).length, 0);
  assert.equal(Voxel.setBlock(world, 7, 0, 7, "#ff0000"), true);
  world.start = { x: 7.5, y: 0, z: 7.5 };
  assert.match(Voxel.spawnIssues(world).join(" "), /intersects/);
  assert.equal(Voxel.setBlock(world, 7, 0, 7, null), true);
  assert.deepEqual(Voxel.spawnIssues(world), []);
  world.blocks = [{ x: 7, y: 0, z: 7, color: "#ff0000" }];
  assert.match(Voxel.spawnIssues(world).join(" "), /intersects/);
  world.blocks[0].x = 3;
  Voxel.invalidateWorldCache(world);
  assert.deepEqual(Voxel.spawnIssues(world), []);
});

test("voxel editor module handles marker replacement, name collisions, and safe spawn", () => {
  const world = Voxel.empty();
  const cell = { x: 3, y: 1, z: 4 };
  assert.equal(Editor.validCell(world, cell), true);
  assert.equal(Editor.validCell(world, { x: 100, y: 1, z: 4 }), false);
  assert.match(Editor.addMarker(world, cell, { kind: "npc" }).error, /Choose an NPC/);
  const first = Editor.addMarker(world, cell, { kind: "trigger", name: "Open Door" });
  assert.equal(first.marker.id, "open-door");
  assert.equal(world.markers.length, 1);
  const second = Editor.addMarker(world, { x: 4, y: 1, z: 4 }, { kind: "trigger", name: "Open Door" });
  assert.equal(second.marker.id, "open-door-2");
  const replacement = Editor.addMarker(world, cell, { kind: "npc", characterId: "elder", name: "Elder" });
  assert.equal(replacement.marker.kind, "npc");
  assert.equal(world.markers.length, 2);
  assert.equal(Editor.removeMarker(world, cell), true);
  assert.equal(Editor.removeMarker(world, cell), false);
  Voxel.setBlock(world, 2, 0, 2, "#669977");
  assert.deepEqual({ ...Editor.setSpawn(world, { x: 2, y: 0, z: 2 }) }, { x: 2.5, y: 1, z: 2.5 });
});

test("new scripts precede renderer and exports use shared input and jump assistance", () => {
  const html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
  const rendererStart = html.indexOf('<script src="./renderer.js"></script>');
  for (const file of ["renderer/play-frame-controller", "renderer/play-input-controller", "renderer/play-voxel-editor-controller", "terrain-play-world"]) {
    const index = html.indexOf(`modules/${file}.js`);
    assert.ok(index > 0 && index < rendererStart, file);
  }
  assert.ok(html.indexOf("modules/renderer/play-input-controller.js") < html.indexOf("modules/tiny-game-export.js"));
  assert.match(html, /id="tile-terrain-play-world"/);
  const js = fs.readFileSync(path.join(root, "src", "renderer.js"), "utf8");
  assert.match(js, /PixelBugPlayFrameController\.advance/);
  assert.match(js, /PixelBugTerrainPlayWorld\.convert/);
  assert.match(js, /PixelBugPlayVoxelEditor\.addMarker/);
  assert.doesNotMatch(js, /function readPlayGamepad\(/);
  const payload = { title: "Test", exportWidth: 320, exportHeight: 240,
    playMode: { worldType: "sidescroller", sceneWidth: 320, sceneHeight: 240,
      nodeEditor: { nodes: [] }, props: [], scenes: [] }, spriteFrames: { actor: {}, object: {} } };
  for (const worldType of ["sidescroller", "voxel3d"]) {
    const exportHtml = Export.buildTinyGameHtml({ ...payload, playMode: { ...payload.playMode, worldType, voxelWorld: Voxel.empty() } });
    assert.match(exportHtml, /const INPUT =/);
    assert.match(exportHtml, /INPUT\.readGamepad/);
    if (worldType === "sidescroller") assert.match(exportHtml, /CORE\.assistedJump/);
    else assert.match(exportHtml, /INPUT\.directions/);
  }
});
