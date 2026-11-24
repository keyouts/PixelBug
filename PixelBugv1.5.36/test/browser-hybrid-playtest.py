from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent

def until(page, expression):
    for _ in range(100):
        try:
            if page.evaluate(expression): return
        except Exception:
            pass
        page.wait_for_timeout(100)
    raise AssertionError('Condition timed out: '+expression+'; current='+str(page.evaluate('({currentSceneId,handoffCount})')))

with TemporaryDirectory() as temp:
    directory=Path(temp)
    subprocess.run(['node', str(ROOT/'test/browser-hybrid-fixtures.cjs')],check=True,
                   env={**os.environ,'PIXELBUG_BROWSER_FIXTURE_DIR':str(directory)})
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or '/usr/bin/chromium',
                                  args=['--no-sandbox','--disable-dev-shm-usage'])
        checks=0
        for filename,mode in [('hybrid-2d-voxel-2d.html','sidescroller'),('hybrid-voxel-2d-voxel.html','voxel3d')]:
            page=browser.new_page(viewport={'width':1200,'height':900}); errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.set_content((directory/filename).read_text(),wait_until='load')
            until(page,'currentSceneId === "s2" && handoffCount === 2')
            assert page.evaluate('currentMode')==mode
            until(page,'childReady === true')
            child=page.frames[1]
            state=child.evaluate('''() => {
              const v=typeof nodeVariables === 'undefined' ? variables : nodeVariables;
              const i=typeof nodeInventory === 'undefined' ? inventory : nodeInventory;
              return {v,i};
            }''')
            assert all(state['v'].get('arrived'+str(i))=='yes' for i in range(3)),state
            assert all('key'+str(i) in state['i'] for i in range(3)),state
            assert not errors,errors
            checks+=1
            page.get_by_role('button',name='Restart game').click()
            until(page,'currentSceneId === "s2" && handoffCount === 2')
            until(page,'childReady === true')
            state=page.frames[1].evaluate('''() => ({v:typeof nodeVariables === 'undefined' ? variables : nodeVariables})''')
            assert state['v'].get('arrived2')=='yes',state
            assert not errors,errors
            checks+=1
            page.close()
        page=browser.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((directory/'hybrid-random.html').read_text(),wait_until='load')
        until(page,'currentSceneId === "s2" && handoffCount === 2')
        expected=page.evaluate('''() => {const values=[];let a=1234;for(let i=0;i<3;i++){a=(Math.imul(a,1664525)+1013904223)>>>0;values.push(String(1+Math.floor(a/4294967296*1000)));}return values;}''')
        until(page,'childReady === true')
        state=page.frames[1].evaluate('''() => typeof nodeVariables === 'undefined' ? variables : nodeVariables''')
        assert [state.get('roll'+str(i)) for i in range(3)]==expected,(state,expected)
        assert not errors,errors
        checks+=1
        page.close()
        page=browser.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((directory/'hybrid-checkpoint.html').read_text(),wait_until='load')
        until(page,'currentSceneId === "s1" && handoffCount === 1')
        assert page.evaluate('gameState.checkpoint.sceneId')=='s0'
        page.frame_locator('#runtime').locator('#reset').click()
        until(page,'currentSceneId === "s0" && handoffCount === 2')
        until(page,'childReady === true')
        result=page.frames[1].evaluate('''() => ({x:actor.x,restored:nodeVariables.restored})''')
        assert result['x']==24 and result['restored']=='yes',result
        assert not errors,errors
        checks+=1
        page.close()
        page=browser.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((directory/'hybrid-loop.html').read_text(),wait_until='load')
        until(page,'handoffCount === 12')
        assert 'loop stopped' in page.locator('#hybrid-status').inner_text()
        assert not errors,errors
        checks+=1
        page.close()
        page=browser.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        sample=(ROOT/'examples/Hybrid-2D-Voxel-Browser-Demo.html').read_text()
        page.set_content(sample,wait_until='load')
        page.frames[1].locator('#game').focus()
        page.keyboard.down('d');page.wait_for_timeout(1100);page.keyboard.up('d')
        until(page,'currentSceneId === "scene-b"')
        assert not errors,errors
        checks+=1
        page.frames[1].locator('#game').focus()
        page.keyboard.down('d');page.wait_for_timeout(900);page.keyboard.up('d')
        until(page,'currentSceneId === "scene-a" && handoffCount === 2')
        assert not errors,errors
        checks+=1
        page.close()
        browser.close()
        print('HYBRID BROWSER CHECKS:',checks,'PASSED')
