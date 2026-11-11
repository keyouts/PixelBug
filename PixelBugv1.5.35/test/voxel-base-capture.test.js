"use strict";

const test = require("node:test");
const flatSprite = require("../src/modules/voxel-flat-sprite.js");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const capture = require("../src/modules/voxel-base-capture.js");

// Raster sampling
test("a transparent voxel camera capture becomes an isolated Base sprite", () => {
  const width = 48, height = 48;
  const image = new Uint8ClampedArray(width * height * 4);
  for (let y = 10; y < 38; y++) for (let x = 16; x < 32; x++) {
    const i = (y * width + x) * 4;
    image[i] = 255; image[i + 1] = 63; image[i + 2] = 21; image[i + 3] = 255;
  }
  const pixels = capture.rasterize(image, width, height, 32, 32);
  assert.equal(pixels.length, 32);
  assert.equal(pixels[0].length, 32);
  assert.equal(pixels[0][0], null);
  assert.equal(pixels[16][16], "#ff3f15");
  assert.ok(pixels.flat().filter(Boolean).length > 20);
  assert.equal(capture.rasterize(new Uint8ClampedArray(image.length), width, height, 32, 32), null);
});

// Frame isolation
test("voxel pose frame uses its own new layer and copies pixel buffers", () => {
  const pixels = [[null, "#ff0000"], ["#abcdef", null]];
  const makeLayer = (w, name, h) => ({ name, pixels: Array.from({ length: h }, () => Array(w).fill(null)), sourcePixels: [] });
  const result = capture.frameRecord(pixels, "Jump Arms", 130, makeLayer);
  assert.equal(result.tag, "Jump Arms");
  assert.equal(result.layers.length, 1);
  assert.equal(result.layers[0].name, "Voxel Pose: Jump Arms");
  assert.equal(result.layers[0].pixels[0][0], null);
  assert.equal(result.layers[0].pixels[0][1], "#ff0000");
  pixels[0][1] = "#00ff00";
  assert.equal(result.layers[0].pixels[0][1], "#ff0000");
  assert.notEqual(result.layers[0].pixels, result.layers[0].sourcePixels);
});

// Capture assignment
test("a captured jump pose appends a Base frame without shifting other Play Mode references", () => {
  const existing = { tag: "Original", layers: [{ name: "Original Art", pixels: [["#ffffff"]] }] };
  const state = { frames: [existing], activeFrame: 0, activeLayer: 0, playMode: { idleFrame: 0, walkFrame: 0, jumpFrame: 0, voxelActorAssetId: "hero" } };
  const rgba = new Uint8ClampedArray(8 * 8 * 4);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = (y * 8 + x) * 4; rgba[i + 1] = 255; rgba[i + 3] = 255; }
  const first = JSON.stringify(existing);
  let undoCount = 0;
  const result = capture.capture({ state, cubeCount: 128, limit: 240, name: "Jump", action: "jump", playing: false,
    preview: () => ({ width: 8, height: 8, getContext: () => ({ getImageData: () => ({ data: rgba }) }) }),
    width: 16, height: 16, makeLayer: (w, name, h) => ({ name, pixels: Array.from({ length: h }, () => Array(w).fill(null)) }),
    beforeEdit: () => { undoCount++; }, duration: 120 });
  assert.equal(result.ok, true);
  assert.equal(result.index, 1);
  assert.equal(state.frames[0], existing);
  assert.equal(JSON.stringify(existing), first);
  assert.equal(state.frames.length, 2);
  assert.equal(state.frames[1].layers.length, 1);
  assert.equal(state.activeLayer, 0);
  assert.equal(state.playMode.jumpFrame, 1);
  assert.equal(state.playMode.idleFrame, 0);
  assert.equal(state.playMode.walkFrame, 0);
  assert.equal(state.playMode.voxelActorAssetId, "");
  assert.equal(undoCount, 1);
});

// Capture safety
test("failed pose capture resumes animation without changing project state", () => {
  const state = { frames: [{ tag: "Original" }], playMode: { jumpFrame: 0 } };
  let stopped = 0, resumed = 0, history = 0;
  const args = { state, cubeCount: 1, limit: 240, action: "jump", playing: true,
    stop: () => stopped++, resume: () => resumed++, beforeEdit: () => history++,
    preview: () => { throw new Error("canvas read failed"); } };
  const outcome = capture.capture(args);
  assert.equal(outcome.ok, false);
  assert.match(outcome.message, /canvas read failed/);
  assert.equal(stopped, 1);
  assert.equal(resumed, 1);
  assert.equal(state.frames.length, 1);
  assert.equal(history, 0);
  assert.equal(capture.capture({ ...args, cubeCount: 0 }).ok, false);
  assert.equal(capture.capture({ ...args, limit: 1 }).ok, false);
});

// Workspace layout
test("share buttons stack and voxel parts have dedicated spacing", () => {
  const styles = fs.readFileSync(path.join(__dirname, "../src/styles-workspaces.css"), "utf8");
  const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  const renderer = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");
  assert.match(styles, /\.play-toolbar-export \.play-actions \{\s*display: grid;\s*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /\.play-voxel-library-card \.play-voxel-parts-row/);
  assert.match(html, /class="play-grid play-voxel-parts-row"/);
  for (const id of ["voxel-base-capture-name", "voxel-base-capture-action", "voxel-base-capture-btn"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(renderer, /PixelBugVoxelBaseCapture\.capture/);
  assert.match(html, /modules\/voxel-base-capture\.js/);
});

// Export bridge
test("captured Base pose frames and existing node rules remain addressable in a game export", () => {
  const exporter = require("../src/modules/tiny-game-export.js");
  const html = exporter.buildTinyGameHtml({ title: "Pose Capture", artWidth: 32, artHeight: 32, exportWidth: 640, exportHeight: 360,
    frames: { "0": "data:image/png;base64,AAAA", "1": "data:image/png;base64,AQID" },
    playMode: { idleFrame: 0, walkFrame: 0, jumpFrame: 1, voxelActorAssetId: "", props: [], nodeEditor: { nodes: [
      { id: "start", type: "eventStart", next: "say", data: {} },
      { id: "say", type: "actionMessage", next: "", data: { message: "Jump ready" } }
    ] } } });
  assert.match(html, /"jumpFrame":1/);
  assert.match(html, /"voxelActorAssetId":""/);
  assert.match(html, /"Jump ready"/);
  assert.match(html, /data:image\/png;base64,AQID/);
  assert.match(html, /const RULES/);
});

// Capture finishing
test("clean pose finish reduces fine pixel noise without altering the detailed source", () => {
  const pixels = Array.from({ length: 64 }, (_, y) => Array.from({ length: 64 }, (_, x) => {
    if (x < 16 || x > 47 || y < 8 || y > 55) return null;
    const noise = (x * 13 + y * 7) % 23;
    return `#${(136 + noise).toString(16)}${(70 + noise).toString(16)}${(40 + noise).toString(16)}`;
  }));
  const original = JSON.stringify(pixels);
  const detail = capture.cleanPixels(pixels, "detail");
  const clean = capture.cleanPixels(pixels, "clean");
  const chunky = capture.cleanPixels(pixels, "chunky");
  const colors = image => new Set(image.flat().filter(Boolean));
  assert.equal(detail, pixels);
  assert.equal(JSON.stringify(pixels), original);
  assert.equal(clean.length, pixels.length);
  assert.equal(clean[0].length, pixels[0].length);
  assert.equal(clean[0][0], null);
  assert.ok(colors(clean).size < colors(detail).size, "clean palette should have fewer shade variations");
  assert.ok(colors(chunky).size <= colors(clean).size, "bolder finish should not add extra colors");
  assert.ok(clean[20][20] && clean[20][21], "clean blocks should retain the character body");
  assert.equal(clean.flat().filter(Boolean).length, pixels.flat().filter(Boolean).length, "color merging preserves every occupied pixel");
});

// Finish wiring
test("capture finish is optional and does not overwrite existing Base frames", () => {
  const image = new Uint8ClampedArray(64 * 64 * 4);
  for (let y = 8; y < 56; y++) for (let x = 16; x < 48; x++) {
    const i = (y * 64 + x) * 4;
    image[i] = (x * 11 + y * 3) % 40 + 130; image[i + 1] = 75; image[i + 2] = 55; image[i + 3] = 255;
  }
  const oldFrame = { tag: "Original", layers: [{ pixels: [["#123456"]] }] };
  const frame = { frames: [oldFrame], activeFrame: 0, activeLayer: 0, playMode: { jumpFrame: 0 } };
  const result = capture.capture({ state: frame, cubeCount: 50, limit: 240, name: "Jump", action: "jump", finish: "clean", playing: false,
    preview: () => ({ width: 64, height: 64, getContext: () => ({ getImageData: () => ({ data: image }) }) }),
    width: 64, height: 64, makeLayer: (w, name, h) => ({ name }), beforeEdit: () => {}, duration: 120 });
  assert.equal(result.ok, true);
  assert.equal(frame.frames[0], oldFrame);
  assert.equal(frame.frames[0].layers[0].pixels[0][0], "#123456");
  assert.equal(frame.frames[1].layers[0].pixels.length, 64);
  assert.equal(frame.playMode.jumpFrame, 1);
  const source = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");
  const markup = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  assert.match(source, /finish: voxelBaseCaptureFinish\?\.value/);
  assert.match(markup, /id="voxel-base-capture-finish" aria-describedby="voxel-base-capture-help"/);
});

// Edge retention
test("color merging preserves fine strokes, empty gaps, and contrast while grouping near shades", () => {
  const artwork = Array.from({ length: 24 }, () => Array(24).fill(null));
  const variants = ["#d4a17f", "#d5a280", "#d19f7d", "#d7a481", "#d2a17e", "#d6a380"];
  for (let y = 3; y < 20; y++) for (let x = 4; x < 20; x++) {
    artwork[y][x] = variants[(x * 3 + y * 5) % variants.length];
  }
  for (let y = 8; y <= 16; y++) artwork[y][11] = null;
  artwork[5][8] = "#1a1317";
  artwork[5][16] = "#1a1317";
  artwork[12][16] = "#5b392b";
  artwork[2][12] = "#191719";
  const original = JSON.stringify(artwork);
  const styles = ["soft", "clean", "bold"];
  const occupied = artwork.map(row => row.map(Boolean));
  for (const style of styles) {
    const result = capture.cleanPixels(artwork, style);
    assert.deepEqual(result.map(row => row.map(Boolean)), occupied, `${style} should not change sprite geometry`);
    assert.ok(parseInt(result[5][8].slice(1, 3), 16) < 45, `${style} should keep small dark eyes`);
    assert.ok(parseInt(result[5][16].slice(1, 3), 16) < 45, `${style} should keep the other eye`);
    assert.ok(parseInt(result[12][16].slice(1, 3), 16) < 120, `${style} should keep distinct markings`);
    assert.ok(parseInt(result[2][12].slice(1, 3), 16) < 45, `${style} should keep one-pixel protrusions`);
    assert.equal(result[11][11], null, `${style} should not fill transparent gaps`);
    const skinColors = new Set(result.flat().filter(color => color && color.startsWith("#d")));
    assert.ok(skinColors.size < variants.length, `${style} should merge near-duplicate skin colors`);
  }
  assert.equal(JSON.stringify(artwork), original, "cleanup should not modify the captured source");
  assert.equal(capture.cleanPixels(artwork, "detail"), artwork, "original detail is still unchanged");
});

// Palette separation
test("color merge retains high-contrast one-pixel features on dense artwork", () => {
  const artwork = Array.from({ length: 96 }, (_, y) => Array.from({ length: 96 }, (_, x) => {
    if (x < 5 || x > 90 || y < 5 || y > 90) return null;
    const shade = (x * 3 + y * 7) % 18;
    return `#${(127 + shade).toString(16)}${(145 + shade).toString(16)}${(165 + shade).toString(16)}`;
  }));
  for (let x = 17; x <= 72; x++) artwork[50][x] = "#201b2a";
  for (let y = 18; y < 80; y++) artwork[y][66] = "#ffffff";
  const result = capture.cleanPixels(artwork, "clean");
  for (let x = 17; x <= 72; x++) {
    if (x === 66) continue;
    assert.equal(result[50][x], "#201b2a", "thin outline stays visible");
  }
  for (let y = 18; y < 80; y++) assert.equal(result[y][66], "#ffffff", "thin bright highlight stays visible");
  assert.equal(result[0][0], null);
  assert.ok(new Set(result.flat().filter(Boolean)).size < new Set(artwork.flat().filter(Boolean)).size);
});

// Finish selection
test("pose finish presents distinct conservative and original-detail choices", () => {
  const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  for (const [style, description] of [["clean", "Balanced color merge"], ["soft", "Gentle color merge"],
    ["bold", "Stronger color merge"], ["chunky", "Bolder pixel blocks"], ["detail", "Keep original detail"]]) {
    assert.match(html, new RegExp(`<option value="${style}"[^>]*>${description}`));
  }
  assert.match(html, /value="flat" selected/);
});

// Flat sampling
test("flat sprite raster keeps small dark eyes instead of averaging them into skin", () => {
  const sw = 100, sh = 100;
  const rgba = new Uint8ClampedArray(sw * sh * 4);
  for (let y = 5; y < 95; y++) for (let x = 5; x < 95; x++) {
    const i = (y * sw + x) * 4;
    const eye = x >= 47 && x <= 56 && y >= 42 && y <= 53;
    rgba[i] = eye ? 18 : 220;
    rgba[i + 1] = eye ? 15 : 166;
    rgba[i + 2] = eye ? 22 : 125;
    rgba[i + 3] = 255;
  }
  const palette = ["#dca67d", "#120f16"];
  const result = capture.rasterizeFlat(rgba, sw, sh, 16, 16, palette);
  const colors = new Set(result.flat().filter(Boolean));
  assert.ok(colors.has("#120f16"), "dark features survive downsampling");
  assert.ok(colors.has("#dca67d"), "skin color remains flat");
  assert.equal(colors.size, 2, "no invented blended colors");
  assert.equal(result[0][0], null);
});

test("flat sprite projection retains pose coordinates and painted colors without lighting", () => {
  const calls = [];
  const ctx = { clearRect: () => {}, beginPath: () => {}, moveTo: (...a) => calls.push(["start", ...a]), lineTo: (...a) => calls.push(["line", ...a]), closePath: () => {}, fill: () => calls.push(["fill", ctx.fillStyle, ctx.globalAlpha]) };
  const canvas = { width: 0, height: 0, getContext: () => ctx };
  const descriptors = [{ cube: { color: "#111111", partId: "eye" }, faceName: "front" }, { cube: { color: "#deb48e", partId: "face" }, faceName: "front" }];
  const drawn = flatSprite.capture({ descriptors, faceFor: (cube, _face, cache) => {
    assert.ok(cache instanceof WeakMap);
    return { points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }], normal: { x: 0, y: 0, z: 1 }, depth: cube.color === "#111111" ? 2 : 1 };
  }, visible: normal => normal.z === 1, width: 32, height: 32, makeCanvas: () => canvas, opacityForPart: () => 1 });
  assert.equal(drawn, canvas);
  assert.deepEqual(calls.filter(call => call[0] === "fill").map(call => call[1]), ["#deb48e", "#111111"]);
  assert.deepEqual(new Set(drawn.capturePalette), new Set(["#111111", "#deb48e"]));
  assert.ok(calls.some(call => call[0] === "start" && Number.isFinite(call[1]) && Number.isFinite(call[2])));
});

test("flat capture option is first and routes through direct voxel rendering", () => {
  const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  const renderer = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");
  assert.match(html, /value="flat" selected>Flat Sprite/);
  assert.match(html, /modules\/voxel-flat-sprite\.js/);
  assert.match(renderer, /PixelBugVoxelFlatSprite\.capture/);
  assert.match(renderer, /preview: style => style === "flat"/);
  assert.equal(capture.cleanPixels([["#123456"]], "flat")[0][0], "#123456");
});
