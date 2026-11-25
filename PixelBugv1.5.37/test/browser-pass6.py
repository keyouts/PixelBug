"""Pass 6 browser checks for directional timeline, platform navigation and voxel elevation."""
from pathlib import Path
import os,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent/'src'
html=(ROOT/'index.html').read_text(encoding='utf8')
scripts=re.findall(r'<script src="([^"]+)"\s*></script>',html)
markup=re.sub(r'<script src="[^"]+"\s*></script>','',html)
markup=re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>','',markup)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or '/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    try:
        page=browser.new_page(viewport={'width':1440,'height':900})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(markup,wait_until='domcontentloaded')
        for css in ['styles.css','styles-workspaces.css']:
            page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
        page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
        for file in scripts:page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
        page.wait_for_timeout(100)
        assert not errors,errors
        page.locator('#play-mode-btn').click()
        page.locator('#play-workspace-player-btn').click()
        page.evaluate('''() => {
          if(state.frames.length===1)state.frames.push(structuredClone(state.frames[0]));
          state.playMode.leftRunClip='';state.activeFrame=0;renderPlayPanel();
        }''')
        picker=page.locator('#play-anim-timeline-clip')
        picker.select_option('leftRunClip')
        page.locator('#play-anim-append').click()
        page.evaluate('''() => {state.activeFrame=1;}''')
        page.locator('#play-anim-append').click()
        frames=page.locator('#play-anim-strip button')
        assert frames.count()==2,frames.count()
        frames.nth(0).click()
        page.locator('#play-anim-later').click()
        result=page.evaluate('''() => ({clip:state.playMode.leftRunClip,field:document.querySelector('#play-left-run-clip').value,
            nodes:document.querySelectorAll('#play-anim-strip button').length,
            canvas:document.querySelector('#play-anim-preview-canvas').width})''')
        assert result=={'clip':'1,0','field':'1,0','nodes':2,'canvas':128},result
        page.locator('#play-anim-preview').click()
        page.wait_for_timeout(200)
        page.locator('#play-anim-preview').click()
        page.locator('#play-anim-remove').click()
        assert page.evaluate('state.playMode.leftRunClip')=='1'
        print('PASS 6 visual directional animation timeline: sprite thumbnails, reorder, preview, remove, and shared field',flush=True)
        page.locator('#play-workspace-close-btn').click()
        page.locator('#play-workspace-objects-btn').click()
        page.locator('#play-gameplay-kind').select_option('enemy')
        page.locator('details.play-piece-options summary').click()
        page.locator('#play-gameplay-behavior').select_option('chase')
        page.locator('#play-gameplay-platform-jump').check()
        page.locator('#play-gameplay-avoid').check()
        page.locator('#play-gameplay-patrol-range').fill('180')
        page.locator('#play-gameplay-patrol-speed').fill('140')
        page.locator('#play-gameplay-add').click()
        data=page.evaluate('''() => ({prop:state.playMode.props.at(-1),exported:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
        assert data['prop']['componentPlatformJump'] is True and 'createPlayPlatformNavigation' in data['exported'],data['prop']
        standalone=browser.new_page(viewport={'width':960,'height':600});standalone_errors=[]
        standalone.on('pageerror',lambda e:standalone_errors.append(str(e)))
        standalone.set_content(data['exported'],wait_until='domcontentloaded',timeout=30000)
        standalone.wait_for_timeout(300)
        assert not standalone_errors,standalone_errors
        assert standalone.locator('canvas#game').count()==1
        standalone.close()
        print('PASS 6 opt-in enemy jump setting survives editor authoring and standalone 2D export',flush=True)
        elevated=page.evaluate('''() => {
          const w=PixelBugPlayVoxelWorld.empty();w.width=12;w.depth=8;w.height=6;
          for(let x=3;x<=9;x++)w.blocks.push({x,y:0,z:3,color:'#5a9551'});
          const occupied=new Set(w.blocks.map(b=>`${b.x},${b.y},${b.z}`));
          return PixelBugPlayVoxelEnemies.route(w,{x:1.5,y:0,z:3.5},{x:8.5,y:1,z:3.5},occupied);
        }''')
        assert elevated and any(p['y']==1 for p in elevated),elevated
        assert not errors,errors
        print('PASS 6 browser multi-level voxel navigation and renderer startup',flush=True)
        print('PASS 6 BROWSER CHECKS: 3/3',flush=True)
    finally:
        browser.close()
