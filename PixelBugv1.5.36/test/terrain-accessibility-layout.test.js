"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"../src");
test("terrain drawing surfaces have nonvisual guidance and change announcements",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  assert.match(html,/id="tile-terrain-keyboard-help" class="sr-only"/);
  assert.match(html,/id="tile-terrain-accessibility-status" class="sr-only" aria-live="polite"/);
  assert.match(html,/id="tile-terrain-editor-overlay"[^>]+aria-describedby="tile-terrain-keyboard-help tile-terrain-accessibility-status"/);
  assert.match(html,/id="tile-terrain-paint"[^>]+aria-describedby="tile-terrain-keyboard-help tile-terrain-accessibility-status"/);
  assert.match(html,/id="tile-terrain-3d"[^>]+tabindex="0"[^>]+aria-describedby="tile-terrain-camera-help"/);
  assert.match(html,/id="tile-repeat-toggle"[^>]+aria-describedby="tile-repeat-toggle-help"/);
});
test("terrain launch is moved beyond the upper right canvas edge",()=>{
  const css=fs.readFileSync(path.join(root,"styles-workspaces.css"),"utf8");
  assert.match(css,/\.tile-repeat-launch\s*\{\s*position:\s*absolute;\s*top:\s*-15px;\s*right:\s*-9px;/);
  assert.match(css,/@media \(max-width: 760px\)[\s\S]*?\.tile-repeat-launch\s*\{\s*top:\s*-12px;\s*right:\s*-7px;/);
});
