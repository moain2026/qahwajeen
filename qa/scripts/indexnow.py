#!/usr/bin/env python3
"""
Ping IndexNow (Bing, Yandex, Seznam, Naver share one endpoint) with every
URL in the live sitemap. Run once after each production deploy.

  python3 qa/scripts/indexnow.py            # submit all sitemap URLs
  python3 qa/scripts/indexnow.py --dry      # print what would be sent

Google does not use IndexNow: it discovers changes from sitemap.xml
(<lastmod>) and from Search Console → Sitemaps.
"""
import json
import re
import sys
import urllib.request

SITE = "https://qahwajeen.com"
src = open(__file__.rsplit("/qa/", 1)[0] + "/src/data.ts", encoding="utf-8").read()
KEY = re.search(r"indexNowKey:\s*'([0-9a-f]+)'", src).group(1)

xml = urllib.request.urlopen(SITE + "/sitemap.xml", timeout=30).read().decode()
urls = re.findall(r"<loc>([^<]+)</loc>", xml)
key_ok = urllib.request.urlopen(f"{SITE}/{KEY}.txt", timeout=30).read().decode().strip() == KEY
print(f"{len(urls)} URLs · key file {'OK' if key_ok else 'MISSING — deploy first'}")
if not key_ok:
    sys.exit(1)
body = {"host": "qahwajeen.com", "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls}
if "--dry" in sys.argv:
    print(json.dumps(body, indent=1)[:600])
    sys.exit(0)
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=json.dumps(body).encode(),
                             headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
try:
    r = urllib.request.urlopen(req, timeout=30)
    print("IndexNow", r.status, "(200/202 = accepted)")
except urllib.error.HTTPError as e:
    print("IndexNow", e.code, e.read().decode()[:200])
    sys.exit(1)
