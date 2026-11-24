"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const core = require("../src/modules/play-runtime-core.js");
const rules = require("../src/modules/play-rule-runtime.js");
const voxel = require("../src/modules/play-voxel-world.js");
const exporter = require("../src/modules/tiny-game-export.js");
const standaloneRules = vm.runInNewContext(rules.standaloneSource);
const plain = value => JSON.parse(JSON.stringify(value));
const node = (id, type, next = "", data = {}, alt = "") => ({ id, type, next, alt, data });

test("shared clock simulates the same 120 updates across common display rates", () => {
  const speeds = [30, 60, 90, 120, 240];
  const values = speeds.map(fps => {
    const clock = core.createSimulationClock();
    let distance = 0;
    for (let f = 0; f <= fps * 2; f++) {
      core.advanceSimulationClock(clock, 1000 + (f * 2000 / (fps * 2)), dt => { distance += 3.5 * dt; });
    }
    return { steps: clock.ticks, distance };
  });
  const baseline = values[0];
  for (const current of values) {
    assert.ok(Math.abs(current.steps - baseline.steps) <= 1, JSON.stringify(values));
    assert.ok(Math.abs(current.distance - baseline.distance) <= 3.5 / 60 + 1e-10, JSON.stringify(values));
  }
});

test("long background pauses cap catch-up and reset cancels pending steps", () => {
  const clock = core.createSimulationClock();
  core.advanceSimulationClock(clock, 1000, () => {});
  const result = core.advanceSimulationClock(clock, 61000, () => {});
  assert.equal(result.steps, core.MAX_CATCH_UP_STEPS);
  assert.ok(result.dropped > 0);
  const before = clock.ticks;
  core.resetSimulationClock(clock);
  core.advanceSimulationClock(clock, 62000, () => {});
  assert.equal(clock.ticks, before + 1);
  const second = core.createSimulationClock();
  const output = core.advanceSimulationClock(second, 1000, () => core.resetSimulationClock(second));
  assert.equal(output.steps, 1);
});

test("jump requires a fresh press, not a held key", () => {
  const samples = [false, true, true, true, false, true, false, true];
  let previous = false;
  const edges = samples.map(value => { const result = core.jumpEdge(value, previous); previous = value; return result; });
  assert.deepEqual(edges, [false, true, false, false, false, true, false, true]);
});

test("rule lint finds missing branches, invalid arithmetic, unreachable code, and missing scenes", () => {
  const nodes = [
    node("start", "eventStart", "branch"),
    node("branch", "logicCompareNumber", "division", { variable: "score", compare: "NaN", operator: ">=" }),
    node("division", "actionMathNumber", "scene", { variable: "score", mathOperation: "divide", operand: 0 }),
    node("scene", "actionScene", "", { sceneId: "gone" }),
    node("orphan", "actionFinish")
  ];
  const issues = rules.lintGraph(nodes, { sceneIds: ["home"] });
  for (const kind of ["missing-else", "possibly-uninitialized", "invalid-comparison", "divide-zero", "invalid-scene", "unreachable"])
    assert.ok(issues.some(issue => issue.kind === kind), `Expected ${kind} in ${JSON.stringify(issues)}`);
  assert.equal(rules.lintGraph([
    node("start", "eventStart", "set"), node("set", "actionSetVariable", "branch", { variable: "flag", value: "true" }),
    node("branch", "logicVariable", "yes", { variable: "flag" }, "no"),
    node("yes", "actionFinish"), node("no", "actionFinish")
  ]).length, 0);
});

test("converging routes report a variable missing on just one path", () => {
  const nodes = [node("event", "eventStart", "branch"), node("branch", "logicHasItem", "initialize", { item: "key" }, "check"),
    node("initialize", "actionSetVariable", "check", { variable: "door", value: "open" }),
    node("check", "logicVariable", "done", { variable: "door" }, "done"), node("done", "actionFinish")];
  const issues = rules.lintGraph(nodes);
  assert.ok(issues.some(issue => issue.id === "check" && issue.kind === "possibly-uninitialized"));
  assert.equal(rules.lintGraph(nodes, { initialVariables: { door: "closed" } }).some(issue => issue.kind === "possibly-uninitialized"), false);
});

test("seeded replay produces identical traces for native and standalone runtimes", () => {
  const nodes = [node("start", "eventStart", "roll"), node("roll", "actionRollNumber", "compare", { variable: "roll", rollMin: 1, rollMax: 20 }),
    node("compare", "logicCompareNumber", "win", { variable: "roll", operator: ">", compare: 10 }, "lose"),
    node("win", "actionAddItem", "end", { item: "good" }), node("lose", "actionAddItem", "end", { item: "bad" }),
    node("end", "actionFinish")];
  const first = rules.replayGraph(nodes, "start", { variables: {}, inventory: [] }, 9001);
  const repeat = rules.replayGraph(nodes, "start", {}, 9001);
  const embedded = standaloneRules.replayGraph(nodes, "start", {}, 9001);
  assert.deepEqual(first, repeat);
  assert.deepEqual(first, plain(embedded));
  assert.equal(first.stopReason, "finish");
  assert.equal(first.trace.length, 5);
  assert.equal(first.state.inventory.length, 1);
  const otherSeeds = Array.from({ length: 40 }, (_, index) => rules.replayGraph(nodes, "start", {}, index).state.variables.roll);
  assert.ok(new Set(otherSeeds).size > 1);
});

test("replay ends safely on cycles, missing links, dialogue and step budgets", () => {
  assert.equal(rules.replayGraph([node("a", "actionAddItem", "a", { item: "x" })], "a").stopReason, "cycle");
  assert.equal(rules.replayGraph([node("a", "actionAddItem", "b", { item: "x" })], "a").stopReason, "missing");
  assert.equal(rules.replayGraph([node("a", "actionDialogue", "b", { line: 0 }), node("b", "actionFinish")], "a").stopReason, "dialogue");
  assert.equal(rules.replayGraph([node("a", "actionAddItem", "b", { item: "x" }), node("b", "actionFinish")], "a", {}, 1337, 1).stopReason, "step-limit");
});

test("voxel spawn diagnostics distinguish blocked and unsupported positions", () => {
  const world = voxel.empty();
  world.start = { x: 7.5, y: 1, z: 7.5 };
  assert.match(voxel.spawnIssues(world).join(" "), /empty space/);
  voxel.setBlock(world, 7, 0, 7, "#ff0000");
  assert.deepEqual(voxel.spawnIssues(world), []);
  world.start.y = 0;
  assert.match(voxel.spawnIssues(world).join(" "), /intersects/);
});

test("both exported modes embed the same simulation clock and deterministic rule interpreter", () => {
  const world = voxel.empty();
  const pm = { worldType: "side2d", actorScale: 2, sceneWidth: 320, sceneHeight: 240, worldWidth: 400, groundY: 200,
    nodeEditor: { nodes: [node("s", "eventStart", "r"), node("r", "actionRollNumber", "", { variable: "r", rollMin: 1, rollMax: 6 })] },
    activeSceneId: "a", voxelWorld: world, scenes: [{ id: "a", worldType: "side2d", props: [], voxelWorld: world }] };
  const payload = { title: "Timing", exportWidth: 320, exportHeight: 240, artWidth: 16, artHeight: 16, playMode: pm, spriteFrames: { actor: {}, object: {} } };
  for (const worldType of ["side2d", "voxel3d"]) {
    const html = exporter.buildTinyGameHtml({ ...payload, playMode: { ...pm, worldType, scenes: [{ ...pm.scenes[0], worldType }] } });
    assert.match(html, /CORE\.advanceSimulationClock\(simulationClock/);
    assert.match(html, /RULES\.createSeededRandom\(ruleSeed\)/);
    assert.match(html, /RULES\.evaluateNode\(/);
  }
});

test("shared rule queue executes in due-tick/FIFO order and drops stale scene work", () => {
  const queue = rules.createRuleQueue();
  queue.schedule("later", new Set(["root"]), 1, 1100, 10);
  queue.schedule("first", new Set(["root"]), 1, 500, 10);
  queue.schedule("second", new Set(["root"]), 1, 500, 10);
  queue.schedule("old", new Set(), 0, 0, 10);
  assert.deepEqual(queue.takeReady(39, 1).map(item => item.id), []);
  assert.deepEqual(queue.takeReady(40, 1).map(item => item.id), ["first", "second"]);
  assert.deepEqual(queue.takeReady(76, 1).map(item => item.id), ["later"]);
  assert.equal(queue.size(), 0);
  for (let i = 0; i < 600; i++) queue.schedule(`node-${i}`, [], 1, 0, 0);
  assert.equal(queue.size(), 512);
  queue.clear();
  assert.equal(queue.size(), 0);
});

test("one thousand generated graph traces agree between the packaged runtime and export runtime", () => {
  const actionTypes = ["actionSetVariable", "actionChangeNumber", "actionMathNumber", "actionRollNumber",
    "actionAddItem", "actionRemoveItem", "logicVariable", "logicCompareNumber", "logicHasItem",
    "actionFinish", "actionScene", "actionDialogue", "actionMessage"];
  for (let caseIndex = 0; caseIndex < 1000; caseIndex++) {
    const random = rules.createSeededRandom(caseIndex * 15427 + 7727);
    const count = 4 + Math.floor(random() * 14);
    const graph = [node("entry", "eventStart", "n0")];
    for (let index = 0; index < count; index++) {
      const type = actionTypes[Math.floor(random() * actionTypes.length)];
      const link = () => {
        const target = Math.floor(random() * (count + 3));
        return target >= count ? "" : `n${target}`;
      };
      const data = {
        variable: ["score", "flag", "roll"][Math.floor(random() * 3)],
        value: ["true", "false", "7", ""][Math.floor(random() * 4)],
        equals: ["true", "false", "7"][Math.floor(random() * 3)],
        compare: Math.floor(random() * 30) - 15,
        operator: ["=", "!=", "<", "<=", ">", ">="][Math.floor(random() * 6)],
        mathOperation: ["set", "add", "subtract", "multiply", "divide", "modulo"][Math.floor(random() * 6)],
        operand: Math.floor(random() * 21) - 10,
        amount: Math.floor(random() * 20) - 10,
        rollMin: 1, rollMax: 100,
        item: ["key", "coin", "map"][Math.floor(random() * 3)],
        sceneId: "next-room",
        message: "Hello"
      };
      graph.push(node(`n${index}`, type, link(), data, link()));
    }
    const state = { variables: { score: String(Math.floor(random() * 100) - 50) },
      inventory: random() > 0.5 ? ["key"] : [] };
    const seed = Math.floor(random() * 0xFFFFFFFF);
    const native = rules.replayGraph(graph, "entry", state, seed);
    const exported = plain(standaloneRules.replayGraph(graph, "entry", state, seed));
    assert.deepEqual(exported, plain(native), `Rule runtimes diverged in generated case ${caseIndex}`);
    assert.ok(native.trace.length <= rules.MAX_RULE_STEPS);
  }
});
