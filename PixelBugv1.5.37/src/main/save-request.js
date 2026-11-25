"use strict";

const path = require("node:path");
const MAX_SAVE_BYTES = 256 * 1024 * 1024;
const MAX_TOTAL_SAVE_BYTES = MAX_SAVE_BYTES;
const MAX_EXTRA_FILES = 16;
const EXTRA_FILE_NAME_LIMIT = 120;
const SAVE_ENCODINGS = new Set(["utf8", "base64"]);

function isPlainRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cleanExtraFilename(filename) {
  if (typeof filename !== "string" || !filename || filename.length > EXTRA_FILE_NAME_LIMIT || /[<>:"/\\|?*\x00-\x1F\x7F]/.test(filename) || /^[ .]+$|[ .]$/.test(filename) || /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?: *\.| *$)/i.test(filename)) throw new Error("Invalid companion filename");
  return filename;
}

// Payload limits
function cleanEncoding(value) {
  const encoding = value == null ? "utf8" : String(value).toLowerCase();
  if (!SAVE_ENCODINGS.has(encoding)) throw new Error("Unsupported save encoding");
  return encoding;
}

function base64ByteLength(value) {
  const text = String(value || "");
  if (text.length > Math.ceil(MAX_SAVE_BYTES * 4 / 3) + 4) throw new Error("Save payload is too large");
  if (text && (!/^[A-Za-z0-9+/]*={0,2}$/.test(text) || text.length % 4 !== 0 || /=/.test(text.slice(0, -2)))) throw new Error("Invalid base64 payload");
  const padding = text.endsWith("==") ? 2 : text.endsWith("=") ? 1 : 0;
  return Math.max(0, text.length / 4 * 3 - padding);
}

function inspectPayload(data, requestedEncoding) {
  if (typeof data !== "string") throw new Error("Save payload must be text");
  const encoding = cleanEncoding(requestedEncoding);
  const bytes = encoding === "base64" ? base64ByteLength(data) : Buffer.byteLength(data, "utf8");
  if (bytes > MAX_SAVE_BYTES) throw new Error("Save payload is too large");
  return { encoding, bytes, data };
}

function cleanFilters(filters) {
  if (!Array.isArray(filters)) return undefined;
  return filters.slice(0, 12).map(filter => ({
    name: String(filter?.name || "File").slice(0, 80),
    extensions: Array.isArray(filter?.extensions) ? filter.extensions.slice(0, 12).map(ext => String(ext).replace(/[^a-z0-9]/gi, "").slice(0, 16)).filter(Boolean).slice(0, 12) : []
  })).filter(filter => filter.extensions.length);
}

function materializePayload({ encoding, bytes, data }) {
  return { encoding, bytes, payload: encoding === "base64" ? Buffer.from(data, "base64") : data };
}

function validateSaveRequest(options, maxTotalBytes = MAX_TOTAL_SAVE_BYTES) {
  if (!Number.isSafeInteger(maxTotalBytes) || maxTotalBytes < 1 || maxTotalBytes > MAX_TOTAL_SAVE_BYTES) throw new Error("Invalid combined save limit");
  if (!isPlainRecord(options)) throw new Error("Invalid save request");
  const primary = inspectPayload(options.data, options.encoding);
  const sourceExtras = options.extraFiles == null ? [] : options.extraFiles;
  if (!Array.isArray(sourceExtras) || sourceExtras.length > MAX_EXTRA_FILES) throw new Error("Invalid extra file list");
  const extras = sourceExtras.map(extra => {
    if (!isPlainRecord(extra)) throw new Error("Invalid extra file request");
    return { filename: cleanExtraFilename(extra.filename), ...inspectPayload(extra.data, extra.encoding) };
  });
  const identities = new Set(extras.map(extra => extra.filename.toLowerCase()));
  if (identities.size !== extras.length) throw new Error("Companion files must use unique names");
  const totalBytes = extras.reduce((sum, extra) => sum + extra.bytes, primary.bytes);
  if (totalBytes > maxTotalBytes) throw new Error("Combined save payload is too large");
  return {
    title: String(options.title || "Pixel Bug").slice(0, 120),
    defaultPath: options.defaultPath ? path.basename(String(options.defaultPath)).slice(0, 240) : undefined,
    filters: cleanFilters(options.filters),
    primary: materializePayload(primary),
    extras: extras.map(extra => ({ filename: extra.filename, ...materializePayload(extra) }))
  };
}

module.exports = Object.freeze({ MAX_SAVE_BYTES, cleanExtraFilename, validateSaveRequest });
