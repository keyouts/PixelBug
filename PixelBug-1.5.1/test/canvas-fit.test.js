const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CanvasFit = require("../src/modules/canvas-fit.js");

const root = path.join(__dirname, "..");

// Canvas fitting
test("desktop canvas fits without incidental scrollbars", () => {
  const fit = CanvasFit.calculate({
    projectWidth: 32,
    projectHeight: 32,
    availableWidth: 824,
    availableHeight: 802,
    maxDisplay: 1024
  });
  assert.equal(fit.pixelScale, 25);
  assert.equal(fit.displayWidth, 800);
  assert.equal(fit.displayHeight, 800);
  assert.equal(fit.overflow, false);
});

test("oversized projects retain deliberate scrolling", () => {
  const fit = CanvasFit.calculate({
    projectWidth: 900,
    projectHeight: 700,
    availableWidth: 824,
    availableHeight: 602,
    maxDisplay: 1024
  });
  assert.equal(fit.pixelScale, 1);
  assert.equal(fit.overflowX, true);
  assert.equal(fit.overflowY, true);
});

test("canvas fitting stays connected to the renderer", () => {
  const html = fs.readFileSync(path.join(root, "src/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
  const renderer = fs.readFileSync(path.join(root, "src/renderer.js"), "utf8");
  assert.match(html, /modules\/canvas-fit\.js/);
  assert.match(css, /\.canvas-frame\.canvas-overflow\s*\{\s*overflow:auto;/);
  assert.match(renderer, /CanvasFit\.calculate/);
  assert.match(renderer, /data-fit-mode/);
});
