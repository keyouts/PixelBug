"""Pass 7 browser checks for world rule mapping and base art."""
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
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.set_content(markup,wait_until='domcontentloaded')
        for css in ['styles.css','styles-workspaces.css']:
            page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
        page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
        for file in scripts: page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
        page.wait_for_timeout(150)
        assert not errors,errors
        page.locator('#play-mode-btn').click()
        page.locator('#play-workspace-player-btn').click()
        page.evaluate('''() => {if(state.frames.length===1)state.frames.push(structuredClone(state.frames[0]));state.activeFrame=1;}''')
        page.locator('#play-player-from-base').click()
        player=page.evaluate('''() => ({frames:[state.playMode.idleFrame,state.playMode.walkFrame,state.playMode.jumpFrame],
          scene:state.playMode.scenes.find(s=>s.id===state.playMode.activeSceneId),status:document.querySelector('#play-player-source-status').textContent})''')
        assert player['frames']==[1,1,1] and player['scene']['idleFrame']==1,player
        assert 'frame 2' in player['status'].lower(),player['status']
        page.locator('#play-workspace-close-btn').click()
        print('PASS 7 base drawing button assigns player sprite with saved scene parity',flush=True)
        page.locator('#play-workspace-objects-btn').click()
        page.locator('#play-use-active-btn').click()
        assert page.locator('#play-prop-frame').input_value()=='1'
        page.locator('#play-workspace-close-btn').click()
        print('PASS 7 base drawing can be assigned as a Play scene object',flush=True)
        fixture=page.evaluate('''() => {
          const pm=state.playMode;
          const id=pm.activeSceneId;
          pm.props=[{id:'door',frame:1,x:220,y:100,scale:2,solid:false,nodeTriggerId:'door',targetSceneId:'dungeon',targetX:6,targetY:7}];
          pm.nodeEditor={nodes:[
            {id:'touch',type:'eventTrigger',name:'Touch Door',next:'go',alt:'',x:0,y:0,data:{sceneId:id,trigger:'door'}},
            {id:'go',type:'actionScene',name:'Enter Dungeon',next:'',alt:'',x:350,y:0,data:{sceneId:'dungeon'}},
            {id:'exit',type:'eventTrigger',name:'Touch Exit',next:'return',alt:'',x:0,y:300,data:{sceneId:'dungeon',trigger:'exit'}},
            {id:'return',type:'actionScene',name:'Return Village',next:'',alt:'',x:350,y:300,data:{sceneId:id}}
          ]};
          captureActivePlayScene();
          const world=PixelBugPlayVoxelWorld.empty();
          world.blocks=[{x:5,y:0,z:5,color:'#668866'}];
          world.markers=[{kind:'trigger',id:'exit-marker',triggerId:'exit',name:'Return Exit',x:5,y:1,z:5}];
          pm.scenes.push({...structuredClone(pm.scenes[0]),id:'dungeon',name:'Crystal Dungeon',worldType:'voxel3d',voxelWorld:world,props:[],dialogue:{characters:[],lines:[]}});
          return {id,sceneCount:pm.scenes.length};
        }''')
        page.locator('#play-workspace-rules-btn').click()
        worldmap=page.locator('.play-world-rule-map')
        cards=worldmap.locator('.play-world-rule-scene')
        assert cards.count()==2,cards.count()
        content=worldmap.inner_text()
        assert '2D Sprite' in content and '3D Voxel' in content and '2D ↔ 3D' in content,content
        assert 'Touch Door' in content and 'Touch Exit' in content,content
        print('PASS 7 visual node map shows scoped 2D/voxel rule routes and portal links',flush=True)
        page.evaluate('''() => {window.__mapSceneEvents=0;const old=PixelBugNodeEditor.runEvent;PixelBugNodeEditor.runEvent=(...args)=>{window.__mapSceneEvents++;return old(...args);};}''')
        cards.nth(1).click()
        assert page.evaluate('window.__mapSceneEvents')==0,'Editor-only world navigation must not run game events'
        assert page.evaluate('state.playMode.worldType')=='voxel3d'
        assert page.evaluate('state.playMode.activeSceneId')=='dungeon'
        assert not errors,errors
        page.locator('#node-editor-overlay .node-editor-close').click()
        print('PASS 7 world map navigation opens the selected voxel editing scene',flush=True)
        exported=page.evaluate('''() => PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())''')
        assert 'sandbox="allow-scripts"' in exported and 'function createPlayScenePortal' in exported
        game=browser.new_page(viewport={'width':1000,'height':750})
        game_errors=[]
        game.on('pageerror',lambda error:game_errors.append(str(error)))
        game.set_content(exported,wait_until='domcontentloaded',timeout=30000)
        game.wait_for_timeout(450)
        assert game.locator('#runtime').count()==1
        assert game.locator('#hybrid-status').text_content().startswith('Scene:'),game.locator('#hybrid-status').text_content()
        assert not game_errors,game_errors
        game.close()
        print('PASS 7 self-contained hybrid export boots with scene, sprite and rule data',flush=True)
        assert page.evaluate("PixelBugAppApi.selectPlayScene('"+fixture['id']+"')") is True
        previous_count=page.evaluate('state.playMode.scenes.length')
        page.locator('#play-workspace-builder-btn').click()
        build=page.locator('#play-build-voxel-world')
        assert build.is_visible()
        assert build.evaluate('el=>getComputedStyle(el).minHeight')=='42px'
        build.click()
        assert page.locator('#play-world-type').input_value()=='voxel3d'
        assert page.evaluate('state.playMode.scenes.length')==previous_count+1
        assert page.evaluate('state.playMode.scenes.find(s=>s.id==="'+fixture['id']+'").worldType')=='sidescroller'
        assert page.locator('#play-world-editor').is_visible()
        assert page.evaluate('state.playMode.voxelWorld.blocks.length')>0
        print('PASS 7 voxel scene creation keeps original 2D world and exposes the editor',flush=True)
        page.evaluate("""() => {state.playMode.scenes[0].name='<img src=x onerror=window.__injected=true>'; window.__injected=false;}""")
        page.locator('#play-workspace-rules-btn').click()
        maproot=page.locator('.play-world-rule-map')
        assert '<img src=x' in maproot.inner_text()
        assert maproot.locator('img').count()==0
        assert page.evaluate('window.__injected') is False
        page.locator('#node-editor-overlay .node-editor-close').click()
        print('PASS 7 untrusted world names render as text, not executable markup',flush=True)

        print('PASS 7 BROWSER CHECKS: 7/7 passed',flush=True)
    finally:browser.close()
