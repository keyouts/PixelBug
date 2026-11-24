const path = require("node:path");

const APP_FILES = new Set(["index.html", "renderer.js", "styles.css", "styles-workspaces.css", "theme.js"]);
const MOD_FILES = new Set(["runner.html", "mod-runner.js"]);
const APP_PREFIXES = ["modules/", "workers/"];

function cleanRelativePath(url) {
  let value;
  try {
    value = decodeURIComponent(url.pathname || "/");
  } catch (_error) {
    throw new Error("Invalid application path");
  }
  value = value.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!value || value.includes("\0") || value.split("/").some(part => !part || part === "." || part === "..")) throw new Error("Invalid application path");
  return value;
}

function isAllowedResource(host, relativePath) {
  if (host === "app") return APP_FILES.has(relativePath) || (relativePath.endsWith(".js") && APP_PREFIXES.some(prefix => relativePath.startsWith(prefix)));
  return host === "mod" && MOD_FILES.has(relativePath);
}

function targetPath(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(resolvedRoot, relativePath);
  if (resolvedTarget === resolvedRoot || !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) throw new Error("Invalid application path");
  return resolvedTarget;
}

module.exports = { cleanRelativePath, isAllowedResource, targetPath };
