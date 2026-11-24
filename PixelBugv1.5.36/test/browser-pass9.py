"""Pass 9 browser checks for direct 2D/voxel world-connection authoring."""
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
  page=browser.new_page(viewport={'width':1480,'height':960})
  errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(markup,wait_until='domcontentloaded')
  for css in ['styles.css','styles-workspaces.css']:
   page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
  for file in scripts:page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
  page.wait_for_timeout(150)
  assert not errors,errors
  page.locator('#play-mode-btn').click()
  fixture=page.evaluate('''() => {
    const pm=state.playMode,home=pm.activeSceneId;
    pm.props=[{id:'gem',name:'Gem',frame:0,x:80,y:110,scale:2,solid:false,nodeTriggerId:'gem'}];
    pm.nodeEditor={nodes:[{id:'start',type:'eventStart',name:'Start',next:'',alt:'',x:40,y:40,data:{sceneId:home}}]};
    captureActivePlayScene();
    const voxel=PixelBugPlayVoxelWorld.empty();voxel.width=28;voxel.depth=26;
    voxel.blocks=[{x:2,y:0,z:2,color:'#448855'}];voxel.start={x:2.5,y:1,z:2.5};
    voxel.markers=[{kind:'trigger',id:'exit-marker',triggerId:'cave-exit',name:'Exit Crystal',x:3,y:1,z:3}];
    pm.scenes.push({...structuredClone(pm.scenes[0]),id:'cave',name:'Crystal Cavern',worldType:'voxel3d',voxelWorld:voxel,props:[],dialogue:{characters:[],lines:[]}});
    pm.scenes.push({...structuredClone(pm.scenes[0]),id:'gallery',name:'Art Gallery',worldType:'sidescroller',props:[]});
    return {home};
  }''')
  home=fixture['home']
  page.locator('#play-workspace-rules-btn').click()
  diagram=page.locator('.play-world-rule-map')
  assert diagram.locator('.play-world-diagram-card').count()==3
  assert diagram.locator('.play-world-diagram-mini-canvas').count()==3
  assert diagram.locator('.play-world-diagram-connection-mode').count()==1
  print('PASS 9 world diagram renders fresh 2D/3D canvas previews and creation controls',flush=True)
  source=diagram.locator(f'.play-world-diagram-card[data-scene-id="{home}"] .play-world-diagram-connect')
  dest=diagram.locator('.play-world-diagram-card[data-scene-id="cave"] .play-world-diagram-card-heading')
  source.scroll_into_view_if_needed();p=source.bounding_box();q=dest.bounding_box();assert p and q
  page.mouse.move(p['x']+p['width']/2,p['y']+p['height']/2)
  page.mouse.down()
  page.mouse.move(q['x']+q['width']/2,q['y']+q['height']/2,steps=12)
  page.mouse.up()
  result=page.evaluate('''() => {
    const pm=state.playMode;const event=pm.nodeEditor.nodes.find(n=>n.type==='eventTrigger'&&n.data?.sceneId===pm.activeSceneId);
    return {props:pm.props, event,action:pm.nodeEditor.nodes.find(n=>n.id===event?.next),snapshot:pm.scenes.find(s=>s.id===pm.activeSceneId).props};
  }''')
  assert len(result['props'])==2,result
  assert result['event']['data']['trigger']==result['props'][-1]['nodeTriggerId'],result
  assert result['action']['type']=='actionScene' and result['action']['data']['sceneId']=='cave',result
  assert len(result['snapshot'])==2,result
  assert diagram.locator('.play-world-diagram-path').count()>=1
  print('PASS 9 pointer drag creates persisted sprite trigger and editable cross-dimensional scene rule',flush=True)
  diagram.locator('.play-world-diagram-connection-mode').select_option('portal')
  diagram.locator(f'.play-world-diagram-card[data-scene-id="{home}"] .play-world-diagram-connect').click()
  diagram.locator('.play-world-diagram-card[data-scene-id="gallery"] .play-world-diagram-connect').click()
  native=page.evaluate('''() => ({portal:state.playMode.props.find(p=>p.targetSceneId==='gallery'),nodes:state.playMode.nodeEditor.nodes.length})''')
  assert native['portal'] and native['nodes']==3,native
  print('PASS 9 keyboard/click connection mode creates native 2D portal without duplicate rule',flush=True)
  diagram.locator('.play-world-diagram-connection-mode').select_option('rule')
  diagram.locator('.play-world-diagram-card[data-scene-id="cave"] .play-world-diagram-connect').click()
  diagram.locator(f'.play-world-diagram-card[data-scene-id="{home}"] .play-world-diagram-connect').click()
  voxel=page.evaluate('''() => ({
    markers:state.playMode.scenes.find(s=>s.id==='cave').voxelWorld.markers,
    rule:state.playMode.nodeEditor.nodes.find(n=>n.type==='eventTrigger'&&n.data?.sceneId==='cave'&&n.data.trigger!=='cave-exit'),
    nodes:state.playMode.nodeEditor.nodes
  })''')
  assert len(voxel['markers'])==2,voxel
  assert voxel['rule'] and voxel['rule']['data']['trigger']==voxel['markers'][-1]['triggerId'],voxel
  assert next(n for n in voxel['nodes'] if n['id']==voxel['rule']['next'])['data']['sceneId']==home
  print('PASS 9 voxel connection creates valid marker and scoped trigger/action nodes',flush=True)
  # Target selection
  hotspot=diagram.locator('.play-world-diagram-card[data-scene-id="cave"] .play-world-diagram-hotspot').first
  assert hotspot.count()>0
  hotspot.click(timeout=6000)
  assert 'Trigger ID:' in diagram.locator('.play-world-diagram-inspector').inner_text()
  assert page.evaluate('state.playMode.activeSceneId')==home
  diagram.locator('.play-world-diagram-filter').fill('Exit Crystal')
  assert diagram.locator('.play-world-diagram-target:visible').count()==1
  print('PASS 9 voxel target hotspots and inspector filtering select direct bindings without entering play mode',flush=True)
  # Route preview
  diagram.locator('.play-world-diagram-route-list button').filter(has_text='Crystal Cavern').first.click()
  assert diagram.locator('.play-world-diagram-large-preview').count()==1
  assert diagram.locator('.play-world-diagram-preview').count()==1
  saved=page.evaluate('''() => {
    const project=PixelBugAppApi.cloneProject();const html=PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload());
    return {props:project.playMode.props,nodes:project.playMode.nodeEditor.nodes,
      cave:project.playMode.scenes.find(s=>s.id==='cave').voxelWorld.markers,
      sandbox:html.includes('sandbox="allow-scripts"'),embedded:html.includes('portal-touch'),size:html.length};
  }''')
  assert len(saved['props'])==3 and len(saved['cave'])==2 and len(saved['nodes'])==5,saved
  assert saved['sandbox'] and saved['embedded'] and saved['size']>50000,saved
  exported=page.evaluate('''() => PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())''')
  game=browser.new_page(viewport={'width':1000,'height':750})
  game_errors=[]
  game.on('pageerror',lambda error:game_errors.append(str(error)))
  game.set_content(exported,wait_until='domcontentloaded',timeout=30000)
  game.wait_for_timeout(400)
  assert game.locator('#runtime').count()==1
  assert game.locator('#hybrid-status').text_content().startswith('Scene:')
  assert not game_errors,game_errors
  game.close()
  print('PASS 9 generated hybrid standalone HTML boots with new trigger/portal records',flush=True)
  assert not errors,errors
  snap=ROOT.parent/'browser-test-output'/'pass9-world-diagram.png'
  snap.parent.mkdir(parents=True,exist_ok=True)
  page.screenshot(path=str(snap),full_page=False)
  print('PASS 9 saved project and sandboxed standalone HTML preserve both connection types',flush=True)
  print('PASS 9 BROWSER CHECKS: 7/7 passed',flush=True)
 finally:browser.close()
