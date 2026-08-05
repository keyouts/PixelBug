(() => {
  function positive(value, fallback = 1) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function whole(value, fallback = 1) {
    return Math.max(1, Math.floor(positive(value, fallback)));
  }

  function calculate(options = {}) {
    const projectWidth = whole(options.projectWidth);
    const projectHeight = whole(options.projectHeight);
    const availableWidth = whole(options.availableWidth);
    const availableHeight = whole(options.availableHeight);
    const maxDisplay = whole(options.maxDisplay, 1024);
    const ratio = Math.min(
      maxDisplay / projectWidth,
      maxDisplay / projectHeight,
      availableWidth / projectWidth,
      availableHeight / projectHeight
    );
    const pixelScale = Math.max(1, Math.floor(ratio));
    const displayWidth = projectWidth * pixelScale;
    const displayHeight = projectHeight * pixelScale;
    const overflowX = displayWidth > availableWidth;
    const overflowY = displayHeight > availableHeight;
    return Object.freeze({
      availableHeight,
      availableWidth,
      displayHeight,
      displayWidth,
      overflow: overflowX || overflowY,
      overflowX,
      overflowY,
      pixelScale,
      projectHeight,
      projectWidth
    });
  }

  const api = Object.freeze({ calculate });
  if (typeof globalThis !== "undefined") globalThis.PixelBugCanvasFit = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
