"""Layered Base Mode art, animated voxel poses, scene bindings and export."""
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
    function layer(color,z){const pixels=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=5&&x<=10&&y>=5&&y<=13?color:null));return {name:z,visible:true,opacity:1,blendMode:'source-over',pixels,sourcePixels:pixels.map(row=>row.slice()),sourceWidth:w,sourceHeight:h};}
    state.frames[0].layers=[layer('#cc2233','body'),layer('#eeee88','face')];
    const second=structuredClone(state.frames[0]);second.layers[0].pixels[6][5]='#22cc44';
    state.frames.push(second);
  }''')
  page.locator('#play-layer-start').focus()
  page.locator('#play-layer-count').fill('2')
  page.locator('#play-layer-thickness').select_option('2')
  page.locator('#play-layer-name').fill('Custom Fox')
  page.locator('#play-layer-voxel-next').click()
  assert 'animated pose' in page.locator('#play-layer-voxel-status').inner_text()
  page.locator('#play-layer-voxel-play').click();page.wait_for_timeout(420);page.locator('#play-layer-voxel-play').click()
  assert page.locator('#play-layer-voxel-play').inner_text()=='Play Pose Preview'
  print('PASS 12 Base layers and frame poses render in the animated preview',flush=True)
  before=page.evaluate('JSON.stringify(state.frames[0].layers.map(layer=>layer.pixels))')
  page.locator('#play-layer-voxel-build').click()
  saved=page.evaluate('''() => state.playMode.voxelAssets.at(-1)''')
  assert saved['name']=='Custom Fox' and len(saved['poses'])==2 and saved['depth']==4,saved
  assert page.evaluate('JSON.stringify(state.frames[0].layers.map(layer=>layer.pixels))')==before
  print('PASS 12 layered character is a reusable asset; Base drawings are unchanged',flush=True)
  page.locator('#play-layer-voxel-use').click()
  state=page.evaluate('''() => ({id:state.playMode.voxelActorAssetId,scene:state.playMode.scenes.find(s=>s.id===state.playMode.activeSceneId),clip:state.playMode.voxelWalkPoseClip,assets:state.playMode.voxelAssets.length})''')
  assert state['id'] and state['scene']['voxelActorAssetId']==state['id'] and len(state['clip'].split(','))==1,state
  assert state['assets']==1
  print('PASS 12 player assignment writes scene-local voxel appearance and animation clips',flush=True)
  page.locator('#play-workspace-close-btn').click()
  page.locator('#play-workspace-scene-btn').click()
  page.locator('#play-scene-add-btn').click()
  scenes=page.evaluate('''() => state.playMode.scenes.map(s=>({id:s.id,asset:s.voxelActorAssetId}))''')
  assert len(scenes)>=2,scenes
  page.evaluate('''() => { state.playMode.voxelActorAssetId='';captureActivePlayScene(); }''')
  page.locator('#play-scene-select').select_option(scenes[0]['id'])
  page.locator('#play-scene-select').dispatch_event('change')
  assert page.evaluate('state.playMode.voxelActorAssetId')==state['id']
  print('PASS 12 switching scenes restores each world’s voxel actor and pose bindings',flush=True)
  voxel=page.evaluate('''() => {
    state.playMode.worldType="voxel3d";
    state.playMode.voxelWorld=PixelBugPlayVoxelWorld.demo();
    captureActivePlayScene();drawPlayScene();
    const actor=PixelBugPlayVoxelWorld.initialActor(state.playMode.voxelWorld);
    actor.grounded=true;actor.moving=true;actor.direction="right";
    const image=PixelBugPlayVoxelAssets.actorSprite(state.playMode.voxelAssets,state.playMode,actor,5,document);
    return {hasSprite:!!image,visible:image?.canvas?.width>1,pose:PixelBugPlayVoxelAssets.selectActorPose(state.playMode,"voxelWalkPoseId",5),world:state.playMode.worldType};
  }''')
  assert voxel['hasSprite'] and voxel['visible'] and voxel['world']=='voxel3d',voxel
  print('PASS 12 voxel world uses the assigned animated voxel actor rather than a Base-only sprite',flush=True)
  result=page.evaluate('''() => ({project:PixelBugAppApi.cloneProject(),html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
  assert any(a['name']=='Custom Fox' for a in result['project']['playMode']['voxelAssets'])
  assert any(s.get('voxelActorAssetId')==state['id'] for s in result['project']['playMode']['scenes'])
  assert {'voxel3d','sidescroller'} == {s['worldType'] for s in result['project']['playMode']['scenes']}
  standalone=browser.new_page();standaloneErrors=[];standalone.on('pageerror',lambda e:standaloneErrors.append(str(e)))
  standalone.set_content(result['html'],wait_until='domcontentloaded',timeout=30000)
  standalone.wait_for_timeout(350)
  assert not standaloneErrors,standaloneErrors
  assert standalone.locator('iframe').count()>=1 and standalone.frame_locator('iframe').first.locator('canvas').count()>=1
  standalone.close()
  print('PASS 12 exported hybrid game boots and retains scene-specific voxel character settings',flush=True)
  assert not errors,errors
  page.locator('#play-workspace-close-btn').click()
  page.locator('#play-workspace-builder-btn').click()
  page.locator('#play-layered-character').screenshot(path='/mnt/data/PixelBug-Pass-12-Layered-Character-Builder.png')
  print('PASS 12 BROWSER CHECKS: 5/5 passed',flush=True)
 finally:browser.close()
