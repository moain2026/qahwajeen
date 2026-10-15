/**
 * OnePage — the site IS one page.
 *
 * Every URL (home, a service, a city, a Jeddah keyword page…) renders the
 * SAME complete structure, so a visitor who lands from Google on any URL
 * sees the whole business without navigating. Only three things change
 * per URL — and that is what makes each URL unique for search:
 *   1. the first screen (photo, H1, one line)
 *   2. an optional "focus" block right after it (the page's own content)
 *   3. the FAQ (matches the page's FAQPage JSON-LD exactly)
 *
 * Section order follows the proven Keif structure:
 *   occasions → works → crew looks → offerings → services → roles →
 *   why → coverage → FAQ → contact
 * Each section shows a few items and a single "عرض المزيد" link — the
 * ONLY reason to navigate.
 */
import type { Child } from 'hono/jsx'
import { BRAND, SERVICES, OCCASIONS, MENU, GALLERY, FAQ, STAFF, ROLES, WHY } from './data'
import { CITIES } from './cities'
import { Img, HeroPic, Faq } from './ui'
import { Ico, wa } from './blocks'

/* ── section header: kicker + title + gold rule ──────────────── */
const Head = ({ k, t, sub }: { k: string; t: string; sub?: string }) => (
  <header class="op-head">
    <p class="op-k">{k}</p>
    <h2>{t}</h2>
    <i class="op-rule" aria-hidden="true" />
    {sub && <p class="op-sub">{sub}</p>}
  </header>
)

const More = ({ href, label = 'عرض المزيد' }: { href: string; label?: string }) => (
  <div class="op-more">
    <a class="btn btn-line" href={href}>
      {label}
      <Ico n="arrow" />
    </a>
  </div>
)

const Rail = ({ children, label, cls = '' }: { children: Child; label: string; cls?: string }) => (
  <div class={`rail ${cls}`} role="list" aria-label={label}>
    {children}
  </div>
)

/** photo card: picture + caption on a dark gradient */
const Pic = ({ img, t, d, href, sizes = '(min-width:1024px) 280px, 64vw' }: { img: string; t: string; d?: string; href?: string; sizes?: string }) => {
  const inner = (
    <>
      <Img n={img} alt={t} sizes={sizes} />
      <span class="rcard-cap">
        <b>{t}</b>
        {d && <small>{d}</small>}
      </span>
    </>
  )
  return href ? (
    <a class="rcard" role="listitem" href={href}>
      {inner}
    </a>
  ) : (
    <figure class="rcard" role="listitem">
      {inner}
    </figure>
  )
}

export type HeroSpec = {
  /** landscape image (desktop) */
  img: string
  /** optional portrait image for phones */
  tall?: string
  alt: string
  /** small line above the wordmark/H1 */
  kick: string
  h1: string
  lead: string
  /** home shows the big wordmark */
  wordmark?: boolean
  /** pre-filled WhatsApp message */
  msg: string
}

/** first-screen copy is ONE short line — cut at a clause/word boundary */
export const oneLine = (t: string, max = 84) => {
  const c = t.split(/[.،—–:]/)[0].trim()
  if (c.length <= max && c.length > 20) return c
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

/* ═══ FIRST SCREEN ═════════════════════════════════════════════ */
export const Hero = ({ h }: { h: HeroSpec }) => (
  <section class={'hero hero-lux hero-art' + (h.wordmark ? ' is-home' : '')}>
    <div class="hero-bg">
      {h.tall ? <HeroPic wide={h.img} tall={h.tall} alt={h.alt} eager /> : <Img n={h.img} alt={h.alt} sizes="100vw" eager />}
    </div>
    <div class="hero-veil" aria-hidden="true" />
    <div class="hero-in">
      <div class="glass">
        <p class="glass-kick">{h.kick}</p>
        {h.wordmark && (
          <>
            <p class="glass-name">قهوجيين</p>
            <i class="glass-bar" aria-hidden="true" />
            <p class="glass-latin">QAHWAJEEN</p>
            <p class="glass-sub">LUXURY HOSPITALITY</p>
          </>
        )}
        <h1 class="glass-h1">{h.h1}</h1>
        <p class="glass-lead">{h.lead}</p>
        <ul class="glass-dots">
          <li>الأعراس</li>
          <li>الشركات</li>
          <li>المجالس</li>
        </ul>
      </div>
      <div class="hero-cta">
        <a class="btn btn-gold btn-lg" href={`tel:${BRAND.phoneLocal}`}>
          <Ico n="phone" />
          اتصل الآن
        </a>
        <a class="btn btn-line btn-lg" href={wa(h.msg)} rel="noopener" target="_blank">
          <Ico n="chat" />
          واتساب
        </a>
      </div>
    </div>
  </section>
)

/* ═══ THE PAGE ═════════════════════════════════════════════════ */
export const OnePage = ({
  hero,
  focus,
  faq = FAQ.slice(0, 5),
  place = 'جدة',
}: {
  hero: HeroSpec
  /** the URL's own block, shown right after the first screen */
  focus?: Child
  faq?: readonly { q: string; a: string }[]
  place?: string
}) => (
  <>
    <Hero h={hero} />

    {focus}

    {/* 1 — occasions */}
    <section class="op" id="occasions">
      <div class="wrap">
        <Head k="لمن نخدم" t="طاقم واحد — وزيّ وتقديم بحسب مناسبتك" />
        <Rail label="المناسبات" cls="rail-occ">
          {OCCASIONS.map((o) => (
            <Pic img={o.img} t={o.title} href={`/occasions/${o.slug}`} sizes="(min-width:1024px) 280px, 46vw" />
          ))}
        </Rail>
      </div>
    </section>

    {/* 2 — works */}
    <section class="op op-alt" id="works">
      <div class="wrap">
        <Head k="أعمالنا" t="صور من مناسبات نفّذناها" />
        <Rail label="صور من أعمالنا" cls="rail-works">
          {GALLERY.slice(0, 8).map((g) => (
            <Pic img={g.img} t={g.cap} sizes="(min-width:1024px) 280px, 70vw" />
          ))}
        </Rail>
        <More href="/gallery" label="معرض الأعمال كاملاً" />
      </div>
    </section>

    {/* 3 — crew looks */}
    <section class="op" id="crew">
      <div class="wrap">
        <Head k="الطاقم والزيّ" t="اختر زيّ طاقمك" sub="قهوجيين وصبابين بزيٍّ موحّد — وطاقم نسائي للمناسبات النسائية." />
        <Rail label="أزياء الطاقم" cls="rail-crew">
          {STAFF.map((s) => (
            <Pic img={s.img} t={s.t} d={s.d} sizes="(min-width:1024px) 280px, 60vw" />
          ))}
        </Rail>
        <More href="/services/qahwajiin" />
      </div>
    </section>

    {/* 4 — offerings */}
    <section class="op op-alt" id="menu">
      <div class="wrap">
        <Head k="التقديمات" t="ما الذي يصل إلى ضيوفك؟" />
        <Rail label="التقديمات" cls="rail-menu">
          {MENU.map((m) => (
            <Pic img={m.hero} t={m.cat} href={`/menu/${m.slug}`} sizes="(min-width:1024px) 280px, 46vw" />
          ))}
        </Rail>
        <More href="/menu" label="كل التقديمات" />
      </div>
    </section>

    {/* 5 — services */}
    <section class="op" id="services">
      <div class="wrap">
        <Head k="الخدمات" t="كل ما تحتاجه مناسبتك — من طاقم واحد" />
        <div class="tiles">
          {SERVICES.map((s) => (
            <a class="tile" href={`/services/${s.slug}`}>
              <span class="tile-media">
                <Img n={s.img} alt={s.title} sizes="(min-width:1024px) 280px, 46vw" />
              </span>
              <span class="tile-in">
                <b>{s.title}</b>
              </span>
            </a>
          ))}
        </div>
        <More href="/services" label="تفاصيل كل الخدمات" />
      </div>
    </section>

    {/* 6 — roles */}
    <section class="op op-alt" id="roles">
      <div class="wrap">
        <Head k="الأدوار" t="ماذا يفعل طاقمنا في مناسبتك؟" />
        <div class="roles">
          {ROLES.map((r) => (
            <article class="role">
              <span class="role-img">
                <Img n={r.img} alt={r.t} sizes="(min-width:1024px) 360px, 92vw" />
              </span>
              <div class="role-in">
                <h3>{r.t}</h3>
                <p>{r.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* 7 — why */}
    <section class="op" id="why">
      <div class="wrap wrap-nar">
        <Head k="لماذا نحن" t="لماذا يختارنا أهل جدة؟" />
        <ul class="why-list">
          {WHY.map((w) => (
            <li>
              <Ico n="check" />
              {w}
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* 8 — coverage */}
    <section class="op op-alt" id="cities">
      <div class="wrap">
        <Head k="التغطية" t={`نخدم ${place} وكل مدن المملكة`} />
        <div class="chips">
          {CITIES.map((c) => (
            <a class="chip" href={`/qahwajiin-${c.slug}`}>
              <Ico n="pin" />
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* 9 — FAQ (identical to the page's FAQPage schema) */}
    <section class="op" id="faq">
      <div class="wrap wrap-nar">
        <Head k="أسئلة شائعة" t="أجوبة قبل أن تسأل" />
        <Faq items={faq} />
      </div>
    </section>

    {/* 10 — contact */}
    <section class="op op-contact" id="contact">
      <div class="wrap">
        <div class="cta-band">
          <p class="op-k">تواصل مباشر</p>
          <h2>أرسل تفاصيل مناسبتك ونعود إليك بعرض</h2>
          <p class="op-sub">التاريخ · الحيّ · عدد الضيوف — والرسالة جاهزة في واتساب.</p>
          <div class="hero-cta">
            <a class="btn btn-gold btn-lg" href={wa(hero.msg)} rel="noopener" target="_blank">
              <Ico n="chat" />
              واتساب
            </a>
            <a class="btn btn-line btn-lg" href={`tel:${BRAND.phoneLocal}`}>
              <Ico n="phone" />
              اتصال
            </a>
          </div>
          <a class="cta-phone ltr" href={`tel:${BRAND.phoneLocal}`}>
            {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  </>
)

/* ═══ FOCUS BLOCKS — each URL's own content, compact ═════════ */

/** a short text + one image (used by service / city / keyword pages) */
export const FocusText = ({ k, t, body, img, points }: { k: string; t: string; body: string; img?: string; points?: readonly string[] }) => (
  <section class="op op-focus">
    <div class="wrap">
      <div class="focus">
        <div class="focus-txt">
          <p class="op-k">{k}</p>
          <h2>{t}</h2>
          <i class="op-rule" aria-hidden="true" />
          <p class="focus-body">{body}</p>
          {points && (
            <ul class="why-list">
              {points.map((p) => (
                <li>
                  <Ico n="check" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
        {img && (
          <span class="focus-img">
            <Img n={img} alt={t} sizes="(min-width:1024px) 520px, 92vw" />
          </span>
        )}
      </div>
    </div>
  </section>
)

/** a photo grid (used by gallery / menu category / service gallery) */
export const FocusGrid = ({ k, t, items }: { k: string; t: string; items: { img: string; t: string; d?: string }[] }) => (
  <section class="op op-focus">
    <div class="wrap">
      <Head k={k} t={t} />
      <div class="pgrid">
        {items.map((i) => (
          <figure class="rcard">
            <Img n={i.img} alt={i.t} sizes="(min-width:1024px) 280px, 46vw" />
            <figcaption class="rcard-cap">
              <b>{i.t}</b>
              {i.d && <small>{i.d}</small>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)
