"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const guard = require("../src/modules/project-guard");
const { writeFileAtomic, writeFilesTransaction } = require("../src/main/file-transactions");
const { cleanInput, cleanResult } = require("../src/main/mod-validation");

function project() {
  return {
    name: "Test",
    size: 2,
    frames: [{ layers: [{ name: "Layer", pixels: [[null, "#ffffff"], [null, null]] }] }]
  };
}

test("legacy projects migrate", () => {
  const value = guard.prepare(project());
  assert.equal(value.format, guard.FORMAT);
  assert.equal(value.schemaVersion, guard.SCHEMA_VERSION);
  assert.equal(value.width, 2);
  assert.equal(value.height, 2);
});

test("unsafe properties fail", () => {
  assert.throws(() => guard.parse('{"size":2,"frames":[{"layers":[{}]}],"constructor":{}}'), /unsafe property/);
});

test("oversized projects fail", () => {
  const value = project();
  value.frames = Array.from({ length: 241 }, () => ({ layers: [{}] }));
  assert.throws(() => guard.prepare(value), /frames/);
});

test("atomic files replace together", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pixelbug-test-"));
  const first = path.join(directory, "first.txt");
  const second = path.join(directory, "second.txt");
  try {
    await fs.writeFile(first, "old-first");
    await fs.writeFile(second, "old-second");
    await writeFilesTransaction([
      { filePath: first, payload: "new-first" },
      { filePath: second, payload: Buffer.from("new-second") }
    ]);
    assert.equal(await fs.readFile(first, "utf8"), "new-first");
    assert.equal(await fs.readFile(second, "utf8"), "new-second");
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("directory targets are rejected", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pixelbug-test-"));
  const target = path.join(directory, "folder");
  try {
    await fs.mkdir(target);
    await assert.rejects(writeFileAtomic(target, "blocked"), /must be a file/);
    assert.equal((await fs.stat(target)).isDirectory(), true);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("duplicate outputs fail safely", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pixelbug-test-"));
  const target = path.join(directory, "target.txt");
  try {
    await writeFileAtomic(target, "kept");
    await assert.rejects(writeFilesTransaction([
      { filePath: target, payload: "first" },
      { filePath: target, payload: "second" }
    ]), /unique names/);
    assert.equal(await fs.readFile(target, "utf8"), "kept");
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("mod validation limits requests and results", () => {
  const request = cleanInput({ kind: "brush", code: "return color;", payload: { x: 1, y: 2, color: "#123456", pixels: [[null]], app: { width: 1, height: 1 } } });
  assert.equal(request.payload.x, 1);
  assert.deepEqual(cleanResult("brush", { color: "#123456" }, request.payload), [{ color: "#123456" }]);
  assert.throws(() => cleanInput({ kind: "effect", code: "return pixels;", payload: { pixels: [[]], app: { width: 1, height: 1 } } }), /pixels/);
  assert.throws(() => cleanResult("brush", Array.from({ length: 4097 }, () => "#000000"), request.payload), /too many/);
});

test("mod runner preserves brush and effect formats", async () => {
  let receive;
  const responses = [];
  const context = vm.createContext({
    window: {
      pixelBugMod: {
        receive(callback) { receive = callback; },
        respond(id, result, error) { responses.push({ id, result, error }); }
      }
    }
  });
  const source = await fs.readFile(path.join(__dirname, "../src/mod-runner.js"), "utf8");
  vm.runInContext(source, context);
  await receive({ id: "brush", kind: "brush", code: "function brush(x, y, color) { return { x, y, color }; }", payload: { x: 1, y: 2, color: "#123456", pixels: [[null]], app: { width: 1, height: 1 } } });
  await receive({ id: "effect", kind: "effect", code: "function effect(r, g, b, a) { return { r: 255 - r, g: 255 - g, b: 255 - b, a }; }", payload: { color: "#000000", pixels: [["#000000"]], app: { width: 1, height: 1 } } });
  assert.deepEqual(JSON.parse(JSON.stringify(responses[0].result)), { x: 1, y: 2, color: "#123456" });
  assert.deepEqual(JSON.parse(JSON.stringify(responses[1].result)), [["#ffffff"]]);
});
