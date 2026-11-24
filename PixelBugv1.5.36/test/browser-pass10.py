"""Pass 10 browser checks for native voxel and sprite-sheet asset importing."""
from pathlib import Path
import io,os,re,struct
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent/'src'
html=(ROOT/'index.html').read_text(encoding='utf8')
scripts=re.findall(r'<script src="([^"]+)"\s*></script>',html)
markup=re.sub(r'<script src="[^"]+"\s*></script>','',html)
markup=re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>','',markup)
def chunk(tag,contents,children=b''):
 return tag.encode()+struct.pack('<II',len(contents),len(children))+contents+children
vxs=b''.join(bytes([x,z,0,1]) for z in range(4) for x in range(4))
palette=bytearray(1024);palette[:4]=bytes((0,166,125,255))
vox=b'VOX '+struct.pack('<I',150)+chunk('MAIN',b'',chunk('SIZE',struct.pack('<III',4,4,2))+chunk('XYZI',struct.pack('<I',16)+vxs)+chunk('RGBA',bytes(palette)))
image=Image.new('RGBA',(32,8),(0,0,0,0))
paint=ImageDraw.Draw(image)
for k,c in enumerate([(255,0,0,255),(0,255,0,255),(0,0,255,255),(255,255,0,255)]):paint.rectangle((k*8,0,k*8+7,7),fill=c)
buffer=io.BytesIO();image.save(buffer,format='PNG');png=buffer.getvalue()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or '/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  page=browser.new_page(viewport={'width':1480,'height':960})
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  page.set_content(markup,wait_until='domcontentloaded')
  for css in ['styles.css','styles-workspaces.css']:page.add_style_tag(content=(ROOT/css).read_text(encoding='utf8'))
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
  for file in scripts:page.add_script_tag(content=(ROOT/file.removeprefix('./')).read_text(encoding='utf8'))
  page.wait_for_timeout(150)
  assert not errors,errors
  page.locator('#play-mode-btn').click()
  page.locator('#play-workspace-builder-btn').click()
  assert page.locator('#play-import-assets:visible').count()==1
  assert page.locator('#play-import-voxel-preview').count()==1
  print('PASS 10 imported asset workspace appears in Game Builder',flush=True)
  page.locator('#play-import-voxel-file').set_input_files({'name':'castle.vox','mimeType':'application/octet-stream','buffer':vox})
  page.wait_for_function("document.querySelector('#play-import-voxel-status').textContent.includes('16 voxels')")
  assert '4 × 4 × 2' in page.locator('#play-import-voxel-status').inner_text()
  page.locator('#play-import-asset-name').fill('My Castle')
  page.locator('#play-import-voxel-object').click()
  result=page.evaluate('''() => ({assets:state.playMode.voxelAssets.map(x=>({name:x.name,size:x.cubes.length})),selected:document.querySelector('#play-voxel-library-select')?.value})''')
  assert result['assets'][0]['name']=='My Castle' and result['assets'][0]['size']==16,result
  print('PASS 10 external MagicaVoxel VOX model previews and stores in reusable voxel library',flush=True)
  page.locator('#play-import-voxel-world').click()
  world=page.evaluate('''() => ({type:state.playMode.worldType,blocks:state.playMode.voxelWorld?.blocks?.length,start:state.playMode.voxelWorld?.start,snapshot:state.playMode.scenes.find(s=>s.id===state.playMode.activeSceneId)?.voxelWorld?.blocks?.length})''')
  assert world['type']=='voxel3d' and world['blocks']==16 and world['snapshot']==16,world
  assert world['start']['y']==1,world
  print('PASS 10 imported landscape is collision-based and saved as active voxel world with safe spawn',flush=True)
  page.locator('#play-import-sprite-cols').fill('4');page.locator('#play-import-sprite-rows').fill('1')
  page.locator('#play-import-sprite-file').set_input_files({'name':'hero-sheet.png','mimeType':'image/png','buffer':png})
  page.wait_for_function("document.querySelector('#play-import-sprite-status').textContent.includes('Ready to import')")
  previous=page.evaluate('state.frames.length')
  page.locator('#play-import-sprite-frames').click()
  sprite=page.evaluate('''() => ({frameCount:state.frames.length,assets:state.playMode.spriteAssets,first:state.frames.at(-4).layers[0].pixels[0][0]})''')
  assert sprite['frameCount']==previous+4 and len(sprite['assets'])==1,sprite
  assert sprite['first']=='#ff0000',sprite
  print('PASS 10 sprite sheet slices to editable Base Mode frames and reusable sprite-set entry',flush=True)
  page.locator('#play-import-sprite-player').click()
  assigned=page.evaluate('''() => ({idle:state.playMode.idleClip,run:state.playMode.runClip,frame:state.playMode.idleFrame,saved:state.playMode.scenes.find(s=>s.id===state.playMode.activeSceneId).idleClip})''')
  assert assigned['idle']==','.join(str(i) for i in range(previous,previous+4)),assigned
  assert assigned['saved']==assigned['idle'],assigned
  persisted=page.evaluate('''() => PixelBugAppApi.cloneProject().playMode.spriteAssets''')
  assert len(persisted)==1 and persisted[0]['frames']==list(range(previous,previous+4)),persisted
  print('PASS 10 imported pixel sprites drive player animation and persist to project and scene snapshots',flush=True)
  page.locator('#play-import-sprite-remove').click()
  assert page.evaluate('state.frames.length')==previous+4
  assert page.evaluate('state.playMode.spriteAssets.length')==0
  print('PASS 10 library removal preserves frames used by gameplay',flush=True)
  saved=page.evaluate('''() => ({state:PixelBugAppApi.cloneProject(),html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
  assert len(saved['state']['playMode']['voxelAssets'])==1
  assert len(saved['state']['frames'])==previous+4
  standalone=browser.new_page();standaloneErrors=[];standalone.on('pageerror',lambda e:standaloneErrors.append(str(e)))
  standalone.set_content(saved['html'],wait_until='domcontentloaded',timeout=30000)
  standalone.wait_for_timeout(300)
  assert standalone.locator('canvas').count()>=1 and not standaloneErrors,standaloneErrors
  standalone.close()
  assert not errors,errors
  print('PASS 10 saved project and standalone HTML boot with imported assets',flush=True)
  page.locator('#play-import-assets').screenshot(path='/mnt/data/PixelBug-Pass-10-Asset-Importer.png')
  print('PASS 10 BROWSER CHECKS: 7/7 passed',flush=True)
 finally:browser.close()
