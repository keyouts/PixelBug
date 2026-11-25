from pathlib import Path
import os, re
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parent.parent / 'src'
html = (ROOT / 'index.html').read_text(encoding='utf8')
scripts = re.findall(r'<script src="([^"]+)"\s*></script>', html)
markup = re.sub(r'<script src="[^"]+"\s*></script>', '', html)
markup = re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>', '', markup)
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
    try:
        page=browser.new_page(viewport={'width':1300,'height':900})
        errors=[]
        page.on('pageerror',lambda err: errors.append(str(err)))
        page.set_content(markup,wait_until='domcontentloaded')
        page.add_style_tag(content=(ROOT / 'styles.css').read_text(encoding='utf8'))
        page.evaluate('''() => {const m=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
        for script in scripts: page.add_script_tag(content=(ROOT/script.removeprefix('./')).read_text(encoding='utf8'))
        page.wait_for_timeout(150)
        assert not errors, errors
        page.locator('#play-mode-btn').click()
        assert page.locator('#play-gameplay-add').count()==1
        for kind in ['collectible','enemy','checkpoint','door','goal']:
            page.locator('#play-gameplay-kind').select_option(kind)
            page.locator('#play-gameplay-item').fill('ruby')
            page.locator('#play-gameplay-add').click()
        found=page.evaluate('''() => ({kinds:state.playMode.props.map(p=>p.componentKind),events:state.playMode.nodeEditor.nodes.filter(n=>n.type==='eventTrigger').map(n=>n.data.trigger),errors:window.PixelBugPlayWorkspace.validate(state.playMode).errors, serialized:serializeProject().includes('"componentKind"'), count:state.playMode.nodeEditor.nodes.length})''')
        assert found['kinds']==['collectible','enemy','checkpoint','door','goal'],found
        assert len(found['events'])==5,found
        assert not found['errors'],found
        assert found['serialized'] is True,found
        assert not errors,errors
        print('PASS five palette pieces create graph events and serializable props',found)
        page.locator('#play-acceleration').fill('12')
        page.locator('#play-acceleration').dispatch_event('change')
        page.locator('#play-friction').fill('16')
        page.locator('#play-friction').dispatch_event('change')
        page.locator('#play-variable-jump').check()
        settings=page.evaluate('''() => ({acceleration:state.playMode.acceleration,friction:state.playMode.friction,variableJump:state.playMode.variableJump})''')
        assert settings=={'acceleration':12,'friction':16,'variableJump':True},settings
        assert not errors,errors
        print('PASS character feel options persist in scene settings')
        payload=page.evaluate('''() => { const p=buildTinyGamePayload(); return {pieces:p.playMode.props.map(x=>x.componentKind),n:p.playMode.nodeEditor.nodes.length,source:window.PixelBugTinyGameExport.buildTinyGameHtml(p)}; }''')
        assert len(payload['pieces'])==5 and payload['n']==found['count']
        assert 'propCollected' in payload['source'] and 'horizontalVelocity' in payload['source']
        game=browser.new_page()
        export_errors=[]
        game.on('pageerror',lambda err: export_errors.append(str(err)))
        game.set_content(payload['source'],wait_until='domcontentloaded')
        game.wait_for_timeout(500)
        assert not export_errors,export_errors
        assert game.locator('canvas#game').count()==1
        print('PASS exported standalone HTML boots with all five rule components')
        game.close()
        print('GAMEPLAY PIECES BROWSER CHECKS: 3/3 passed')
    finally: browser.close()
