"""Pass 3 browser verification for component authoring, terrain and hybrid exports."""
from pathlib import Path
import os, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent/'src'
EXAMPLE=ROOT.parent/'examples'/'Crystal-Ridge-Hybrid-Adventure-Pass-3.pxbuild'
html=(ROOT/'index.html').read_text(encoding='utf8')
scripts=re.findall(r'<script src="([^"]+)"\s*></script>',html)
markup=re.sub(r'<script src="[^"]+"\s*></script>','',html)
markup=re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>','',markup)
with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
  try:
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.set_content(markup,wait_until='domcontentloaded')
    for css in ['styles.css','styles-workspaces.css']:
      page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
    page.evaluate('''() => {const m=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
    for file in scripts:page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
    page.wait_for_timeout(120)
    assert not errors,errors
    page.locator('#play-mode-btn').click()
    page.locator('#play-workspace-objects-btn').click()
    page.locator('.play-piece-options summary').click()
    page.locator('#play-gameplay-kind').select_option('enemy')
    page.locator('#play-gameplay-damage').fill('2')
    page.locator('#play-gameplay-patrol-range').fill('95')
    page.locator('#play-gameplay-patrol-speed').fill('47')
    page.locator('#play-gameplay-bob').fill('4')
    page.locator('#play-gameplay-add').click()
    info=page.evaluate('''() => {const p=state.playMode.props.at(-1);return {kind:p.componentKind,range:p.componentPatrolRange,speed:p.componentPatrolSpeed,bob:p.componentBobHeight,amount:state.playMode.nodeEditor.nodes.find(n=>n.type==='actionChangeNumber'&&n.data.variable==='health')?.data.amount,move0:PixelBugPlayComponentMotion.position(p,0).x,move60:PixelBugPlayComponentMotion.position(p,60).x,errs:PixelBugPlayWorkspace.validate(state.playMode).errors}}''')
    assert info['kind']=='enemy' and info['range']==95 and info['speed']==47 and info['amount']==-2,info
    assert info['move60']>info['move0'] and not info['errs'],info
    print('PASS custom patrol enemy links damage rules and has deterministic visual movement')
    page.locator('#play-workspace-close-btn').click()
    page.locator('#play-workspace-player-btn').click()
    page.locator('#play-manual-animation summary').click()
    page.locator('#play-idle-clip').fill('0')
    page.locator('#play-idle-clip').dispatch_event('change')
    page.locator('#play-run-clip').fill('0,0')
    page.locator('#play-run-clip').dispatch_event('change')
    page.locator('#play-clip-ticks').fill('5')
    page.locator('#play-clip-ticks').dispatch_event('change')
    saved=page.evaluate('''() => ({run:state.playMode.runClip,hold:state.playMode.clipFrameTicks,packed:serializeProject().includes('"runClip"'),standalone:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload()).includes('const PIECES =')})''')
    assert saved=={'run':'0,0','hold':5,'packed':True,'standalone':True},saved
    print('PASS animation clips save and embed in standalone runtime')
    page.locator('#play-world-type').select_option('voxel3d')
    page.locator('#play-world-landscape').select_option('snow')
    page.locator('#play-world-landscape-seed').fill('123')
    page.locator('#play-world-landscape-generate').click()
    terrain=page.evaluate('''() => ({count:state.playMode.voxelWorld.blocks.length,issues:PixelBugPlayVoxelWorld.spawnIssues(state.playMode.voxelWorld),width:state.playMode.voxelWorld.width,depth:state.playMode.voxelWorld.depth})''')
    assert terrain['count']>100 and not terrain['issues'],terrain
    # Undo verification
    page.locator('#play-workspace-undo-btn').click()
    restored=page.evaluate('''() => state.playMode.voxelWorld.blocks.length''')
    assert restored!=terrain['count'],(restored,terrain)
    print('PASS procedural snow landscape generates safe spawn and Undo restores the world')
    project=EXAMPLE.read_text(encoding='utf8')
    hybrid=page.evaluate('''source => {
      state=window.PixelBugProjectPackage.unpack(JSON.parse(source));
      normalizeProject();renderPlayPanel();
      const problems=window.PixelBugPlayWorkspace.validate(state.playMode).errors;
      const payload=buildTinyGamePayload();
      return {problems,scenes:payload.playMode.scenes.map(s=>s.worldType),html:window.PixelBugTinyGameExport.buildTinyGameHtml(payload)};
    }''',project)
    assert not hybrid['problems'],hybrid['problems']
    assert hybrid['scenes']==['sidescroller','voxel3d'],hybrid['scenes']
    assert 'pixelbug-hybrid-v1' in hybrid['html']
    exported=browser.new_page()
    export_errors=[]
    exported.on('pageerror',lambda e:export_errors.append(str(e)))
    exported.set_content(hybrid['html'],wait_until='domcontentloaded')
    exported.wait_for_timeout(650)
    assert not export_errors,export_errors
    assert exported.locator('iframe').count()>=1
    print('PASS editable Crystal Ridge starter exports and boots as standalone hybrid HTML')
    exported.close()
    assert not errors,errors
    print('PASS 3 BROWSER CHECKS: 4/4 passed')
  finally:
    browser.close()
