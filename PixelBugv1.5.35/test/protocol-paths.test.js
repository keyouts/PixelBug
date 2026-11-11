"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { cleanRelativePath, isAllowedResource, targetPath } = require("../src/main/protocol-paths");

test("application resources are allowlisted by host and type", () => {
  assert.equal(isAllowedResource("app", "index.html"), true);
  assert.equal(isAllowedResource("app", "modules/accessibility-labels.js"), true);
  assert.equal(isAllowedResource("app", "workers/project-parser-worker.js"), true);
  assert.equal(isAllowedResource("app", "modules/private.json"), false);
  assert.equal(isAllowedResource("mod", "mod-runner.js"), true);
  assert.equal(isAllowedResource("mod", "modules/project-guard.js"), false);
  assert.equal(isAllowedResource("other", "index.html"), false);
});

test("protocol resource paths reject traversal and non-files", () => {
  assert.equal(cleanRelativePath(new URL("pixelbug://app/modules/editor-features.js")), "modules/editor-features.js");
  for (const pathname of ["/../index.html", "/modules/%2e%2e/index.html", "/modules//accessibility-labels.js", "/", "/modules/%00x.js", "/modules/%5c..%5cindex.html"]) {
    assert.throws(() => cleanRelativePath({ pathname }), /Invalid application path/);
  }
  const root = path.resolve("/tmp/pixel-bug-test-protocol");
  assert.equal(targetPath(root, "modules/test.js"), path.join(root, "modules", "test.js"));
  assert.throws(() => targetPath(root, "../secret"), /Invalid application path/);
  assert.throws(() => targetPath(root, "."), /Invalid application path/);
});
