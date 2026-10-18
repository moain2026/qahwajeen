/**
 * OnePage Royal Merge — Built on the exact visual cadence & proportions
 * of keifaldiafa.com while retaining our emerald-gold identity ("القهوة الملكية — ROYAL COFFEE")
 * and full in-page expandable details:
 *
 * 1. First Screen: Royal Emerald & Gold Frosted Glass Card (.hero-art .glass) + 2 CTAs.
 * 2. Who We Serve (#who): 3 compact side-by-side cards (109×146px on mobile) —
 *    الجهات الحكومية · الشركات والمؤتمرات · المناسبات الخاصة (fits in half a screen!).
 * 3. Our Works (#works): Horizontal swipeable gallery rail (250×334px cards) with
 *    category pills + "عرض كل الصور (33)" inline expansion & full-screen Lightbox.
 * 4. Partners of Success (#partners): "شركاء النجاح — جهات وشركات وثقت بنا"
 *    3×3 compact badge grid on a pearl/ivory luxury surface + expandable 18 partners.
 * 5. Crew & Attire (#crew): "اختر زيّ طاقمك" — compact swipeable cards (200×268px).
 * 6. Offerings & Hospitality Menu (#menu): "ما الذي يصل إلى ضيوفك؟" — interactive
 *    category tabs + compact 2-column square cards (170×170px).
 * 7. All Services (#services): "كل ما تحتاجه مناسبتك — من طاقم واحد" — grouped
 *    into (الطاقم الرجالي · الطاقم النسائي · التجهيزات واللمسات الملكية) in a compact
 *    2-column grid (168×110px image) where each card expands inline (<details>) to
 *    reveal full service details & direct WhatsApp booking without giant images!
 * 8. Crew Roles (#roles) + Team Arrangements (#arrangements): "ماذا يفعل طاقمنا" &
 *    "كيف نرتّب الطاقم لمناسبتك" (no prices).
 * 9. Why Royal Coffee (#why): 6 compact diamond-bulleted bars.
 * 10. FAQ (#faq) + Closing Contact Card (#contact).
 */
import type { Child } from 'hono/jsx'
import {
  BRAND,
  SERVICES,
  OCCASIONS,
  MENU,
  GALLERY,
  FAQ,
  STAFF,
  ROLES,
  WHY,
  AUDIENCE,
  PARTNERS,
  ARRANGEMENTS,
  type Service,
} from './data'
import { Img, HeroPic, Faq } from './ui'
import { Ico, wa } from './blocks'

/** first-screen copy is ONE short line — cut at a clause/word boundary */
export const oneLine = (t: string, max = 88) => {
  const c = t.split(/[.،—–:]/)[0].trim()
  if (c.length <= max && c.length > 20) return c
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

const n2 = (i: number) => String(i + 1).padStart(2, '0')

/* ── section header ─────────────────────────────────────────── */
const Head = ({ k, t, sub, start, light }: { k: string; t: string; sub?: string; start?: boolean; light?: boolean }) => (
  <header class={'sx-head rv' + (start ? ' sx-start' : '') + (light ? ' sx-light' : '')}>
    <p class="sx-k">{k}</p>
    <h2>{t}</h2>
    <i class="sx-rule" aria-hidden="true" />
    {sub && <p class="sx-sub">{sub}</p>}
  </header>
)

export type HeroSpec = {
  img: string
  tall?: string
  alt: string
  kick: string
  h1: string
  lead: string
  wordmark?: boolean
  dots?: readonly string[]
  msg: string
}

/* ═══ 1. FIRST SCREEN — Royal Emerald & Gold Frosted Glass Card ═══ */
export const Hero = ({ h }: { h: HeroSpec }) => {
  const dots = h.dots ?? ['فعاليات رسمية', 'فعاليات الشركات', 'مناسبات خاصة']
  return (
    <section class={'hero hero-lux hero-art' + (h.wordmark ? ' is-home' : ' is-inner')}>
      <div class="hero-bg">
        {h.tall ? (
          <HeroPic wide={h.img} tall={h.tall} alt={h.alt} eager />
        ) : (
          <Img n={h.img} alt={h.alt} sizes="100vw" eager />
        )}
      </div>
      <div class="hero-veil" aria-hidden="true" />
      <div class="hero-in">
        <div class="glass tilt">
          <span class="glass-corner c-tl" aria-hidden="true" />
          <span class="glass-corner c-tr" aria-hidden="true" />
          <span class="glass-corner c-bl" aria-hidden="true" />
          <span class="glass-corner c-br" aria-hidden="true" />
          <p class="glass-kick">{h.kick}</p>
          {h.wordmark ? (
            <>
              <p class="glass-name">{BRAND.name}</p>
              <i class="glass-bar" aria-hidden="true" />
              <p class="glass-latin">{BRAND.latin}</p>
              <p class="glass-sub">LUXURY HOSPITALITY</p>
            </>
          ) : (
            <p class="glass-sub glass-sub-inner">
              {BRAND.name} · {BRAND.latin}
            </p>
          )}
          <h1 class="glass-h1">{h.h1}</h1>
          <p class="glass-lead">{h.lead}</p>
          <ul class="glass-dots" aria-label="مجالات الضيافة">
            {dots.map((d) => (
              <li>{d}</li>
            ))}
          </ul>
        </div>

        <div class="hero-cta">
          <a
            class="btn btn-gold btn-lg"
            href={`tel:${BRAND.phoneLocal}`}
            data-track="call"
            data-location="hero"
          >
            <Ico n="phone" />
            اتصل الآن
          </a>
          <a
            class="btn btn-line btn-lg"
            href={wa(h.msg)}
            rel="noopener"
            target="_blank"
            data-track="whatsapp"
            data-location="hero"
          >
            <Ico n="chat" />
            واتساب
          </a>
        </div>
      </div>
    </section>
  )
}

/* Compact 2-column Service Card with inline <details> drawer */
const CompactServiceCard = ({ s, place }: { s: Service; place: string }) => (
  <article class="ksvc-card rv" id={`s-${s.slug}`}>
    <div class="ksvc-media">
      <Img
        n={s.img}
        alt={`${s.h1} — ${BRAND.name} في ${place}`}
        sizes="(min-width:1024px) 280px, 45vw"
      />
      <span class="ksvc-badge">{s.badge}</span>
    </div>
    <div class="ksvc-body">
      <h3>{s.title}</h3>
      <p class="ksvc-short">{s.short}</p>
      <details class="ksvc-more">
        <summary>
          <span>التفاصيل ومشتملات الخدمة</span>
          <Ico n="chevron" />
        </summary>
        <div class="ksvc-drawer">
          <p class="ksvc-desc">{s.desc}</p>
          <ul class="ksvc-pts">
            {s.points.map((pt) => (
              <li>{pt}</li>
            ))}
          </ul>
          <div class="ksvc-inc">
            {s.includes.map((inc) => (
              <div>
                <b>{inc.t}</b>
                <span>{inc.d}</span>
              </div>
            ))}
          </div>
          <div class="ksvc-actions">
            <a
              class="btn btn-gold btn-sm"
              href={wa(`السلام عليكم، أرغب في حجز خدمة (${s.title}) من ${BRAND.name}.`)}
              rel="noopener"
              target="_blank"
              data-track="whatsapp"
              data-location={`service-${s.slug}`}
            >
              <Ico n="chat" />
              اطلب هذه الخدمة
            </a>
            <a class="lnk" href={`/services/${s.slug}`}>
              صفحة الخدمة
              <Ico n="arrow" />
            </a>
          </div>
        </div>
      </details>
    </div>
  </article>
)

/* ═══ THE FULL PAGE EXPERIENCE (Keif Cadence + Royal Emerald Luxury) ═══ */
export const OnePage = ({
  hero,
  focus,
  faq = FAQ.slice(0, 6),
  place = 'جدة',
}: {
  hero: HeroSpec
  focus?: Child
  faq?: readonly { q: string; a: string }[]
  place?: string
}) => {
  const menSvcs = SERVICES.filter((s) => ['qahwajiin', 'zamzam'].includes(s.slug))
  const womenSvcs = SERVICES.filter((s) => ['qahwajiat', 'offerings'].includes(s.slug))
  const royalSvcs = SERVICES.filter((s) => ['royal', 'equipment', 'buffet', 'extras'].includes(s.slug))

  return (
    <>
      <Hero h={hero} />

      {/* ═══ 2. WHO WE SERVE (لمن نخدم — 3 بطاقات مدمجة متناسقة في شاشة واحدة) ═══ */}
      <section class="sx sx-who" id="who">
        <div class="wrap">
          <Head
            k="لمن نخدم"
            t="طاقم واحد مدرَّب — وزيّ وتقديم بحسب طابع مناسبتك"
          />
          <div class="who-grid">
            {AUDIENCE.map((a, i) => (
              <a class="who-card rv" style={`--i:${i}`} href={a.href}>
                <Img
                  n={a.img}
                  alt={`${a.t} — ${BRAND.name} في ${place}`}
                  sizes="(min-width:1024px) 260px, 31vw"
                />
                <span class="who-cap">
                  <b>{a.t}</b>
                  <small>{a.d}</small>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {focus}

      {/* ═══ 3. OUR WORKS (أعمالنا — شريط سحب أفقي متناسق + تكبير الصور) ═══ */}
      <section class="sx sx-alt" id="works">
        <div class="wrap">
          <Head
            k="أعمالنا"
            t="صور من مناسبات نفّذناها"
            sub="اضغط على أي صورة لتكبيرها والتنقّل بين الباقي."
          />
          <p class="k-swipe-hint" aria-hidden="true">
            اسحب لليسار
            <Ico n="arrow" />
          </p>
          <div class="k-rail" id="worksRail" role="region" aria-label="معرض أعمال القهوة الملكية">
            {GALLERY.slice(0, 12).map((g) => (
              <button
                type="button"
                class="k-work-card galx-it"
                data-full={g.img}
                data-cap={g.cap}
                aria-label={`تكبير صورة: ${g.cap}`}
              >
                <Img
                  n={g.img}
                  alt={`${g.cap} — ${BRAND.name}`}
                  sizes="(min-width:1024px) 280px, 64vw"
                />
                <span class="k-work-tag">{g.cat}</span>
                <span class="k-work-cap">{g.cap}</span>
              </button>
            ))}
          </div>

          {/* Expandable full gallery inline */}
          <div class="galx-extra" id="galx" hidden>
            <div class="k-gal-grid">
              {GALLERY.slice(12).map((g) => (
                <button
                  type="button"
                  class="k-work-card galx-it"
                  data-full={g.img}
                  data-cap={g.cap}
                  aria-label={`تكبير صورة: ${g.cap}`}
                >
                  <Img
                    n={g.img}
                    alt={`${g.cap} — ${BRAND.name}`}
                    sizes="(min-width:1024px) 240px, 46vw"
                  />
                  <span class="k-work-tag">{g.cat}</span>
                  <span class="k-work-cap">{g.cap}</span>
                </button>
              ))}
            </div>
          </div>

          <div class="sx-more">
            <button
              type="button"
              class="btn btn-line"
              id="galMore"
              aria-controls="galx"
              aria-expanded="false"
            >
              معرض الأعمال الكامل ({GALLERY.length} صورة)
              <Ico n="chevron" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 4. PARTNERS OF SUCCESS (شركاء النجاح — جهات وشركات وثقت بنا) ═══ */}
      <section class="sx sx-partners" id="partners">
        <div class="wrap">
          <Head
            k="شركاء النجاح"
            t="جهات وشركات وثقت بنا"
            sub="جهات حكومية · جامعات · منتديات ومؤتمرات دولية · شركات ومجموعات وقاعات كبرى"
            light
          />
          <div class="ptn-grid" id="ptnGrid">
            {PARTNERS.map((p, i) => (
              <div class={'ptn-card' + (i >= 9 ? ' ptn-more' : '')}>
                <span class="ptn-crest" aria-hidden="true">
                  <Ico n={p.icon} />
                </span>
                <b class="ptn-name">{p.name}</b>
                <small class="ptn-sub">{p.sub}</small>
              </div>
            ))}
          </div>
          <div class="sx-more">
            <button
              type="button"
              class="btn btn-ptn"
              id="ptnMore"
              aria-controls="ptnGrid"
              aria-expanded="false"
            >
              عرض كل الشركاء · {PARTNERS.length} جهة
              <Ico n="chevron" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 5. CREW & ATTIRE (اختر زيّ طاقمك — بطاقات سحب متناسقة) ═══ */}
      <section class="sx" id="crew">
        <div class="wrap">
          <Head
            k="الطاقم والزيّ الرسمي"
            t="اختر زيّ طاقمك"
            sub="قهوجيين وصبابين ومباشرين بزيٍّ موحّد — وطاقم نسائي مستقل للمناسبات النسائية."
          />
          <p class="k-swipe-hint" aria-hidden="true">
            اسحب لليسار
            <Ico n="arrow" />
          </p>
          <div class="k-rail k-rail-crew" role="region" aria-label="أزياء طاقم القهوة الملكية">
            {STAFF.map((s) => (
              <figure class="k-crew-card">
                <Img
                  n={s.img}
                  alt={`${s.t} — ${s.d} من ${BRAND.name}`}
                  sizes="(min-width:1024px) 240px, 52vw"
                />
                <figcaption>
                  <b>{s.t}</b>
                  <small>{s.d}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. OFFERINGS & MENU (ما الذي يصل إلى ضيوفك؟ — تبويبات + بطاقات مدمجة) ═══ */}
      <section class="sx sx-alt" id="menu">
        <div class="wrap">
          <Head
            k="التقديمات والمعدات"
            t="ما الذي يصل إلى ضيوفك؟"
            sub="اختر القسم لتصفّح الأصناف بصورها الحقيقية — أكثر من ٧٠ صنفاً من القهوة والتمور والحلى."
          />
          <div class="tabs rv" role="tablist" aria-label="أقسام التقديمات">
            {MENU.map((m, i) => (
              <button
                type="button"
                role="tab"
                class="tab"
                id={`t-${m.slug}`}
                aria-controls={`p-${m.slug}`}
                aria-selected={i === 0 ? 'true' : 'false'}
              >
                {m.cat}
              </button>
            ))}
          </div>
          {MENU.map((m, i) => (
            <div
              class="tabp"
              role="tabpanel"
              id={`p-${m.slug}`}
              aria-labelledby={`t-${m.slug}`}
              hidden={i !== 0}
            >
              <p class="tabp-blurb">{m.blurb}</p>
              <div class="dishx">
                {m.items
                  .filter((it) => it.img)
                  .map((it) => (
                    <figure class="dishx-card">
                      <Img
                        n={it.img!}
                        alt={`${it.n} — ${m.cat} من ${BRAND.name}`}
                        sizes="(min-width:1024px) 220px, 44vw"
                      />
                      <figcaption>
                        <b>{it.n}</b>
                        <small>{it.d}</small>
                      </figcaption>
                    </figure>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. ALL SERVICES (الخدمات — مقسّمة بوضوح في عمودين مدمجين مع فتح التفاصيل) ═══ */}
      <section class="sx" id="services">
        <div class="wrap">
          <Head
            k="الخدمات"
            t="كل ما تحتاجه مناسبتك — من طاقم واحد"
            sub="طاقم مدرَّب، وتجهيز المكان، ولمسات فنية تكمّل الضيافة — اضغط «التفاصيل» في أي بطاقة لعرض المشتملات الكاملة."
          />

          <div class="ksvc-group">
            <h3 class="ksvc-gtitle">
              <span>الطاقم الرجالي</span>
            </h3>
            <div class="ksvc-grid">
              {menSvcs.map((s) => (
                <CompactServiceCard s={s} place={place} />
              ))}
            </div>
          </div>

          <div class="ksvc-group">
            <h3 class="ksvc-gtitle">
              <span>الطاقم النسائي والتقديمات</span>
            </h3>
            <div class="ksvc-grid">
              {womenSvcs.map((s) => (
                <CompactServiceCard s={s} place={place} />
              ))}
            </div>
          </div>

          <div class="ksvc-group">
            <h3 class="ksvc-gtitle">
              <span>تجهيزات ملكية ولمسات فنية</span>
            </h3>
            <div class="ksvc-grid">
              {royalSvcs.map((s) => (
                <CompactServiceCard s={s} place={place} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. ROLES (كيف نعمل — ماذا يفعل طاقمنا في مناسبتك؟) ═══ */}
      <section class="sx sx-alt" id="roles">
        <div class="wrap">
          <Head
            k="كيف نعمل"
            t="ماذا يفعل طاقمنا في مناسبتك؟"
            sub="ثلاثة أدوار يعرفها أهل الضيافة في السعودية — ونوزّعها على عدد ضيوفك وشكل المكان."
          />
          <div class="rolx">
            {ROLES.map((r, i) => (
              <article class="rolx-card rv" style={`--i:${i}`}>
                <div class="rolx-txt">
                  <span class="rolx-k">الأدوار · {n2(i)}</span>
                  <h3>{r.t}</h3>
                  <p>{r.d}</p>
                </div>
                <span class="rolx-img">
                  <Img
                    n={r.img}
                    alt={`دور ${r.t} في خدمة الضيافة — ${BRAND.name}`}
                    sizes="(min-width:1024px) 360px, 90vw"
                  />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. TEAM ARRANGEMENTS (الترتيبات — كيف نرتّب الطاقم لمناسبتك بدون أسعار) ═══ */}
      <section class="sx" id="arrangements">
        <div class="wrap">
          <Head
            k="الترتيبات"
            t="كيف نرتّب الطاقم لمناسبتك"
            sub="ثلاثة تشكيلات شائعة — ويُحسب عدد الطاقم بدقة على عدد ضيوفك ومساحة المكان."
          />
          <div class="arr-grid">
            {ARRANGEMENTS.map((ar, i) => (
              <article class="arr-card rv" style={`--i:${i}`}>
                <h3>{ar.title}</h3>
                <p class="arr-sub">{ar.sub}</p>
                <ul class="arr-pts">
                  {ar.points.map((pt) => (
                    <li>{pt}</li>
                  ))}
                </ul>
                <a
                  class="btn btn-gold btn-block"
                  href={wa(ar.msg)}
                  rel="noopener"
                  target="_blank"
                  data-track="whatsapp"
                  data-location={`arrangement-${i + 1}`}
                >
                  <Ico n="chat" />
                  اطلب هذا الترتيب
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10. OCCASIONS (المناسبات — لمحة سريعة مدمجة) ═══ */}
      <section class="sx sx-alt" id="occasions">
        <div class="wrap">
          <Head
            k="المناسبات"
            t="ضيافة مُفصَّلة لكل نوع مناسبة"
          />
          <div class="occx">
            {OCCASIONS.map((o, i) => (
              <a class="occx-card rv" style={`--i:${i}`} href={`/occasions/${o.slug}`}>
                <Img
                  n={o.img}
                  alt={`${o.h1} — ${BRAND.name} في ${place}`}
                  sizes="(min-width:1024px) 280px, 46vw"
                />
                <span class="occx-cap">
                  <b>{o.title}</b>
                  <small>{o.d}</small>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 11. WHY US (لماذا نحن — لماذا يختارنا منظمو الفعاليات وأصحاب المجالس؟) ═══ */}
      <section class="sx" id="why">
        <div class="wrap wrap-nar">
          <Head k="لماذا نحن" t={`لماذا يختارنا منظّمو الفعاليات في ${place}؟`} />
          <ul class="why-bars">
            {WHY.map((w, i) => (
              <li class="rv" style={`--i:${i}`}>
                <i aria-hidden="true">✦</i>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 12. FAQ (الأسئلة الشائعة) ═══ */}
      <section class="sx sx-alt" id="faq">
        <div class="wrap wrap-nar">
          <Head k="الأسئلة الشائعة" t="إجابات صريحة قبل تأكيد حجزك" />
          <Faq items={faq} />
        </div>
      </section>

      {/* ═══ 13. FINAL CALL (خاتمة التواصل والحجز) ═══ */}
      <section class="endx" id="contact">
        <div class="endx-bg">
          <Img n="ev-vip-2" alt="" sizes="100vw" />
        </div>
        <div class="endx-in wrap rv">
          <div class="endx-card">
            <p class="sx-k">تواصل مباشر ٢٤/٧</p>
            <h2>مناسبتك القادمة — نتولّى ضيافتها بمعيار ملكي</h2>
            <p class="sx-sub">
              أرسل موعد المناسبة والموقع وعدد الضيوف، ويصلك عرض سعر مكتوب ومفصّل خلال دقائق.
            </p>
            <a
              class="endx-phone ltr"
              href={`tel:${BRAND.phoneLocal}`}
              data-track="call"
              data-location="footer-cta"
            >
              {BRAND.phoneDisplay}
            </a>
            <div class="hx-cta">
              <a
                class="btn btn-gold btn-lg"
                href={`tel:${BRAND.phoneLocal}`}
                data-track="call"
                data-location="footer-cta"
              >
                <Ico n="phone" />
                اتصل الآن
              </a>
              <a
                class="btn btn-line btn-lg"
                href={wa(hero.msg)}
                rel="noopener"
                target="_blank"
                data-track="whatsapp"
                data-location="footer-cta"
              >
                <Ico n="chat" />
                واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      <dialog class="lbx" id="lbx" aria-label="معاينة الصورة بحجم كامل">
        <button type="button" class="lbx-x" aria-label="إغلاق المعاينة">
          <Ico n="close" />
        </button>
        <button type="button" class="lbx-nav lbx-prev" aria-label="الصورة السابقة">
          <Ico n="chevron" />
        </button>
        <figure class="lbx-fig">
          <img alt="" width="900" height="1200" decoding="async" />
          <figcaption id="lbxCap"></figcaption>
        </figure>
        <button type="button" class="lbx-nav lbx-next" aria-label="الصورة التالية">
          <Ico n="chevron" />
        </button>
      </dialog>
    </>
  )
}

/* ═══ FOCUS BLOCKS — each URL's own content (compact & proportional) ═══ */
export const FocusText = ({
  k,
  t,
  body,
  img,
  points,
}: {
  k: string
  t: string
  body: string
  img?: string
  points?: readonly string[]
}) => (
  <section class="sx sx-focus">
    <div class="wrap">
      <div class={'focx' + (img ? '' : ' focx-solo')}>
        <div class="focx-txt rv">
          <p class="sx-k">{k}</p>
          <h2>{t}</h2>
          <p class="focx-body">{body}</p>
          {points && (
            <ul class="svx-pts">
              {points.map((p) => (
                <li>{p}</li>
              ))}
            </ul>
          )}
        </div>
        {img && (
          <span class="focx-img rv">
            <Img n={img} alt={`${t} — ${BRAND.name}`} sizes="(min-width:1024px) 440px, 88vw" />
          </span>
        )}
      </div>
    </div>
  </section>
)

export const FocusGrid = ({
  k,
  t,
  items,
}: {
  k: string
  t: string
  items: { img: string; t: string; d?: string }[]
}) => (
  <section class="sx sx-focus">
    <div class="wrap">
      <Head k={k} t={t} />
      <div class="dishx">
        {items.map((i) => (
          <figure class="dishx-card rv">
            <Img n={i.img} alt={`${i.t} — ${BRAND.name}`} sizes="(min-width:1024px) 240px, 44vw" />
            <figcaption>
              <b>{i.t}</b>
              {i.d && <small>{i.d}</small>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)
