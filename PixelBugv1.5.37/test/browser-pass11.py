"""Chromium regression for multi-model VOX scenes and shared sprite libraries."""
from pathlib import Path
import os,re,struct,io
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent/'src'
html=(ROOT/'index.html').read_text(encoding='utf8')
scripts=re.findall(r'<script src="([^"]+)"\s*></script>',html)
markup=re.sub(r'<script src="[^"]+"\s*></script>','',html)
markup=re.sub(r'<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>','',markup)
def chunk(tag,data=b'',children=b''):
 return tag.encode()+struct.pack('<II',len(data),len(children))+data+children
def i(n):return struct.pack('<i',n)
def dic(d=None):
 d=d or {};return i(len(d))+b''.join(i(len(x.encode()))+x.encode() for pair in d.items() for x in pair)
def shape(node,model):return chunk('nSHP',i(node)+dic()+i(1)+i(model)+dic())
def trn(node,child,x):return chunk('nTRN',i(node)+dic()+i(child)+i(-1)+i(0)+i(1)+dic({'_t':f'{x} 0 0','_r':'4'}))
base=chunk('nGRP',i(0)+dic()+i(2)+i(1)+i(2))
scene=base+trn(1,3,0)+trn(2,4,8)+shape(3,0)+shape(4,1)
models=b''
for color in [1,2]:
 cells=b''.join(bytes((x,z,0,color)) for z in range(4) for x in range(4))
 models+=chunk('SIZE',struct.pack('<III',4,4,2))+chunk('XYZI',struct.pack('<I',16)+cells)
palette=bytearray(1024);palette[:8]=bytes((170,90,21,255,20,210,100,255))
vox=b'VOX '+struct.pack('<I',150)+chunk('MAIN',b'',models+chunk('RGBA',bytes(palette))+scene)
img=Image.new('RGBA',(16,32),(0,0,0,0));paint=ImageDraw.Draw(img)
for index in range(8):
 x=index%2*8;y=index//2*8
 paint.rectangle((x,y,x+7,y+7),fill=((index*25+20)%256,(index*45+40)%256,(index*70+20)%256,255))
buffer=io.BytesIO();img.save(buffer,format='PNG');png=buffer.getvalue()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or '/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  page=browser.new_page(viewport={'width':1520,'height':1040});page.set_default_timeout(12000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(markup,wait_until='domcontentloaded')
  for name in ['styles.css','styles-workspaces.css']:page.add_style_tag(content=(ROOT/name).read_text(encoding='utf8'))
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}});window.pixelBug={getSessionRecovery:async()=>null};}''')
  for name in scripts:page.add_script_tag(content=(ROOT/name.removeprefix('./')).read_text(encoding='utf8'))
  page.wait_for_timeout(150)
  assert not errors,errors
  page.locator('#play-mode-btn').click();page.locator('#play-workspace-builder-btn').click()
  page.locator('#play-import-voxel-file').set_input_files({'name':'two-towers.vox','mimeType':'application/octet-stream','buffer':vox})
  page.wait_for_function("document.querySelector('#play-import-voxel-status').textContent.includes('32 voxels')")
  info=page.locator('#play-import-voxel-status').inner_text()
  assert '2 model(s), 2 scene instance(s)' in info,info
  page.locator('#play-import-voxel-yaw').select_option('1')
  assert page.evaluate("document.getElementById('play-import-voxel-preview').getContext('2d').getImageData(112,63,1,1).data.length") ==4
  print('PASS 11 transformed multi-model VOX scene renders in rotatable preview',flush=True)
  page.locator('#play-import-asset-name').fill('Twin Towers')
  page.locator('#play-import-voxel-object').click()
  entry=page.evaluate('state.playMode.voxelAssets.at(-1)')
  assert entry['name']=='Twin Towers' and len(entry['cubes'])==32,entry
  page.locator('#play-import-voxel-rename').fill('Custom Twin Towers')
  page.locator('#play-import-voxel-rename-button').click()
  assert page.evaluate('state.playMode.voxelAssets.at(-1).name')=='Custom Twin Towers'
  print('PASS 11 multi-model imported voxel assets are reusable and rename without ID changes',flush=True)
  page.locator('#play-import-voxel-world').click()
  world=page.evaluate("({blocks:state.playMode.voxelWorld.blocks.length,type:state.playMode.worldType})")
  assert world['blocks']==32 and world['type']=='voxel3d',world
  print('PASS 11 combined voxel scene becomes solid playable terrain',flush=True)
  page.locator('#play-workspace-close-btn').click()
  page.locator('#play-workspace-scene-btn').click()
  page.locator('#play-scene-add-btn').click()
  scenes=page.evaluate('state.playMode.scenes.map(x=>({id:x.id,name:x.name}))')
  assert len(scenes)>=2,scenes
  page.locator('#play-workspace-close-btn').click()
  page.locator('#play-workspace-builder-btn').click()
  page.locator('#play-import-sprite-cols').fill('2');page.locator('#play-import-sprite-rows').fill('4')
  page.locator('#play-import-sprite-offset-x').fill('1')
  page.locator('#play-import-sprite-file').set_input_files({'name':'hero-8.png','mimeType':'image/png','buffer':png})
  page.wait_for_function("document.querySelector('#play-import-sprite-status').textContent.includes('Ready to import')")
  first=page.evaluate('state.frames.length')
  page.locator('#play-import-sprite-frames').click()
  data=page.evaluate('''() => ({asset:state.playMode.spriteAssets.at(-1),shifted:state.frames.at(-8).layers[0].pixels[0].slice(0,3)})''')
  assert len(data['asset']['frames'])==8 and data['shifted'][0] is None and data['shifted'][1] is not None,data
  print('PASS 11 imported frames honor per-sheet alignment without changing Base Mode dimensions',flush=True)
  page.locator('#play-import-sprite-rename').fill('Hero Eight')
  page.locator('#play-import-sprite-rename-button').click()
  assert page.evaluate('state.playMode.spriteAssets.at(-1).name')=='Hero Eight'
  page.locator('#play-import-sprite-library-preview').click(position={'x':170,'y':20})
  assert 'Selected sprite frame' in page.locator('#play-import-sprite-status').inner_text()
  print('PASS 11 sprite thumbnail gallery supports safe selection and metadata rename',flush=True)
  page.locator('#play-import-target-scene').select_option(scenes[0]['id'])
  page.locator('#play-import-idle-row').fill('4');page.locator('#play-import-run-row').fill('2')
  page.locator('#play-import-row-left').fill('4');page.locator('#play-import-idle-ticks').fill('12');page.locator('#play-import-run-ticks').fill('4')
  before=page.evaluate('state.playMode.scenes.map(s=>s.idleClip)')
  page.locator('#play-import-sprite-player').click()
  after=page.evaluate('''() => state.playMode.scenes.map(s=>({id:s.id,idle:s.idleClip,run:s.runClip,left:s.leftClip,ticks:s.idleClipTicks}))''')
  target=next(s for s in after if s['id']==scenes[0]['id'])
  other=next(s for s in after if s['id']==scenes[1]['id'])
  assert target['idle']==f'{first+6},{first+7}' and target['ticks']==12 and target['left']==f'{first+6},{first+7}',after
  assert other['idle']==before[1],after
  page.locator('#play-import-target-scene').select_option('all')
  page.locator('#play-import-sprite-player').click()
  assert all(s['idleClip']==f'{first+6},{first+7}' for s in page.evaluate('state.playMode.scenes')), 'all scenes not updated'
  print('PASS 11 custom directional clips and timing update selected worlds or all worlds',flush=True)
  saved=page.evaluate('''() => ({project:PixelBugAppApi.cloneProject(),html:PixelBugTinyGameExport.buildTinyGameHtml(buildTinyGamePayload())})''')
  assert len(saved['project']['playMode']['spriteAssets'])==1
  assert len(saved['project']['playMode']['scenes'])>=2
  standalone=browser.new_page();standaloneErrors=[];standalone.on('pageerror',lambda e:standaloneErrors.append(str(e)))
  standalone.set_content(saved['html'],wait_until='domcontentloaded',timeout=30000)
  standalone.wait_for_timeout(250)
  assert standalone.locator('iframe').count()>=1 and not standaloneErrors,standaloneErrors
  frame=standalone.frame_locator('iframe').first
  assert frame.locator('canvas').count()>=1, 'embedded game canvas did not boot'
  standalone.close()
  print('PASS 11 cross-scene asset assignments survive project saves and standalone HTML boot',flush=True)
  assert not errors,errors
  page.locator('#play-import-assets').screenshot(path='/mnt/data/PixelBug-Pass-11-Asset-Importer.png')
  print('PASS 11 BROWSER CHECKS: 8/8 passed',flush=True)
 finally:browser.close()
