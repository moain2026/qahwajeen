/**
 * All page views. Pure JSX — no side effects.
 * Every image goes through <Img> (see ui.tsx) so the -sm/-md/-lg
 * convention lives in exactly one place.
 */
import { Layout, SITE } from './layout'
import { Icon, raw } from './icons'
import {
  BRAND,
  SHOW,
  SOCIAL,
  SERVICES,
  OCCASIONS,
  MENU,
  STATS,
  PRICING,
  FAQ,
  GALLERY,
  GAL_CATS,
  REVIEWS,
  PILLARS,
  type Service,
  type Occasion,
  type MenuCat,
} from './data'
import { CITIES, FAMILIES, familyCopy, type City, type Family } from './cities'
import {
  graph,
  orgLd,
  siteLd,
  faqLd,
  crumbLd,
  serviceLd,
  eventLd,
  menuLd,
  galleryLd,
  reviewsLd,
  offerLd,
} from './ld'
import {
  Img,
  HeroPic,
  Rule,
  Eyebrow,
  SecHead,
  Crumbs,
  PageHead,
  QuickBar,
  ServiceCard,
  StatsBand,
  Pillars,
  Steps,
  CityChips,
  WorksStrip,
  CtaBand,
  Faq,
} from './ui'
import { MiniSite, ContactBlock, PriceCards, Actions, Ico, wa, SvcGrid, CoverLinks, Rail } from './blocks'
import { JEDDAH_PAGES, type JeddahPage } from './jeddah'

/* ── tiny local helpers ───────────────────────────────────── */
const svc = (slug: string) => SERVICES.find((s) => s.slug === slug)!

/**
 * Builds a <title> that always fits Google's ~70-character SERP budget.
 * Suffixes are tried longest-first; the first one that fits wins, so
 * short city names keep the richest title and long ones (المدينة المنورة،
 * مكة المكرمة) degrade gracefully instead of being truncated by Google.
 */
const fitTitle = (base: string, ...suffixes: string[]) => {
  /* Layout appends " | <brand>" — reserve that from the 70-char budget. */
  const budget = 70 - ` | ${BRAND.name}`.length
  for (const s of suffixes) {
    const t = s ? `${base} — ${s}` : base
    if (t.length <= budget) return t
  }
  return base
}

/** Trust line under CTAs — removes the last hesitation before tapping. */
const Trust = () => (
  <p class="fine">
    <Ico n="shield" />
    عرض سعر مكتوب قبل التأكيد · بلا بنود مخفية · رفع وتنظيف بعد المناسبة
  </p>
)

/* ══════════════════════════════════════════════════════════
 * HOME
 * ══════════════════════════════════════════════════════════ */
export const Home = () => (
  <Layout
    path="/"
    hero="hero-real"
    jsonld={graph(orgLd(), siteLd(), faqLd(FAQ))}
    title="قهوجيين وصبابين جدة — ضيافة مناسبات فاخرة"
    desc="قهوجيين وصبابين وقهوجيات في جدة و١٠ مدن: طاقم بزي موحّد، قهوة عربية تُحضَّر في الموقع، تمور وحلى وعدّة نحاسية. اتصال وواتساب 0504968113."
  >
    {/* ─── HERO ───
        Cinematic, not static: two stills cross-fade under a slow Ken-Burns
        drift, a gold sheen sweeps the headline once, and the whole block
        cascades in line by line. All of it is CSS — zero JS, zero layout
        shift, and every motion is disabled under prefers-reduced-motion. */}
    <section class="hero hero-home hero-lux hero-art">
      <div class="hero-bg">
        <HeroPic wide="hero-real" tall="hero-real-tall" alt="فريق قهوجيين وصبابين بزي موحّد في مناسبة بجدة" eager />
      </div>
      <div class="hero-veil" aria-hidden="true"></div>
      <div class="hero-in">
        <div class="glass">
          <p class="glass-kick">JEDDAH · SAUDI ARABIA</p>
          <p class="glass-name">قهوجيين</p>
          <i class="glass-bar" aria-hidden="true"></i>
          <p class="glass-latin">QAHWAJEEN</p>
          <p class="glass-sub">LUXURY HOSPITALITY</p>
          <h1 class="glass-h1">قهوجيين وصبابين جدة</h1>
          <p class="glass-lead">طاقم بزيٍّ رسمي، ودلال ذهبية، وضيافة تليق بمكانة ضيوفك.</p>
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
          <a class="btn btn-line btn-lg" href={wa('السلام عليكم، أرغب في حجز ضيافة لمناسبة في جدة.')} rel="noopener" target="_blank">
            <Ico n="chat" />
            واتساب
          </a>
        </div>
      </div>
    </section>

    {/* ─── OCCASIONS (swipe) ─── */}
    <section class="sec sec-mini" id="services">
      <div class="wrap">
        <SecHead kicker="لمن نخدم" title="لكل مناسبةٍ طاقمها وزيّها وترتيبها" />
        <Rail label="المناسبات" cls="rail-occ">
          {OCCASIONS.map((o) => (
            <a class="rcard" role="listitem" href={`/occasions/${o.slug}`}>
              <Img n={o.img} alt={o.title} sizes="(min-width:1024px) 280px, 60vw" />
              <span class="rcard-cap">
                <b>{o.title}</b>
                <small>{o.d}</small>
              </span>
            </a>
          ))}
        </Rail>
      </div>
    </section>

    <MiniSite
      faq={FAQ}
      active="/"
      contact={{ title: 'خلِّ ضيافتك حديث ضيوفك', msg: 'السلام عليكم، أرغب في حجز ضيافة لمناسبة.' }}
    />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * SERVICES  (index + detail)
 * ══════════════════════════════════════════════════════════ */
export const Services = () => (
  <Layout
    path="/services"
    hero="souqiya"
    jsonld={graph(
      crumbLd([{ name: 'الخدمات', path: '/services' }]),
      {
        '@type': 'ItemList',
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.title,
          url: `${SITE}/services/${s.slug}`,
        })),
      },
    )}
    title="خدمات الضيافة — قهوجيين وصبابين وعدّة وتقديمات"
    desc="ثمانية أقسام ضيافة: قهوجيين للرجال، قهوجيات للنساء، سقاية ماء زمزم، تمور وحلى، بوفيه ومداخل، عدّة نحاسية، ضيافة ملكية، وإضافات المناسبة."
  >
    <PageHead
      kicker="خدماتنا"
      title="خدمات الضيافة"
      desc="كل قسمٍ هنا يعمل وحده أو مع غيره — والأفضل دائماً أن نتولّى الضيافة كاملة بعرضٍ واحد."
      img="souqiya"
      crumbs={[{ label: 'الخدمات' }]}
    >
      <QuickBar />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="grid g-md2 g-lg3">
          {SERVICES.map((s, i) => (
            <ServiceCard s={s} eager={i < 3} />
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec-alt">
      <div class="wrap">
        <SecHead kicker="ثابت في كل حزمة" title="ما لا نتنازل عنه أبداً" />
        <Pillars />
      </div>
    </section>

    <MiniSite skip={['services', 'why']} active="/services" />
  </Layout>
)

export const ServiceDetail = ({ s }: { s: Service }) => {
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3)
  return (
    <Layout
      path={`/services/${s.slug}`}
      hero={s.img}
      jsonld={graph(
        serviceLd(s.h1, s.desc, `/services/${s.slug}`, s.img),
        crumbLd([
          { name: 'الخدمات', path: '/services' },
          { name: s.title, path: `/services/${s.slug}` },
        ]),
      )}
      title={s.h1}
      desc={s.desc.slice(0, 155)}
    >
      <PageHead
        kicker={s.badge}
        title={s.h1}
        desc={s.short}
        img={s.img}
        crumbs={[{ href: '/services', label: 'الخدمات' }, { label: s.title }]}
      >
        <QuickBar label={`احجز ${s.title}`} />
      </PageHead>

      <section class="sec">
        <div class="wrap">
          <div class="split">
            <div class="split-txt rv">
              <Eyebrow>عن الخدمة</Eyebrow>
              <h2>{s.title}</h2>
              <Rule />
              <p class="lead">{s.desc}</p>
              <ul class="ticks ticks-lg">
                {s.points.map((p) => (
                  <li>
                    <Ico n="check" />
                    {p}
                  </li>
                ))}
              </ul>
              <Actions msg={`أرغب في حجز: ${s.title}`} />
              <Trust />
            </div>
            <div class="split-img rv">
              <Img n={s.img} alt={s.title} sizes="(min-width:1024px) 560px, 92vw" eager />
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="ماذا تحصل عليه" title="بنود الخدمة بالتفصيل" />
          <div class="grid g-md2">
            {s.includes.map((it, i) => (
              <div class="pillar rv">
                <div class="medal num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 class="h4">{it.t}</h3>
                  <p>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <SecHead kicker="من أعمالنا" title={`لمحة من ${s.title}`} />
          <WorksStrip shots={s.gal.map((g) => ({ img: g, cap: s.title }))} cols={3} />
        </div>
      </section>

      <MiniSite
        svcExclude={s.slug}
        active={`/services/${s.slug}`}
        contact={{ title: `جاهزون لحجز ${s.title}`, msg: `السلام عليكم، أرغب في حجز: ${s.title}` }}
      />
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════════
 * OCCASIONS
 * ══════════════════════════════════════════════════════════ */
export const Occasions = () => (
  <Layout
    path="/occasions"
    hero="souqiya"
    jsonld={graph(crumbLd([{ name: 'المناسبات', path: '/occasions' }]))}
    title="ضيافة المناسبات — أعراس وعزاء ومؤتمرات وتخرّج"
    desc="لكل مناسبةٍ جدول ضيافةٍ مختلف: أعراس وملكات، مجالس عزاء، مؤتمرات مؤسسية، حفلات تخرّج، استقبال مواليد، ومخيمات شتوية."
  >
    <PageHead
      kicker="المناسبات"
      title="ضيافة المناسبات"
      desc="نُدير الضيافة بجدولٍ مكتوب يختلف باختلاف المناسبة — لا بقالبٍ واحد يُعاد على الجميع."
      img="souqiya"
      crumbs={[{ label: 'المناسبات' }]}
    >
      <QuickBar />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="grid g-md2 g-lg3">
          {OCCASIONS.map((o) => (
            <a class="card occ rv" href={`/occasions/${o.slug}`}>
              <div class="occ-media">
                <Img n={o.img} alt={o.title} />
              </div>
              <div class="occ-body">
                <span class="occ-ico">
                  <Icon n={o.icon} />
                </span>
                <h2>{o.title}</h2>
                <p>{o.d}</p>
                <span class="lnk">
                  التفاصيل
                  <Ico n="arrow" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <MiniSite active="/occasions" />
  </Layout>
)

export const OccasionDetail = ({ o }: { o: Occasion }) => {
  const rel = o.services.map(svc).filter(Boolean)
  return (
    <Layout
      path={`/occasions/${o.slug}`}
      hero={o.img}
      title={o.h1}
      desc={o.desc.slice(0, 155)}
      jsonld={graph(
        eventLd(o.h1, o.desc, `/occasions/${o.slug}`, o.img),
        crumbLd([
          { name: 'المناسبات', path: '/occasions' },
          { name: o.title, path: `/occasions/${o.slug}` },
        ]),
      )}
    >
      <PageHead
        kicker="مناسبات"
        title={o.h1}
        desc={o.d}
        img={o.img}
        crumbs={[{ href: '/occasions', label: 'المناسبات' }, { label: o.title }]}
      >
        <QuickBar label={`احجز ضيافة ${o.title}`} />
      </PageHead>

      <section class="sec">
        <div class="wrap">
          <div class="split">
            <div class="split-txt rv">
              <Eyebrow>كيف نُدير هذه المناسبة</Eyebrow>
              <h2>{o.title}</h2>
              <Rule />
              <p class="lead">{o.desc}</p>
              <Actions msg={`أرغب في ضيافة لمناسبة: ${o.title}`} />
              <Trust />
            </div>
            <div class="split-img rv">
              <Img n={o.img} alt={o.title} sizes="(min-width:1024px) 560px, 92vw" eager />
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="ما تحتاجه هذه المناسبة" title="بنودٌ لا تُنسى" />
          <div class="grid g-md2">
            {o.needs.map((n, i) => (
              <div class="pillar rv">
                <div class="medal num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 class="h4">{n}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <SecHead kicker="الخدمات المناسبة" title="ما نُرشّحه لمناسبتك" />
          <div class="grid g-md2 g-lg3">
            {rel.map((s) => (
              <ServiceCard s={s} />
            ))}
          </div>
        </div>
      </section>

      <MiniSite
        skip={['services']}
        active={`/occasions/${o.slug}`}
        contact={{ title: `نُدير ضيافة ${o.title} كاملة`, msg: `السلام عليكم، أرغب في ضيافة لمناسبة: ${o.title}` }}
      />
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════════
 * LOCATIONS  (hub + city + family×city)
 * ══════════════════════════════════════════════════════════ */
export const Locations = () => (
  <Layout
    path="/locations"
    hero="souqiya"
    jsonld={graph(
      crumbLd([{ name: 'مناطق الخدمة', path: '/locations' }]),
      {
        '@type': 'ItemList',
        itemListElement: CITIES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          url: `${SITE}/locations/${c.slug}`,
        })),
      },
    )}
    title="مناطق الخدمة — قهوجيين وصبابين في عشر مدن سعودية"
    desc="نخدم جدة والرياض ومكة المكرمة والمدينة المنورة والدمام والخبر والطائف وأبها وينبع وتبوك بفرقٍ محلية مقيمة — لا وكلاء ولا وسطاء."
  >
    <PageHead
      kicker="مناطق الخدمة"
      title="عشر مدن — بفرقٍ محلية مقيمة"
      desc="في كل مدينةٍ نخدمها لدينا فريقٌ مقيم وعدّة مخزّنة محلياً، لأن الضيافة التي تُنقل من مدينةٍ أخرى تصل متأخرة أو باردة."
      img="souqiya"
      crumbs={[{ label: 'مناطق الخدمة' }]}
    >
      <QuickBar />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="grid g-md2 g-lg3">
          {CITIES.map((c, i) => (
            <a class="card city rv" href={`/locations/${c.slug}`}>
              <div class="city-media">
                <Img n={c.hero} alt={`ضيافة ${c.name}`} eager={i < 3} />
                <span class="city-name">
                  <Ico n="pin" />
                  {c.name}
                </span>
              </div>
              <div class="city-body">
                <span class="badge badge-line">{c.region}</span>
                <p>{c.intro.slice(0, 130)}…</p>
                <span class="lnk">
                  ضيافة {c.name}
                  <Ico n="arrow" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec-alt">
      <div class="wrap">
        <SecHead
          kicker="صفحات متخصّصة"
          title="ابحث عن خدمتك في مدينتك"
          desc="ثلاثون صفحة متخصّصة — كل صفحةٍ تشرح تفاصيل الخدمة في مدينتها تحديداً."
        />
        {FAMILIES.map((f) => (
          <div class="fam-block rv">
            <h3>
              <Icon n={f.icon} />
              {f.kicker}
            </h3>
            <div class="fam-links">
              {CITIES.map((c) => (
                <a href={`/${f.prefix}-${c.slug}`}>
                  {f.noun} {c.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <MiniSite skip={['cover']} active="/locations" />
  </Layout>
)

export const CityHub = ({ c }: { c: City }) => (
  <Layout
    path={`/locations/${c.slug}`}
    hero={c.slug === 'jeddah' ? 'ev-team-1' : c.hero}
    jsonld={graph(
      serviceLd(
        `ضيافة ${c.name}`,
        c.intro,
        `/locations/${c.slug}`,
        c.hero,
        c.name,
      ),
      crumbLd([
        { name: 'مناطق الخدمة', path: '/locations' },
        { name: c.name, path: `/locations/${c.slug}` },
      ]),
    )}
    title={`ضيافة ${c.name} — قهوجيين وصبابين وقهوة عربية`}
    desc={c.intro.slice(0, 155)}
  >
    <PageHead
      kicker={c.region}
      title={`ضيافة ${c.inName}`}
      desc={`فريقٌ مقيم في ${c.inName} وعدّة مخزّنة محلياً — نصل قبل الموعد بساعتين ونعرف قاعات المدينة بأسمائها.`}
      img={c.slug === 'jeddah' ? 'ev-team-1' : c.hero}
      crumbs={[{ href: '/locations', label: 'مناطق الخدمة' }, { label: c.name }]}
    >
      <QuickBar label={`احجز ضيافة ${c.name}`} />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="split">
          <div class="split-txt rv">
            <Eyebrow>عن خدمتنا في {c.inName}</Eyebrow>
            <h2>ضيافة {c.inName}</h2>
            <Rule />
            <p class="lead">{c.intro}</p>
            <ul class="ticks ticks-lg">
              {c.local.map((l) => (
                <li>
                  <Ico n="check" />
                  {l}
                </li>
              ))}
            </ul>
            <Actions msg={`أرغب في حجز ضيافة في ${c.name}`} />
            <Trust />
          </div>
          <div class="split-img rv">
            <Img n={c.hero} alt={`ضيافة ${c.name}`} sizes="(min-width:1024px) 560px, 92vw" eager />
          </div>
        </div>
      </div>
    </section>

    {/* the 3 family pages for this city — the SEO spine */}
    <section class="sec sec-alt">
      <div class="wrap">
        <SecHead kicker="خدماتنا في المدينة" title={`ماذا نقدّم في ${c.inName}`} />
        <div class="grid g-md3">
          {FAMILIES.map((f) => (
            <a class="card fam rv" href={`/${f.prefix}-${c.slug}`}>
              <span class="fam-ico">
                <Icon n={f.icon} />
              </span>
              <h3>
                {f.noun} {c.name}
              </h3>
              <p>{familyCopy(f, c).slice(0, 150)}…</p>
              <span class="lnk">
                اقرأ التفاصيل
                <Ico n="arrow" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <SecHead kicker="التغطية" title={`أحياء وقاعات نخدمها في ${c.inName}`} />
        <div class="cover rv">
          <div>
            <h3 class="h4">
              <Ico n="pin" />
              الأحياء
            </h3>
            <div class="tags">
              {c.districts.map((d) => (
                <span>{d}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 class="h4">
              <Ico n="crown" />
              المواقع والقاعات
            </h3>
            <div class="tags">
              {c.venues.map((v) => (
                <span>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <MiniSite
      place={c.inName}
      active={`/locations/${c.slug}`}
      contact={{
        title: `فريقنا في ${c.inName} جاهز لمناسبتك`,
        desc: `أرسل التاريخ وعدد الضيوف والحيّ في ${c.inName}، ويصلك عرض سعرٍ مكتوب خلال ساعات.`,
        msg: `السلام عليكم، أرغب في حجز ضيافة في ${c.name}`,
      }}
    />
  </Layout>
)

/** City-specific FAQ for family×city pages — unique Q&A per page. */
const cityFaq = (f: Family, c: City) => [
  {
    q: `كم ${f.noun === 'ضيافة مناسبات' ? 'فرداً من الطاقم' : f.noun.split(' ')[0]} أحتاج لمناسبة في ${c.inName}؟`,
    a: `نحسب فرداً لكل ٣٠ ضيفاً تقريباً، ومباشراً للمناسبات التي تتجاوز ١٠٠ ضيف. أرسل عدد ضيوفك ونوع المكان في ${c.inName} على واتساب ${BRAND.phoneDisplay} ونرسل لك التشكيل المناسب مكتوباً.`,
  },
  {
    q: `هل تصلون إلى كل أحياء ${c.inName}؟`,
    a: `نعم — نخدم ${c.districts.slice(0, 6).join('، ')} وغيرها، إضافةً إلى ${c.venues.slice(0, 3).join('، ')}. الحيّ لا يغيّر جودة الخدمة، ونصل قبل الموعد لتجهيز كل شيء.`,
  },
  {
    q: `كم سعر ${f.noun} في ${c.inName}؟`,
    a: `السعر يعتمد على عدد الضيوف ومدة المناسبة ونوع التقديمات. نرسل لك عرض سعر مكتوباً قبل أي تأكيد — بلا بنود مخفية ولا زيادات يوم المناسبة.`,
  },
  {
    q: `كيف أحجز ${f.noun} في ${c.inName}؟`,
    a: `اتصل أو أرسل واتساب على ${BRAND.phoneDisplay}: التاريخ، الحيّ أو القاعة، وعدد الضيوف. يصلك العرض خلال ساعات، ونثبّت الموعد بعد موافقتك.`,
  },
  ...FAQ.slice(1, 3),
]

export const FamilyCity = ({ f, c }: { f: Family; c: City }) => {
  const rel = f.services.map(svc).filter(Boolean)
  const title = `${f.noun} ${c.name}`
  /* real team photos per page type; other cities keep their own hero */
  const hero = ({ qahwajiin: 'ev-team-1', 'sababin-qahwa': 'ev-booth-2', 'diyafa-munasabat': 'ev-vip-2' } as Record<string, string>)[f.prefix] ?? c.hero
  return (
    <Layout
      path={`/${f.prefix}-${c.slug}`}
      hero={hero}
      jsonld={graph(
        serviceLd(title, familyCopy(f, c), `/${f.prefix}-${c.slug}`, hero, c.name),
        faqLd(cityFaq(f, c)),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: c.name, path: `/locations/${c.slug}` },
          { name: title, path: `/${f.prefix}-${c.slug}` },
        ]),
      )}
      title={fitTitle(title, `${f.kicker} بأسعار واضحة`, f.kicker, 'أسعار واضحة')}
      desc={familyCopy(f, c).slice(0, 155)}
    >
      <PageHead
        kicker={f.kicker}
        title={title}
        desc={`${f.kicker} بزيٍّ موحّد في ${c.inName} — حضورٌ قبل الموعد وعرض سعرٍ مكتوب قبل التأكيد.`}
        img={hero}
        crumbs={[
          { href: '/locations', label: 'مناطق الخدمة' },
          { href: `/locations/${c.slug}`, label: c.name },
          { label: f.noun },
        ]}
      >
        <QuickBar label={`احجز ${title}`} />
      </PageHead>

      <section class="sec">
        <div class="wrap">
          <div class="split">
            <div class="split-txt rv">
              <Eyebrow>{title}</Eyebrow>
              <h2>
                {f.noun} في {c.inName}
              </h2>
              <Rule />
              <p class="lead">{familyCopy(f, c)}</p>
              <p>{f.pitch}</p>
              <Actions msg={`أرغب في حجز ${title}`} />
              <Trust />
            </div>
            <div class="split-img rv">
              <Img n={c.hero} alt={title} sizes="(min-width:1024px) 560px, 92vw" eager />
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="ما يميّزنا" title={`لماذا ${title} معنا`} />
          <div class="grid g-md2">
            {f.bullets.map((b, i) => (
              <div class="pillar rv">
                <div class="medal num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 class="h4">{b.t}</h3>
                  <p>{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <SecHead kicker="التغطية" title={`نخدم كل أحياء ${c.inName}`} />
          <div class="tags tags-wide rv">
            {c.districts.map((d) => (
              <span>
                {f.noun} {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="صفحات ذات صلة" title={`${f.noun} في مدنٍ أخرى`} />
          <div class="fam-links rv">
            {CITIES.filter((x) => x.slug !== c.slug).map((x) => (
              <a href={`/${f.prefix}-${x.slug}`}>
                {f.noun} {x.name}
              </a>
            ))}
          </div>
          <div class="fam-links rv" style="margin-top:14px">
            {FAMILIES.filter((x) => x.key !== f.key).map((x) => (
              <a href={`/${x.prefix}-${c.slug}`}>
                {x.noun} {c.name}
              </a>
            ))}
            {c.slug === 'jeddah' &&
              JEDDAH_PAGES.map((p) => <a href={`/${p.slug}`}>{p.chip}</a>)}
          </div>
        </div>
      </section>

      <MiniSite
        place={c.inName}
        active={`/${f.prefix}-${c.slug}`}
        faq={cityFaq(f, c)}
        contact={{
          title: `احجز ${f.noun} في ${c.inName} الآن`,
          desc: `أرسل التاريخ والحيّ وعدد الضيوف — يصلك عرض سعرٍ مكتوب لمناسبتك في ${c.inName} خلال ساعات.`,
          msg: `السلام عليكم، أرغب في حجز ${title}`,
        }}
      />
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════════
 * MENU
 * ══════════════════════════════════════════════════════════ */
export const Menu = () => (
  <Layout
    path="/menu"
    hero="sw-station"
    jsonld={graph(crumbLd([{ name: 'قائمة الضيافة', path: '/menu' }]), {
      '@type': 'Menu',
      name: `قائمة الضيافة — ${BRAND.name}`,
      hasMenuSection: MENU.map((m) => ({
        '@type': 'MenuSection',
        name: m.cat,
        url: `${SITE}/menu/${m.slug}`,
      })),
    })}
    title="قائمة الضيافة — أكثر من ٧٠ صنفاً بصور حقيقية"
    desc="قهوة عربية وشاي، مشروبات باردة، تمور محشية، حلى ومحطات دِزرت، فواكه طازجة، مقبلات وفينجر فود، ساندويتشات ومعجنات."
  >
    <PageHead
      kicker="قائمة الضيافة"
      title="أكثر من ٧٠ صنفاً"
      desc="كل صنفٍ هنا بصورةٍ حقيقية من تقديماتنا — تختار بعينك لا بوصفٍ مكتوب."
      img="sw-station"
      crumbs={[{ label: 'قائمة الضيافة' }]}
    >
      <QuickBar label="اطلب قائمة مخصّصة" />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="grid g2 g-md3 g-lg4">
          {MENU.map((m, i) => (
            <a class="mcat rv" href={`/menu/${m.slug}`}>
              <Img n={m.hero} alt={m.cat} sizes="(min-width:1024px) 280px, 46vw" eager={i < 4} />
              <div class="mcat-in">
                <Icon n={m.icon} />
                <h3>{m.cat}</h3>
                <span>{m.items.length} صنفاً</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* each category: a swipe rail of its items (full list lives on /menu/:slug) */}
    {MENU.map((m, i) => (
      <section class={'sec sec-mini' + (i % 2 ? '' : ' sec-alt')} id={m.slug}>
        <div class="wrap">
          <SecHead kicker={`${m.items.length} صنفاً`} title={m.cat} desc={m.blurb} />
          <Rail label={m.cat} cls="rail-menu">
            {m.items.map((it) => (
              <article class="rcard" role="listitem">
                {it.img && <Img n={it.img} alt={it.n} sizes="(min-width:1024px) 280px, 60vw" />}
                <span class="rcard-cap">
                  <b>{it.n}</b>
                  <small>{it.d}</small>
                </span>
              </article>
            ))}
          </Rail>
          <div class="mid-cta">
            <a class="btn btn-line" href={`/menu/${m.slug}`}>
              كل أصناف {m.cat}
              <Ico n="arrow" />
            </a>
          </div>
        </div>
      </section>
    ))}

    <MiniSite skip={['menu']} active="/menu" contact={{ title: 'نبني قائمتك على مقاس مناسبتك', msg: 'السلام عليكم، أرغب في قائمة ضيافة مخصّصة.' }} />
  </Layout>
)

export const MenuCategory = ({ m }: { m: MenuCat }) => (
  <Layout
    path={`/menu/${m.slug}`}
    hero={m.hero}
    jsonld={graph(
      menuLd(m.cat, `/menu/${m.slug}`, m.items),
      crumbLd([
        { name: 'قائمة الضيافة', path: '/menu' },
        { name: m.cat, path: `/menu/${m.slug}` },
      ]),
    )}
    title={`${m.cat} — قائمة الضيافة`}
    desc={m.blurb.slice(0, 155)}
  >
    <PageHead
      kicker={`${m.items.length} صنفاً`}
      title={m.cat}
      desc={m.blurb}
      img={m.hero}
      crumbs={[{ href: '/menu', label: 'قائمة الضيافة' }, { label: m.cat }]}
    >
      <QuickBar label={`اطلب ${m.cat}`} />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="grid g2 g-md3 g-lg4">
          {m.items.map((it, i) => (
            <article class="dish rv">
              {it.img && <Img n={it.img} alt={it.n} sizes="(min-width:1024px) 260px, 46vw" eager={i < 4} />}
              <div class="dish-in">
                <h3 class="h4">{it.n}</h3>
                <p>{it.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <MiniSite menuExclude={m.slug} active={`/menu/${m.slug}`} contact={{ title: `أضف ${m.cat} إلى ضيافتك`, msg: `السلام عليكم، أرغب في: ${m.cat}` }} />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * GALLERY
 * ══════════════════════════════════════════════════════════ */
export const Gallery = () => (
  <Layout
    path="/gallery"
    hero="sawas-3"
    jsonld={graph(galleryLd('/gallery', GALLERY), crumbLd([{ name: 'معرض الأعمال', path: '/gallery' }]))}
    title="معرض الأعمال — صور حقيقية من مناسباتنا"
    desc="صور من ضيافاتنا الفعلية: سوقيات ذهبية، سواس نحاسية، محطات حلى، عدّة مصقولة، وفرقٌ في الميدان."
  >
    <PageHead
      kicker="معرض الأعمال"
      title="نبذة من أعمالنا"
      desc="كل صورةٍ هنا من مناسبةٍ نفّذناها فعلاً. اضغط أي فئة لتصفية المعرض."
      img="sawas-3"
      crumbs={[{ label: 'معرض الأعمال' }]}
    >
      <QuickBar label="أريد ضيافة مثل هذه" />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="filters rv" id="galFilters" role="tablist" aria-label="تصفية المعرض">
          {GAL_CATS.map((c, i) => (
            <button
              class={'chip' + (i === 0 ? ' on' : '')}
              type="button"
              data-cat={i === 0 ? 'all' : c}
              aria-pressed={i === 0 ? 'true' : 'false'}
            >
              {c}
            </button>
          ))}
        </div>
        <div class="gal" data-cols="3" id="galGrid">
          {GALLERY.map((g, i) => (
            <figure class={g.tall ? 'flip tall' : 'flip'} data-cat={g.cat} style={`--d:${(i % 6) * 70}ms`}>
              <Img
                n={g.img}
                alt={g.cap}
                sizes="(min-width:1024px) 33vw, (min-width:768px) 46vw, 92vw"
                eager={i < 3}
              />
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    <MiniSite skip={['works']} active="/gallery" contact={{ title: 'نفّذ الأجمل منه في مناسبتك', msg: 'السلام عليكم، أعجبتني أعمالكم وأرغب في ضيافة مثلها.' }} />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * PRICES
 * ══════════════════════════════════════════════════════════ */
export const Prices = () => (
  <Layout
    path="/prices"
    hero="eq-dallah-2"
    jsonld={graph(offerLd('/prices'), faqLd(FAQ), crumbLd([{ name: 'الأسعار', path: '/prices' }]))}
    title="أسعار القهوجيين والضيافة — دليل واضح بلا بنود مخفية"
    desc="ثلاث حزم ضيافة وما يحدّد السعر النهائي: عدد الضيوف، مدة الخدمة، المدينة، ونوع التقديمات. عرض سعر مكتوب قبل التأكيد."
  >
    <PageHead
      kicker="الأسعار"
      title="دليل أسعار الضيافة"
      desc="لا نُخفي التسعير ولا نُساوم في يوم المناسبة. هذه الحزم ومحدّدات السعر بوضوحٍ كامل."
      img="eq-dallah-2"
      crumbs={[{ label: 'الأسعار' }]}
    >
      <QuickBar label="اطلب عرض سعر" />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <SecHead kicker="الحزم" title="ثلاث حزم أساسية" desc="والتخصيص متاح دائماً — نزيد أو نُنقص بحسب حاجتك." />
        <PriceCards />
      </div>
    </section>

    <section class="sec sec-alt">
      <div class="wrap">
        <SecHead kicker="محدّدات السعر" title="أربعة عوامل تُحدّد فاتورتك" />
        <div class="grid g-md2">
          {[
            { t: 'عدد الضيوف', d: 'نحسب قهوجياً لكل ٣٠ ضيفاً — فعدد الضيوف يحدّد حجم الفريق مباشرة.' },
            { t: 'مدة الخدمة', d: 'ثلاث ساعات ليست كخمس، والتغطية الممتدة لأيام تُحسب بسعرٍ يومي مخفّض.' },
            { t: 'المدينة والموقع', d: 'داخل المدن العشر لا رسوم انتقال. المواقع النائية والاستراحات تحتاج فريقاً مكتفياً ذاتياً.' },
            { t: 'نوع التقديمات', d: 'قهوة وتمور فقط تختلف عن محطة حلى وبوفيه مقبلات وتوزيعات بأسماء الضيوف.' },
          ].map((x, i) => (
            <div class="pillar rv">
              <div class="medal num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 class="h4">{x.t}</h3>
                <p>{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <MiniSite
      skip={['prices']}
      active="/prices"
      faq={FAQ}
      contact={{ title: 'أرسل تفاصيل مناسبتك ويصلك السعر', msg: 'السلام عليكم، أرغب في عرض سعر لمناسبة.' }}
    />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * ABOUT
 * ══════════════════════════════════════════════════════════ */
export const About = () => (
  <Layout
    path="/about"
    hero="sawas-4"
    jsonld={graph(orgLd(), crumbLd([{ name: 'من نحن', path: '/about' }]))}
    title={`عن ${BRAND.name} — ضيافة عربية بمعايير ملكية`}
    desc={`${BRAND.name} — ضيافة عربية من جدة إلى عشر مدن سعودية: قهوجيين وصبابين وقهوجيات بزي موحّد وعدّة نحاسية. اتصال وواتساب ${BRAND.phoneLocal}.`}
  >
    <PageHead
      kicker="من نحن"
      title={`عن ${BRAND.name}`}
      desc={`بدأنا في جدة سنة ${BRAND.since} بدلّةٍ واحدة وفريقٍ من ثلاثة. اليوم نخدم عشر مدن — والمعيار لم يتغيّر.`}
      img="sawas-4"
      crumbs={[{ label: 'من نحن' }]}
    >
      <QuickBar />
    </PageHead>

    <section class="sec">
      <div class="wrap">
        <div class="split">
          <div class="split-txt rv">
            <Eyebrow>قصتنا</Eyebrow>
            <h2>الضيافة عندنا مهنة لا خدمة</h2>
            <Rule />
            <p class="lead">
              انطلقنا من جدة سنة {BRAND.since} بفكرةٍ واحدة: أن الضيافة السعودية تستحقّ أن تُدار بمعيارٍ مكتوب لا
              بالحسّ والاعتياد. اليوم صار لدينا كتيّب تشغيلٍ لكل نوع مناسبة، وفرقٌ
              مقيمة في عشر مدن، وعدّة نحاسية تُصقل وتُعقَّم قبل كل خروج.
            </p>
            <p>
              لا نتعامل بالوساطة: الفريق الذي يصلك موظّفٌ عندنا ومدرَّبٌ على يدنا، والمباشر الذي يمسك مناسبتك
              اسمه معروفٌ لك قبل الموعد. وإن أخطأنا — نعتذر ونُعوّض، لا نُجادل.
            </p>
            <Actions msg="أرغب في التعرّف على خدماتكم" />
            <Trust />
          </div>
          <div class="split-img rv">
            <Img n="sawas-4" alt={BRAND.name} sizes="(min-width:1024px) 560px, 92vw" eager />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec-alt">
      <div class="wrap">
        <StatsBand />
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <SecHead kicker="التزاماتنا" title="ستة بنود نُحاسَب عليها" />
        <Pillars />
      </div>
    </section>

    {SHOW.reviews && (
      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="آراء العملاء" title="شهاداتٌ نعتزّ بها" />
          <div class="grid g-md2 g-lg4">
            {REVIEWS.map((r) => (
              <blockquote class="rev rv">
                <Stars r={r.r} />
                <p>{r.t}</p>
                <footer>
                  <b>{r.n}</b>
                  <span>{r.c}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    )}

    <MiniSite skip={['why']} active="/about" />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * FAQ PAGE
 * ══════════════════════════════════════════════════════════ */
export const FaqPage = () => (
  <Layout
    path="/faq"
    hero="eq-teaset"
    jsonld={graph(faqLd(FAQ), crumbLd([{ name: 'أسئلة متكررة', path: '/faq' }]))}
    title="أسئلة متكررة عن خدمات الضيافة والقهوجيين"
    desc="أجوبة مباشرة عن الحجز والأسعار ومدة الخدمة والتغطية والطاقم النسائي وضيافة العزاء والفواتير النظامية."
  >
    <PageHead
      kicker="أسئلة متكررة"
      title="أسئلة وأجوبة"
      desc="جمعنا هنا كل ما يُسأل عنه فعلاً — بأجوبةٍ صريحة بلا مواربة."
      img="eq-teaset"
      crumbs={[{ label: 'أسئلة متكررة' }]}
    >
      <QuickBar />
    </PageHead>

    <section class="sec">
      <div class="wrap wrap-nar">
        <Faq items={FAQ} />
      </div>
    </section>

    <MiniSite
      skip={['faq']}
      active="/faq"
      contact={{ title: 'لم تجد سؤالك؟ اسألنا مباشرة', desc: 'نجيب على واتساب خلال دقائق، وعلى الهاتف على مدار الساعة.', msg: 'السلام عليكم، عندي سؤال عن خدمات الضيافة.' }}
    />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * CONTACT
 * ══════════════════════════════════════════════════════════ */
export const Contact = () => (
  <Layout
    path="/contact"
    hero="eq-stand"
    jsonld={graph(orgLd(), {
      '@type': 'ContactPage',
      url: `${SITE}/contact`,
      name: `تواصل مع ${BRAND.name}`,
    }, crumbLd([{ name: 'تواصل معنا', path: '/contact' }]))}
    title="تواصل معنا واحجز ضيافتك — 0504968113"
    desc={`احجز ضيافة مناسبتك عبر واتساب أو الهاتف ${BRAND.phoneDisplay} أو نموذج الحجز. عرض سعر مكتوب خلال ساعات.`}
  >
    <PageHead
      kicker="تواصل معنا"
      title="احجز ضيافتك"
      desc={`رقم واحد للاتصال والواتساب: ${BRAND.phoneDisplay} — أو املأ النموذج أدناه. نردّ خلال دقائق.`}
      img="eq-stand"
      crumbs={[{ label: 'تواصل معنا' }]}
    />

    <section class="sec">
      <div class="wrap">
        <div class={SHOW.email ? 'grid g-md3' : 'grid g-md2'}>
          <a class="ccard rv" href={BRAND.whatsapp} rel="noopener" target="_blank">
            <span class="ccard-ico" style="--hue:#25D366">
              <Icon n="chat" />
            </span>
            <h2>واتساب</h2>
            <p>أسرع طريقة — نردّ خلال دقائق</p>
            <b class="ltr">{BRAND.phoneDisplay}</b>
          </a>
          <a class="ccard rv" href={`tel:${BRAND.phoneLocal}`}>
            <span class="ccard-ico" style="--hue:#c5a059">
              <Icon n="phone" />
            </span>
            <h2>اتصال مباشر</h2>
            <p>استقبال الحجوزات ٢٤ ساعة</p>
            <b class="ltr">{BRAND.phoneDisplay}</b>
          </a>
          {SHOW.email && (
            <a class="ccard rv" href={`mailto:${BRAND.email}`}>
              <span class="ccard-ico" style="--hue:#a67c37">
                <Icon n="send" />
              </span>
              <h2>البريد الإلكتروني</h2>
              <p>للعروض المؤسسية والفواتير</p>
              <b class="ltr">{BRAND.email}</b>
            </a>
          )}
        </div>
      </div>
    </section>

    <section class="sec sec-alt">
      <div class="wrap wrap-nar">
        <SecHead
          kicker="نموذج الحجز"
          title="أرسل تفاصيل مناسبتك"
          desc="املأ الحقول ثم اضغط الإرسال — تُفتح محادثة واتساب برسالةٍ جاهزة، ولا نحتفظ ببياناتك على أي سيرفر."
        />
        <form class="form rv" id="bookForm" data-wa={BRAND.whatsapp}>
          <div class="f-row">
            <label>
              <span>الاسم</span>
              <input name="name" type="text" required placeholder="الاسم الكريم" autocomplete="name" />
            </label>
            <label>
              <span>الجوال</span>
              <input name="tel" type="tel" inputmode="tel" required placeholder="05xxxxxxxx" autocomplete="tel" class="ltr" />
            </label>
          </div>
          <div class="f-row">
            <label>
              <span>المدينة</span>
              <select name="city" required>
                {CITIES.map((c) => (
                  <option value={c.name}>{c.name}</option>
                ))}
                <option value="مدينة أخرى">مدينة أخرى</option>
              </select>
            </label>
            <label>
              <span>نوع المناسبة</span>
              <select name="kind" required>
                {OCCASIONS.map((o) => (
                  <option value={o.title}>{o.title}</option>
                ))}
                <option value="مناسبة أخرى">مناسبة أخرى</option>
              </select>
            </label>
          </div>
          <div class="f-row">
            <label>
              <span>تاريخ المناسبة</span>
              <input name="date" type="date" required class="ltr" />
            </label>
            <label>
              <span>عدد الضيوف</span>
              <input name="guests" type="number" min="1" inputmode="numeric" required placeholder="مثال: ١٥٠" class="ltr" />
            </label>
          </div>
          <label>
            <span>الخدمة المطلوبة</span>
            <select name="service">
              {SERVICES.map((s) => (
                <option value={s.title}>{s.title}</option>
              ))}
              <option value="ضيافة متكاملة">ضيافة متكاملة</option>
            </select>
          </label>
          <label>
            <span>ملاحظات إضافية</span>
            <textarea name="note" rows={4} placeholder="الحيّ، اسم القاعة، أي طلب خاص…" />
          </label>
          <button class="btn btn-gold btn-lg btn-block" type="submit">
            <Ico n="chat" />
            إرسال عبر واتساب
          </button>
          <Trust />
        </form>
      </div>
    </section>

    <MiniSite skip={['contact', 'steps']} active="/contact" />
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * SOCIAL — the QR landing page. 3D, luxurious, one-tap.
 * ══════════════════════════════════════════════════════════ */
export const Social = () => {
  const contact = SOCIAL.filter((s) => s.kind === 'contact')
  const social = SOCIAL.filter((s) => s.kind === 'social')
  const place = SOCIAL.filter((s) => s.kind === 'place')
  return (
    <Layout
      path="/social"
      hero="sawas-3"
      bare
      jsonld={graph(orgLd(), siteLd(), {
        '@type': 'ProfilePage',
        url: `${SITE}/social`,
        name: `حسابات ${BRAND.name}`,
        mainEntity: { '@id': `${SITE}/#business` },
      })}
      title={`${BRAND.name} — كل حساباتنا وطرق التواصل`}
      desc="امسح ثم اضغط: واتساب، اتصال، إنستقرام، سناب، تيك توك، إكس، فيسبوك، يوتيوب، تيليجرام والمزيد — كل حساباتنا في صفحة واحدة."
    >
      {/* ── 3D stage ── */}
      <section class="sx" id="sx">
        <div class="sx-orb sx-orb1" aria-hidden="true" />
        <div class="sx-orb sx-orb2" aria-hidden="true" />
        <div class="sx-orb sx-orb3" aria-hidden="true" />
        <div class="sx-grid" aria-hidden="true" />

        <div class="sx-in">
          {/* 3D rotating coin logo */}
          <div class="coin" id="coin" aria-hidden="true">
            <div class="coin-in">
              <div class="coin-f">
                <img src="/static/img/logo-512.webp" alt="" width="160" height="160" decoding="async" />
              </div>
              <div class="coin-b">
                <span class="coin-mark">{BRAND.latin}</span>
              </div>
              <div class="coin-edge" />
            </div>
            <div class="coin-shadow" />
          </div>

          <h1 class="sx-h1">{BRAND.name}</h1>
          <p class="sx-sub">{BRAND.tagline}</p>
          <div class="sx-rule" aria-hidden="true">
            <i />
          </div>
          <p class="sx-lead">اضغط أي زر — يفتح التواصل مباشرة بلا خطوات.</p>

          {/* primary contact — the two money buttons */}
          <div class="sx-prime">
            {contact.map((s) => (
              <a class="sx-big tilt" href={s.href} style={`--hue:${s.hue}`} rel="noopener" target={s.href.startsWith('http') ? '_blank' : undefined}>
                <span class="sx-big-ico">
                  <Icon n={s.n} />
                </span>
                <span class="sx-big-txt">
                  <b>{s.label}</b>
                  <em class={s.n === 'phone' || s.n === 'send' ? 'ltr' : ''}>{s.handle}</em>
                </span>
                <span class="sx-big-note">{s.note}</span>
                <span class="sx-shine" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* QR card */}
          <div class="qr-card tilt rv">
            <div class="qr-frame">
              <img src="/static/img/qr.png" alt={`باركود صفحة تواصل ${BRAND.name}`} width="300" height="300" loading="lazy" decoding="async" />
              <span class="qr-corner qr-tl" aria-hidden="true" />
              <span class="qr-corner qr-tr" aria-hidden="true" />
              <span class="qr-corner qr-bl" aria-hidden="true" />
              <span class="qr-corner qr-br" aria-hidden="true" />
            </div>
            <div class="qr-txt">
              <h2>امسح الباركود</h2>
              <p>وجّه كاميرا جوالك على الرمز — تُفتح هذه الصفحة فوراً بكل حساباتنا وأرقامنا.</p>
              <button class="btn btn-line" type="button" id="shareBtn" data-share="/social">
                <Ico n="share" />
                مشاركة الصفحة
              </button>
              <button class="btn btn-ghost" type="button" id="copyBtn" data-copy={BRAND.phoneDisplay}>
                <Ico n="copy" />
                نسخ رقم الجوال
              </button>
            </div>
          </div>

          {/* all platforms */}
          <h2 class="sx-h2">كل حساباتنا</h2>
          <div class="sx-deck">
            {social.map((s, i) => (
              <a
                class="sx-tile tilt"
                href={s.href}
                style={`--hue:${s.hue};--d:${i * 55}ms`}
                rel="noopener"
                target="_blank"
              >
                <span class="sx-tile-ico">
                  <Icon n={s.n} />
                </span>
                <b>{s.label}</b>
                <em class="ltr">{s.handle}</em>
                <small>{s.note}</small>
                <span class="sx-shine" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* place */}
          {place.map((s) => (
            <a class="sx-map tilt" href={s.href} style={`--hue:${s.hue}`} rel="noopener" target="_blank">
              <span class="sx-big-ico">
                <Icon n="maps" />
              </span>
              <span class="sx-big-txt">
                <b>{s.label}</b>
                <em>{s.handle}</em>
              </span>
              <span class="sx-shine" aria-hidden="true" />
            </a>
          ))}

          {/* site links so the QR page isn't a dead end */}
          <h2 class="sx-h2">تصفّح الموقع</h2>
          <div class="sx-links">
            <a href="/">الرئيسية</a>
            <a href="/services">الخدمات</a>
            <a href="/menu">قائمة الضيافة</a>
            <a href="/gallery">معرض الأعمال</a>
            <a href="/locations">مناطق الخدمة</a>
            <a href="/about">من نحن</a>
            <a href="/contact">نموذج الحجز</a>
          </div>

          <p class="sx-fine">
            <Ico n="shield" />
            {BRAND.name} · {BRAND.latin} · منذ {BRAND.since}
          </p>
        </div>
      </section>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════════
 * 404
 * ══════════════════════════════════════════════════════════ */
export const NotFound = () => (
  <Layout path="/404" noindex hero="eq-teaset" title="الصفحة غير موجودة" desc="الصفحة التي تبحث عنها غير متاحة — تفضّل بالعودة إلى الرئيسية أو تصفّح خدماتنا.">
    <section class="sec sec-404">
      <div class="wrap wrap-nar">
        <Crumbs items={[{ label: 'صفحة غير موجودة' }]} />
        <Eyebrow>خطأ ٤٠٤</Eyebrow>
        <h1>هذه الصفحة غير موجودة</h1>
        <Rule />
        <p class="lead">
          يبدو أن الرابط قديم أو مكتوبٌ خطأً. تفضّل بالعودة إلى الرئيسية، أو تواصل معنا مباشرة ونساعدك فوراً.
        </p>
        <Actions msg="السلام عليكم، أرغب في الاستفسار عن الضيافة." />
        <div class="fam-links" style="margin-top:26px">
          <a href="/">الرئيسية</a>
          <a href="/services">الخدمات</a>
          <a href="/menu">قائمة الضيافة</a>
          <a href="/gallery">معرض الأعمال</a>
          <a href="/locations">مناطق الخدمة</a>
          <a href="/contact">تواصل معنا</a>
        </div>
      </div>
    </section>
  </Layout>
)

/* ══════════════════════════════════════════════════════════
 * JEDDAH KEYWORD PAGES — one search intent per URL
 * ══════════════════════════════════════════════════════════ */
export const JeddahLanding = ({ p }: { p: JeddahPage }) => {
  const rel = p.services.map(svc).filter(Boolean)
  const jed = CITIES[0]
  return (
    <Layout
      path={`/${p.slug}`}
      hero={p.hero}
      title={p.title}
      desc={p.desc}
      jsonld={graph(
        serviceLd(p.h1, p.body[0], `/${p.slug}`, p.hero, 'جدة'),
        faqLd(p.faq),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: 'جدة', path: '/locations/jeddah' },
          { name: p.chip, path: `/${p.slug}` },
        ]),
      )}
    >
      <PageHead
        kicker={p.kicker}
        title={p.h1}
        desc={p.body[0]}
        img={p.hero}
        crumbs={[
          { href: '/locations', label: 'مناطق الخدمة' },
          { href: '/locations/jeddah', label: 'جدة' },
          { label: p.chip },
        ]}
      >
        <QuickBar label="احجز عبر واتساب" />
      </PageHead>

      <section class="sec">
        <div class="wrap">
          <div class="split">
            <div class="split-txt rv">
              <Eyebrow>{p.chip}</Eyebrow>
              <h2>كيف نخدم مناسبتك في جدة</h2>
              <Rule />
              {p.body.slice(1).map((t) => (
                <p class="lead">{t}</p>
              ))}
              <Actions msg={p.msg} />
              <Trust />
            </div>
            <div class="split-img rv">
              <Img n={p.hero} alt={p.h1} sizes="(min-width:1024px) 560px, 92vw" />
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="ما يميّزنا" title={`لماذا ${p.chip} معنا`} />
          <div class="grid g-md2">
            {p.bullets.map((b, i) => (
              <div class="pillar rv">
                <div class="medal num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 class="h4">{b.t}</h3>
                  <p>{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <SecHead kicker="الخدمات المرتبطة" title="ما يشمله الحجز" />
          <div class="tiles">
            {rel.map((s) => (
              <a class="tile rv" href={`/services/${s.slug}`}>
                <span class="tile-media">
                  <Img n={s.img} alt={s.title} sizes="(min-width:1024px) 280px, 46vw" />
                </span>
                <span class="tile-in">
                  <b>{s.title}</b>
                  <small>{s.short}</small>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="sec sec-alt">
        <div class="wrap">
          <SecHead kicker="التغطية" title="أحياء جدة التي نخدمها" />
          <div class="tags tags-wide rv">
            {jed.districts.map((d) => (
              <span>{d}</span>
            ))}
          </div>
        </div>
      </section>

      <MiniSite
        skip={['services', 'cover']}
        active={`/${p.slug}`}
        faq={p.faq}
        contact={{ title: `احجز ${p.chip} الآن`, msg: p.msg }}
      />

      <section class="sec sec-mini sec-alt">
        <div class="wrap">
          <SecHead kicker="صفحات جدة" title="خدماتنا الأخرى في جدة" />
          <CoverLinks active={`/${p.slug}`} />
        </div>
      </section>
    </Layout>
  )
}
