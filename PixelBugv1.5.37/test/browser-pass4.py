"""Browser checks for chunked landscapes, directional clips and the component inspector."""
from pathlib import Path
import os, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent/'src'
html=(ROOT/'index.html').read_text(encoding='utf8')
scripts=re.findall(r'<script src="([^"]+)"\s*></script>',html)
markup=re.sub(r'<script src="[^"]+"\s*></script>','',html)
markup=re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>','',markup)
with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
  try:
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(markup,wait_until='domcontentloaded')
    for css in ['styles.css','styles-workspaces.css']:
      page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
    page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
    for file in scripts:page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
    page.wait_for_timeout(160)
    assert not errors, errors
    page.locator('#play-mode-btn').click()
    page.locator('#play-workspace-objects-btn').click()
    page.locator('.play-piece-options summary').click()
    page.locator('#play-gameplay-kind').select_option('enemy')
    page.locator('#play-gameplay-damage').fill('2')
    page.locator('#play-gameplay-patrol-range').fill('96')
    page.locator('#play-gameplay-patrol-speed').fill('60')
    page.locator('#play-gameplay-behavior').select_option('chase')
    page.locator('#play-gameplay-aggro').fill('180')
    page.locator('#play-gameplay-add').click()
    before=page.evaluate('''() => ({prop:structuredClone(state.playMode.props.at(-1)),count:state.playMode.nodeEditor.nodes.length,errors:PixelBugPlayWorkspace.validate(state.playMode).errors})''')
    assert before['prop']['componentBehavior']=='chase' and before['prop']['componentAggroRange']==180 and not before['errors'],before
    page.locator('#play-gameplay-damage').fill('4')
    page.locator('#play-gameplay-behavior').select_option('guard')
    page.locator('#play-gameplay-aggro').fill('110')
    page.locator('#play-gameplay-update').click()
    after=page.evaluate('''() => ({prop:state.playMode.props.at(-1),count:state.playMode.nodeEditor.nodes.length,damage:state.playMode.nodeEditor.nodes.find(n=>n.type==='actionChangeNumber'&&n.data.variable==='health')?.data.amount})''')
    assert after['prop']['componentBehavior']=='guard' and after['prop']['componentAggroRange']==110 and after['damage']==-4 and after['count']==before['count'],after
    page.locator('#play-gameplay-damage').fill('1')
    page.locator('#play-gameplay-load').click()
    assert page.locator('#play-gameplay-damage').input_value()=='4'
    assert page.locator('#play-gameplay-behavior').input_value()=='guard'
    print('PASS gameplay inspector edits existing behavior and generated damage rule without rebuilding graph',flush=True)
    page.locator('#play-workspace-close-btn').click()
    page.locator('#play-workspace-player-btn').click()
    page.locator('#play-manual-animation summary').click()
    page.locator('#play-left-clip').fill('0,0')
    page.locator('#play-left-clip').dispatch_event('change')
    page.locator('#play-right-clip').fill('0')
    page.locator('#play-right-clip').dispatch_event('change')
    page.locator('#play-up-clip').fill('0')
    page.locator('#play-up-clip').dispatch_event('change')
    clips=page.evaluate('''() => ({left:state.playMode.leftClip,right:state.playMode.rightClip,up:state.playMode.upClip,
      selection:PixelBugPlayRuntimeCore.frameSelection({grounded:true,facing:-1,vx:-2},state.playMode,8),
      html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload()).includes('frameSelection')})''')
    assert clips['left']=='0,0' and clips['right']=='0' and clips['up']=='0' and clips['selection']['flip']==False and clips['html'],clips
    print('PASS directional player clips persist, select their own artwork, and export',flush=True)
    page.locator('#play-world-type').select_option('voxel3d')
    page.locator('#play-voxel-grid-width').fill('72')
    page.locator('#play-voxel-grid-depth').fill('72')
    page.locator('#play-world-landscape').select_option('forest')
    page.locator('#play-world-landscape-seed').fill('348')
    page.locator('#play-world-landscape-generate').click()
    info=page.evaluate('''() => ({blocks:state.playMode.voxelWorld.blocks.length,width:state.playMode.voxelWorld.width,
      depth:state.playMode.voxelWorld.depth,issues:PixelBugPlayVoxelWorld.spawnIssues(state.playMode.voxelWorld),
      exported:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
    assert info['width']==72 and info['depth']==72 and info['blocks']>4096 and not info['issues'],{k:v for k,v in info.items() if k!='exported'}
    assert 'CHUNK_SIZE = 12' in info['exported']
    exported=browser.new_page(viewport={'width':1024,'height':768})
    ex_errors=[]
    exported.on('pageerror',lambda e:ex_errors.append(str(e)))
    exported.set_content(info['exported'],wait_until='domcontentloaded',timeout=30000)
    exported.wait_for_timeout(500)
    assert not ex_errors,ex_errors
    assert exported.locator('#game').count()==1
    exported.close()
    print('PASS >4096-block voxel landscape renders and launches as standalone HTML',flush=True)
    assert not errors,errors
    print('PASS 4 BROWSER CHECKS: 3/3 passed',flush=True)
  finally:
    browser.close()
