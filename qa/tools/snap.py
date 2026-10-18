import sys
from playwright.sync_api import sync_playwright
out=sys.argv[1]
P=['/','/services','/services/royal','/occasions','/qahwajiat-jeddah','/menu','/gallery','/faq','/booking','/links','/nope']
import os; os.makedirs(out,exist_ok=True)
with sync_playwright() as p:
  b=p.chromium.launch()
  for w in (390,1280):
    ctx=b.new_context(viewport={'width':w,'height':900},reduced_motion='reduce')
    pg=ctx.new_page()
    for u in P:
      pg.goto('http://localhost:3000'+u,wait_until='networkidle')
      pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
      pg.wait_for_load_state('networkidle')
      pg.wait_for_timeout(300)
      pg.screenshot(path=f"{out}/{w}{u.replace('/','_') or '_'}.png",full_page=True)
    if w==390:
      pg.goto('http://localhost:3000/'); pg.click('#menuBtn'); pg.wait_for_timeout(400); pg.screenshot(path=f"{out}/390_menu_open.png")
  b.close()
