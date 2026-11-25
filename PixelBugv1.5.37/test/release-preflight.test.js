"use strict";

// Release checks
const test = require("node:test");
const assert = require("node:assert/strict");
const release = require("../scripts/release-preflight.js");

test("candidate settings satisfy the local release preflight",()=>{
  const report=release.inspect(release.readSources());
  assert.equal(report.checks.length,15);
  assert.equal(report.checks.filter(item=>item.pass).length,15,JSON.stringify(report.checks.filter(item=>!item.pass)));
  assert.ok(report.blockers.length>=3);
});

test("missing main-process sandbox blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,main:source.main.replace("sandbox: true","sandbox: false")});
  assert.equal(report.checks.find(check=>check.name==="Main process isolation").pass,false);
});

test("unsafe renderer content policy blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,html:source.html.replace("script-src 'self'","script-src 'unsafe-inline'")});
  assert.equal(report.checks.find(check=>check.name==="Renderer content policy").pass,false);
});

test("removing packaged-app hardening blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,package:{...source.package,build:{...source.package.build,asar:false}}});
  assert.equal(report.checks.find(check=>check.name==="Package sandboxing").pass,false);
});

test("schema extraction missing from renderer boot blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,html:source.html.replace('<script src="./modules/renderer/voxel-model-schema.js"></script>','')});
  assert.equal(report.checks.find(check=>check.name==="Voxel schema isolation").pass,false);
});

test("omitting persistent project IDs blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,editor:source.editor.replace('`editor:${projectId}`','projectId')});
  assert.equal(report.checks.find(check=>check.name==="Stable editor game identity").pass,false);
});

test("removing legacy confirmation blocks candidate checks",()=>{
  const source=release.readSources();
  const report=release.inspect({...source,sessionControls:source.sessionControls.replace('window.confirm(', 'window.prompt(')});
  assert.equal(report.checks.find(check=>check.name==="Legacy save consent").pass,false);
});
