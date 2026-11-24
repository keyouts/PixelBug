from pathlib import Path
import os
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent / "src"
html = (ROOT / "index.html").read_text(encoding="utf8")
scripts = re.findall(r'<script src="([^"]+)"\s*></script>', html)
markup = re.sub(r'<script src="[^"]+"\s*></script>', "", html)
markup = re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>', "", markup)
assert len(scripts) > 60

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or None,
                                         args=["--no-sandbox", "--disable-dev-shm-usage"])
    try:
        page = browser.new_page(viewport={"width": 1300, "height": 900})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.set_content(markup, wait_until="domcontentloaded")
        page.evaluate("""() => {
          const data = new Map();
          Object.defineProperty(window, 'localStorage', {configurable:true, value: {
            getItem:k=>data.get(k)||null,
            setItem:(k,v)=>data.set(k,String(v)),
            removeItem:k=>data.delete(k)
          }});
          window.pixelBug = {getSessionRecovery:async()=>null};
        }""")
        for script in scripts:
            source = (ROOT / script.removeprefix("./")).read_text(encoding="utf8")
            page.add_script_tag(content=source)
        page.wait_for_timeout(250)
        assert not errors, errors[:5]
        assert page.locator("#status").inner_text() == "Ready."
        assert page.evaluate("typeof window.PixelBugVoxelModelSchema") == "object"
        print(f"PASS renderer startup with {len(scripts)} ordered modules")
        page.evaluate('document.querySelector("#open-voxel-btn").click()')
        assert page.evaluate('document.querySelector("#voxel-overlay").hidden') is False
        assert not errors, errors[:5]
        print("PASS voxel mode after extracted schema load")
        page.evaluate('document.querySelector("#close-voxel-btn").click()')
        page.evaluate('document.querySelector("#play-mode-btn").click()')
        assert not errors, errors[:5]
        print("PASS switch back to Play Mode without initialization errors")
        print("RENDERER BOOTSTRAP CHECKS: 3/3 passed (in-memory Chromium harness)")
    finally:
        browser.close()
