"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const sourceRoots = ["src", "scripts"];
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

const jsFiles = sourceRoots.flatMap(folder => walk(path.join(root, folder))).filter(filePath => filePath.endsWith(".js"));
for (const filePath of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", filePath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${relative(filePath)}: ${result.stderr || result.stdout}`);
  const source = fs.readFileSync(filePath, "utf8");
  source.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("// ")) return;
    const words = trimmed.slice(3).trim().split(/\s+/).filter(Boolean);
    if (words.length !== 2) throw new Error(`Comment policy failed for ${relative(filePath)}:${index + 1}`);
  });
}


process.stdout.write(`Source check passed for ${jsFiles.length} JavaScript files.\n`);
