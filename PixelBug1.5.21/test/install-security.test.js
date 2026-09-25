const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const InstallGuard = require("../scripts/install-guard");

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const compromised = new Set([
  "keyv@6.0.0",
  "flat-cache@6.1.24",
  "file-entry-cache@11.1.6",
  "cacheable-request@13.0.20",
  "@cacheable/utils@2.5.1",
  "cacheable@2.5.1",
  "@cacheable/memory@2.2.1",
  "cache-manager@7.2.10",
  "@cacheable/node-cache@3.1.2",
  "ecto@5.0.1",
  "@cacheable/net@2.1.1"
]);

function packageName(packagePath) {
  let name = packagePath.slice("node_modules/".length);
  const nested = name.lastIndexOf("/node_modules/");
  if (nested >= 0) name = name.slice(nested + "/node_modules/".length);
  return name;
}

test("install guard validates the locked dependency graph", () => {
  const result = InstallGuard.verify(root);
  assert.deepEqual(result.installScripts, ["electron-winstaller@5.4.0"]);
  assert.deepEqual(result.missingIntegrity, ["electron@42.9.1"]);
  assert.equal(manifest.scripts.preinstall, "node scripts/install-guard.js");
  assert.equal(manifest.scripts["check:install"], "node scripts/install-guard.js");
});


test("install guard accepts safe lockfile normalization", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "pixel-bug-install-"));
  try {
    fs.writeFileSync(path.join(temporaryRoot, "package.json"), JSON.stringify(manifest));
    const normalizedLock = structuredClone(lock);
    normalizedLock.packages["node_modules/electron"].integrity = "sha512-normalized";
    delete normalizedLock.packages["node_modules/electron-winstaller"].hasInstallScript;
    fs.writeFileSync(path.join(temporaryRoot, "package-lock.json"), JSON.stringify(normalizedLock));
    const result = InstallGuard.verify(temporaryRoot);
    assert.deepEqual(result.installScripts, []);
    assert.deepEqual(result.missingIntegrity, []);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test("dependency manifest stays pinned and development only", () => {
  assert.deepEqual(manifest.dependencies || {}, {});
  for (const version of Object.values(manifest.devDependencies || {})) {
    assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  }
  assert.deepEqual(lock.packages[""].devDependencies, manifest.devDependencies);
  assert.deepEqual(manifest.overrides, { "@xmldom/xmldom": "0.8.15" });
  assert.equal(lock.packages["node_modules/@xmldom/xmldom"].version, "0.8.15");
});

test("lockfile uses trusted registry artifacts", () => {
  assert.equal(lock.lockfileVersion, 3);
  const missingIntegrity = [];
  for (const [packagePath, record] of Object.entries(lock.packages || {})) {
    if (!packagePath.startsWith("node_modules/") || !record.version) continue;
    assert.match(record.resolved || "", /^https:\/\/registry\.npmjs\.org\//);
    if (!record.integrity) missingIntegrity.push(`${packageName(packagePath)}@${record.version}`);
  }
  assert.deepEqual(missingIntegrity, ["electron@42.9.1"]);
});

test("install scripts and compromised releases stay blocked", () => {
  const scriptPackages = [];
  for (const [packagePath, record] of Object.entries(lock.packages || {})) {
    if (!packagePath.startsWith("node_modules/") || !record.version) continue;
    const identifier = `${packageName(packagePath)}@${record.version}`;
    assert.equal(compromised.has(identifier), false, `${identifier} is a blocked release`);
    if (record.hasInstallScript) scriptPackages.push(identifier);
  }
  assert.deepEqual(scriptPackages, ["electron-winstaller@5.4.0"]);
});

test("fs-extra 11.3.6 uses the published registry integrity", () => {
  const expected = "sha512-w8ZNZr2mKIc7qeNaQ9AVPT1+iFaI+Avd4xudVOvdDJ8VytREi1Ft5Ih7hd9jjehod8vAM5GMsfQ/TpPf4EyoEA==";
  const records = Object.entries(lock.packages || {})
    .filter(([packagePath, record]) => packagePath.endsWith("/node_modules/fs-extra") && record?.version === "11.3.6");
  assert.equal(records.length, 2);
  for (const [packagePath, record] of records) {
    assert.equal(record.integrity, expected, `${packagePath} has an unexpected fs-extra integrity value`);
  }
});

test("windows release build is an installable NSIS package with application shortcut", () => {
  assert.equal(manifest.scripts.build, "electron-builder --win nsis");
  assert.equal(manifest.scripts.dist, "electron-builder --win nsis");
  assert.equal(manifest.build.win.target, "nsis");
  assert.equal(manifest.build.win.icon, "assets/icon.ico");
  assert.equal(manifest.build.win.artifactName, "Pixel-Bug-Setup-${version}.${ext}");
  assert.equal(manifest.build.nsis.createDesktopShortcut, "always");
  assert.equal(manifest.build.nsis.createStartMenuShortcut, true);
  assert.equal(manifest.build.nsis.shortcutName, "Pixel Bug");
  assert.equal(manifest.build.nsis.oneClick, true);
  assert.equal(manifest.build.nsis.runAfterFinish, true);
  assert.equal(manifest.build.nsis.installerIcon, "icon.ico");
  assert.equal(manifest.build.nsis.uninstallerIcon, "icon.ico");
  assert.equal(manifest.build.nsis.installerHeaderIcon, "icon.ico");
  assert.equal(fs.existsSync(path.join(root, "assets", "icon.ico")), true);
});

test("packaged application excludes development dependencies", () => {
  assert.equal(manifest.build.asar, true);
  assert.deepEqual(manifest.build.files, ["src/**/*", "assets/**/*", "package.json", "integrations/**/*"]);
  assert.equal(manifest.build.files.some(pattern => /node_modules|test|dist/.test(pattern)), false);
  assert.equal(manifest.build.electronFuses.runAsNode, false);
  assert.equal(manifest.build.electronFuses.enableNodeOptionsEnvironmentVariable, false);
  assert.equal(manifest.build.electronFuses.enableNodeCliInspectArguments, false);
  assert.equal(manifest.build.electronFuses.enableEmbeddedAsarIntegrityValidation, true);
  assert.equal(manifest.build.electronFuses.onlyLoadAppFromAsar, true);
});
