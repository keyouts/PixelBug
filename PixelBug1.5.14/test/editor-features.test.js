"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const features = require("../src/modules/editor-features");

test("advanced masks combine and resize", () => {
  const box = features.boxMask({ x: 1, y: 1, w: 2, h: 2 });
  const color = features.colorMask([
    ["#000000", null, "#ffffff"],
    [null, "#000000", null]
  ], "#000000", 3, 2);
  const combined = features.combineMasks(box, color, "add");
  assert.equal(combined.size, 5);
  assert.equal(features.morphMask(new Set(["1,1"]), 4, 4, 1).size, 9);
  assert.deepEqual(features.maskBounds(new Set(["2,3", "4,5"]), 8, 8), { x: 2, y: 3, w: 3, h: 3 });
});

test("palette tools extract sort and remap", () => {
  const project = {
    palette: ["#ffffff"],
    frames: [{ layers: [{ pixels: [["#ff0000", "#00ff00"], ["#ff0000", null]] }] }]
  };
  assert.deepEqual(features.extractPalette(project), ["#ff0000", "#00ff00"]);
  assert.equal(features.paletteUsage(project)["#ff0000"], 2);
  assert.equal(features.remapProjectColor(project, "#ff0000", "#0000ff"), 2);
  assert.equal(project.frames[0].layers[0].pixels[0][0], "#0000ff");
  assert.deepEqual(features.sortPalette(["#ffffff", "#000000"], "value"), ["#000000", "#ffffff"]);
});

test("canvas transforms preserve nearest pixels", () => {
  const pixels = [["#111111", "#222222"], ["#333333", "#444444"]];
  assert.deepEqual(features.resampleNearest(pixels, 2, 2, 4, 4)[3][3], "#444444");
  assert.deepEqual(features.flipGrid(pixels, true), [["#222222", "#111111"], ["#444444", "#333333"]]);
  assert.deepEqual(features.rotateGrid(pixels, 2, 2), [["#333333", "#111111"], ["#444444", "#222222"]]);
  assert.deepEqual(features.cropGrid(pixels, { x: 1, y: 0, w: 1, h: 2 }), [["#222222"], ["#444444"]]);
});
