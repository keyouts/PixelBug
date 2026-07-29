const fs = require("fs/promises");
const path = require("path");
const { writeFileAtomic } = require("./file-transactions");

const MAX_RECOVERY_BYTES = 16 * 1024 * 1024;
let recoveryQueue = Promise.resolve();

function recoveryPath(app) {
  return path.join(app.getPath("userData"), "recovery", "project.json");
}

function enqueue(task) {
  const next = recoveryQueue.then(task, task);
  recoveryQueue = next.catch(() => {});
  return next;
}

function saveRecovery(app, payload) {
  if (typeof payload !== "string") return Promise.reject(new Error("Recovery data must be text"));
  if (Buffer.byteLength(payload, "utf8") > MAX_RECOVERY_BYTES) return Promise.reject(new Error("Recovery data is too large"));
  return enqueue(async () => {
    const filePath = recoveryPath(app);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await writeFileAtomic(filePath, payload);
    return true;
  });
}

function loadRecovery(app) {
  return enqueue(async () => {
    const filePath = recoveryPath(app);
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile() || stats.size > MAX_RECOVERY_BYTES) return "";
      return await fs.readFile(filePath, "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") return "";
      throw error;
    }
  });
}

function clearRecovery(app) {
  return enqueue(async () => {
    await fs.rm(recoveryPath(app), { force: true });
    return true;
  });
}

module.exports = { clearRecovery, loadRecovery, saveRecovery };
