"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { planRepeat, normalizeSettings, MAX_STAMPS, create } = require("../src/modules/renderer/tile-repeat-workflow.js");

function plan(settings = {}) {
  return planRepeat({ canvasWidth: 32, canvasHeight: 24, tileWidth: 8, tileHeight: 8, ...settings });
}

test("tile repeat fills the artwork without changing the base canvas size", () => {
  const result = plan();
  assert.equal(result.visibleCount, 12);
  assert.deepEqual(result.placements[0], { x: 0, y: 0 });
  assert.deepEqual(result.placements.at(-1), { x: 24, y: 16 });
  assert.equal(result.stepX, 8);
  assert.equal(result.stepY, 8);
});

test("offsets, gaps and clipped leading tiles use artwork pixels", () => {
  const result = plan({ gapX: 2, gapY: 4, originX: 3, originY: 2 });
  assert.deepEqual(result.placements.slice(0, 4), [
    { x: -7, y: 2 }, { x: 3, y: 2 }, { x: 13, y: 2 }, { x: 23, y: 2 }
  ]);
  assert.equal(result.stepX, 10);
  assert.equal(result.stepY, 12);
  assert.deepEqual(plan({ originX: 5, originY: 3 }).placements[0], { x: -3, y: -5 });
});

test("fixed grids and staggered rows calculate their own positions", () => {
  assert.deepEqual(plan({ mode: "count", columns: 2, rows: 2, originX: 6, originY: 4 }).placements,
    [{ x: 6, y: 4 }, { x: 14, y: 4 }, { x: 6, y: 12 }, { x: 14, y: 12 }]);
  assert.deepEqual(plan({ mode: "count", columns: 2, rows: 2, gapX: 4, stagger: "brick" }).placements,
    [{ x: 0, y: 0 }, { x: 12, y: 0 }, { x: 6, y: 8 }, { x: 18, y: 8 }]);
});

test("limits prevent abusive pattern size and invalid numerical settings", () => {
  const normalized = normalizeSettings({ gapX: -100, rows: 10000, columns: Infinity, originX: NaN });
  assert.equal(normalized.gapX, 0);
  assert.equal(normalized.rows, 128);
  assert.equal(normalized.columns, 4);
  assert.equal(normalized.originX, 0);
  assert.equal(planRepeat({ canvasWidth: 512, canvasHeight: 512, tileWidth: 1, tileHeight: 1 }).visibleCount, 262144);
  const overflow = planRepeat({ canvasWidth: 1024, canvasHeight: 1024, tileWidth: 1, tileHeight: 1 });
  assert.equal(overflow.overflow, true);
  assert.equal(overflow.placements.length, 0);
  assert.ok(overflow.visibleCount > MAX_STAMPS);
});

test("Base Mode retains its original canvas and puts all repeat controls in an overlay panel", () => {
  const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
  const start = html.indexOf('<section class="dock-card" data-dock-id="tilemap">');
  const end = html.indexOf('</section>', start);
  const sidebar = html.slice(start, end);
  const stage = html.slice(html.indexOf('<section aria-label="Pixel canvas area" class="stage-panel">'));
  assert.ok(start >= 0 && end > start);
  assert.match(sidebar, /id="tilemap-select"/);
  assert.match(sidebar, /id="tilemap-stamp-btn"/);
  assert.match(sidebar, /id="tilemap-editor-btn"/);
  assert.doesNotMatch(sidebar, /tile-repeat-(?:options|panel|controls|preview)/);
  assert.doesNotMatch(sidebar, /id="tilemap-preview"/);
  assert.match(stage, /<div class="canvas-frame" data-fit-mode="workspace">\s*<canvas[^>]*id="pixel-canvas"[^>]*><\/canvas>\s*<canvas[^>]*id="tile-repeat-overlay"/);
  assert.match(stage, /id="tile-repeat-panel" hidden/);
  assert.match(stage, /id="tile-repeat-toggle"[^>]*aria-controls="tile-repeat-panel"[^>]*aria-expanded="false"/);
  assert.match(stage, /id="tile-repeat-swatch"/);
  assert.match(stage, /id="tile-repeat-preview"/);
  assert.match(stage, /id="tile-repeat-apply"/);
});

function buildUI() {
  const listeners = new Map();
  const drawn = [];
  const context = new Proxy({
    drawImage: (...args) => drawn.push(args),
    createPattern: () => "pattern"
  }, { get(target, key) { return key in target ? target[key] : () => {}; } });
  const elements = new Map();
  function node(id) {
    if (!elements.has(id)) {
      const obj = {
        id, width: id === "tile-repeat-preview" ? 288 : 56, height: id === "tile-repeat-preview" ? 150 : 56,
        offsetLeft: 34, offsetTop: 22, clientLeft: 4, clientTop: 4,
        style: {}, hidden: false, checked: false, disabled: false, value: "", textContent: "", children: [],
        get options() { return this.children; },
        setAttribute(name, value) { this[name] = value; },
        focus() {},
        replaceChildren() { this.children.length = 0; },
        appendChild(child) { this.children.push(child); },
        addEventListener(name, callback) { listeners.set(`${id}:${name}`, callback); },
        getContext: () => context
      };
      elements.set(id, obj);
    }
    return elements.get(id);
  }
  const fakeDocument = {
    getElementById: node,
    createElement: () => node(`generated-${elements.size}`),
    querySelectorAll: () => [node("tile-repeat-columns-parent"), node("tile-repeat-rows-parent")],
    documentElement: { dataset: { theme: "light" } },
    body: { classList: { contains: () => false } }
  };
  return { fakeDocument, node, listeners, drawn };
}

test("floating panel toggles the preview independently, then applies a single undoable edit", () => {
  const before = global.document;
  const ui = buildUI();
  global.document = ui.fakeDocument;
  try {
    const pixels = Array.from({ length: 4 }, () => Array(4).fill(null));
    const tile = { id: "tile", name: "Stone", w: 2, h: 2, pixels: [["#112233", null], [null, "#445566"]] };
    const state = { tilemap: { tiles: [tile], activeTileId: tile.id } };
    let history = 0;
    let changes = 0;
    let saves = 0;
    const controller = create({ getState: () => state, getTile: () => tile,
      getCanvas: () => ({ width: 32, height: 32, offsetLeft: 25, offsetTop: 20, clientLeft: 4, clientTop: 4 }),
      projectWidth: () => 4, projectHeight: () => 4,
      pushHistory: () => history++, renderAll: () => {}, saveLocal: () => saves++, setStatus: () => {},
      getActiveLayer: () => ({ visible: true }), clearLayerSource: () => {},
      selectTile: () => {},
      setPixel: (x, y, color) => {
        if (x < 0 || y < 0 || x >= 4 || y >= 4 || pixels[y][x] === color) return false;
        pixels[y][x] = color; changes++; return true;
      }
    });
    controller.setup();
    assert.equal(ui.node("tile-repeat-panel").hidden, true);
    assert.equal(ui.node("tile-repeat-overlay").hidden, true);
    ui.listeners.get("tile-repeat-toggle:click")();
    assert.equal(ui.node("tile-repeat-panel").hidden, false);
    assert.equal(ui.node("tile-repeat-overlay").hidden, false);
    assert.equal(ui.node("tile-repeat-overlay").style.left, "29px");
    assert.equal(ui.node("tile-repeat-overlay").style.top, "24px");
    assert.ok(ui.drawn.length > 0);
    assert.equal(history, 0);
    assert.equal(changes, 0);
    ui.listeners.get("tile-repeat-overlay-enabled:change")({ target: { checked: false } });
    assert.equal(ui.node("tile-repeat-overlay").hidden, true);
    ui.listeners.get("tile-repeat-overlay-enabled:change")({ target: { checked: true } });
    controller.apply();
    assert.equal(history, 1);
    assert.equal(changes, 8);
    assert.equal(state.tilemap.repeat.enabled, false);
    assert.equal(ui.node("tile-repeat-overlay").hidden, true);
    ui.listeners.get("tile-repeat-close:click")();
    assert.equal(ui.node("tile-repeat-panel").hidden, true);
    assert.ok(saves >= 2);
  } finally {
    if (before === undefined) delete global.document;
    else global.document = before;
  }
});
