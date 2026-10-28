"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { cleanInput } = require("../src/main/mod-validation");

const source = fs.readFileSync(path.join(__dirname, "../src/main/mod-runner-manager.js"), "utf8");
const moduleRef = { exports: {} };
vm.runInNewContext(source, {
  module: moduleRef,
  require(name) {
    if (name === "electron") return {};
    if (name === "./mod-validation") return { cleanInput, cleanResult: require("../src/main/mod-validation").cleanResult };
    return require(name);
  },
  clearTimeout,
  setTimeout
});
const { ModRunnerManager } = moduleRef.exports;

function setup() {
  const url = "pixelbug://mod/runner.html";
  const manager = new ModRunnerManager({ on() {} }, url);
  const sender = { id: 7, isDestroyed: () => false, once() {} };
  const event = { sender };
  const sent = [];
  let created = 0;
  let completeCreation;
  const ready = new Promise(resolve => { completeCreation = resolve; });
  manager.create = async (_owner, kind, code) => {
    created += 1;
    await ready;
    const frame = { url };
    const contents = { id: 99, mainFrame: frame, send(_channel, payload) { sent.push(payload); } };
    const window = { webContents: contents, isDestroyed: () => false, destroy() {} };
    const runner = { ownerId: 7, kind, code, window, idleTimer: null, pending: new Map() };
    manager.contents.set(contents.id, runner);
    return runner;
  };
  return { manager, event, sent, completeCreation, get created() { return created; }, url };
}

const input = {
  kind: "brush",
  code: "return color;",
  permissions: ["canvas.read", "pixels.write"],
  payload: { x: 0, y: 0, color: "#ffffff", pixels: [["#ffffff"]], app: { width: 1, height: 1 } }
};

test("simultaneous mod requests reuse a single runner", async () => {
  const state = setup();
  const first = state.manager.run(state.event, input);
  const second = state.manager.run(state.event, input);
  assert.equal(state.created, 1);
  state.completeCreation();
  for (let index = 0; index < 8 && state.sent.length < 2; index++) await new Promise(resolve => setImmediate(resolve));
  assert.equal(state.created, 1);
  assert.equal(state.sent.length, 2);
  const frame = { url: state.url };
  const contents = { id: 99, mainFrame: frame };
  state.manager.receive({ sender: contents, senderFrame: { url: state.url } }, { id: state.sent[0].id, result: "#ffffff" });
  assert.equal(state.manager.runners.get("7:brush").pending.size, 2);
  state.manager.receive({ sender: contents, senderFrame: frame }, { id: state.sent[0].id, result: "#ffffff" });
  state.manager.receive({ sender: contents, senderFrame: frame }, { id: state.sent[1].id, result: "#ffffff" });
  assert.deepEqual(await Promise.all([first, second]), ["#ffffff", "#ffffff"]);
  state.manager.reset(state.event, "brush");
});

test("reset during asynchronous creation prevents orphaned runners", async () => {
  const state = setup();
  const pending = state.manager.run(state.event, input);
  state.manager.reset(state.event, "brush");
  state.completeCreation();
  await assert.rejects(pending, /Mod runner reset/);
  assert.equal(state.manager.runners.size, 0);
});
