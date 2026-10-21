<div dir="rtl">

# 06 — النشر

> **الإنتاج: https://qahwajeen.com على Vercel، ينشر تلقائيًا من فرع `main`
> في المستودع الخاص `MoTechSys/qahwajeen`.**

| العنصر | القيمة |
|---|---|
| المستودع | `MoTechSys/qahwajeen` (خاص، **للنشر**) — `main` = الإنتاج · نسخة مطابقة **للتطوير**: `moain2026/qahwajeen` (عام) — المزامنة في `HANDOFF.md` §2 |
| Vercel | مشروع `qahwajeen` في `motechsys-projects` · `buildCommand: npm run build:vercel` · `installCommand: npm ci` |
| الدومين | Spaceship · NS `launch1/launch2.spaceship.net` |
| DNS | `A @ 216.198.79.1` · `A @ 64.29.17.1` · `CNAME www → *.vercel-dns-017.com` |
| SSL | تلقائي من Vercel (الجذر + www) |
| التوجيه | `http→https` 308 · `www→الجذر` 301 · `*.vercel.app` = `noindex` |

> **لا تُغيّر DNS ولا Nameservers ولا تشترِ ولا تحذف شيئًا دون طلب صريح من المالك.**

---

## 1. التشغيل محليًا

```bash
npm ci
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000     # نفس بيئة الحافة
npm run build:vercel                                      # تأكد أن بناء الإنتاج ينجح
```

## 2. خطوات كل نشر

1. **قبل الدفع — كلها يجب أن تنجح محليًا:**
   ```bash
   npx tsc --noEmit -p .
   npm run build && npm run build:vercel
   python3 qa/scripts/index_audit.py      # issues: 0
   python3 qa/scripts/seo.py              # issues: 0
   python3 qa/scripts/btn.py              # clipped: 0 · under-44px: 0
   python3 qa/scripts/e2e.py              # اضغط كل شيء — failures: 0
   ```
2. **الكوميت باسم المالك فقط:**
   `MoTechSys <256226456+MoTechSys@users.noreply.github.com>`
   (Vercel يرفض/لا ينسب نشرًا لمؤلف غير معروف لفريق المشروع).
3. ادفع إلى `main` في `MoTechSys/qahwajeen` → Vercel يبني وينشر (≈ 30 ثانية).
4. **بعد النشر — على الموقع الحي:**
   ```bash
   python3 qa/scripts/index_audit.py https://qahwajeen.com
   python3 qa/scripts/seo.py https://qahwajeen.com
   python3 qa/scripts/indexnow.py          # إبلاغ Bing/Yandex بالتحديث
   # + Lighthouse جوال على / و /menu و /gallery
   ```
5. سجّل رقم الكوميت ومعرّف النشر ونتائج الفحص.

## 3. الأسرار

- **لا يوجد أي مفتاح في المستودع.** رموز Vercel وGitHub محفوظة خارج
  المستودع على جهاز المطوّر فقط.
- مفتاح IndexNow في `data.ts` **علني بطبيعة البروتوكول** (يُخدم على
  `/{key}.txt`) — ليس سرًا.
- يُنصح بتدوير رموز Vercel/GitHub دوريًا.

## 4. الترويسات

| المصدر | المسار | الترويسات |
|---|---|---|
| `vercel.json` | `/static/(.*)` | `Cache-Control: public, max-age=31536000, immutable` |
| `vercel.json` + `src/index.tsx` | الكل | `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `X-Frame-Options: SAMEORIGIN` · `Permissions-Policy` · `Strict-Transport-Security` |
| `src/index.tsx` | HTML | `Cache-Control: public, max-age=0, must-revalidate` |

## 5. منصّات بديلة (غير مستخدمة حاليًا)

| المنصّة | الأمر | ملاحظة |
|---|---|---|
| Cloudflare Pages | `npm run build && npx wrangler pages deploy dist --project-name royal-coffee` | `public/_headers` للكاش |
| Docker / VPS | `docker build -t qahwajeen . && docker run -p 8080:8080 qahwajeen` | `src/server.node.ts` |

## 6. التراجع

في Vercel → Deployments → النشر السابق → **Promote to Production**. أو
`git revert` للكوميت ودفعه إلى `main`.

</div>
