"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const Package = require("../src/modules/project-package.js");
const Store = require("../src/main/project-store.js");
const Voxel = require("../src/modules/play-voxel-world.js");
const Rule = require("../src/modules/play-rule-runtime.js");

function makeProject(seed) {
  const random = Rule.createSeededRandom(seed);
  const world = Voxel.empty();
  const cells = 60 + Math.round(random() * 120);
  for (let index = 0; index < cells; index++) {
    const x = Math.floor(random() * world.width), z = Math.floor(random() * world.depth);
    const y = Math.floor(random() * 4), tint = Math.floor(random() * 0xffffff).toString(16).padStart(6, "0");
    Voxel.setBlock(world, x, y, z, `#${tint}`);
  }
  world.start = { x: 7.5, y: 0, z: 7.5 };
  const ruleGraph = [
    { id: "start", type: "eventStart", next: "item", data: { sceneId: "a" } },
    { id: "item", type: "actionAddItem", next: "branch", data: { item: `seed-${seed}` } },
    { id: "branch", type: "logicHasItem", next: "yes", alt: "no", data: { item: `seed-${seed}` } },
    { id: "yes", type: "actionScene", data: { sceneId: "b" } },
    { id: "no", type: "actionFinish", data: { message: "Failed" } },
    { id: "arrive", type: "eventStart", next: "record", data: { sceneId: "b" } },
    { id: "record", type: "actionSetVariable", data: { variable: "arrived", value: "yes" } }
  ];
  return { name: `Voxel test ${seed}`, width: 16, height: 16, frames: [{ layers: [{ pixels: [["#000000", "#ffffff"], ["#ffffff", "#000000"]] }] }],
    playMode: { worldType: "voxel3d", activeSceneId: "a", nodeEditor: { nodes: ruleGraph }, scenes: [
      { id: "a", name: "First", worldType: "voxel3d", voxelWorld: world },
      { id: "b", name: "Second", worldType: "voxel3d", voxelWorld: world }
    ], voxelWorld: world, inventory: [], variables: {} } };
}

test("one hundred varied voxel projects survive package save and reload without logical or geometry drift", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const project = makeProject(seed);
    const serialized = Package.stringify(project);
    const loaded = Package.parse(serialized);
    assert.deepEqual(loaded, project, `Project ${seed} failed roundtrip`);
    assert.equal(Voxel.normalize(loaded.playMode.voxelWorld).blocks.length, project.playMode.voxelWorld.blocks.length);
    const state = Rule.replayGraph(loaded.playMode.nodeEditor.nodes, "start", {}, seed);
    assert.equal(state.stopReason, "scene-transition");
    assert.deepEqual(state.state.inventory, [`seed-${seed}`]);
    assert.deepEqual(Rule.analyzeGraph(loaded.playMode.nodeEditor.nodes), []);
  }
});

test("modified and truncated voxel packages fail integrity checks and offer read-only recovery", () => {
  const project = makeProject(22);
  const saved = Package.stringify(project);
  const tampered = saved.replace("Voxel test 22", "Voxel test 23");
  assert.throws(() => Package.parse(tampered), /integrity check failed/i);
  const recovered = Package.recover(tampered);
  assert.equal(recovered.readOnly, true);
  assert.ok(recovered.warnings.some(text => /integrity/i.test(text)));
  assert.deepEqual(recovered.project.playMode.nodeEditor.nodes, project.playMode.nodeEditor.nodes);
  assert.throws(() => Package.parse(saved.slice(0, saved.length / 2)), SyntaxError);
  const legacy = JSON.stringify({ name: "Old 2D Project", playMode: { worldType: "side2d" }, frames: [] });
  assert.equal(Package.parse(legacy).playMode.worldType, "side2d");
});

test("saved gallery revisions are checksum-protected and preserve the newest complete voxel world", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "pixelbug-voxel-revisions-"));
  const app = { getPath: () => root };
  try {
    let id;
    for (let version = 0; version < 30; version++) {
      const project = makeProject(version + 1);
      const record = { name: "World", projectId: "stable", savedAt: 1000 + version, project, thumbnail: "", meta: `Rev ${version}` };
      const result = await Store.saveStoredProject(app, "gallery", record);
      id = result.id;
    }
    const entries = await Store.listStoredProjects(app, "gallery");
    assert.equal(entries.length, 1);
    const saved = await Store.loadStoredProject(app, "gallery", id);
    assert.deepEqual(saved.project, makeProject(30));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
