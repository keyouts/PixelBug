"use strict";

// Release checks
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");

function readSources(folder = root) {
  const source = name => fs.readFileSync(path.join(folder,name), "utf8");
  return { package:JSON.parse(source("package.json")),
    main:source("src/main.js"),preload:source("src/preload.js"),
    html:source("src/index.html"), session:source("src/modules/play-session-state.js"),
    controls:source("src/modules/play-session-controls.js"),
    editor:source("src/modules/play-editor-session.js"),
    sessionControls:source("src/modules/play-session-controls.js"),
    renderer:source("src/renderer.js"),
    voxelSchema:source("src/modules/renderer/voxel-model-schema.js"),
    ruleEditor:source("src/modules/node-editor.js"),
    assets:["assets/icon.ico","assets/icon.png"].every(file=>fs.existsSync(path.join(folder,file))) };
}

function inspect(inputs) {
  const pkg = inputs.package;
  const build = pkg.build || {};
  const prefs = inputs.main;
  const html = inputs.html;
  const checks = [
    ["Main process isolation", /contextIsolation:\s*true/.test(prefs) && /nodeIntegration:\s*false/.test(prefs) && /sandbox:\s*true/.test(prefs) && /webSecurity:\s*true/.test(prefs)],
    ["Main process navigation", /setWindowOpenHandler\(\(\) => \(\{ action: "deny" \}\)\)/.test(prefs) && /will-navigate/.test(prefs) && /isTrustedSender\(event\)/.test(prefs)],
    ["Renderer content policy", /script-src 'self'/.test(html) && /style-src 'self'/.test(html) && /connect-src 'none'/.test(html) && /object-src 'none'/.test(html)],
    ["Bridge isolation", /contextBridge\.exposeInMainWorld\("pixelBug", api\)/.test(inputs.preload) && !/exposeInMainWorld\([^,]+,\s*ipcRenderer\)/.test(inputs.preload)],
    ["Session input bounds", /MAX_SAVE_BYTES\s*=\s*262144/.test(inputs.session) && /MAX_TAPE_BYTES\s*=\s*8388608/.test(inputs.session) && /DENIED = new Set/.test(inputs.session)],
    ["Replay scene checks", /function snapshot\(value, sceneModes = null\)/.test(inputs.session) && /Saved scene type does not match/.test(inputs.session)],
    ["Editor integration", /modules\/play-editor-session\.js/.test(html) && html.indexOf("play-editor-session.js") < html.indexOf("renderer.js") && /restore\(input, replay = false\)/.test(inputs.editor)],
    ["Accessible controls", /role="status" aria-live="polite"/.test(inputs.controls) && /aria-pressed/.test(inputs.controls) && /session-visually-hidden/.test(inputs.controls)],
    ["Rule continuations", /captureSession, restoreSession, resumeDialogue/.test(inputs.ruleEditor) && /ruleQueue\.restore/.test(inputs.ruleEditor)],
    ["Package sandboxing", build.asar === true && build.electronFuses?.runAsNode === false && build.electronFuses?.onlyLoadAppFromAsar === true],
    ["Package resources", inputs.assets && build.win?.target === "nsis" && Boolean(build.win?.icon)],
    ["Native smoke available", pkg.scripts?.["test:smoke"] === "electron test/electron-smoke.js"],
    ["Voxel schema isolation", /modules\/renderer\/voxel-model-schema\.js/.test(html) && html.indexOf("voxel-model-schema.js") < html.indexOf('<script src="./renderer.js"></script>') && /PixelBugVoxelModelSchema\.create/.test(inputs.renderer) && /function normalizeVoxelModel/.test(inputs.voxelSchema) && inputs.renderer.split("\n").length < 20000],
    ["Stable editor game identity", /projectId:\(\)=>ensureProjectId\(state\)/.test(inputs.renderer) && /editor:\$\{projectId\}/.test(inputs.editor)],
    ["Legacy save consent", /legacyGameId:legacyGameId\(\)/.test(inputs.editor) && /function allowLegacy\(\)/.test(inputs.sessionControls) && /window.confirm\(/.test(inputs.sessionControls) && /legacy-load/.test(inputs.sessionControls)]
  ];
  return { checks:checks.map(([name,pass])=>({name,pass:Boolean(pass)})),
    blockers:["Packaged Windows installer smoke and signing not verified",
      "Power-interruption and real disk-full recovery not tested; simulated rollback passes",
      "Independent security and accessibility review pending",
      "Dependency advisory feed unavailable in the offline build environment"] };
}

function main() {
  const report=inspect(readSources());
  for(const item of report.checks) process.stdout.write(`${item.pass ? "PASS" : "FAIL"} ${item.name}\n`);
  for(const item of report.blockers)process.stdout.write(`PENDING ${item}\n`);
  const passed=report.checks.filter(item=>item.pass).length;
  process.stdout.write(`Candidate checks: ${passed}/${report.checks.length}\n`);
  if(passed !== report.checks.length)process.exitCode=1;
  if(process.argv.includes("--production")){
    process.stderr.write("Production sign-off requires separate packaged-app and manual release evidence.\n");
    process.exitCode=1;
  }
}

if(require.main===module)main();
module.exports={readSources,inspect};
