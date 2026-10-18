from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  errs=[]; pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('pageerror',lambda e: errs.append(str(e)))
  for u in ['/','/menu','/links','/booking','/gallery']:
    pg.goto('https://qahwajeen.com'+u,wait_until='networkidle')
    ov=pg.evaluate('document.documentElement.scrollWidth-innerWidth')
    print(u,'overflow',ov)
  pg.goto('https://qahwajeen.com/'); pg.screenshot(path='/tmp/live_home.png')
  pg.click('#menuBtn'); pg.wait_for_timeout(400); print('menu open:',pg.get_attribute('#menuBtn','aria-expanded'))
  pg.goto('https://qahwajeen.com/booking'); pg.click('.conc-pills[data-conc-group="occ"] .conc-pill:nth-child(2)')
  print('booking wa:', pg.get_attribute('#concWaBtn','href')[:60])
  print('console errors:',errs)
  b.close()
