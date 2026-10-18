from playwright.sync_api import sync_playwright
import sys
P=sys.argv[1:] or ['/','/menu','/qahwajiat-jeddah','/gallery','/links']
with sync_playwright() as p:
  b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':800})
  for u in P:
    pg.goto('http://localhost:3000'+u,wait_until='networkidle')
    r=pg.evaluate("""()=>[...document.querySelectorAll('a,button,summary')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!='hidden'&&(r.height<44||r.width<44)&&!e.closest('.top-pages:not(.open)')&&!e.closest('.skip')}).map(e=>e.className+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)+' '+e.textContent.trim().slice(0,20))""")
    print(u, sorted(set(r)))
  b.close()
