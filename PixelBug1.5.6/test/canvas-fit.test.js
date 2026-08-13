const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CanvasFit = require("../src/modules/canvas-fit.js");

const root = path.join(__dirname, "..");

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
  assert.equal(fit.renderWidth, 800);
  assert.equal(fit.renderHeight, 800);
  assert.equal(fit.overflow, false);
});

test("large canvas presets keep a useful working size", () => {
  const fits = [64, 128, 256, 512].map(size => CanvasFit.calculate({
    projectWidth: size,
    projectHeight: size,
    availableWidth: 824,
    availableHeight: 802,
    maxDisplay: 1024
  }));
  for (const fit of fits) {
    assert.ok(fit.displayWidth >= 768, `${fit.projectWidth}px canvas collapsed to ${fit.displayWidth}px`);
    assert.ok(fit.displayHeight >= 768, `${fit.projectHeight}px canvas collapsed to ${fit.displayHeight}px`);
    assert.equal(fit.overflow, false);
  }
  const largest = fits.at(-1);
  assert.equal(largest.displayWidth, 802);
  assert.equal(largest.renderWidth, 1024);
  assert.equal(largest.renderScale, 2);
});

test("larger projects never display smaller than small projects", () => {
  for (const [availableWidth, availableHeight] of [[824, 802], [640, 520], [520, 420]]) {
    const small = CanvasFit.calculate({ projectWidth: 32, projectHeight: 32, availableWidth, availableHeight, maxDisplay: 1024 });
    const large = CanvasFit.calculate({ projectWidth: 512, projectHeight: 512, availableWidth, availableHeight, maxDisplay: 1024 });
    assert.ok(large.displayWidth >= small.displayWidth);
    assert.ok(large.displayHeight >= small.displayHeight);
  }
});

test("custom large canvases may use a fractional display scale", () => {
  const fit = CanvasFit.calculate({
    projectWidth: 300,
    projectHeight: 300,
    availableWidth: 824,
    availableHeight: 802,
    maxDisplay: 1024
  });
  assert.equal(fit.displayWidth, 802);
  assert.equal(fit.displayHeight, 802);
  assert.equal(fit.renderWidth, 900);
  assert.ok(fit.displayScale > 2.6 && fit.displayScale < 2.7);
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
  assert.equal(fit.displayWidth, 900);
  assert.equal(fit.displayHeight, 700);
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
  assert.match(renderer, /canvas\.width = fit\.renderWidth/);
  assert.match(renderer, /canvas\.style\.width = `\$\{fit\.displayWidth\}px`/);
  assert.match(renderer, /data-fit-mode/);
});

test("interface scaling does not resize structural rem units", () => {
  const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
  const renderer = fs.readFileSync(path.join(root, "src/renderer.js"), "utf8");
  assert.match(css, /:root\s*\{[\s\S]*?font-size:16px;/);
  assert.match(css, /--ui-body-font-size:calc\(16px \* var\(--interface-scale, 1\) \* var\(--a11y-text-scale, 1\)\)/);
  assert.match(css, /body\s*\{[^}]*font-size:var\(--ui-body-font-size, 16px\)/);
  assert.match(renderer, /root\.style\.setProperty\("--interface-scale", String\(ratio\)\)/);
  assert.doesNotMatch(renderer, /root\.style\.setProperty\("--ui-font-size"/);
});


test("editor gives the canvas a larger desktop workspace", () => {
  const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
  const renderer = fs.readFileSync(path.join(root, "src/renderer.js"), "utf8");
  assert.match(css, /\.app-shell \{ width:100%; max-width:1920px;/);
  assert.match(renderer, /CanvasFit\.calculate\(\{ projectWidth: w, projectHeight: h, \.\.\.space, maxDisplay: 1280 \}\)/);
});

test("touchpad pinch does not scale the interface", () => {
  const renderer = fs.readFileSync(path.join(root, "src/renderer.js"), "utf8");
  const main = fs.readFileSync(path.join(root, "src/main.js"), "utf8");
  assert.match(renderer, /window\.addEventListener\("wheel", event => \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?\}, \{ capture: true, passive: false \}\);/);
  assert.doesNotMatch(renderer, /interfaceScaleWheelDelta/);
  assert.match(renderer, /\["gesturestart", "gesturechange", "gestureend"\]/);
  assert.match(main, /contents\.on\("zoom-changed", event => \{[\s\S]*?resetPageZoom\(contents\);[\s\S]*?\}\);/);
  assert.doesNotMatch(main, /contents\.on\("zoom-changed"[\s\S]{0,220}contents\.send\("browser-zoom-blocked"/);
});
