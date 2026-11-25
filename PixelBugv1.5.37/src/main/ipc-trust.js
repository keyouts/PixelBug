"use strict";

function isTrustedAppUrl(value, appUrl) {
  try {
    const url = new URL(String(value || ""));
    const expected = new URL(appUrl);
    if (url.protocol !== expected.protocol || url.pathname !== expected.pathname || url.host !== expected.host || url.username || url.password || url.hash) return false;
    const keys = [...url.searchParams.keys()];
    return keys.length <= 1 && keys.every(key => key === "safeRecovery") && (!url.searchParams.has("safeRecovery") || url.searchParams.get("safeRecovery") === "1");
  } catch (_error) {
    return false;
  }
}

function isTrustedSender(event, mainContents, appUrl) {
  const contents = event?.sender;
  const frame = event?.senderFrame;
  return Boolean(contents && !contents.isDestroyed() && mainContents.has(contents.id) && frame && frame === contents.mainFrame && isTrustedAppUrl(frame.url, appUrl));
}

module.exports = Object.freeze({ isTrustedAppUrl, isTrustedSender });
