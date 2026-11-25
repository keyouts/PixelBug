"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const CommentPolicy = require("./comment-policy");

const root = path.join(__dirname, "..");
const sourceRoots = ["src", "scripts", "integrations"];
const scanRoots = ["src", "scripts", "integrations", "test", "examples"];
const codeExtensions = new Set([".js", ".css", ".html", ".py"]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll("\\", "/");
}

const sourceFiles = sourceRoots.flatMap(folder => walk(path.join(root, folder)));
const jsFiles = sourceFiles.filter(filePath => filePath.endsWith(".js"));
for (const filePath of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", filePath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${relative(filePath)}: ${result.stderr || result.stdout}`);
}
for (const filePath of scanRoots.flatMap(folder => walk(path.join(root, folder))).filter(filePath => codeExtensions.has(path.extname(filePath).toLowerCase()))) CommentPolicy.validate(fs.readFileSync(filePath, "utf8"), path.extname(filePath).toLowerCase(), relative(filePath));

process.stdout.write(`Source check passed for ${jsFiles.length} JavaScript files.\n`);
