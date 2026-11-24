"""Browser regressions for streamed regions, moving markers, animation and inspector."""
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
        page.wait_for_timeout(200)
        assert not errors,errors
        page.locator('#play-mode-btn').click()
        page.locator('#play-workspace-player-btn').click()
        page.locator('#play-left-run-clip').fill('0,0')
        page.locator('#play-left-run-clip').dispatch_event('change')
        page.locator('#play-run-clip-ticks').fill('3')
        page.locator('#play-run-clip-ticks').dispatch_event('change')
        saved=page.evaluate('''() => ({clip:state.playMode.leftRunClip,hold:state.playMode.runClipTicks,
          output:PixelBugPlayRuntimeCore.frameSelection({grounded:true,direction:'left',vx:-2},state.playMode,3),
          scene:PixelBugPlaySceneModel.snapshot(state.playMode,'scene-a','Scene A',{
            sceneId:id=>id,parseClip:v=>PixelBugPlayRuntimeCore.parseClip(v),quarterTurn:v=>0,
            clone:v=>structuredClone(v),defaultVisualLayers:()=>[],normalizeWorld:v=>PixelBugPlayVoxelWorld.normalize(v),
            defaultDialogue:()=>({}),defaultUi:()=>({}),normalizeAudio:v=>v})})''')
        assert saved['clip']=='0,0' and saved['hold']==3 and saved['output']['directional'] and saved['scene']['leftRunClip']=='0,0',saved
        print('PASS 5 animation timeline UI persists directional run frames and hold duration',flush=True)
        page.locator('#play-world-type').select_option('voxel3d')
        marker=page.evaluate('''() => {
          voxelWorldSelectedCell={x:4,y:0,z:4};
          const result=PixelBugPlayComponentEditor.place(state.playMode,{kind:'enemy',selectedCell:voxelWorldSelectedCell,
            behavior:'guard',patrolRange:64,patrolSpeed:32,aggroRange:192,damage:2},PixelBugPlayGameplayComponents);
          renderPlayVoxelWorldControls();
          return {ok:result.ok,trigger:state.playMode.voxelWorld.markers.at(-1)?.triggerId};
        }''')
        assert marker['ok'] and marker['trigger'],marker
        list_button=page.locator('#play-world-marker-list button').last
        list_button.click()
        assert page.locator('#play-marker-status').text_content().find(marker['trigger'])>=0
        page.locator('#play-voxel-marker-inspector summary').click()
        page.locator('#play-marker-damage').fill('5')
        page.locator('#play-marker-range').fill('4')
        page.locator('#play-marker-speed').fill('1.5')
        page.locator('#play-marker-aggro').fill('9')
        page.locator('#play-marker-apply').click()
        item=page.evaluate('''() => ({ marker:state.playMode.voxelWorld.markers.at(-1),
          damage:state.playMode.nodeEditor.nodes.find(n=>n.type==='actionChangeNumber' && n.data.variable==='health')?.data.amount,
          issues:PixelBugPlayWorkspace.validate(state.playMode).errors })''')
        assert item['marker']['componentPatrolRange']==4 and item['marker']['componentPatrolSpeed']==1.5 and item['marker']['componentAggroRange']==9 and item['damage']==-5 and not item['issues'],item
        print('PASS 5 voxel gameplay inspector edits marker and generated rule values through visible UI',flush=True)
        page.evaluate('''() => {
          const w=state.playMode.voxelWorld;
          w.blocks=[{x:5,y:0,z:4,color:'#888888'}];
          PixelBugPlayVoxelWorld.invalidateWorldCache(w);
          state.playMode.voxelWorld=PixelBugPlayVoxelWorld.normalize(w);
        }''')
        runtime=page.evaluate('''() => {
          const w=state.playMode.voxelWorld,m=w.markers.at(-1);
          const occupied=new Set(w.blocks.map(b=>`${b.x},${b.y},${b.z}`));
          const path=PixelBugPlayVoxelEnemies.route(w,{x:4.5,z:4.5},{x:7.5,z:4.5},occupied,0);
          const result=PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload());
          return {path,html:result,stats:PixelBugPlayVoxelWorld.regionStats(w)};
        }''')
        assert runtime['path'] and len(runtime['path'])>=3 and runtime['stats']['loads']==0
        exported=browser.new_page(viewport={'width':1024,'height':768})
        export_errors=[]
        exported.on('pageerror',lambda error:export_errors.append(str(error)))
        exported.set_content(runtime['html'],wait_until='domcontentloaded',timeout=30000)
        exported.wait_for_timeout(350)
        assert not export_errors,export_errors
        assert exported.locator('#game').count()==1
        exported.close()
        print('PASS 5 moving voxel enemy navigation and self-contained standalone export boot',flush=True)
        html2d=page.evaluate('''() => { state.playMode.worldType='sidescroller'; return PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload()); }''')
        game2d=browser.new_page()
        game2d_errors=[]
        game2d.on('pageerror',lambda error:game2d_errors.append(str(error)))
        game2d.set_content(html2d,wait_until='domcontentloaded',timeout=30000)
        simulation=game2d.evaluate('''() => {
          const enemy={x:30,y:90,componentKind:'enemy',componentBehavior:'chase',
            componentAvoidObstacles:true,componentPatrolRange:220,componentPatrolSpeed:120,componentAggroRange:300};
          let result;
          for(let tick=1;tick<=180;tick++)result=PIECES.position(enemy,tick,260,
            {actorX:170,actorY:90,navigation:{width:260,height:220,obstacles:[{x:75,y:40,w:20,h:80}]}});
          return {result,source:{x:enemy.x,y:enemy.y},hasNavigation:typeof PIECES.position==='function'};
        }''')
        assert not game2d_errors,game2d_errors
        assert simulation['result']['x']>120 and simulation['source']=={'x':30,'y':90},simulation
        game2d.close()
        print('PASS 5 standalone 2D export executes obstacle-aware enemy navigation',flush=True)
        assert not errors,errors
        print('PASS 5 BROWSER CHECKS: 4/4 passed',flush=True)
    finally:
        browser.close()
