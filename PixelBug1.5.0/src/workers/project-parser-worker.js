"use strict";

importScripts("../modules/project-guard.js");

self.onmessage = event => {
  try {
    const project = self.PixelBugProjectGuard.parse(event.data?.text);
    self.postMessage({ ok: true, project });
  } catch (error) {
    self.postMessage({ ok: false, error: String(error?.message || error).slice(0, 500) });
  }
};
