"""Play Mode focus layout, disclosure, and shared viewport regression checks."""
from pathlib import Path
import os
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent / 'src'
source = (ROOT / 'index.html').read_text(encoding='utf8')
scripts = re.findall(r'<script src="([^"]+)"\s*></script>', source)
markup = re.sub(r'<script src="[^"]+"\s*></script>', '', source)
markup = re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>', '', markup)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or '/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
    try:
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.set_default_timeout(10000)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.set_content(markup, wait_until='domcontentloaded')
        for css in ['styles.css', 'styles-workspaces.css']:
            page.add_style_tag(content=(ROOT / css).read_text(encoding='utf8'))
        page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
        for script in scripts:
            page.add_script_tag(content=(ROOT / script.removeprefix('./')).read_text(encoding='utf8'))
        page.locator('#play-mode-btn').click()
        canvas = page.locator('#play-canvas')
        page.evaluate('window.originalPlayCanvas = document.getElementById("play-canvas")')
        assert canvas.is_visible() and page.locator('#play-run-btn').is_visible()
        assert not page.locator('.play-runtime-grid').is_visible()
        assert not page.locator('#play-validate-btn').is_visible()
        page.locator('#play-extra-tools summary').click()
        assert page.locator('#play-validate-btn').is_visible() and page.locator('#open-audio-studio-btn').is_visible()
        page.locator('#play-extra-tools summary').click()
        page.locator('#play-runtime-details summary').click()
        assert page.locator('.play-runtime-grid').is_visible()
        page.locator('#play-runtime-details summary').click()
        print('PASS compact default screen and accessible secondary tools', flush=True)

        page.locator('#play-workspace-player-btn').click()
        assert page.locator('#play-workspace-controls #play-actor-frames').is_visible()
        assert page.locator('#play-anim-timeline-clip').is_visible()
        assert not page.locator('#play-left-run-clip').is_visible()
        page.locator('#play-manual-animation summary').click()
        assert page.locator('#play-left-run-clip').is_visible()
        page.locator('#play-manual-animation summary').click()
        preview = page.locator('.play-workspace-preview-pane').bounding_box()
        controls = page.locator('#play-workspace-controls').bounding_box()
        assert preview['x'] + preview['width'] <= controls['x'] + 1, (preview, controls)
        assert page.locator('#play-workspace-controls').evaluate('(el) => el.scrollHeight > el.clientHeight')
        assert page.evaluate('document.getElementById("play-canvas") === window.originalPlayCanvas')
        assert not page.locator('#play-undo-btn').is_visible() and page.locator('#play-workspace-undo-btn').is_visible()
        page.locator('#play-workspace-preview-toggle').click()
        assert not canvas.is_visible()
        assert page.locator('#play-workspace-preview-toggle').get_attribute('aria-expanded') == 'false'
        assert page.locator('#play-workspace-controls').bounding_box()['width'] > controls['width']
        page.locator('#play-workspace-preview-toggle').click()
        assert canvas.is_visible()
        print('PASS desktop split, optional animation controls, and editor-only view', flush=True)

        page.locator('#play-run-btn').click()
        assert page.locator('#play-runtime-state').inner_text() == 'Running'
        assert page.locator('#play-idle-frame').is_disabled()
        assert page.locator('#play-workspace-undo-btn').is_disabled()
        page.locator('#play-pause-btn').click()
        assert page.locator('#play-step-btn').is_enabled()
        page.locator('#play-step-btn').click()
        page.locator('#play-run-btn').click()
        assert page.locator('#play-idle-frame').is_enabled()
        page.locator('#play-world-type').select_option('voxel3d')
        assert page.locator('#play-world-editor').evaluate('(el) => el.open')
        assert page.locator('#play-world-landscape').is_visible()
        page.locator('#play-world-editor > summary').click()
        assert not page.locator('#play-world-landscape').is_visible()
        print('PASS run/pause/step, authoring lock, and collapsible voxel editing', flush=True)

        page.set_viewport_size({'width': 1024, 'height': 768})
        page.wait_for_timeout(100)
        preview = page.locator('.play-workspace-preview-pane').bounding_box()
        controls = page.locator('#play-workspace-controls').bounding_box()
        assert controls['y'] >= preview['y'] + preview['height'] - 2
        page.locator('#play-workspace-preview-toggle').click()
        assert page.locator('#play-idle-frame').is_visible()
        page.locator('[data-play-workspace-switch="objects"]').click()
        assert page.locator('#play-place-frame-art').is_visible()
        page.locator('#play-workspace-close-btn').click()
        assert canvas.is_visible() and page.evaluate('document.getElementById("play-canvas") === window.originalPlayCanvas')
        assert page.locator('#play-workspace-player-btn').evaluate('(el) => document.activeElement === el')
        page.locator('#play-workspace-rules-btn').click()
        assert page.locator('#node-editor-overlay').is_visible()
        page.locator('#node-editor-overlay .node-editor-close').click()
        assert not errors, errors
        print('PASS narrow layout, workspace switching, focus restoration and rules', flush=True)
        print('PLAY FOCUS BROWSER CHECKS: 4/4 passed', flush=True)
    finally:
        browser.close()
