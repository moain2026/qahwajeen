// Drop a rule only if NONE of its selectors matched any element in any page (browser-verified),
// keeping state classes JS toggles, universal/element selectors, @font-face/@keyframes.
const postcss=require('/tmp/purge/node_modules/postcss');const fs=require('fs');
const used=new Set(JSON.parse(fs.readFileSync('/tmp/used.json')));
const STATE=/\.(open|in|stuck|hide|on|show|js)\b|\[hidden\]|\[aria-|:not\(|lbx|dialog|::backdrop|\.toast/;
const norm=x=>x.replace(/\s*([>+~])\s*/g,'$1').trim(); const usedN=new Set([...used].map(norm)); const keep=s=>{s=s.trim(); if(used.has(s)||usedN.has(norm(s)))return true; if(STATE.test(s))return true; if(!/[.#\[]/.test(s))return true; return false};
const root=postcss.parse(fs.readFileSync('/tmp/style.full.css','utf8'));
let removed=0;
root.walkComments(c=>c.remove());
root.walkRules(r=>{ if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;
  const k=r.selectors.filter(keep); if(!k.length){r.remove();removed++} else if(k.length<r.selectors.length){r.selectors=k} });
root.walkAtRules(a=>{ if(a.name==='media'&&!a.nodes.length)a.remove() });
// drop unused keyframes
const css0=root.toString(); 
root.walkAtRules(/keyframes$/,a=>{ const n=a.params.trim(); const re=new RegExp('animation(-name)?:[^;}]*\\b'+n+'\\b'); if(!re.test(css0))a.remove() });
let out=root.toString().replace(/\n\s*\n+/g,'\n');
fs.writeFileSync('/tmp/style.safe.css',out); console.log('rules removed',removed,'bytes',out.length);
