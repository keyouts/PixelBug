"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { readBoundedText } = require("../src/main/bounded-file");
const { cleanExtraFilename, validateSaveRequest } = require("../src/main/save-request");
const { writeFilesTransaction, writeFileAtomic } = require("../src/main/file-transactions");
const { readRecentProjects, rememberRecentProject } = require("../src/main/recent-projects");
const { listStoredProjects } = require("../src/main/project-store");
const { cleanRelativePath } = require("../src/main/protocol-paths");

async function temporary(run) {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "pixelbug-boundary-"));
  try { await run(folder); } finally { await fs.rm(folder, { recursive: true, force: true }); }
}

test("bounded reads accept exact byte limits and reject oversized or nonregular files", () => temporary(async folder => {
  const file = path.join(folder, "data.txt");
  const text = "a".repeat(65535) + "é";
  await fs.writeFile(file, text);
  assert.equal(await readBoundedText(file, 65537), text);
  await assert.rejects(readBoundedText(file, 65536), /too large/);
  await assert.rejects(readBoundedText(folder, 65537), /regular file|EISDIR/);
  await assert.rejects(readBoundedText(file, 0), /size limit/);
}));

test("companion file names are portable leaf names", () => {
  for (const name of ["", "../other", "a/b", "a\\b", "C:stream", "NUL.txt", "COM1.json", "LPT².png", "CON .txt", "a.", "a ", ".", "..", "a\0b", "a".repeat(121)]) assert.throws(() => cleanExtraFilename(name), /filename/);
  assert.equal(cleanExtraFilename("sprite-sheet.json"), "sprite-sheet.json");
  assert.throws(() => validateSaveRequest({ data: "x", extraFiles: [{ filename: "a.txt", data: "1" }, { filename: "A.txt", data: "2" }] }), /unique names/);
  assert.throws(() => validateSaveRequest({ data: "invalid", encoding: "base64" }), /base64/);
});

test("overlapping saves complete in order and leave no temporary files", () => temporary(async folder => {
  const file = path.join(folder, "data.txt");
  await Promise.all(Array.from({ length: 12 }, (_, i) => writeFileAtomic(file, String(i))));
  assert.equal(await fs.readFile(file, "utf8"), "11");
  assert.deepEqual(await fs.readdir(folder), ["data.txt"]);
}));

test("unapproved companion replacement is rejected without changing primary output", () => temporary(async folder => {
  const primary = path.join(folder, "image.png"), companion = path.join(folder, "image.json");
  await fs.writeFile(companion, "existing");
  await assert.rejects(writeFilesTransaction([{ filePath: primary, payload: "new" }, { filePath: companion, payload: "new", requireAbsent: true }]), /already exists/);
  assert.equal(await fs.readFile(companion, "utf8"), "existing");
  await assert.rejects(fs.stat(primary), { code: "ENOENT" });
  await writeFileAtomic(primary, "later");
  assert.equal(await fs.readFile(primary, "utf8"), "later");
}));

test("concurrent recent project updates retain every entry", () => temporary(async folder => {
  const app = { getPath: () => folder };
  await Promise.all(Array.from({ length: 10 }, (_, i) => rememberRecentProject(app, path.join(folder, `${i}.pxbuild`))));
  const entries = await readRecentProjects(app);
  assert.equal(entries.length, 10);
  assert.equal(new Set(entries.map(entry => entry.filePath)).size, 10);
}));

test("collection names reject inherited object properties", () => {
  for (const name of ["constructor", "__proto__", "toString", "valueOf"]) assert.throws(() => listStoredProjects({}, name), /collection/);
});

test("protocol paths reject ambiguous encoded separators and alternate streams", () => {
  for (const pathname of ["//index.html", "/modules/a%5cb.js", "/modules/a%3astream.js", "/modules/a%20.js", "/modules/a./b.js", "/modules/%ZZ.js"]) assert.throws(() => cleanRelativePath({ pathname }), /Invalid application path/);
});

test("combined export budget is checked before decoding companion data", () => {
  const request = { data: "1234", extraFiles: [{ filename: "a.txt", data: "YWJjZA==", encoding: "base64" }] };
  assert.throws(() => validateSaveRequest(request, 7), /Combined save/);
  assert.equal(validateSaveRequest(request, 8).extras[0].payload.toString(), "abcd");
});

test("privileged messages require a registered editor and its top frame", () => {
  const trust = require("../src/main/ipc-trust");
  const origin = "pixelbug://app/index.html";
  const frame = { url: origin };
  const sender = { id: 1, mainFrame: frame, isDestroyed: () => false };
  const known = new Set([1]);
  assert.equal(trust.isTrustedSender({ sender, senderFrame: frame }, known, origin), true);
  assert.equal(trust.isTrustedSender({ sender, senderFrame: { url: origin } }, known, origin), false);
  assert.equal(trust.isTrustedSender({ sender: { ...sender, id: 2 }, senderFrame: frame }, known, origin), false);
  for (const url of ["pixelbug://mod/runner.html", "pixelbug://app/index.html#section", "pixelbug://app/index.html?unknown=1", "pixelbug://app/index.html?safeRecovery=1&safeRecovery=1", "pixelbug://user@app/index.html", "https://app/index.html"]) assert.equal(trust.isTrustedAppUrl(url, origin), false);
  assert.equal(trust.isTrustedAppUrl(`${origin}?safeRecovery=1`, origin), true);
});

test("new companion files install without leaving staging files", () => temporary(async folder => {
  const first = path.join(folder, "primary.txt"), second = path.join(folder, "companion.txt");
  await writeFilesTransaction([{ filePath: first, payload: "one" }, { filePath: second, payload: "two", requireAbsent: true }]);
  assert.equal(await fs.readFile(first, "utf8"), "one");
  assert.equal(await fs.readFile(second, "utf8"), "two");
  assert.deepEqual((await fs.readdir(folder)).sort(), ["companion.txt", "primary.txt"]);
}));
