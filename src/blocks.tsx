/**
 * "Mini-site" blocks — every page is a full tour of the business.
 *
 * Why: a visitor who lands from Google on ANY page (a city page, a
 * service page, the price guide) should see a little of everything —
 * services, real work, offerings, packages, coverage, FAQ, and a
 * one-tap contact — without having to navigate. Mobile-first: wide
 * lists become swipe rails (scroll-snap, zero JS), service cards
 * become a compact 2-column grid so the page stays short.
 *
 * Each block is self-contained; <MiniSite> composes them and lets a
 * page skip what it already shows in its own body.
 */
import type { Child } from 'hono/jsx'
import { Icon, raw } from './icons'
import { BRAND, SERVICES, MENU, GALLERY, PRICING, FAQ, PILLARS, STEPS, type Service } from './data'
import { CITIES, FAMILIES } from './cities'
import { JEDDAH_PAGES } from './jeddah'
import { Img, SecHead, Faq } from './ui'

export const Ico = ({ n }: { n: string }) => <span dangerouslySetInnerHTML={{ __html: raw(n) }} />
export const wa = (msg: string) => `${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`

/** Dual conversion buttons — the site's primary action, repeated by design. */
export const Actions = ({ msg, tone = 'gold' }: { msg: string; tone?: 'gold' | 'line' }) => (
  <div class="btn-row">
    <a class={`btn btn-${tone} btn-lg`} href={wa(msg)} rel="noopener" target="_blank">
      <Ico n="chat" />
      حجز عبر واتساب
    </a>
    <a class="btn btn-line btn-lg" href={`tel:${BRAND.phoneLocal}`}>
      <Ico n="phone" />
      اتصال مباشر
    </a>
  </div>
)

/* ── Swipe rail: horizontal on phones, grid on desktop ─────── */
export const Rail = ({ children, label, cls = '' }: { children: Child; label: string; cls?: string }) => (
  <>
    <p class="swipe-hint" aria-hidden="true">
      اسحب للمزيد
      <Ico n="arrow" />
    </p>
    <div class={`rail ${cls}`} role="list" aria-label={label}>
      {children}
    </div>
  </>
)

/* ── Compact service tile (2-up on phones) ─────────────────── */
export const SvcTile = ({ s }: { s: Service }) => (
  <a class="tile rv" href={`/services/${s.slug}`}>
    <span class="tile-media">
      <Img n={s.img} alt={s.title} sizes="(min-width:1024px) 280px, 46vw" />
    </span>
    <span class="tile-in">
      <b>{s.title}</b>
      <small>{s.short}</small>
    </span>
  </a>
)

export const SvcGrid = ({ exclude }: { exclude?: string }) => (
  <div class="tiles">
    {SERVICES.filter((s) => s.slug !== exclude).map((s) => (
      <SvcTile s={s} />
    ))}
  </div>
)

/* ── Works rail ────────────────────────────────────────────── */
export const WorksRail = ({ from = 0, n = 8 }: { from?: number; n?: number }) => (
  <Rail label="صور من أعمالنا" cls="rail-works">
    {GALLERY.slice(from, from + n).map((g) => (
      <figure class="rcard" role="listitem">
        <Img n={g.img} alt={g.cap} sizes="(min-width:1024px) 280px, 70vw" />
        <figcaption>{g.cap}</figcaption>
      </figure>
    ))}
  </Rail>
)

/* ── Offerings rail ────────────────────────────────────────── */
export const MenuRail = ({ exclude }: { exclude?: string }) => (
  <Rail label="أقسام قائمة الضيافة" cls="rail-menu">
    {MENU.filter((m) => m.slug !== exclude).map((m) => (
      <a class="rcard" role="listitem" href={`/menu/${m.slug}`}>
        <Img n={m.hero} alt={m.cat} sizes="(min-width:1024px) 280px, 60vw" />
        <span class="rcard-cap">
          <b>{m.cat}</b>
          <small>{m.items.length} صنفاً</small>
        </span>
      </a>
    ))}
  </Rail>
)

/* ── Packages ──────────────────────────────────────────────── */
export const PriceCards = () => (
  <div class="grid g-md3 price-rail">
    {PRICING.map((p) => (
      <div class={'price rv' + ((p as any).hot ? ' hot' : '')}>
        {(p as any).hot && <span class="price-tag">{p.badge}</span>}
        <span class="price-ico">
          <Icon n={p.icon} />
        </span>
        <h3>{p.name}</h3>
        <p class="price-g">{p.guests}</p>
        <ul class="ticks">
          {p.items.map((i) => (
            <li>
              <Ico n="check" />
              {i}
            </li>
          ))}
        </ul>
        <a
          class={'btn ' + ((p as any).hot ? 'btn-gold' : 'btn-line')}
          href={wa(`أرغب في عرض سعر — ${p.name}`)}
          rel="noopener"
          target="_blank"
        >
          <Ico n="chat" />
          اطلب هذا الترتيب
        </a>
      </div>
    ))}
  </div>
)

/* ── Why us — compact checklist (Keif-style, short on mobile) ─ */
export const WhyList = () => (
  <ul class="why rv">
    {PILLARS.map((p) => (
      <li>
        <Ico n="check" />
        <span>
          <b>{p.t}</b> — {p.d}
        </span>
      </li>
    ))}
  </ul>
)

/* ── Steps — horizontal rail on phones ─────────────────────── */
export const StepsRail = () => (
  <ol class="steps steps-rail rv">
    {STEPS.map((s, i) => (
      <li>
        <div class="step-ico">
          <Icon n={s.icon} />
          <b class="num">{String(i + 1)}</b>
        </div>
        <h3 class="h4">{s.t}</h3>
        <p>{s.d}</p>
      </li>
    ))}
  </ol>
)

/* ── Jeddah keyword links + all cities (local-SEO spine) ───── */
export const CoverLinks = ({ active }: { active?: string }) => (
  <div class="cover-links rv">
    <p class="cl-lbl">الأكثر طلباً في جدة:</p>
    <div class="fam-links">
      {FAMILIES.map((f) => (
        <a href={`/${f.prefix}-jeddah`} aria-current={active === `/${f.prefix}-jeddah` ? 'page' : undefined}>
          {f.noun} جدة
        </a>
      ))}
      {JEDDAH_PAGES.map((p) => (
        <a href={`/${p.slug}`} aria-current={active === `/${p.slug}` ? 'page' : undefined}>
          {p.chip}
        </a>
      ))}
    </div>
    <p class="cl-lbl">نخدم أيضاً:</p>
    <div class="chips">
      {CITIES.map((c) => (
        <a
          class="chip"
          href={`/locations/${c.slug}`}
          aria-current={active === `/locations/${c.slug}` ? 'page' : undefined}
        >
          <Ico n="pin" />
          {c.name}
        </a>
      ))}
    </div>
  </div>
)

/* ── Contact block — the one number, call + WhatsApp ───────── */
export const ContactBlock = ({
  title = 'احجز ضيافتك الآن',
  desc = 'أرسل التاريخ والحيّ وعدد الضيوف — يصلك عرض سعر مكتوب خلال ساعات.',
  msg = 'السلام عليكم، أرغب في حجز ضيافة.',
}: {
  title?: string
  desc?: string
  msg?: string
}) => (
  <section class="sec sec-cta" id="book">
    <div class="wrap">
      <div class="cta-band rv">
        <div class="cta-glow" aria-hidden="true" />
        <p class="eyebrow">تواصل مباشر</p>
        <h2>{title}</h2>
        <p class="lead" style="max-width:52ch;margin-inline:auto">
          {desc}
        </p>
        <a class="cta-phone ltr" href={`tel:${BRAND.phoneLocal}`}>
          {BRAND.phoneDisplay}
        </a>
        <div class="btn-row">
          <a href={wa(msg)} class="btn btn-gold btn-lg" rel="noopener" target="_blank">
            <Ico n="chat" />
            واتساب
          </a>
          <a href={`tel:${BRAND.phoneLocal}`} class="btn btn-line btn-lg">
            <Ico n="phone" />
            اتصال
          </a>
        </div>
        <p class="cta-fine">
          <Ico n="shield" />
          رقم واحد للاتصال والواتساب · عرض سعر مكتوب قبل التأكيد · استقبال ٢٤ ساعة
        </p>
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════════
 * <MiniSite> — appended to every page after its own content.
 * `skip` removes blocks the page already renders itself.
 * ══════════════════════════════════════════════════════════ */
export type Block = 'works' | 'services' | 'menu' | 'steps' | 'prices' | 'why' | 'cover' | 'faq' | 'contact'

export const MiniSite = ({
  skip = [],
  place = 'جدة',
  faq,
  active,
  svcExclude,
  menuExclude,
  contact,
}: {
  skip?: Block[]
  /** city name used in headings */
  place?: string
  faq?: readonly { q: string; a: string }[]
  /** current path, to mark the matching chip */
  active?: string
  svcExclude?: string
  menuExclude?: string
  contact?: { title?: string; desc?: string; msg?: string }
}) => {
  /* promo site: no packages, no process/why essays — visuals + contact only */
  const OFF: Block[] = ['prices', 'steps', 'why']
  const has = (b: Block) => !skip.includes(b) && !OFF.includes(b)
  return (
    <>
      {has('works') && (
        <section class="sec sec-mini">
          <div class="wrap">
            <SecHead kicker="أعمالنا" title="صور من مناسباتٍ نفّذناها" />
            <WorksRail />
            <div class="mid-cta">
              <a class="btn btn-line" href="/gallery">
                معرض الأعمال كاملاً
                <Ico n="arrow" />
              </a>
            </div>
          </div>
        </section>
      )}

      {has('services') && (
        <section class="sec sec-mini sec-alt">
          <div class="wrap">
            <SecHead kicker="الخدمات" title="كل ما تحتاجه مناسبتك — من فريقٍ واحد" />
            <SvcGrid exclude={svcExclude} />
            <div class="mid-cta">
              <a class="btn btn-line" href="/services">
                تفاصيل كل الخدمات
                <Ico n="arrow" />
              </a>
            </div>
          </div>
        </section>
      )}

      {has('menu') && (
        <section class="sec sec-mini">
          <div class="wrap">
            <SecHead kicker="التقديمات" title="ما الذي يصل إلى ضيوفك؟" />
            <MenuRail exclude={menuExclude} />
          </div>
        </section>
      )}

      {has('steps') && (
        <section class="sec sec-mini sec-alt">
          <div class="wrap">
            <SecHead kicker="كيف نعمل" title="أربع خطوات من الرسالة حتى الرفع" />
            <StepsRail />
          </div>
        </section>
      )}

      {has('prices') && (
        <section class="sec sec-mini">
          <div class="wrap">
            <SecHead
              kicker="الترتيبات"
              title={`كيف نرتّب الطاقم لمناسبتك في ${place}`}
              desc="ثلاث صور شائعة — والعدد النهائي يُحسب على عدد ضيوفك ومدة المناسبة."
            />
            <PriceCards />
          </div>
        </section>
      )}

      {has('why') && (
        <section class="sec sec-mini sec-alt">
          <div class="wrap wrap-nar">
            <SecHead kicker="لماذا نحن" title="ما نلتزم به في كل مناسبة" />
            <WhyList />
          </div>
        </section>
      )}

      {has('cover') && (
        <section class="sec sec-mini">
          <div class="wrap">
            <SecHead kicker="التغطية" title={`نخدم ${place} وتسع مدن أخرى`} />
            <CoverLinks active={active} />
          </div>
        </section>
      )}

      {has('faq') && (
        <section class="sec sec-mini sec-alt">
          <div class="wrap wrap-nar">
            <SecHead kicker="أسئلة شائعة" title="أجوبة قبل أن تسأل" />
            <Faq items={faq ?? FAQ.slice(0, 5)} />
          </div>
        </section>
      )}

      {has('contact') && <ContactBlock {...(contact ?? {})} />}
    </>
  )
}
