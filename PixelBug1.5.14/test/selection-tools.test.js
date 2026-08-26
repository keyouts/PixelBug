"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const EditorFeatures = require("../src/modules/editor-features");
const SelectionWorkflow = require("../src/modules/renderer/selection-workflow");

const source = name => fs.readFileSync(path.join(__dirname, "..", "src", name), "utf8");

test("large color masks remain compact", () => {
  const size = 512;
  const pixels = Array.from({ length: size }, () => Array(size).fill("#A1B2C3"));
  const mask = EditorFeatures.colorMask(pixels, "#a1b2c3", size, size);
  assert.ok(mask instanceof Set);
  assert.equal(mask.size, size * size);
  assert.equal(mask.bits.byteLength, size * size);
  assert.deepEqual(EditorFeatures.maskBounds(mask, size, size), { x: 0, y: 0, w: size, h: size });
  const runs = EditorFeatures.maskRuns(mask);
  assert.equal(runs.length, size);
  assert.deepEqual(runs[0], { x: 0, y: 0, w: size });
});

test("optimized masks preserve selection operations", () => {
  const pixels = [
    ["#ff0000", "#00ff00", "#ff0000"],
    [null, "#ff0000", null]
  ];
  const red = EditorFeatures.colorMask(pixels, "#FF0000", 3, 2);
  const box = EditorFeatures.boxMask({ x: 0, y: 0, w: 2, h: 2 }, 3, 2);
  assert.equal(red.size, 3);
  assert.equal(EditorFeatures.combineMasks(box, red, "add").size, 5);
  assert.equal(EditorFeatures.combineMasks(box, red, "subtract").size, 2);
  assert.equal(EditorFeatures.maskHas(red, 2, 0), true);
  assert.equal(EditorFeatures.maskHas(red, 1, 0), false);
  const shifted = SelectionWorkflow.shiftMask(red, 1, 1, 4, 3, EditorFeatures);
  assert.equal(EditorFeatures.maskHas(shifted, 1, 1), true);
  assert.equal(EditorFeatures.maskHas(shifted, 3, 1), true);
  const cleared = pixels.map(row => row.slice());
  assert.equal(SelectionWorkflow.clearPixels(red, cleared, EditorFeatures, (x, y, value, target) => { target[y][x] = value; }), 3);
  assert.deepEqual(cleared, [[null, "#00ff00", null], [null, null, null]]);
});

test("base color selection is connected and accessible", () => {
  const html = source("index.html");
  const renderer = source("renderer.js");
  assert.match(html, /id="selection-color-btn"/);
  assert.match(html, /id="selection-color-help"/);
  assert.match(html, /modules\/renderer\/selection-workflow\.js/);
  assert.match(renderer, /function selectCurrentLayerColor\(\)/);
  assert.match(renderer, /selectionColorBtn\?\.addEventListener\("click", selectCurrentLayerColor\)/);
  assert.match(renderer, /Choose a painted pixel when selecting by color\./);
});
