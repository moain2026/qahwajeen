from playwright.sync_api import sync_playwright
import json
urls=[l.strip() for l in open('/tmp/urls.txt')]
used=set()
JS="""()=>{const out=[];const walk=(rules)=>{for(const r of rules){if(r.selectorText){for(const s of r.selectorText.split(',')){const t=s.trim();const base=t.replace(/::?(before|after|placeholder|selection|marker|-webkit-[a-z-]+)/g,'').replace(/:(hover|focus|focus-visible|focus-within|active|visited)/g,'');try{if(document.querySelector(base||'*'))out.push(t)}catch(e){}}}if(r.cssRules)walk(r.cssRules)}};for(const ss of document.styleSheets){try{walk(ss.cssRules)}catch(e){}}return out}"""
with sync_playwright() as p:
  b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':900})
  for u in urls:
    pg.goto('http://localhost:3000'+u,wait_until='domcontentloaded')
    used|=set(pg.evaluate(JS))
    try:
      pg.click('#menuBtn',timeout=500); used|=set(pg.evaluate(JS))
    except Exception: pass
  b.close()
json.dump(sorted(used),open('/tmp/used.json','w'),ensure_ascii=False)
print(len(used))
