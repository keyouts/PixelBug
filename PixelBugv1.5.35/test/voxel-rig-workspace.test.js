"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "../src");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles-workspaces.css"), "utf8");
const workspace = fs.readFileSync(path.join(root, "modules/voxel-workspaces.js"), "utf8");

// Workspace grouping
test("rigging and parts use one workspace with both original editors", () => {
  assert.match(html, /data-voxel-workspace-open="rigging"[^>]*>Rigging &amp; Parts<\/button>/);
  assert.doesNotMatch(html, /data-voxel-workspace-open="parts"/);
  assert.match(html, /data-voxel-workspace-source="parts"/);
  assert.match(html, /data-voxel-workspace-source="rigging"/);
  assert.match(workspace, /name === "rigging" \? \[source, sourceByName\.get\("parts"\)\]\.filter\(Boolean\)/);
  assert.match(workspace, /parkNodes\(nextSources, controlsHost\)/);
  assert.match(workspace, /restoreNodes\(activeSources\)/);
  assert.match(html, /id="voxel-mode-part-list"/);
  assert.match(html, /id="voxel-mode-bone-list"/);
  assert.match(html, /id="voxel-mode-weight-paint-btn"/);
});

// Library placement
test("rig pose library and frame capture live in rigging, not animation", () => {
  const rig = html.slice(html.indexOf('data-voxel-workspace-source="rigging"'), html.indexOf('data-voxel-workspace-source="animation"'));
  const animation = html.slice(html.indexOf('data-voxel-workspace-source="animation"'), html.indexOf('id="voxel-tool-workspace-overlay"'));
  assert.match(rig, /class="voxel-pose-library"/);
  assert.match(rig, /id="voxel-mode-pose-save-btn"/);
  assert.match(rig, /id="voxel-base-capture-btn"/);
  assert.match(rig, /id="voxel-base-capture-action"/);
  assert.doesNotMatch(animation, /id="voxel-mode-pose-name"/);
  assert.doesNotMatch(animation, /id="voxel-base-capture-btn"/);
  for (const id of ["voxel-mode-pose-name", "voxel-mode-pose-select", "voxel-base-capture-btn"]) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1);
  }
});

// Viewport flow
test("rigging workspace scrolls with natural heights and an upper viewport", () => {
  assert.match(css, /data-active-workspace="rigging"\] \.voxel-workspace-body\s*\{[^}]*flex-direction: column;[^}]*overflow-y: auto;/);
  assert.match(css, /data-active-workspace="rigging"\] #voxel-workspace-preview-host \.voxel-mode-stage\s*\{[^}]*order: -1;[^}]*max-height: none;/);
  assert.match(css, /data-active-workspace="rigging"\] \.voxel-workspace-controls\s*\{[^}]*height: max-content;[^}]*flex: 0 0 auto;/);
  assert.match(css, /data-active-workspace="rigging"\] \.voxel-workspace-controls\s*\{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
});

// Field containment
test("pose fields are bounded and screen readers get pose guidance", () => {
  assert.match(css, /\.voxel-rigging-workspace-card \.voxel-pose-library\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\);[^}]*max-width: 100%;/);
  assert.match(css, /\.voxel-rigging-workspace-card \.voxel-pose-library > input,[\s\S]*?min-width: 0;[\s\S]*?width: 100%;/);
  assert.match(html, /id="voxel-mode-pose-name" aria-describedby="voxel-rig-pose-help"/);
  assert.match(html, /id="voxel-mode-pose-select" aria-describedby="voxel-rig-pose-help"/);
  assert.match(html, /class="sr-only" id="voxel-rig-pose-help"/);
});
