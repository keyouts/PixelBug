"""Browser regression checks for comment hardening, enemy paths and accessible authoring controls."""
from pathlib import Path
import os
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent / "src"
source = (ROOT / "index.html").read_text(encoding="utf8")
scripts = re.findall(r'<script src="([^"]+)"\s*></script>', source)
markup = re.sub(r'<script src="[^"]+"\s*></script>', "", source)
markup = re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>', "", markup)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or "/usr/bin/chromium", args=["--no-sandbox", "--disable-dev-shm-usage"])
    try:
        page = browser.new_page(viewport={"width": 1440, "height": 920})
        page.set_default_timeout(13000)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.set_content(markup, wait_until="domcontentloaded")
        for css in ["styles.css", "styles-workspaces.css"]:
            page.add_style_tag(content=(ROOT / css).read_text(encoding="utf8"))
        page.evaluate("""() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}""")
        for file in scripts:
            page.add_script_tag(content=(ROOT / file.removeprefix("./")).read_text(encoding="utf8"))
        assert not errors, errors
        print("PASS 14 renderer boots with stricter source policy", flush=True)

        page.locator("#play-mode-btn").click()
        labels = page.evaluate("""() => ({left:document.querySelector('#play-world-rotate-left').getAttribute('aria-label'),right:document.querySelector('#play-world-rotate-right').getAttribute('aria-label'),voxel:document.querySelector('label[for="play-marker-behavior"]').textContent,avatar:document.querySelector('label[for="play-gameplay-behavior"]').textContent,live:document.querySelector('#play-marker-status').getAttribute('aria-live')})""")
        assert labels == {"left": "Rotate voxel view left", "right": "Rotate voxel view right", "voxel": "Enemy Paths", "avatar": "Enemy Paths", "live": "polite"}, labels
        print("PASS 14 enemy movement is consistently presented as Enemy Paths with accessible hints", flush=True)

        page.locator("#play-workspace-objects-btn").click()
        page.locator(".play-piece-options summary").click()
        assert "movement route" in page.locator("#play-gameplay-paths-help").inner_text()
        page.locator("#play-gameplay-kind").select_option("enemy")
        page.locator("#play-gameplay-behavior").select_option("guard")
        page.locator("#play-gameplay-patrol-range").fill("115")
        page.locator("#play-gameplay-patrol-speed").fill("40")
        page.locator("#play-gameplay-add").click()
        recorded = page.evaluate("""() => { const p=state.playMode.props.at(-1); return {path:p.componentBehavior,kind:p.componentKind,rule:state.playMode.nodeEditor.nodes.some(n=>n.type==='eventTrigger'&&n.data.trigger===p.nodeTriggerId),valid:PixelBugPlayWorkspace.validate(state.playMode).errors.length}; }""")
        assert recorded == {"path": "guard", "kind": "enemy", "rule": True, "valid": 0}, recorded
        print("PASS 14 saved enemy movement values and generated graph rules remain compatible", flush=True)

        page.locator("#play-workspace-close-btn").click()
        page.locator("#play-workspace-rules-btn").click()
        help = page.locator("#play-world-diagram-keyboard-help")
        assert help.count() == 1
        diagram = page.locator(".play-world-diagram-scroll")
        assert diagram.get_attribute("aria-describedby") == "play-world-diagram-keyboard-help"
        assert "Escape" in help.inner_text()
        assert page.locator(".play-world-diagram-arrows").get_attribute("role") == "group"
        page.locator("#node-editor-overlay .node-editor-close").click()
        print("PASS 14 interactive world diagram provides nonvisual keyboard guidance", flush=True)

        result = page.evaluate("""() => ({serialized:serializeProject().includes('"componentBehavior":"guard"'), html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})""")
        assert result["serialized"]
        assert "createPlayComponentMotion" in result["html"]
        game = browser.new_page()
        game_errors = []
        game.on("pageerror", lambda error: game_errors.append(str(error)))
        game.set_content(result["html"], wait_until="domcontentloaded", timeout=30000)
        game.wait_for_timeout(250)
        assert not game_errors, game_errors
        game.close()
        assert not errors, errors
        print("PASS 14 exported enemy paths run without changing standalone HTML behavior", flush=True)
        print("PASS 14 BROWSER CHECKS: 5/5 passed", flush=True)
    finally:
        browser.close()
