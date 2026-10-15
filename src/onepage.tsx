/**
 * OnePage v3 — "the whole site on one scroll".
 *
 * Own identity (not a copy of any competitor): an editorial, cinematic
 * scroll story. Bottom-anchored headline on a full-bleed real photo,
 * a moving gold marquee, every service shown IN FULL as an alternating
 * editorial row that opens in place, an in-page menu with tabs, a
 * moving crew film-strip, a gallery that expands inline and opens a
 * lightbox. Nothing requires navigation; links exist only as
 * "صفحة الخدمة" for people who want a dedicated page.
 *
 * Every URL renders this same story — only the first screen, an
 * optional focus block and the FAQ change, which keeps each URL unique
 * for Google while the visitor always gets the full site.
 */
import type { Child } from 'hono/jsx'
import { BRAND, SERVICES, OCCASIONS, MENU, GALLERY, FAQ, STAFF, ROLES, WHY } from './data'
import { Img, HeroPic, Faq } from './ui'
import { Ico, wa } from './blocks'

/** first-screen copy is ONE short line — cut at a clause/word boundary */
export const oneLine = (t: string, max = 84) => {
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
  msg: string
}

/* ═══ FIRST SCREEN — cinematic, bottom-anchored ═══════════════ */
export const Hero = ({ h }: { h: HeroSpec }) => (
  <section class={'hx' + (h.wordmark ? ' hx-home' : '')}>
    <div class="hx-bg">
      {h.tall ? <HeroPic wide={h.img} tall={h.tall} alt={h.alt} eager /> : <Img n={h.img} alt={h.alt} sizes="100vw" eager />}
    </div>
    <div class="hx-veil" aria-hidden="true" />
    <p class="hx-side" aria-hidden="true">
      QAHWAJEEN · JEDDAH
    </p>

    <div class="hx-in wrap">
      <p class="hx-kick">
        <i aria-hidden="true" />
        {h.kick}
      </p>
      <h1 class="hx-h1">
        {h.h1.split(' ').map((w, i) => (
          <span style={`--i:${i}`}>{w} </span>
        ))}
      </h1>
      <p class="hx-lead">{h.lead}</p>
      <div class="hx-cta">
        <a class="btn btn-gold btn-lg" href={`tel:${BRAND.phoneLocal}`}>
          <Ico n="phone" />
          اتصل الآن
        </a>
        <a class="btn btn-glass btn-lg" href={wa(h.msg)} rel="noopener" target="_blank">
          <Ico n="chat" />
          واتساب
        </a>
      </div>
    </div>

    <a class="hx-down" href="#story" aria-label="تابع للأسفل">
      <span />
    </a>
  </section>
)

/* moving gold words */
const Marquee = () => {
  const words = ['قهوة عربية', 'دلال ذهبية', 'تمور فاخرة', 'زيّ موحّد', 'ضيافة ملكية', 'طاقم نسائي', 'بخور وعود', 'حلى وشرقيات']
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
}: {
  hero: HeroSpec
  focus?: Child
  faq?: readonly { q: string; a: string }[]
  place?: string
}) => (
  <>
    <Hero h={hero} />
    <Marquee />

    {/* statement */}
    <section class="sx sx-statement" id="story">
      <div class="wrap wrap-nar">
        <p class="stmt rv">
          نحن لا نصبّ القهوة فقط — <em>نصنع انطباع ضيوفك الأول</em>، من فنجالٍ ساخن في يدٍ بزيٍّ رسمي، إلى آخر ضيفٍ يغادر
          راضياً.
        </p>
      </div>
    </section>

    {focus}

    {/* 1 — ALL services, in full, each opens in place */}
    <section class="sx" id="services">
      <div class="wrap">
        <Head k="خدماتنا" t="كل ما تحتاجه مناسبتك — كاملاً" sub="ثمانية أقسام ضيافة، تُطلب منفردة أو مجتمعة بعرضٍ واحد." />
        <div class="svx">
          {SERVICES.map((s, i) => (
            <article class={'svx-row' + (i % 2 ? ' flip' : '')} id={`s-${s.slug}`}>
              <div class="svx-media rv rv-clip">
                <Img n={s.img} alt={s.title} sizes="(min-width:1024px) 560px, 92vw" />
                <b class="svx-n">{n2(i)}</b>
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
                    التفاصيل
                    <Ico n="chevron" />
                  </summary>
                  <p>{s.desc}</p>
                  <div class="svx-inc">
                    {s.includes.map((x) => (
                      <div>
                        <b>{x.t}</b>
                        <span>{x.d}</span>
                      </div>
                    ))}
                  </div>
                </details>
                <div class="svx-act">
                  <a class="btn btn-gold" href={wa(`السلام عليكم، أرغب في حجز: ${s.title}`)} rel="noopener" target="_blank">
                    <Ico n="chat" />
                    احجز هذه الخدمة
                  </a>
                  <a class="lnk" href={`/services/${s.slug}`}>
                    صفحة الخدمة
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
        <Head k="المناسبات" t="لكل مناسبةٍ طاقمها وزيّها وترتيبها" />
        <div class="occx">
          {OCCASIONS.map((o, i) => (
            <a class="occx-card rv" style={`--i:${i}`} href={`/occasions/${o.slug}`}>
              <Img n={o.img} alt={o.title} sizes="(min-width:1024px) 380px, 46vw" />
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
        <Head k="الطاقم والزيّ" t="اختر زيّ طاقمك" sub="قهوجيين وصبابين بزيٍّ موحّد — وطاقم نسائي بالكامل للمناسبات النسائية." />
      </div>
      <div class="film" aria-label="أزياء الطاقم">
        <div class="film-track">
          {[...STAFF, ...STAFF].map((s, i) => (
            <figure class="film-card" aria-hidden={i >= STAFF.length ? 'true' : undefined}>
              <Img n={s.img} alt={i >= STAFF.length ? '' : s.t} sizes="(min-width:1024px) 300px, 62vw" />
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
        <Head k="الأدوار" t="ماذا يفعل طاقمنا في مناسبتك؟" />
        <div class="rolx">
          {ROLES.map((r, i) => (
            <article class="rolx-card rv" style={`--i:${i}`}>
              <span class="rolx-img">
                <Img n={r.img} alt={r.t} sizes="(min-width:1024px) 380px, 92vw" />
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
        <Head k="التقديمات" t="ما الذي يصل إلى ضيوفك؟" sub="اختر القسم — والأصناف تظهر هنا بصورها الحقيقية." />
        <div class="tabs rv" role="tablist" aria-label="أقسام التقديمات">
          {MENU.map((m, i) => (
            <button type="button" role="tab" class="tab" id={`t-${m.slug}`} aria-controls={`p-${m.slug}`} aria-selected={i === 0 ? 'true' : 'false'}>
              {m.cat}
            </button>
          ))}
        </div>
        {MENU.map((m, i) => (
          <div class="tabp" role="tabpanel" id={`p-${m.slug}`} aria-labelledby={`t-${m.slug}`} hidden={i !== 0}>
            <p class="tabp-blurb">{m.blurb}</p>
            <div class="dishx">
              {m.items
                .filter((it) => it.img)
                .map((it) => (
                  <figure class="dishx-card">
                    <Img n={it.img!} alt={it.n} sizes="(min-width:1024px) 240px, 44vw" />
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
        <Head k="أعمالنا" t="صور من مناسبات نفّذناها" sub="كل صورة هنا من مناسبة حقيقية — اضغط لتكبيرها." />
        <div class="galx" id="galx">
          {GALLERY.map((g, i) => (
            <button type="button" class={'galx-it' + (g.tall ? ' tall' : '') + (i >= 12 ? ' more' : '')} data-full={g.img} aria-label={`تكبير: ${g.cap}`}>
              <Img n={g.img} alt={g.cap} sizes="(min-width:1024px) 300px, 46vw" />
            </button>
          ))}
        </div>
        <div class="sx-more">
          <button type="button" class="btn btn-line" id="galMore" aria-controls="galx" aria-expanded="false">
            عرض المزيد من الصور
            <Ico n="chevron" />
          </button>
        </div>
      </div>
    </section>

    {/* 7 — why */}
    <section class="sx" id="why">
      <div class="wrap">
        <Head k="لماذا نحن" t="ستة أشياء لا نتنازل عنها" />
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
        <Head k="أسئلة شائعة" t="أجوبة قبل أن تسأل" />
        <Faq items={faq} />
      </div>
    </section>

    {/* 9 — final call */}
    <section class="endx" id="contact">
      <div class="endx-bg">
        <Img n="ev-vip-2" alt="" sizes="100vw" />
      </div>
      <div class="endx-in wrap rv">
        <p class="sx-k">تواصل مباشر</p>
        <h2>مناسبتك القادمة — نتولّى ضيافتها كاملة</h2>
        <p class="sx-sub">أرسل التاريخ والحيّ وعدد الضيوف، ويصلك عرض سعر مكتوب خلال ساعات.</p>
        <a class="endx-phone ltr" href={`tel:${BRAND.phoneLocal}`}>
          {BRAND.phoneDisplay}
        </a>
        <div class="hx-cta">
          <a class="btn btn-gold btn-lg" href={`tel:${BRAND.phoneLocal}`}>
            <Ico n="phone" />
            اتصل الآن
          </a>
          <a class="btn btn-glass btn-lg" href={wa(hero.msg)} rel="noopener" target="_blank">
            <Ico n="chat" />
            واتساب
          </a>
        </div>
      </div>
    </section>

    <dialog class="lbx" id="lbx" aria-label="عرض الصورة">
      <button type="button" class="lbx-x" aria-label="إغلاق">
        <Ico n="close" />
      </button>
      <img alt="" width="900" height="1200" decoding="async" />
    </dialog>
  </>
)

/* ═══ FOCUS BLOCKS — each URL's own content ═══════════════════ */
export const FocusText = ({ k, t, body, img, points }: { k: string; t: string; body: string; img?: string; points?: readonly string[] }) => (
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
            <Img n={img} alt={t} sizes="(min-width:1024px) 520px, 92vw" />
          </span>
        )}
      </div>
    </div>
  </section>
)

export const FocusGrid = ({ k, t, items }: { k: string; t: string; items: { img: string; t: string; d?: string }[] }) => (
  <section class="sx sx-focus">
    <div class="wrap">
      <Head k={k} t={t} />
      <div class="dishx">
        {items.map((i) => (
          <figure class="dishx-card rv">
            <Img n={i.img} alt={i.t} sizes="(min-width:1024px) 260px, 44vw" />
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
