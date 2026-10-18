# Agent instructions

Read `HANDOFF.md` first (Arabic). It is the single source for rules, workflow,
deploy procedure, research, past failures and pending work.

Hard rules (summary):
- Brand «القهوة الملكية», domain qahwajeen.com, Jeddah only. Phone/WhatsApp 0504968113, email qahwajeen@gmail.com.
- No prices, packages, reviews, partner logos, unprovable claims. One URL per search intent.
- Never print or commit secrets. No DNS / nameserver / purchase / delete actions without explicit owner request.
- Production commits authored by `MoTechSys <256226456+MoTechSys@users.noreply.github.com>`.
- Before claiming done: `qa/scripts/index_audit.py`, `seo.py`, `btn.py`, Lighthouse — locally and on https://qahwajeen.com after deploy.
- Bump `V` in `src/layout.tsx` on any CSS/JS change.
- Reply to the owner in Arabic, concise, with measured numbers and an explicit "not verified" list.
