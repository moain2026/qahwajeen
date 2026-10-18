from playwright.sync_api import sync_playwright
P=['/','/services','/menu','/gallery','/links','/booking','/qahwajiat-jeddah','/faq']
with sync_playwright() as p:
  b=p.chromium.launch()
  for w in (320,390):
    pg=b.new_page(viewport={'width':w,'height':800})
    for u in P:
      pg.goto('http://localhost:3000'+u,wait_until='networkidle')
      r=pg.evaluate("""()=>({ov:document.documentElement.scrollWidth-innerWidth,h:document.querySelector('#hdr').getBoundingClientRect().height,
        small:[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!='hidden'&&(r.height<44)&&!e.closest('.top-pages:not(.open)')&&!e.closest('.ftr')}).length})""")
      print(w,u,r)
  b.close()
