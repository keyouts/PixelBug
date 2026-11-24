const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "src/index.html"), "utf8");

// Screenreader guidance
test("terrain tools have nonvisual descriptions for critical actions", () => {
  for (const id of ["tile-repeat-preview-help", "tile-terrain-sensitivity-help", "tile-terrain-transfer-help"]) {
    assert.match(html, new RegExp(`class="sr-only" id="${id}"`));
    assert.match(html, new RegExp(`aria-describedby="${id}"`));
  }
  assert.match(html, /id="tile-terrain-import"[^>]+aria-describedby="tile-terrain-transfer-help"/);
  assert.match(html, /id="tile-terrain-transfer-mode"[^>]+aria-describedby="tile-terrain-transfer-help"/);
  assert.match(html, /id="tile-terrain-sensitivity"[^>]+aria-describedby="tile-terrain-sensitivity-help"/);
});

// Release metadata
test("release notes and package metadata use the same release number", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
  const notes = fs.readFileSync(path.resolve(root, "..", "RELEASE_NOTES_1.5.36.md"), "utf8");
  assert.equal(manifest.version, "1.5.36");
  assert.equal(lock.version, manifest.version);
  assert.equal(lock.packages[""].version, manifest.version);
  assert.match(notes, /^# Pixel Bug 1\.5\.36\s*$/m);
});
