"""Editor session browser checks."""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROMIUM = os.environ.get("CHROMIUM_EXECUTABLE", "/usr/bin/chromium")
MODULES = ["play-session-state", "play-session-controls", "play-editor-session"]


def document():
    scripts = "".join("<script>" + (ROOT / "src" / "modules" / (name + ".js")).read_text().replace("</script", "<\\/script") + "</script>" for name in MODULES)
    return """<!doctype html><html><head><meta charset='utf-8'></head><body><main><section id='editor-controls'></section></main>""" + scripts + """<script>
    const memory = new Map();
    Object.defineProperty(window,'localStorage',{configurable:true,value:{
      setItem:(key,value)=>memory.set(key,String(value)),getItem:key=>memory.get(key)??null,
      removeItem:key=>memory.delete(key)}});
    const sceneModes=[{id:'home',worldType:'sidescroller'}, {id:'cave',worldType:'voxel3d'}];
    let running=true, active='home', tick=10, actor={x:10,y:20,z:0}, recorded=false;
    let runtime={variables:{score:'1'},inventory:['key'],checkpoint:null};
    const pm={scenes:sceneModes,activeSceneId:active,worldType:'sidescroller',nodeEditor:{runtime},dialogue:{currentLine:0}};
    window.confirm=()=>true;
    const oldState={sceneId:'home',mode:'sidescroller',actor:{x:71,y:20},variables:{score:'3'}};
    window.legacyPortable=PixelBugPlaySessionState.packSave(oldState,{home:'sidescroller',cave:'voxel3d'},'Example|home|cave');
    PixelBugPlaySessionState.createStorage(window.localStorage,'Example|home|cave').save(3,oldState,{home:'sidescroller',cave:'voxel3d'});
    const bridge=PixelBugPlayEditorSession.create({document,window,container:()=>document.querySelector('#editor-controls'),
      running:()=>running,title:()=> 'Example',projectId:()=> 'project-1234567890abcdef', playMode:()=>pm,tick:()=>tick,setTick:value=>{tick=value;},
      rules:()=>({captureSession:()=>({randomState:777,queue:[],entered:[],continuation:null}),restoreSession:()=>{}}),
      actor:()=>actor, camera:()=>({x:0}),entered:()=>[],checkpoint:()=>null,
      dialogue:()=>({active:false,line:0}),message:()=>'',finished:()=>false,setFinished:()=>{},
      pause:()=>{},changeScene:id=>{pm.activeSceneId=id;pm.worldType=sceneModes.find(s=>s.id===id).worldType;},
      applyActor:next=>{actor=next;},applyCamera:()=>{},applyDialogue:()=>{},applyMessage:()=>{},finishRestore:()=>{},
      savePortable:async (text,name)=>{window.exported={text,name};return true;}});
    bridge.mount();
    window.demo={bridge,get actor(){return actor;},setX:x=>{actor.x=x;},setScene:id=>{pm.activeSceneId=id;pm.worldType=sceneModes.find(s=>s.id===id).worldType;},
      advance:()=>{tick+=2;bridge.frame();},setRunning:b=>{running=b;}};
    </script></body></html>"""


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=CHROMIUM,
            args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_page(accept_downloads=True)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.set_content(document(), wait_until="load", timeout=12000)
        checks = 0
        panel = page.locator("#editor-controls")
        panel.get_by_role("button", name="Save game").click()
        assert "Saved to slot 1" in panel.locator(".session-message").inner_text()
        page.evaluate("demo.setX(99)")
        panel.get_by_role("button", name="Load game").click()
        assert page.evaluate("demo.actor.x") == 10
        checks += 1
        panel.get_by_role("button", name="Start recording").click()
        page.evaluate("demo.setX(20);demo.advance();demo.setScene('cave');demo.setX(25);demo.advance()")
        panel.get_by_role("button", name="Stop recording").click()
        assert "3 frames" in panel.locator(".session-message").inner_text()
        panel.get_by_role("button", name="Replay session").click()
        assert "Replaying" in panel.locator(".session-message").inner_text()
        page.wait_for_timeout(150)
        assert page.evaluate("demo.actor.x") == 25
        checks += 1
        panel.get_by_role("button", name="Download replay").click()
        page.wait_for_timeout(50)
        assert page.evaluate("exported.name") == "pixelbug-replay.pbreplay"
        assert page.evaluate("JSON.parse(exported.text).checksum.length") == 8
        checks += 1
        page.evaluate("demo.setScene('home');demo.setX(65)")
        panel.get_by_role("button", name="Download save file").click()
        assert page.evaluate("exported.name") == "pixelbug-save.pbsave"
        checks += 1
        panel.locator("#session-slot").select_option("3")
        panel.get_by_role("button", name="Recover an older title-based save after confirming its identity").click()
        assert "Older save recovered" in panel.locator(".session-message").inner_text()
        assert page.evaluate("demo.actor.x") == 71
        checks += 1
        page.evaluate("demo.setX(200)")
        legacy_data = page.evaluate("legacyPortable").encode("utf8")
        panel.locator("#session-save-file").set_input_files({"name": "old.pbsave", "mimeType": "application/json", "buffer": legacy_data})
        page.wait_for_timeout(70)
        assert "Saved game imported" in panel.locator(".session-message").inner_text()
        assert page.evaluate("demo.actor.x") == 71
        checks += 1
        page.evaluate("demo.setX(250);window.confirm=()=>false")
        panel.locator("#session-save-file").set_input_files({"name": "old.pbsave", "mimeType": "application/json", "buffer": legacy_data})
        page.wait_for_timeout(70)
        assert "Legacy import cancelled" in panel.locator(".session-message").inner_text()
        assert page.evaluate("demo.actor.x") == 250
        checks += 1
        page.evaluate("demo.setRunning(false)")
        panel.get_by_role("button", name="Save game").click()
        assert "Start the Play Mode tester" in panel.locator(".session-message").inner_text()
        checks += 1
        assert not errors, errors
        browser.close()
        print(f"EDITOR SESSION BROWSER CHECKS: {checks}/{checks} passed")


if __name__ == "__main__":
    main()
