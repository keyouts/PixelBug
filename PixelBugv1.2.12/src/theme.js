(() => {
  const root = document.documentElement;
  const query = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function applyTheme(theme) {
    root.dataset.theme = theme === "dark" ? "dark" : "light";
  }

  function applyFallback() {
    applyTheme(query && query.matches ? "dark" : "light");
  }

  applyFallback();

  if (query) {
    const onChange = event => applyTheme(event.matches ? "dark" : "light");
    if (query.addEventListener) query.addEventListener("change", onChange);
    else if (query.addListener) query.addListener(onChange);
  }

  if (window.pixelBug && window.pixelBug.getSystemTheme) {
    window.pixelBug.getSystemTheme().then(applyTheme).catch(applyFallback);
  }

  if (window.pixelBug && window.pixelBug.onSystemThemeChanged) {
    window.pixelBug.onSystemThemeChanged(applyTheme);
  }
})();
