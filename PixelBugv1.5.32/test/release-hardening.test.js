"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const runtime = require("../src/modules/play-rule-runtime.js");

// Runtime protection
test("reserved variable names cannot modify runtime object prototypes", () => {
  const before = {};
  const node = { id: "dice", type: "actionRollNumber", data: { variable: "__proto__", rollMin: 1, rollMax: 6 } };
  const result = runtime.evaluateNode(node, { variables: before }, { random: () => 0.2 });
  assert.equal(Object.getPrototypeOf(result.state.variables), Object.prototype);
  assert.equal(Object.hasOwn(result.state.variables, "__proto__"), false);
  assert.equal(result.state.variables.roll, "2");
  assert.equal(runtime.variableName("constructor"), "score");
  assert.equal(runtime.variableName("prototype", "flag"), "flag");
  assert.equal(runtime.variableName(" userScore "), "userScore");
});

test("math and condition rules use the same bounded and safe names", () => {
  const arithmetic = runtime.evaluateNode({ id: "add", type: "actionMathNumber", data: { variable: "constructor", mathOperation: "add", operand: 3 } }, {});
  assert.equal(arithmetic.state.variables.score, "3");
  const check = runtime.evaluateNode({ id: "check", type: "logicCompareNumber", data: { variable: "constructor", operator: ">=", compare: 2 }, next: "yes", alt: "no" }, arithmetic.state);
  assert.equal(check.nextId, "yes");
});

// Assistive guidance
test("coding explanations and practice results have nonvisual accessible names", () => {
  const editor = fs.readFileSync(path.join(__dirname, "../src/modules/node-editor.js"), "utf8");
  assert.match(editor, /aria-label="Selected rule coding explanation and safe practice"/);
  assert.match(editor, /aria-label="Practice this coding concept without changing your game"/);
  assert.match(editor, /aria-label="Practice result"/);
  assert.match(editor, /aria-atomic="true"/);
});
