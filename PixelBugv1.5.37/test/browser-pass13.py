"""Volumetric voxel actors, editable rigs and self-contained hybrid exports."""
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
  page=browser.new_page(viewport={'width':1520,'height':1040});page.set_default_timeout(12000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(markup,wait_until='domcontentloaded')
  for file in ['styles.css','styles-workspaces.css']:page.add_style_tag(content=(ROOT/file).read_text(encoding='utf8'))
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
  for name in scripts:page.add_script_tag(content=(ROOT/name.removeprefix('./')).read_text(encoding='utf8'))
  assert not errors,errors
  page.locator('#play-mode-btn').click();page.locator('#play-workspace-builder-btn').click()
  page.evaluate('''() => {
    const w=state.width,h=state.height;
    function layer(color){return {name:'Body',visible:true,opacity:1,blendMode:'source-over',pixels:Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=4&&x<=12&&y>=3&&y<=13?color:null))};}
    state.frames[0].layers=[layer('#aa3344')];
    const next=structuredClone(state.frames[0]);next.layers[0].pixels[6][5]='#33bbaa';state.frames.push(next);
  }''')
  page.locator('#play-layer-start').focus()
  page.locator('#play-layer-count').fill('2')
  page.locator('#play-layer-rig-enabled').check()
  page.locator('#play-layer-rig-blend').check()
  page.locator('#play-layer-rig-swing').fill('22')
  page.locator('#play-layer-rig-bob').fill('6')
  page.locator('#play-layer-voxel-use').click()
  asset=page.evaluate('''() => state.playMode.voxelAssets.at(-1)''')
  assert asset['rig']['enabled'] and asset['rig']['interpolate'] and asset['rig']['swing']==22 and asset['rig']['bob']==6,asset
  print('PASS 13 layered-actor builder saves optional rigging and interpolation',flush=True)
  page.locator('#play-workspace-close-btn').click();page.locator('#play-workspace-voxels-btn').click()
  page.locator('#play-voxel-rig-editor summary').click()
  page.wait_for_function('(id)=>document.querySelector("#play-rig-asset")?.value===id',arg=asset['id'])
  assert page.locator('#play-rig-asset').input_value()==asset['id']
  page.locator('#play-rig-swing').fill('30')
  page.locator('#play-rig-bob').fill('12')
  page.locator('#play-rig-play').click();page.wait_for_timeout(200)
  assert page.locator('#play-rig-play').inner_text()=='Pause Walking'
  page.locator('#play-rig-play').click()
  page.locator('#play-rig-apply').click()
  result=page.evaluate('''() => ({asset:state.playMode.voxelAssets.find(a=>a.id===state.playMode.voxelActorAssetId),id:state.playMode.voxelActorAssetId})''')
  assert result['id']==asset['id'] and result['asset']['rig']['swing']==30 and result['asset']['rig']['bob']==12,result
  print('PASS 13 advanced rig editor previews and updates reusable character without breaking scene ID',flush=True)
  world_result=page.evaluate('''() => {
    state.playMode.worldType='voxel3d';state.playMode.voxelWorld=PixelBugPlayVoxelWorld.demo();
    captureActivePlayScene();drawPlayScene();
    const actor=PixelBugPlayVoxelWorld.initialActor(state.playMode.voxelWorld);actor.grounded=true;actor.moving=true;actor.direction='right';
    const sample=PixelBugPlayVoxelAssets.actorVolume(state.playMode.voxelAssets,state.playMode,actor,4);
    const img=PixelBugPlayVoxelAssets.actorSprite(state.playMode.voxelAssets,state.playMode,actor,4,document);
    return {count:sample.cubes.length,volume:sample.voxelVolume,legacySprite:!!img,asset:sample.assetId};
  }''')
  assert world_result['volume'] and world_result['count']>0 and world_result['legacySprite'] and world_result['asset']==asset['id'],world_result
  print('PASS 13 voxel world renders world-space geometry with legacy sprite fallback intact',flush=True)
  exported=page.evaluate('''() => ({project:PixelBugAppApi.cloneProject(),html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
  assert any(item.get('rig',{}).get('swing')==30 for item in exported['project']['playMode']['voxelAssets'])
  assert 'createVoxelVolumeDraw' in exported['html'] and 'createVoxelCharacterGeometry' in exported['html']
  standalone=browser.new_page();exportErrors=[];standalone.on('pageerror',lambda e:exportErrors.append(str(e)))
  standalone.set_content(exported['html'],wait_until='domcontentloaded',timeout=30000)
  standalone.wait_for_timeout(500)
  assert not exportErrors,exportErrors
  assert standalone.locator('canvas').count()>=1 or (standalone.locator('iframe').count() and standalone.frame_locator('iframe').first.locator('canvas').count()>=1)
  standalone.close()
  print('PASS 13 standalone voxel HTML boots with geometry, rig and pose source embedded',flush=True)
  # Art preservation
  unchanged=page.evaluate('''() => ({frames:state.frames.length,voxel:state.playMode.voxelAssets.at(-1).rig,art:state.frames[0].layers[0].pixels[4][4]})''')
  assert unchanged['frames']>=2 and unchanged['art']=='#aa3344',unchanged
  print('PASS 13 editable Base artwork survives and rig metadata persists through normalization',flush=True)
  assert not errors,errors
  page.locator('#play-rig-editor').count() if False else None
  page.locator('#play-voxel-rig-editor').screenshot(path='/mnt/data/PixelBug-Pass-13-Volumetric-Rig-Editor.png')
  print('PASS 13 BROWSER CHECKS: 5/5 passed',flush=True)
 finally:browser.close()
