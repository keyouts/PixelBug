"""Session tests."""
import os
import subprocess
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
CHROMIUM = os.environ.get('CHROMIUM_EXECUTABLE', '/usr/bin/chromium')


def until(page, expression):
    for _ in range(120):
        try:
            if page.evaluate(expression):
                return
        except Exception:
            pass
        page.wait_for_timeout(80)
    raise AssertionError('Timed out: ' + expression)


def open_fixture(page, folder, filename):
    page.evaluate('''() => {
        const items = new Map();
        Object.defineProperty(window,'localStorage',{
          configurable:true,value:{
            getItem:key=>items.has(key)?items.get(key):null,
            setItem:(key,value)=>items.set(key,String(value)),
            removeItem:key=>items.delete(key)
          }
        });
    }''')
    page.set_content((folder / filename).read_text(), wait_until='load')


def check_download(page, hybrid):
    with page.expect_download(timeout=5000) as downloaded:
        if hybrid:
            page.evaluate('document.getElementById("download-save").click()')
        else:
            page.locator('[data-action="save-file"]').click()
    assert downloaded.value.suggested_filename.endswith('.pbsave')
    return downloaded.value.path()


def main():
    with tempfile.TemporaryDirectory(prefix='pixelbug-browser-session-') as directory:
        folder = Path(directory)
        subprocess.run(['node', str(HERE / 'browser-session-fixtures.cjs')],
                       env={**os.environ, 'PIXELBUG_BROWSER_FIXTURE_DIR': directory}, check=True)
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True, executable_path=CHROMIUM,
                args=['--no-sandbox', '--disable-dev-shm-usage'])
            checks = 0
            for mode in ('2d','voxel'):
                page = browser.new_page(accept_downloads=True)
                errors = []
                page.on('pageerror', lambda err: errors.append(str(err)))
                open_fixture(page, folder, f'{mode}-session.html')
                page.get_by_role('button', name='Save game').wait_for()
                page.wait_for_timeout(180)
                original = page.evaluate('actor.x')
                page.get_by_role('button', name='Save game').click()
                until(page, 'document.querySelector(".session-message").textContent.includes("Saved to slot 1")')
                moved = page.evaluate('() => { const before=actor.x; actor.x+=32; return actor.x-before; }')
                assert moved == 32
                page.get_by_role('button', name='Load game').click()
                assert abs(page.evaluate('actor.x') - original) < 1, mode
                checks += 1
                page.get_by_role('button', name='Start recording').click()
                page.locator('#game').focus()
                page.keyboard.down('d')
                page.wait_for_timeout(220)
                page.keyboard.up('d')
                page.get_by_role('button', name='Stop recording').click()
                assert 'frames' in page.locator('.session-message').inner_text()
                page.get_by_role('button', name='Replay session').click()
                assert 'Replaying' in page.locator('.session-message').inner_text()
                page.wait_for_timeout(340)
                assert not errors, errors
                checks += 1
                with page.expect_download(timeout=5000) as replay_download:
                    page.locator('[data-action="replay-file"]').click()
                downloaded_replay = replay_download.value
                assert downloaded_replay.suggested_filename.endswith('.pbreplay')
                page.locator('#session-replay-file').set_input_files(str(downloaded_replay.path()))
                until(page, 'document.querySelector(".session-message").textContent.includes("Replay imported")')
                checks += 1
                saved_x = page.evaluate('actor.x')
                file_path = check_download(page, False)
                checks += 1
                page.evaluate('actor.x += 75')
                page.locator('#session-save-file').set_input_files(str(file_path))
                until(page, 'document.querySelector(".session-message").textContent.includes("Saved game imported")')
                assert abs(page.evaluate('actor.x') - saved_x) < 1, mode
                checks += 1
                page.close()
            page = browser.new_page(accept_downloads=True)
            errors = []
            page.on('pageerror', lambda err: errors.append(str(err)))
            open_fixture(page, folder, 'hybrid-session.html')
            until(page, 'childReady === true')
            page.evaluate('document.getElementById("save-game").click()')
            until(page, 'sessionStatus.textContent.includes("Saved game to slot 1")')
            original = page.frames[1].evaluate('actor.x')
            page.frames[1].evaluate('actor.x += 67')
            page.evaluate('document.getElementById("load-game").click()')
            until(page, 'childReady === true')
            assert page.frames[1].evaluate('actor.x') == original
            checks += 1
            page.evaluate('document.getElementById("record-game").click()')
            page.wait_for_timeout(130)
            page.frames[1].evaluate("loadRuntimeScene('cave')")
            until(page, 'childReady === true && currentSceneId === "cave"')
            page.wait_for_timeout(140)
            page.frames[1].evaluate("loadScene('home')")
            until(page, 'childReady === true && currentSceneId === "home"')
            page.wait_for_timeout(140)
            page.evaluate('document.getElementById("stop-record").click()')
            scenes = page.evaluate('lastTape.frames.map(frame=>frame.sceneId)')
            assert 'home' in scenes and 'cave' in scenes and scenes[-1] == 'home', scenes
            checks += 1
            page.evaluate('document.getElementById("play-record").click()')
            until(page, 'playing === true')
            page.wait_for_timeout(450)
            assert not errors, errors
            page.evaluate('document.getElementById("stop-replay").click()')
            until(page, 'childReady === true && playing === false')
            checks += 1
            with page.expect_download(timeout=5000) as replay_download:
                page.evaluate('document.getElementById("download-record").click()')
            downloaded_replay = replay_download.value
            assert downloaded_replay.suggested_filename.endswith('.pbreplay')
            page.locator('#record-file').set_input_files(str(downloaded_replay.path()))
            until(page, 'sessionStatus.textContent.includes("Loaded replay with")')
            checks += 1
            saved_x = page.frames[1].evaluate('actor.x')
            file_path = check_download(page, True)
            checks += 1
            page.frames[1].evaluate('actor.x += 75')
            page.locator('#save-file').set_input_files(str(file_path))
            until(page, 'childReady === true && sessionStatus.textContent.includes("Saved game loaded")')
            assert abs(page.frames[1].evaluate('actor.x') - saved_x) < 1
            checks += 1
            result = page.evaluate('''async () => {
              const saving=requestSnapshot().then(()=>"saved",error=>error.message);
              openHybridScene("cave");
              return await saving;
            }''')
            assert result == 'Scene changed while saving.', result
            until(page, 'childReady === true && currentSceneId === "cave"')
            checks += 1
            page.close()
            browser.close()
            print(f'SESSION BROWSER CHECKS: {checks}/{checks} passed')


if __name__ == '__main__':
    main()
