"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const runtime = require("../src/modules/play-rule-runtime.js");

const root = path.join(__dirname, "..");
const nodeEditor = fs.readFileSync(path.join(root, "src", "modules", "node-editor.js"), "utf8");
const tinyExport = fs.readFileSync(path.join(root, "src", "modules", "tiny-game-export.js"), "utf8");

function node(type, data = {}, next = "then", alt = "else") {
  return { id: type, type, name: type, next, alt, data };
}

test("shared rule runtime changes copied state without mutating input", () => {
  const original = { variables: { score: "2" }, inventory: ["key"] };
  const changed = runtime.evaluateNode(node("actionChangeNumber", { variable: "score", amount: 3 }), original);
  assert.equal(changed.state.variables.score, "5");
  assert.deepEqual(original, { variables: { score: "2" }, inventory: ["key"] });
  const added = runtime.evaluateNode(node("actionAddItem", { item: "coin" }), changed.state);
  assert.deepEqual(added.state.inventory, ["key", "coin"]);
  const removed = runtime.evaluateNode(node("actionRemoveItem", { item: "key" }), added.state);
  assert.deepEqual(removed.state.inventory, ["coin"]);
});

test("shared rule runtime chooses value, number, and membership branches", () => {
  const state = { variables: { door: "open", score: "4" }, inventory: ["key"] };
  const value = runtime.evaluateNode(node("logicVariable", { variable: "door", equals: "open" }), state);
  assert.equal(value.nextId, "then");
  assert.deepEqual(value.predicate, { kind: "value", variable: "door", actual: "open", operator: "=", expected: "open", matched: true, route: "Then" });
  const number = runtime.evaluateNode(node("logicCompareNumber", { variable: "score", operator: ">=", compare: 5 }), state);
  assert.equal(number.nextId, "else");
  assert.equal(number.predicate.matched, false);
  const membership = runtime.evaluateNode(node("logicHasItem", { item: "key" }), state);
  assert.equal(membership.nextId, "then");
  assert.equal(membership.predicate.kind, "membership");
});

test("shared rule runtime describes host side effects", () => {
  const scene = runtime.evaluateNode(node("actionScene", { sceneId: "two" }), {});
  assert.equal(scene.nextId, "");
  assert.deepEqual(scene.effects, [{ type: "scene", sceneId: "two" }]);
  const audio = runtime.evaluateNode(node("actionPlaySound", { audioAssetId: "bell", audioVolume: 0.5, audioLoop: true }), {});
  assert.deepEqual(audio.effects, [{ type: "playSound", assetId: "bell", volume: 0.5, loop: true }]);
  const dialogue = runtime.evaluateNode(node("actionDialogue", { line: 2 }, "after"), {});
  assert.equal(dialogue.continuationId, "after");
  assert.equal(dialogue.nextId, "");
});

test("shared event matching remains scene scoped", () => {
  const trigger = node("eventTrigger", { trigger: "door", sceneId: "one" });
  assert.equal(runtime.eventMatches(trigger, "triggerEnter", { id: "door" }, "one"), true);
  assert.equal(runtime.eventMatches(trigger, "triggerEnter", { id: "door" }, "two"), false);
  const character = node("eventInteract", { character: "guide", sceneId: "one" });
  assert.equal(runtime.eventMatches(character, "characterInteract", { id: "guide", name: "Guide" }, "one"), true);
});

test("editor and exported game both consume the shared rule semantics", () => {
  assert.match(nodeEditor, /RuleRuntime\.evaluateNode/);
  assert.match(nodeEditor, /RuleRuntime\?\.eventMatches/);
  assert.match(tinyExport, /RULES\.evaluateNode/);
  assert.match(tinyExport, /RULES\.eventMatches/);
  const context = {};
  vm.runInNewContext(`this.RULES = ${runtime.standaloneSource};`, context);
  assert.equal(context.RULES.evaluateNode(node("logicCompareNumber", { variable: "score", operator: ">", compare: 2 }), { variables: { score: "3" } }).nextId, "then");
});
