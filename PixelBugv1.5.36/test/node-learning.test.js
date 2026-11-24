"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const rules = require("../src/modules/play-rule-runtime.js");
const learning = require("../src/modules/node-learning.js");
const exported = require("../src/modules/tiny-game-export.js");

function math(operation, operand) {
  return { id: "calc", type: "actionMathNumber", name: "Calculator", next: "check", data: { variable: "score", mathOperation: operation, operand } };
}

test("math operations preserve the input state and produce bounded results", () => {
  const cases = [
    ["set", 4, "4"], ["add", 4, "11"], ["subtract", 4, "3"],
    ["multiply", 4, "28"], ["divide", 2, "3.5"], ["modulo", 4, "3"]
  ];
  for (const [operation, operand, expected] of cases) {
    const original = { variables: { score: "7" }, inventory: ["key"] };
    const result = rules.evaluateNode(math(operation, operand), original);
    assert.equal(result.state.variables.score, expected);
    assert.equal(result.nextId, "check");
    assert.deepEqual(original, { variables: { score: "7" }, inventory: ["key"] });
  }
  assert.equal(rules.calculate(5, "divide", 0), 5);
  assert.equal(rules.calculate(5, "modulo", 0), 5);
  assert.equal(rules.calculate(999999999, "multiply", 20000), 1000000000);
  assert.equal(rules.calculate(3, "divide", 7), 0.4286);
});

test("math combines with real conditional routes", () => {
  const calculated = rules.evaluateNode(math("multiply", 2), { variables: { score: "5" } });
  const check = rules.evaluateNode({ id: "check", type: "logicCompareNumber", next: "win", alt: "lose", data: { variable: "score", operator: ">=", compare: 10 } }, calculated.state);
  assert.equal(check.predicate.matched, true);
  assert.equal(check.nextId, "win");
});

test("learning examples show the same arithmetic as the shared runtime", () => {
  const described = learning.describe(math("multiply", 2));
  assert.match(described.code, /\* 2/);
  const result = rules.evaluateNode(math("multiply", 2), { variables: { score: "9" } });
  assert.match(learning.explainResult(math("multiply", 2), 9, result), /9 → 18/);
  const divided = learning.describe(math("divide", 0));
  assert.match(divided.code, /if \(0 !== 0\)/);
  assert.match(learning.describe({ type: "logicCompareNumber", data: { variable: "score", operator: ">=", compare: 3 } }).code, /if \(/);
});

test("export embeds updated arithmetic semantics and the editor includes the new learning tools", () => {
  const root = path.join(__dirname, "..");
  const editor = fs.readFileSync(path.join(root, "src/modules/node-editor.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "src/index.html"), "utf8");
  assert.match(editor, /actionMathNumber/);
  assert.match(editor, /function renderCodeGlasses/);
  assert.match(editor, /double-score/);
  assert.match(editor, /remainder/);
  assert.ok(html.indexOf("node-learning.js") < html.indexOf("node-editor.js"));
  const local = {};
  vm.runInNewContext(`this.RULES = ${rules.standaloneSource};`, local);
  assert.equal(local.RULES.evaluateNode(math("modulo", 2), { variables: { score: "7" } }).state.variables.score, "1");
  const output = exported.buildTinyGameHtml({
    title: "Number Lesson", exportWidth: 320, exportHeight: 240,
    artWidth: 16, artHeight: 16, frames: {},
    playMode: { activeSceneId: "one", scenes: [], props: [], variables: { score: "7" }, inventory: [],
      nodeEditor: { nodes: [math("modulo", 2)] } }
  });
  assert.match(output, /actionMathNumber/);
  assert.match(output, /modulo/);
});

test("random number rules are bounded, inclusive, and repeatable under a fixed test source", () => {
  const roll = { id: "dice", type: "actionRollNumber", name: "Die", next: "check", data: { variable: "roll", rollMin: 1, rollMax: 6 } };
  for (const [source, expected] of [[0, "1"], [0.5, "4"], [0.9999999, "6"]]) {
    const result = rules.evaluateNode(roll, { variables: { roll: "0" } }, { random: () => source });
    assert.equal(result.state.variables.roll, expected);
    assert.equal(result.nextId, "check");
  }
  assert.equal(rules.evaluateNode({ ...roll, data: { variable: "roll", rollMin: 6, rollMax: 1 } }, {}, { random: () => 0 }).state.variables.roll, "1");
  assert.match(learning.describe(roll).code, /Math\.random/);
  assert.match(learning.explainResult(roll, 0, rules.evaluateNode(roll, {}, { random: () => 0.5 })), /roll = 4/);
});
