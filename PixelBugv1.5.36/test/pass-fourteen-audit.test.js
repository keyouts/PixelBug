"use strict";

// Comment contracts
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const comments = require("../scripts/comment-policy");
const mod = require("../src/main/mod-validation");
const preflight = require("../src/modules/export-preflight");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");

test("standalone two-word headings pass while inline code annotations fail", () => {
  assert.equal(comments.validate("// Scene controls\nconst n = 1;", ".js"), 1);
  assert.equal(comments.validate("const url = 'https://example.test/a'; const rex = /\\/\\/abc/;", ".js"), 0);
  assert.throws(() => comments.validate("const n = 1; // Inline annotation", ".js"), /Comment policy/);
  assert.throws(() => comments.validate("// Too many words\nconst n = 1;", ".js"), /Comment policy/);
  assert.throws(() => comments.validate("/* Two words */ const n = 1;", ".js"), /Comment policy/);
  assert.throws(() => comments.validate("const n = 1; /* Two words */", ".js"), /Comment policy/);
  assert.equal(comments.validate("const thing = `${1 + 1}`;", ".js"), 0);
  assert.throws(() => comments.validate("const thing = `${1 /* Bad comment */ + 1}`;", ".js"), /Comment policy/);
});

test("HTML CSS and Python comments follow the same section-header rule", () => {
  assert.equal(comments.validate("<!-- Game controls -->\n<section></section>", ".html"), 1);
  assert.throws(() => comments.validate("<section><!-- Game controls --></section>", ".html"), /Comment policy/);
  assert.equal(comments.validate("/* Focus outlines */\nbutton{}", ".css"), 1);
  assert.throws(() => comments.validate("button{/* Focus outlines */}", ".css"), /Comment policy/);
  assert.equal(comments.validate("# Model helpers\ncolor = '#ff2233'", ".py"), 1);
  assert.throws(() => comments.validate("color = '#ff2233' # Inline annotation", ".py"), /Comment policy/);
});

test("source policy validates comments and JavaScript syntax", () => {
  const checker = fs.readFileSync(path.join(root, "scripts", "source-check.js"), "utf8");
  assert.match(checker, /CommentPolicy\.validate/);
  assert.match(checker, /sourceRoots/);
  assert.match(checker, /spawnSync/);
});

test("enemy paths labels remain compatible with existing behavior keys", () => {
  for (const id of ["play-marker-behavior", "play-gameplay-behavior"]) {
    assert.match(html, new RegExp(`for="${id}">Enemy Paths`));
    const select = html.match(new RegExp(`<select id="${id}"[^>]*>([\\s\\S]*?)<\\/select>`));
    assert.ok(select);
    for (const value of ["patrol", "chase", "guard", "wander", "sentry"]) assert.match(select[1], new RegExp(`value="${value}"`));
  }
  assert.match(html, /id="play-marker-paths-help"/);
  assert.match(html, /id="play-gameplay-paths-help"/);
  assert.match(html, /id="play-world-rotate-left"[^>]*aria-label="Rotate voxel view left"/);
  assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
});

test("screen-reader world map help references the matching hidden hint", () => {
  const diagram = fs.readFileSync(path.join(root, "src", "modules", "play-world-diagram.js"), "utf8");
  assert.match(diagram, /play-world-diagram-keyboard-help/);
  assert.match(diagram, /scroller\.setAttribute\('aria-describedby',help\.id\)/);
  assert.match(diagram, /svg\.setAttribute\('role','group'\)/);
});

// Input boundaries
test("mod brush results reject extreme coordinates and control-character colors", () => {
  const payload = { pixels: [["#112233"]], app: { width: 1, height: 1 } };
  assert.throws(() => mod.cleanResult("brush", [{ x: 1e100, y: 0, color: "#112233" }], payload), /paint position/);
  assert.throws(() => mod.cleanResult("brush", [{ x: 1, y: 0, color: "red\n<script>" }], payload), /mod color/);
  assert.deepEqual(mod.cleanResult("brush", [{ x: -500, y: 700, color: "#112233" }], payload), [{ x: -500, y: 700, color: "#112233" }]);
});

test("export preflight bounds nonfinite size estimates and builds text-only details", () => {
  const estimate = preflight.estimate({ width: Number.POSITIVE_INFINITY, height: 1e300, frames: 1e300, scale: 1e300 });
  assert.equal(estimate.width, 1);
  assert.equal(estimate.height, 16384);
  assert.equal(estimate.frames, 1000);
  assert.equal(estimate.scale, 32);
  assert.ok(Number.isSafeInteger(estimate.rawBytes));
  const source = fs.readFileSync(path.join(root, "src", "modules", "export-preflight.js"), "utf8");
  assert.match(source, /details\.replaceChildren\(\.\.\.nodes\)/);
  assert.doesNotMatch(source, /details\.innerHTML/);
});

test("volume rendering preserves the fallback only for non-voxel actors", () => {
  const source = fs.readFileSync(path.join(root, "src", "modules", "play-voxel-world.js"), "utf8");
  assert.match(source, /!sprite\?\.voxelVolume && sprite\?\.canvas/);
  assert.match(source, /else if \(!sprite\?\.voxelVolume\)/);
});
