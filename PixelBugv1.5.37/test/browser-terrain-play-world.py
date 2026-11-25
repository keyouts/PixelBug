from pathlib import Path
import os
import re
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent / 'src'
html = (root / 'index.html').read_text(encoding='utf8')
scripts = re.findall(r'<script src="([^"]+)"\s*></script>', html)
markup = re.sub(r'<script src="[^"]+"\s*></script>', '', html)
markup = re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>', '', markup)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or None,
                                         args=['--no-sandbox', '--disable-dev-shm-usage'])
    try:
        page = browser.new_page(viewport={'width': 1300, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.set_content(markup, wait_until='domcontentloaded')
        page.evaluate("""() => {
          const data = new Map();
          Object.defineProperty(window, 'localStorage', {configurable:true, value: {
            getItem:k=>data.get(k)||null, setItem:(k,v)=>data.set(k,String(v)), removeItem:k=>data.delete(k)
          }});
          window.pixelBug = {getSessionRecovery:async()=>null};
          window.confirm = () => true;
        }""")
        for script in scripts:
            page.add_script_tag(content=(root / script.removeprefix('./')).read_text(encoding='utf8'))
        page.wait_for_timeout(250)
        assert not errors, errors
        page.evaluate("""() => {
          const pixels = Array.from({length:8}, (_,y) => Array.from({length:8}, (_,x) =>
            (x+y)%2 ? '#aabbcc' : '#44aa66'));
          state.tilemap.tiles = [{id:'terrain-test', name:'Terrain', w:8, h:8, pixels}];
          state.tilemap.activeTileId = 'terrain-test';
          state.tilemap.terrain = window.PixelBugTerrainHeightmap.normalize({base:1, peak:5, solid:true}, state.tilemap.tiles);
          tileRepeatController.refresh();
          terrainPaintController.refresh();
          document.querySelector('#tile-repeat-toggle').click();
          document.querySelector('#tile-terrain-tab').click();
        }""")
        page.wait_for_timeout(120)
        assert page.locator('#tile-terrain-play-world').is_enabled()
        page.evaluate("document.querySelector('#tile-terrain-play-world').click()")
        snapshot = page.evaluate("""() => ({
          mode:state.playMode.worldType, blocks:state.playMode.voxelWorld?.blocks?.length || 0,
          start:state.playMode.voxelWorld?.start,
          playMode:document.body.classList.contains('play-mode'),
          terrainOpen:!document.querySelector('#tile-repeat-panel').hidden,
          issues:window.PixelBugPlayVoxelWorld.spawnIssues(state.playMode.voxelWorld)
        })""")
        assert snapshot['mode'] == 'voxel3d', snapshot
        assert 0 < snapshot['blocks'] <= 4096, snapshot
        assert snapshot['issues'] == [], snapshot
        assert snapshot['playMode'] and not snapshot['terrainOpen'], snapshot
        print('PASS Terrain Studio imports playable voxel geometry with a valid spawn')
        page.evaluate("document.querySelector('#undo-btn').click()")
        assert page.evaluate('state.playMode.worldType') == 'sidescroller'
        assert not errors, errors
        print('PASS undo restores the previous scene after terrain transfer')
        print('TERRAIN PLAY WORLD BROWSER CHECKS: 2/2 passed')
    finally:
        browser.close()
