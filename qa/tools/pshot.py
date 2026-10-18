import sys
from playwright.sync_api import sync_playwright
u,out,h=sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 2400
with sync_playwright() as p:
  b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
  pg.goto('http://localhost:3000'+u,wait_until='networkidle')
  pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');document.querySelector('.bnav')&&(document.querySelector('.bnav').style.display='none')")
  pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(400)
  pg.screenshot(path=out,full_page=True)
  b.close()
from PIL import Image
im=Image.open(out); print(im.size); im.crop((0,0,390,min(h,im.size[1]))).save(out)
