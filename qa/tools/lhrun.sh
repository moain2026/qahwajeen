mkdir -p /tmp/lh; cd "${LH_DIR:-.}"
for u in "$@"; do n=$(echo $u | tr / _); CHROME_PATH=${CHROME_PATH:?set CHROME_PATH to a Chromium binary} timeout 100 npx lighthouse http://localhost:3000$u --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/tmp/lh/p$n.json --quiet; python3 -c "
import json;d=json.load(open('/tmp/lh/p$n.json'));c=d['categories'];a=d['audits']
print('$u',[round(v['score']*100) for v in c.values()],'LCP',a['largest-contentful-paint']['displayValue'],'TBT',a['total-blocking-time']['displayValue'],'CLS',a['cumulative-layout-shift']['displayValue'])"; done
