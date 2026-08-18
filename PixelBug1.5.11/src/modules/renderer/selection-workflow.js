(() => {
  "use strict";

  function drawOverlay(options = {}) {
    const { context, box, mask, cell, strokeStyle, fillStyle, EditorFeatures } = options;
    if (!context || !box || !EditorFeatures || !Number.isFinite(cell)) return;
    context.save();
    context.strokeStyle = strokeStyle;
    context.lineWidth = Math.max(1, Math.min(2, cell));
    context.setLineDash(cell >= 4 ? [6, 4] : []);
    context.fillStyle = fillStyle;
    if (mask instanceof Set && mask.size) {
      EditorFeatures.maskRuns(mask).forEach(run => context.fillRect(run.x * cell, run.y * cell, run.w * cell, cell));
      context.beginPath();
      EditorFeatures.forEachMaskPoint(mask, (x, y) => {
        if (!EditorFeatures.maskHas(mask, x - 1, y)) { context.moveTo(x * cell, y * cell); context.lineTo(x * cell, (y + 1) * cell); }
        if (!EditorFeatures.maskHas(mask, x + 1, y)) { context.moveTo((x + 1) * cell, y * cell); context.lineTo((x + 1) * cell, (y + 1) * cell); }
        if (!EditorFeatures.maskHas(mask, x, y - 1)) { context.moveTo(x * cell, y * cell); context.lineTo((x + 1) * cell, y * cell); }
        if (!EditorFeatures.maskHas(mask, x, y + 1)) { context.moveTo(x * cell, (y + 1) * cell); context.lineTo((x + 1) * cell, (y + 1) * cell); }
      });
      context.stroke();
    } else {
      const x = box.x * cell;
      const y = box.y * cell;
      const width = box.w * cell;
      const height = box.h * cell;
      context.strokeRect(Math.round(x) + 1, Math.round(y) + 1, Math.max(1, Math.round(width) - 2), Math.max(1, Math.round(height) - 2));
      context.fillRect(x, y, width, height);
    }
    context.restore();
  }

  function shiftMask(mask, dx, dy, width, height, EditorFeatures) {
    const shifted = EditorFeatures.createMask(width, height);
    EditorFeatures.forEachMaskPoint(mask, (x, y) => shifted.addPoint(x + dx, y + dy));
    return shifted;
  }

  function clearPixels(mask, pixels, EditorFeatures, setPixel) {
    let changed = 0;
    EditorFeatures.forEachMaskPoint(mask, (x, y) => {
      if (!pixels?.[y]?.[x]) return;
      setPixel(x, y, null, pixels);
      changed++;
    });
    return changed;
  }

  const api = { clearPixels, drawOverlay, shiftMask };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.PixelBugSelectionWorkflow = api;
})();
