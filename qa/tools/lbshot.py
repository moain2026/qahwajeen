import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:3000'
tag=sys.argv[2] if len(sys.argv)>2 else 'loc'
with sync_playwright() as p:
  b=p.chromium.launch()
  for w,h in [(320,640),(390,844),(1280,800)]:
    pg=b.new_page(viewport={'width':w,'height':h})
    pg.goto(base+'/gallery',wait_until='networkidle')
    it=pg.locator('.galx-it').nth(2); it.scroll_into_view_if_needed(); it.click(); pg.wait_for_timeout(700)
    r=pg.evaluate("""()=>{const q=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};
    return {open:document.querySelector('#lbx').open,dlg:q('#lbx'),img:q('#lbx img'),cap:q('#lbxCap'),x:q('.lbx-x'),prev:q('.lbx-prev'),next:q('.lbx-next'),sw:document.documentElement.scrollWidth,iw:innerWidth,htmlOv:getComputedStyle(document.documentElement).overflow}}""")
    print(w,r)
    pg.screenshot(path=f'/tmp/lb-{tag}-{w}.png')
    pg.close()
  b.close()
