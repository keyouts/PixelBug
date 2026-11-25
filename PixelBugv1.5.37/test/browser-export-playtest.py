from pathlib import Path
from tempfile import TemporaryDirectory
import os
import subprocess
from playwright.sync_api import sync_playwright

folder = Path(os.environ.get('PIXELBUG_BROWSER_FIXTURE_DIR') or str(Path(__file__).parent.parent/'browser-test-output'))
folder.mkdir(parents=True, exist_ok=True)
subprocess.run(['node', str(Path(__file__).parent/'browser-export-fixtures.cjs')], check=True, env={**os.environ, 'PIXELBUG_BROWSER_FIXTURE_DIR': str(folder)})
checks = 0
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or None, args=['--no-sandbox','--disable-dev-shm-usage'])
    for kind in ['voxel','2d']:
        for mode in ['rules','stale']:
            page=browser.new_page(viewport={'width':1024,'height':768})
            failures=[]
            page.on('pageerror',lambda e:failures.append(str(e)))
            page.set_content((folder/f'{kind}-{mode}.html').read_text(),wait_until='load')
            if mode=='rules':
                key='variables' if kind=='voxel' else 'nodeVariables'
                page.wait_for_function(f"{key}.arrived === 'yes'",timeout=4000)
                state=page.evaluate(f"({{scene: currentSceneId, variables: {key}, inventory: {('inventory' if kind=='voxel' else 'nodeInventory')} }})")
                assert state['scene']=='scene-b', state
                assert state['variables']['score']=='21',state
                assert state['variables']['arrived']=='yes',state
                assert 'magic_key' in state['inventory'],state
                assert state['variables'].get('failure') is None,state
                print('PASS',kind,mode,state)
            else:
                page.wait_for_timeout(100)
                page.evaluate('window.__forcedScene = true; '+("loadScene('scene-b')" if kind=='voxel' else "loadRuntimeScene('scene-b')"))
                page.wait_for_timeout(1500)
                key='variables' if kind=='voxel' else 'nodeVariables'
                state=page.evaluate(f"({{scene: currentSceneId, variables: {key}}})")
                assert state['scene']=='scene-b',state
                assert state['variables'].get('stale') is None,state
                assert state['variables']['arrived']=='yes',state
                print('PASS',kind,mode,state)
            assert not failures,failures
            checks+=1
            page.close()
    for kind in ['voxel','2d']:
        page=browser.new_page(viewport={'width':1024,'height':768})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((folder/f'{kind}-loop.html').read_text(),wait_until='load')
        page.wait_for_timeout(500)
        count=page.evaluate("sceneTransitions.length" if kind=='voxel' else "sceneRuleTransitionTimes.length")
        assert count<=12,count
        assert not errors,errors
        print('PASS',kind,'scene transition cycle bounded at',count)
        checks+=1
        page.close()
    for kind in ['voxel','2d']:
        page=browser.new_page(viewport={'width':1024,'height':768})
        page.set_content((folder/f'{kind}-stale.html').read_text(),wait_until='load')
        page.wait_for_timeout(100)
        page.evaluate('resetActor()' if kind=='voxel' else 'resetActorToCheckpoint()')
        page.wait_for_timeout(1300)
        key='variables' if kind=='voxel' else 'nodeVariables'
        assert page.evaluate(f"{key}.stale === undefined")
        print('PASS',kind,'reset cancels old rule continuations')
        checks+=1
        page.close()
    page=browser.new_page(viewport={'width':1024,'height':768})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content((folder/'voxel-trigger.html').read_text(),wait_until='load')
    page.wait_for_function("variables.arrived === 'yes'",timeout=4000)
    assert page.evaluate("inventory.includes('portal_key')")
    assert page.evaluate("currentSceneId")=='scene-b'
    assert not errors,errors
    print('PASS voxel interactive trigger + scene transition')
    checks+=1
    page.close()
    page=browser.new_page(viewport={'width':1024,'height':768})
    page.set_content((folder/'voxel-stale.html').read_text(),wait_until='load')
    page.evaluate("loadScene('scene-b')")
    readings=page.evaluate('''() => {
      const w = WORLD.empty();
      for(let x=5;x<10;x++)for(let z=5;z<10;z++)WORLD.setBlock(w,x,0,z,'#aaccff');
      w.start={x:7.5,y:1,z:7.5};
      const a=WORLD.initialActor(w);
      const ys=[];for(let i=0;i<1000;i++){WORLD.step(w,a,{},1/60);ys.push(a.y);}
      let max=1;let landed=false;
      for(let i=0;i<180;i++){WORLD.step(w,a,{jump:i===0},1/60);max=Math.max(max,a.y);if(i>5&&a.grounded)landed=true;}
      const final=a.y;
      return {min:Math.min(...ys),max:Math.max(...ys),jumpPeak:max,landed,final};
    }''')
    assert readings['min']==1 and readings['max']==1,readings
    assert readings['landed'] and readings['jumpPeak']>1.7 and readings['final']==1,readings
    canvas=page.locator('#game')
    bounds=canvas.bounding_box()
    angleBefore=page.evaluate('world.cameraAngle')
    page.mouse.move(bounds['x']+100,bounds['y']+80)
    page.mouse.down()
    page.mouse.move(bounds['x']+210,bounds['y']+115,steps=5)
    page.mouse.up()
    angleAfter=page.evaluate('world.cameraAngle')
    assert angleAfter!=angleBefore
    print('PASS voxel click-drag orbit')
    checks+=1
    page.evaluate("world = WORLD.empty(); actor = WORLD.initialActor(world); canvas.focus()")
    page.keyboard.down('Space')
    page.wait_for_timeout(1850)
    movement=page.evaluate('({y:actor.y,grounded:actor.grounded,jumpHeld:actor.jumpHeld})')
    assert movement=={'y':0,'grounded':True,'jumpHeld':True},movement
    page.keyboard.up('Space')
    print('PASS voxel live keyboard jump and no pogo on held key')
    checks+=1
    page.screenshot(path=str(folder/'voxel_browser_verified.png'))
    print('PASS voxel browser physics',readings)
    checks+=1
    for kind in ['voxel','2d']:
        page=browser.new_page(viewport={'width':1024,'height':768})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.set_content((folder/f'{kind}-multi.html').read_text(),wait_until='load')
        key='variables' if kind=='voxel' else 'nodeVariables'
        page.wait_for_function(f"{key}.arrived === 'yes'",timeout=4000)
        result=page.evaluate(f"({{scene:currentSceneId,stale:{key}.staleEvent}})")
        assert result['scene']=='scene-b' and result['stale'] is None,result
        assert not errors,errors
        print('PASS',kind,'old scene event roots cancelled on immediate transition')
        checks+=1
        page.close()
    page=browser.new_page(viewport={'width':1024,'height':768})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.set_content((folder/'2d-rules.html').read_text(),wait_until='load')
    page.wait_for_function("nodeVariables.arrived === 'yes'",timeout=4000)
    page.locator('#game').focus()
    page.keyboard.down('Space')
    page.wait_for_timeout(1600)
    state=page.evaluate('({grounded:actor.grounded,jumpHeld,vy:actor.vy,feet:actor.y+actorMetrics().h,ground:groundY()})')
    assert state['grounded'] and state['jumpHeld'] and state['vy']==0,state
    assert abs(state['feet']-state['ground']) < 0.0001,state
    page.keyboard.up('Space')
    assert not errors,errors
    print('PASS 2d held-jump lands once without automatic re-jumping',state)
    checks+=1
    page.close()
    for kind in ['voxel','2d']:
        page=browser.new_page(viewport={'width':1024,'height':768})
        page.set_content((folder/f'{kind}-rules.html').read_text(),wait_until='load')
        data=page.evaluate('''() => {
          const rates=[30,60,120,240],runs=[];
          for(const fps of rates){
            const clock=CORE.createSimulationClock();let count=0;
            for(let f=0;f<=fps*3;f++)CORE.advanceSimulationClock(clock,1000+f*1000/fps,()=>count++);
            runs.push({fps,count});
          }
          return runs;
        }''')
        assert max(item['count'] for item in data)-min(item['count'] for item in data)<=1,data
        print('PASS',kind,'exported fixed clock across display rates',data)
        checks+=1
        page.close()
    browser.close()
print('TOTAL BROWSER TESTS:',checks)
