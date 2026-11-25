const crypto = require("crypto");
const fs = require("fs/promises");
const { constants } = require("node:fs");
const path = require("path");
let transactionQueue = Promise.resolve();

function pathIdentity(filePath) {
  const resolved = path.resolve(filePath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function siblingPath(filePath, label) {
  const token = crypto.randomBytes(12).toString("hex");
  return path.join(path.dirname(filePath), `.${path.basename(filePath)}.${label}-${process.pid}-${token}`);
}

async function existingTarget(filePath) {
  try {
    const stats = await fs.lstat(filePath);
    if (!stats.isFile() && !stats.isSymbolicLink()) throw new Error("Save target must be a file");
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function syncDirectory(directory) {
  let handle;
  try {
    handle = await fs.open(directory, "r");
    await handle.sync();
  } catch (_error) {
  } finally {
    await handle?.close().catch(() => {});
  }
}

async function removeQuietly(filePath) {
  try {
    await fs.rm(filePath, { force: true });
  } catch (_error) {}
}

async function stageFile(filePath, payload) {
  const handle = await fs.open(filePath, "wx", 0o600);
  try {
    await handle.writeFile(payload);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function performTransaction(entries) {
  if (!Array.isArray(entries) || !entries.length) throw new Error("No files to save");
  const identities = new Set();
  const staged = entries.map(entry => {
    const rawTarget = String(entry?.filePath || "");
    if (!rawTarget.trim()) throw new Error("Invalid save path");
    const target = path.resolve(rawTarget);
    const identity = pathIdentity(target);
    if (identities.has(identity)) throw new Error("Save files must use unique names");
    identities.add(identity);
    return { target, payload: entry.payload, requireAbsent: entry.requireAbsent === true, temp: siblingPath(target, "pending"), backup: siblingPath(target, "backup"), hadTarget: false, installed: false };
  });

  try {
    for (const item of staged) {
      item.hadTarget = await existingTarget(item.target);
      if (item.requireAbsent && item.hadTarget) throw new Error("Companion file already exists");
    }
    for (const item of staged) await stageFile(item.temp, item.payload);
    for (const item of staged) {
      if (item.hadTarget) await fs.rename(item.target, item.backup);
    }
    for (const item of staged) {
      if (item.requireAbsent) {
        try {
          await fs.link(item.temp, item.target);
        } catch (error) {
          if (!["ENOTSUP", "EOPNOTSUPP", "EPERM", "ENOSYS"].includes(error.code)) throw error;
          await fs.copyFile(item.temp, item.target, constants.COPYFILE_EXCL);
        }
        item.installed = true;
        await fs.unlink(item.temp);
      } else {
        await fs.rename(item.temp, item.target);
        item.installed = true;
      }
    }
    await Promise.all(staged.map(item => item.hadTarget ? removeQuietly(item.backup) : Promise.resolve()));
    await Promise.all([...new Set(staged.map(item => path.dirname(item.target)))].map(syncDirectory));
  } catch (error) {
    for (const item of [...staged].reverse()) {
      if (item.installed) await removeQuietly(item.target);
      if (item.hadTarget && await existingTarget(item.backup)) {
        try { await fs.rename(item.backup, item.target); } catch (_restoreError) {}
      }
      await removeQuietly(item.temp);
    }
    throw error;
  }
}

function writeFilesTransaction(entries) {
  const next = transactionQueue.then(() => performTransaction(entries));
  transactionQueue = next.catch(() => {});
  return next;
}

async function writeFileAtomic(filePath, payload) {
  await writeFilesTransaction([{ filePath, payload }]);
}

module.exports = { pathIdentity, writeFileAtomic, writeFilesTransaction };
