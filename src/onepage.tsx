/**
 * OnePage Royal Merge (v2 Luxury Frosted Glass Hero + v3 Full Editorial Expandable Experience).
 *
 * Designed pixel-by-pixel for "القهوة الملكية — ROYAL COFFEE":
 * - First screen: Royal emerald-gold frosted glass card (.hero-art .glass) with
 *   royal crest, gold shimmer wordmark, unclipped H1, concise lead, 3 trust dots,
 *   and dual 58px conversion buttons (Call + WhatsApp).
 * - Full single-page experience below the fold: moving gold marquee, statement,
 *   optional page-specific focus block, all 8 services in full with inline <details>
 *   accordion & service-specific WhatsApp booking, 6 occasions mosaic, moving crew
 *   film-strip, 3 crew roles, interactive 9-tab hospitality menu, 33-photo inline
 *   expandable gallery with next/prev/caption lightbox, 6 numbered commitments,
 *   FAQ accordion, and closing conversion banner.
 * - Zero city chips in the body or footer (clean luxury flow on every URL).
 */
import type { Child } from 'hono/jsx'
import { BRAND, SERVICES, OCCASIONS, MENU, GALLERY, FAQ, STAFF, ROLES, WHY } from './data'
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
const Head = ({ k, t, sub, start }: { k: string; t: string; sub?: string; start?: boolean }) => (
  <header class={'sx-head rv' + (start ? ' sx-start' : '')}>
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

/* ═══ FIRST SCREEN — Royal Emerald & Gold Frosted Glass Card ═══ */
export const Hero = ({ h }: { h: HeroSpec }) => {
  const dots = h.dots ?? ['الأعراس والملكات', 'المؤتمرات والشركات', 'المجالس والعزاء']
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

      <a class="hx-down" href="#story" aria-label="استكشف تفاصيل الضيافة">
        <span />
      </a>
    </section>
  )
}

/* moving gold words */
const Marquee = () => {
  const words = [
    'القهوة الملكية',
    'قهوة سعودية بالهيل والزعفران',
    'دلال نحاسية مذهّبة',
    'قهوجيين وصبابين بزيّ رسمي',
    'قهوجيات وصبابات بخصوصية تامة',
    'تمور فاخرة ومحطات حلى',
    'سقاية ماء زمزم المبرّد',
    'سوقية ذهبية وبخور عود ملكي',
  ]
  const row = (
    <span class="mq-row">
      {words.map((w) => (
        <span>
          {w}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </span>
  )
  return (
    <div class="mq" aria-hidden="true">
      <div class="mq-track">
        {row}
        {row}
      </div>
    </div>
  )
}

/* ═══ THE STORY ════════════════════════════════════════════════ */
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
}) => (
  <>
    <Hero h={hero} />
    <Marquee />

    {/* statement + quick luxury credentials */}
    <section class="sx sx-statement" id="story">
      <div class="wrap wrap-nar">
        <p class="stmt rv">
          في <em>{BRAND.name}</em> لا نصبّ القهوة فحسب — بل نصنع <em>انطباع ضيوفك الأول</em>، من لحظة الاستقبال بالدلال المذهّبة والزيّ الرسمي الموحّد، حتى يغادر آخر ضيفٍ راضياً.
        </p>
        <div class="royal-badges rv" aria-label="ضمانات الخدمة">
          <span>
            <Ico n="check" />
            حضور قبل الموعد بساعتين
          </span>
          <span>
            <Ico n="crown" />
            طاقم رجالي ونسائي مستقل
          </span>
          <span>
            <Ico n="shield" />
            عرض سعر مكتوب وفاتورة نظامية
          </span>
        </div>
      </div>
    </section>

    {focus}

    {/* 1 — ALL services, in full, each opens in place */}
    <section class="sx" id="services">
      <div class="wrap">
        <Head
          k="خدمات الضيافة الملكية"
          t="كل ما تحتاجه مناسبتك — كاملاً من فريقٍ واحد"
          sub="ثمانية أقسام ضيافة متكاملة، تُطلب منفردة أو مجتمعة بعرضٍ واحد ومشرفٍ ميداني واحد."
        />
        <div class="svx">
          {SERVICES.map((s, i) => (
            <article class={'svx-row' + (i % 2 ? ' flip' : '')} id={`s-${s.slug}`}>
              <div class="svx-media rv rv-clip">
                <Img
                  n={s.img}
                  alt={`${s.h1} — ${BRAND.name} في ${place}`}
                  sizes="(min-width:1024px) 560px, 92vw"
                />
                <b class="svx-n" aria-hidden="true">
                  {n2(i)}
                </b>
              </div>
              <div class="svx-txt rv">
                <p class="sx-k">{s.badge}</p>
                <h3>{s.title}</h3>
                <p class="svx-short">{s.short}</p>
                <ul class="svx-pts">
                  {s.points.map((p) => (
                    <li>{p}</li>
                  ))}
                </ul>
                <details class="svx-more">
                  <summary>
                    <span>التفاصيل وما يشمله الطلب</span>
                    <Ico n="chevron" />
                  </summary>
                  <div class="svx-more-body">
                    <p>{s.desc}</p>
                    <div class="svx-inc">
                      {s.includes.map((x) => (
                        <div>
                          <b>{x.t}</b>
                          <span>{x.d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
                <div class="svx-act">
                  <a
                    class="btn btn-gold"
                    href={wa(`السلام عليكم، أرغب في حجز خدمة (${s.title}) من ${BRAND.name}.`)}
                    rel="noopener"
                    target="_blank"
                    data-track="whatsapp"
                    data-location={`service-${s.slug}`}
                  >
                    <Ico n="chat" />
                    اطلب الخدمة عبر واتساب
                  </a>
                  <a class="lnk" href={`/services/${s.slug}`}>
                    تفاصيل {s.title}
                    <Ico n="arrow" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* 2 — occasions */}
    <section class="sx sx-alt" id="occasions">
      <div class="wrap">
        <Head
          k="المناسبات والفعاليات"
          t="لكل مناسبةٍ طاقمها وزيّها وبروتوكولها"
          sub="ندير الضيافة بجدولٍ مكتوب يراعي طبيعة المناسبة وخصوصيتها."
        />
        <div class="occx">
          {OCCASIONS.map((o, i) => (
            <a class="occx-card rv" style={`--i:${i}`} href={`/occasions/${o.slug}`}>
              <Img
                n={o.img}
                alt={`${o.h1} — ${BRAND.name} في ${place}`}
                sizes="(min-width:1024px) 380px, 46vw"
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

    {/* 3 — crew film-strip (auto-moving) */}
    <section class="sx" id="crew">
      <div class="wrap">
        <Head
          k="الطاقم والزيّ الرسمي"
          t="اختر المظهر الذي يليق بمناسبتك"
          sub="قهوجيين وصبابين بزيٍّ سعودي موحّد — وطاقم نسائي مستقل بالكامل للمناسبات النسائية."
        />
      </div>
      <div class="film" aria-label="أزياء طاقم القهوة الملكية">
        <div class="film-track">
          {[...STAFF, ...STAFF].map((s, i) => (
            <figure class="film-card" aria-hidden={i >= STAFF.length ? 'true' : undefined}>
              <Img
                n={s.img}
                alt={i >= STAFF.length ? '' : `${s.t} — ${s.d} من ${BRAND.name}`}
                sizes="(min-width:1024px) 300px, 62vw"
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

    {/* 4 — roles */}
    <section class="sx sx-alt" id="roles">
      <div class="wrap">
        <Head
          k="تنظيم المجلس"
          t="كيف يعمل فريقنا داخل مناسبتك؟"
          sub="توزيع أدوار واضح يمنع الازدحام ويضمن خدمة كل ضيف في وقته."
        />
        <div class="rolx">
          {ROLES.map((r, i) => (
            <article class="rolx-card rv" style={`--i:${i}`}>
              <span class="rolx-img">
                <Img
                  n={r.img}
                  alt={`دور ${r.t} في خدمة الضيافة — ${BRAND.name}`}
                  sizes="(min-width:1024px) 380px, 92vw"
                />
              </span>
              <b class="rolx-n">{n2(i)}</b>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* 5 — the full menu, in-page tabs */}
    <section class="sx" id="menu">
      <div class="wrap">
        <Head
          k="قائمة التقديمات والضيافة"
          t="أكثر من ٧٠ صنفاً تُحضَّر وتُقدَّم بأعلى معيار"
          sub="تصفّح الأقسام التسعة — كل صنف معروض بصورته الحقيقية من مناسباتنا."
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
                      sizes="(min-width:1024px) 240px, 44vw"
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

    {/* 6 — gallery: expands inline + lightbox */}
    <section class="sx sx-alt" id="works">
      <div class="wrap">
        <Head
          k="معرض أعمالنا"
          t="توثيق حيّ من مناسبات نفّذناها"
          sub="جميع الصور حقيقية ١٠٠٪ لطاقمنا وعدّتنا في الميدان — اضغط على أي صورة لتكبيرها."
        />
        <div class="galx" id="galx">
          {GALLERY.map((g, i) => (
            <button
              type="button"
              class={'galx-it' + (g.tall ? ' tall' : '') + (i >= 12 ? ' more' : '')}
              data-full={g.img}
              data-cap={g.cap}
              aria-label={`تكبير صورة: ${g.cap}`}
            >
              <Img
                n={g.img}
                alt={`${g.cap} — ${BRAND.name}`}
                sizes="(min-width:1024px) 300px, 46vw"
              />
              <span class="galx-cap">{g.cap}</span>
            </button>
          ))}
        </div>
        <div class="sx-more">
          <button
            type="button"
            class="btn btn-line"
            id="galMore"
            aria-controls="galx"
            aria-expanded="false"
          >
            عرض كل الصور ({GALLERY.length})
            <Ico n="chevron" />
          </button>
        </div>
      </div>
    </section>

    {/* 7 — why */}
    <section class="sx" id="why">
      <div class="wrap">
        <Head k={`لماذا ${BRAND.name}`} t="ستة التزامات ثابتة في كل حجز" />
        <ol class="whyx">
          {WHY.map((w, i) => (
            <li class="rv" style={`--i:${i}`}>
              <b>{n2(i)}</b>
              <span>{w}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* 8 — FAQ (matches the page's FAQPage schema) */}
    <section class="sx sx-alt" id="faq">
      <div class="wrap wrap-nar">
        <Head k="الأسئلة الشائعة" t="إجابات صريحة قبل تأكيد حجزك" />
        <Faq items={faq} />
      </div>
    </section>

    {/* 9 — final call */}
    <section class="endx" id="contact">
      <div class="endx-bg">
        <Img n="ev-vip-2" alt="" sizes="100vw" />
      </div>
      <div class="endx-in wrap rv">
        <div class="endx-card">
          <p class="sx-k">حجز وتنسيق فوري</p>
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

/* ═══ FOCUS BLOCKS — each URL's own content ═══════════════════ */
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
          <span class="focx-img rv rv-clip">
            <Img n={img} alt={`${t} — ${BRAND.name}`} sizes="(min-width:1024px) 520px, 92vw" />
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
            <Img n={i.img} alt={`${i.t} — ${BRAND.name}`} sizes="(min-width:1024px) 260px, 44vw" />
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
