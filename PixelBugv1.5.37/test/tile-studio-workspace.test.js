"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const source = path.join(__dirname, "../src");
const html = fs.readFileSync(path.join(source, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(source, "styles-workspaces.css"), "utf8");
const workflow = fs.readFileSync(path.join(source, "modules/renderer/tile-repeat-workflow.js"), "utf8");

test("Base Mode launches a standalone accessible tile and terrain studio", () => {
  assert.match(html, /id="tile-repeat-toggle"[^>]*aria-controls="tile-repeat-panel"/);
  assert.match(html, /aria-modal="true" role="dialog" tabindex="-1" class="tile-repeat-panel tile-studio"/);
  assert.match(html, /id="tile-studio-title">Tiles &amp; Terrain Studio/);
  assert.match(html, /id="tile-repeat-close"[^>]*type="button">×/);
  assert.match(html, /id="tile-studio-map-editor"/);
  assert.match(workflow, /document\.body\.appendChild\(panel\)/);
  assert.match(styles, /body \.tile-repeat-panel\.tile-studio\s*\{\s*position: fixed;/);
});

test("live 2D editor, 3D terrain, brushes, controls and action buttons stay connected", () => {
  for (const id of ["tile-terrain-paint", "tile-terrain-3d", "tile-terrain-brush",
    "tile-terrain-active-layer", "tile-terrain-source", "tile-terrain-undo", "tile-terrain-redo",
    "tile-terrain-reset", "tile-terrain-import", "tile-terrain-transfer-mode", "tile-repeat-apply", "tile-repeat-preview"]) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} should not be duplicated`);
  }
  assert.match(workflow, /brushes\.append\(layers\[0\], controls\[0\]\)/);
  assert.match(workflow, /viewport\.append\(previews\[1\]\)/);
  assert.match(workflow, /footer\.append\(byId\("tile-terrain-summary"\)/);
  assert.match(styles, /grid-template-areas:\s*"brushes editor viewport inspector"/);
  assert.match(workflow, /focusButton\.textContent = focus \? "Exit 3D Focus" : "Focus 3D"/);
});

test("closing does not discard the selected tile, terrain, or the pattern's visibility preference", () => {
  const close = workflow.slice(workflow.indexOf("function setOpen(value)"), workflow.indexOf("function change(key, value)"));
  assert.match(close, /open = Boolean\(value\);/);
  assert.match(close, /refresh\(\);/);
  assert.doesNotMatch(close, /options\.enabled = false/);
  assert.doesNotMatch(close, /delete\s+getState\(\)/);
  assert.match(workflow, /if \(event\.key === "Escape"\)/);
  assert.match(workflow, /body\.classList\.toggle\?\.\("tile-studio-open", open && baseMode\(\)\)/);
});
