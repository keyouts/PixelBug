"use strict";

// Runtime integration
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const exporter = require("../src/modules/tiny-game-export.js");
const voxel = require("../src/modules/play-voxel-assets.js");

function makeGame(extraProps = []) {
  const renderCalls = [];
  const events = {};
  const frames = [];
  let voxelCanvasCount = 0;
  const context = new Proxy({ globalAlpha: 1, imageSmoothingEnabled: false }, {
    get(object, name) {
      if (name === "drawImage") return (...args) => renderCalls.push({ image: args[0], alpha: object.globalAlpha });
      if (name === "measureText") return value => ({ width: String(value).length * 8 });
      if (name in object) return object[name];
      return () => {};
    },
    set(object, name, value) { object[name] = value; return true; }
  });
  const canvas = { width: 320, height: 240, style: {}, parentElement: { style: {} }, getContext: () => context, addEventListener: () => {}, focus: () => {} };
  const status = { textContent: "" };
  const doc = { getElementById: id => id === "game" ? canvas : id === "game-status" ? status : null,
    createElement: tag => tag === "canvas" ? (voxelCanvasCount++, { width: 0, height: 0, getContext: () => context }) : {} };
  class FakeImage { constructor() { this.width = 16; this.height = 24; } set src(_value) { this.onload?.(); } }
  const tree = voxel.normalizeAsset({ id: "tree", name: "Tree", width: 2, height: 2, depth: 2, cubes: [{ x: 0, y: 0, z: 0, color: "#338833" }] });
  const props = [{ x: 80, y: 20, scale: 4, voxelAssetId: "tree", voxelInFront: false, solid: false, nodeTriggerId: "tree1" }, { x: 150, y: 20, scale: 4, voxelAssetId: "tree", voxelInFront: true, solid: false, nodeTriggerId: "tree2" }, ...extraProps];
  const pm = { sceneWidth: 320, sceneHeight: 240, worldWidth: 960, actorScale: 2, moveSpeed: 4, jumpStrength: 8, gravity: .45, groundY: 200, backgroundScale: "cover", voxelBackgroundAssetId: "tree", voxelAssets: [tree], props, idleFrame: 0, walkFrame: 0, jumpFrame: 0, activeSceneId: "home", scenes: [{ id: "home", props, voxelBackgroundAssetId: "tree", backgroundScale: "cover" }], nodeEditor: { nodes: [{ id: "begin", type: "eventStart", next: "greet", data: {} }, { id: "greet", type: "actionMessage", next: "", data: { message: "Welcome!" } }] } };
  const html = exporter.buildTinyGameHtml({ title: "Voxel smoke", exportWidth: 320, exportHeight: 240, artWidth: 16, artHeight: 24, sceneBackground: "#f0f0f0", playMode: pm, frames: { 0: "data:image/png;base64,AAAA" } });
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const sandbox = { document: doc, navigator: { getGamepads: () => [] }, window: { addEventListener: (kind, callback) => { events[kind] = callback; } }, performance: { now: () => 100 }, Image: FakeImage, requestAnimationFrame: callback => { frames.push(callback); }, console, setTimeout, clearTimeout };
  const scriptContext = vm.createContext(sandbox);
  vm.runInContext(script, scriptContext);
  return { scriptContext, status, renderCalls, events, frames, voxelCanvasCount: () => voxelCanvasCount };
}

test("a standalone game runs voxel backdrops, repeated objects, 2D sprites and a node start event", async () => {
  const game = makeGame();
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(game.frames.length, "runtime schedules its first game tick");
  assert.equal(game.status.textContent, "Welcome!");
  game.frames.shift()(16);
  assert.ok(game.renderCalls.length >= 4, "voxel backdrop, two objects and 2D sprite are drawn");
  assert.equal(vm.runInContext("actor.x", game.scriptContext), 24);
  const firstX = vm.runInContext("actor.x", game.scriptContext);
  game.events.keydown({ code: "KeyD", preventDefault() {} });
  game.frames.shift()(32);
  assert.ok(vm.runInContext("actor.x", game.scriptContext) > firstX, "D moves the player");
  game.events.keyup({ code: "KeyD" });
  game.events.keydown({ code: "Space", preventDefault() {} });
  game.frames.shift()(48);
  assert.ok(vm.runInContext("actor.vy", game.scriptContext) < 0, "Space jumps");
  assert.equal(vm.runInContext("ctx.globalAlpha", game.scriptContext), 1, "drawing restores full opacity");
  assert.equal(game.voxelCanvasCount(), 2, "background uses a high-detail cache and both objects share their own render");
});

test("exporter skips offscreen voxel instances while keeping their scene data", async () => {
  const far = Array.from({ length: 90 }, (_, index) => ({ x: 3000 + index * 45, y: 24, scale: 4, voxelAssetId: "tree", voxelInFront: true, solid: false, nodeTriggerId: `far-${index}` }));
  const game = makeGame(far);
  await new Promise(resolve => setImmediate(resolve));
  game.frames.shift()(16);
  assert.ok(game.renderCalls.length < 12, "offscreen objects should not incur canvas draw calls");
  assert.equal(vm.runInContext("props.length", game.scriptContext), 92, "culling does not delete gameplay objects");
});
