"use strict";

const fs = require("node:fs/promises");
const { constants } = require("node:fs");

async function readBoundedText(filePath, maxBytes) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error("Invalid file size limit");
  const handle = await fs.open(filePath, constants.O_RDONLY | (constants.O_NONBLOCK || 0));
  try {
    const stats = await handle.stat();
    if (!stats.isFile() || stats.size > maxBytes) throw new Error("Selected file is too large or not a regular file");
    const chunks = [];
    let total = 0;
    while (true) {
      const chunk = Buffer.allocUnsafe(Math.min(65536, maxBytes - total + 1));
      const { bytesRead } = await handle.read(chunk, 0, chunk.length, null);
      if (!bytesRead) break;
      total += bytesRead;
      if (total > maxBytes) throw new Error("Selected file is too large");
      chunks.push(chunk.subarray(0, bytesRead));
    }
    return Buffer.concat(chunks, total).toString("utf8");
  } finally {
    await handle.close();
  }
}

module.exports = Object.freeze({ readBoundedText });
