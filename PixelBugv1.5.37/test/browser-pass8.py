"""Pass 8 browser checks for editable hybrid world diagram."""
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
        page.wait_for_timeout(200)
        assert not errors,errors
        page.locator('#play-mode-btn').click()
        fixture=page.evaluate('''() => {
          const pm=state.playMode,home=pm.activeSceneId;
          pm.props=[
            {id:'gate',name:'Stone Gate',frame:0,x:150,y:100,scale:2,solid:false,nodeTriggerId:'gate',targetSceneId:'cave',targetX:3,targetY:7},
            {id:'gem',name:'Gem',frame:0,x:80,y:100,scale:2,solid:false,nodeTriggerId:'gem'}
          ];
          pm.nodeEditor={nodes:[
            {id:'touch',type:'eventTrigger',name:'Touch Gate',next:'go',alt:'',x:40,y:40,data:{sceneId:home,trigger:'gate'}},
            {id:'go',type:'actionScene',name:'Enter Cave',next:'',alt:'',x:340,y:40,data:{sceneId:'cave'}},
            {id:'exit',type:'eventTrigger',name:'Touch Exit',next:'back',alt:'',x:40,y:270,data:{sceneId:'cave',trigger:'cave-exit'}},
            {id:'back',type:'actionScene',name:'Return Home',next:'',alt:'',x:340,y:270,data:{sceneId:home}}
          ]};
          captureActivePlayScene();
          const voxel=PixelBugPlayVoxelWorld.empty();
          voxel.width=28;voxel.depth=26;
          voxel.blocks=[{x:2,y:0,z:2,color:'#448855'}];
          voxel.markers=[{kind:'trigger',id:'exit-marker',triggerId:'cave-exit',name:'Exit Crystal',x:3,y:1,z:3}];
          pm.scenes.push({...structuredClone(pm.scenes[0]),id:'cave',name:'Crystal Cavern',worldType:'voxel3d',voxelWorld:voxel,props:[],dialogue:{characters:[],lines:[]}});
          pm.scenes.push({...structuredClone(pm.scenes[0]),id:'gallery',name:'Art Gallery',worldType:'sidescroller',props:[]});
          return {home};
        }''')
        page.locator('#play-workspace-rules-btn').click()
        diagram=page.locator('.play-world-rule-map')
        assert diagram.locator('.play-world-diagram-card').count()==3
        assert diagram.locator('svg.play-world-diagram-arrows').count()==1
        assert diagram.locator('.play-world-diagram-path').count()>=3
        assert diagram.locator('.play-world-diagram-path').first.get_attribute('d').startswith('M ')
        print('PASS 8 diagram renders real rule and object portal arrows across 2D/voxel worlds',flush=True)
        handle=diagram.locator('.play-world-diagram-card[data-scene-id="cave"] .play-world-diagram-handle')
        handle.focus();handle.press('ArrowRight');handle.press('ArrowDown')
        saved=page.evaluate("state.playMode.nodeEditor.worldPositions.cave")
        assert saved['x']>24 and saved['y']>30,saved
        handle.scroll_into_view_if_needed()
        box=handle.bounding_box()
        assert box
        page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
        page.mouse.down()
        page.mouse.move(box['x']+box['width']/2+55,box['y']+box['height']/2+37,steps=5)
        page.mouse.up()
        dragged=page.evaluate('state.playMode.nodeEditor.worldPositions.cave')
        assert dragged['x']>=saved['x']+40 and dragged['y']>=saved['y']+25,(saved,dragged)
        saved=dragged
        assert diagram.locator('.play-world-diagram-card[data-scene-id="cave"]').get_attribute('style').find('left:')>=0
        print('PASS 8 keyboard-accessible draggable scene cards persist editor coordinates',flush=True)
        diagram.locator('.play-world-diagram-route-list button').filter(has_text='Touch Gate').first.click()
        assert 'Destination preview' in diagram.inner_text()
        assert 'Voxel world' in diagram.inner_text()
        diagram.locator('.play-world-route-destination').select_option('gallery')
        assert page.evaluate("state.playMode.nodeEditor.nodes.find(n=>n.id==='go').data.sceneId")=='gallery'
        assert page.evaluate("state.playMode.nodeEditor.nodes.find(n=>n.id==='touch').next")=='go'
        print('PASS 8 rule-arrow destination edits preserve node IDs, connectivity and preview content',flush=True)
        diagram.locator('.play-world-diagram-route-list button').filter(has_text='Object 1').first.click()
        assert 'Entry Z (ground depth)' in diagram.inner_text()
        entries=diagram.locator('.play-world-diagram-entry')
        entries.nth(0).fill('6');entries.nth(1).fill('9')
        diagram.locator('.play-world-diagram-apply').click()
        value=page.evaluate('''() => ({x:state.playMode.props[0].targetX,y:state.playMode.props[0].targetY,
          snapshot:state.playMode.scenes.find(s=>s.id===state.playMode.activeSceneId).props[0].targetX})''')
        assert value=={'x':6,'y':9,'snapshot':6},value
        diagram.locator('.play-world-route-destination').select_option('gallery')
        assert page.evaluate('state.playMode.props[0].targetSceneId')=='gallery'
        assert 'Entry Y' in diagram.inner_text()
        print('PASS 8 portal destination and 2D/3D entry coordinates update live and authored scenes',flush=True)
        diagram.locator('.play-world-diagram-card[data-scene-id="cave"] .play-world-diagram-inspect').click()
        assert 'Voxel marker' in diagram.inner_text()
        diagram.locator('.play-world-diagram-target').filter(has_text='Exit Crystal').click()
        assert 'Trigger ID: cave-exit' in diagram.inner_text()
        diagram.get_by_role('button',name='Create touch rule for this target').click()
        new=page.evaluate('''() => {const nodes=state.playMode.nodeEditor.nodes;return {count:nodes.length,node:nodes.find(n=>n.id===state.playMode.nodeEditor.selectedId),last:nodes.at(-1)};}''')
        assert new['count']==6,new
        assert new['node']['data']['sceneId']=='cave',new
        assert new['node']['data']['trigger']=='cave-exit',new
        assert new['node']['next']==new['last']['id'],new
        assert page.locator('.node-editor-map-details').get_attribute('open') is not None
        print('PASS 8 voxel-marker binding creates editable scoped touch and response rules',flush=True)
        diagram.locator('.play-world-diagram-card[data-scene-id="'+fixture['home']+'"] .play-world-diagram-inspect').click()
        assert diagram.locator('.play-world-diagram-thumb').count()==3
        diagram.locator('.play-world-diagram-target').filter(has_text='Object 2').click()
        diagram.get_by_role('button',name='Create touch rule for this target').click()
        assert page.evaluate("state.playMode.nodeEditor.nodes.some(n=>n.type==='eventTrigger'&&n.data.trigger==='gem')")
        print('PASS 8 Base drawing sprites show thumbnails and bind to real playable touch rules',flush=True)
        result=page.evaluate('''() => {
          const project=PixelBugAppApi.cloneProject();
          const html=PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload());
          return {positions:project.playMode.nodeEditor.worldPositions,props:project.playMode.props,
            go:project.playMode.nodeEditor.nodes.find(n=>n.id==='go').data.sceneId,
            exists:html.includes('sandbox="allow-scripts"'),mapped:html.includes('cave-exit'),length:html.length};
        }''')
        assert result['positions']['cave']['x']==saved['x']
        assert result['props'][0]['targetSceneId']=='gallery',result
        assert result['go']=='gallery' and result['exists'] and result['mapped'] and result['length']>50000,result
        page.evaluate('''() => {state.playMode.nodeEditor.nodes.push({id:'orphan',type:'actionScene',name:'Missing Portal',data:{sceneId:'removed-world'}});PixelBugNodeEditor.render();}''')
        assert 'Missing Portal' in diagram.locator('.play-world-diagram-global-checks').inner_text()
        page.evaluate('''() => {state.playMode.nodeEditor.nodes=state.playMode.nodeEditor.nodes.filter(n=>n.id!=='orphan')}''')
        page.locator('.play-world-diagram-reset').click(timeout=7000)
        assert page.evaluate('Object.keys(state.playMode.nodeEditor.worldPositions).length')==0
        assert not errors,errors
        print('PASS 8 saved project/export parity, secure scene rendering and layout reset',flush=True)
        page.screenshot(path='/mnt/data/pass8-world-diagram-review.png',full_page=False)
        print('PASS 8 BROWSER CHECKS: 7/7 passed',flush=True)
    finally:browser.close()
