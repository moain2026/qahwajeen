/**
 * Dedicated, Focused Page Views —
 *
 * - Home (`/`) renders the complete <OnePage> executive experience.
 * - Every other page (`/services`, `/services/:slug`, `/menu`, `/menu/:slug`,
 *   `/gallery`, `/occasions`, `/occasions/:slug`, `/locations`, `/locations/:slug`,
 *   `/:combo`, `/:jeddahPage`, `/about`, `/faq`, `/contact`, `/booking`) renders
 *   ONLY its own dedicated, well-organized sections (just like keifaldiafa.com),
 *   so clicking "الخدمات" shows Services only, clicking "التقديمات" shows Offerings
 *   only, clicking "أعمالنا" shows the Portfolio only, etc.
 */
import { Layout, SITE } from './layout'
import {
  BRAND,
  SERVICES,
  OCCASIONS,
  MENU,
  GALLERY,
  FAQ,
  PILLARS,
  STEPS,
  type Service,
  type Occasion,
  type MenuCat,
} from './data'
import { CITIES, FAMILIES, familyCopy, type City, type Family } from './cities'
import { JEDDAH_PAGES, type JeddahPage } from './jeddah'
import { graph, orgLd, siteLd, faqLd, crumbLd, serviceLd, eventLd, menuLd, galleryLd } from './ld'
import { Img } from './ui'
import { Ico, wa } from './blocks'
import {
  OnePage,
  Hero,
  Head,
  PartnersStrip,
  WhoSec,
  ServicesSec,
  CrewSec,
  RolesSec,
  ArrangementsSec,
  MenuSec,
  WorksSec,
  OccasionsSec,
  WhySec,
  FaqSec,
  EndCta,
  RoyalConcierge,
  FocusText,
  FocusGrid,
  oneLine,
} from './onepage'

const JED = 'jeddah'
/** real-team photos for Jeddah pages */
const FAM_HERO: Record<string, string> = {
  qahwajiin: 'ev-team-1',
  'sababin-qahwa': 'ev-booth-2',
  'diyafa-munasabat': 'ev-vip-2',
}

/** keep <title> inside Google's ~65-char budget (Layout appends " | القهوة الملكية") */
const fit = (base: string, ...suffixes: string[]) => {
  const budget = 65 - ` | ${BRAND.name}`.length
  for (const s of suffixes) {
    const t = s ? `${base} — ${s}` : base
    if (t.length <= budget) return t
  }
  return base
}

/* ══ 1. HOME (الصفحة الرئيسية الشاملة) ══════════════════════════ */
export const Home = () => (
  <Layout
    path="/"
    hero="hero-real"
    jsonld={graph(orgLd(), siteLd(), galleryLd('/', GALLERY.slice(0, 12)), faqLd(FAQ.slice(0, 6)))}
    title="قهوجي وصبابين جدة — ضيافة مناسبات فاخرة"
    desc="القهوة الملكية لخدمات الضيافة في جدة: قهوجي وصبابين رجال، قهوجيات وصبابات نساء، دلال مذهّبة، قهوة سعودية وتمور فاخرة. اتصال وواتساب 0504968113."
  >
    <OnePage
      hero={{
        img: 'hero-real',
        tall: 'hero-real-tall',
        alt: 'فريق قهوجيين وصبابين بزي سعودي رسمي موحّد في مناسبة بجدة — القهوة الملكية',
        kick: 'JEDDAH · SAUDI ARABIA',
        h1: 'قهوجي وصبابين جدة لضيافة المناسبات',
        lead: 'طاقم رجالي ونسائي بزيٍّ رسمي، ودلال مذهّبة، وضيافة تليق بمقام ضيوفك.',
        wordmark: true,
        dots: ['الأعراس والملكات', 'المؤتمرات والشركات', 'المجالس والعزاء'],
        msg: `السلام عليكم، أرغب في حجز ضيافة لمناسبة في جدة مع ${BRAND.name}.`,
      }}
      faq={FAQ.slice(0, 6)}
    />
  </Layout>
)

/* ══ 2. SERVICES (صفحة الخدمات المخصصة فقط — مثل كيف الضيافة /services) ══ */
export const Services = () => {
  const msg = `السلام عليكم، أرغب في معرفة خدمات الضيافة لدى ${BRAND.name}.`
  return (
    <Layout
      path="/services"
      hero="ev-team-1"
      jsonld={graph(crumbLd([{ name: 'الخدمات', path: '/services' }]), faqLd(FAQ.slice(0, 5)))}
      title="خدمات الضيافة في جدة — قهوجيين وقهوجيات وتقديمات"
      desc="خدمات ضيافة متكاملة في جدة من القهوة الملكية: قهوجيين للرجال، قهوجيات للنساء، سقاية زمزم، تمور وحلى، بوفيه، عدّة نحاسية، وضيافة ملكية. 0504968113."
    >
      <Hero
        h={{
          img: 'ev-team-1',
          alt: `طاقم ضيافة بزي موحّد — ${BRAND.name}`,
          kick: 'الخدمات المتكاملة',
          h1: 'كل ما تحتاجه مناسبتك — من طاقم واحد',
          lead: 'الطاقم الرجالي · الطاقم النسائي · التجهيزات الملكية واللمسات الفنية — بعرض سعر واحد ومشرف ميداني واحد.',
          dots: ['الطاقم الرجالي', 'الطاقم النسائي', 'تجهيزات ملكية VIP'],
          msg,
        }}
      />
      <ServicesSec place="جدة" />
      <CrewSec />
      <RolesSec />
      <ArrangementsSec />
      <FaqSec items={FAQ.slice(0, 5)} />
      <EndCta msg={msg} />
    </Layout>
  )
}

export const ServiceDetail = ({ s }: { s: Service }) => {
  const msg = `السلام عليكم، أرغب في حجز: ${s.title} من ${BRAND.name}.`
  return (
    <Layout
      path={`/services/${s.slug}`}
      hero={s.img}
      jsonld={graph(
        serviceLd(s.h1, s.desc, `/services/${s.slug}`, s.img, 'جدة'),
        crumbLd([
          { name: 'الخدمات', path: '/services' },
          { name: s.title, path: `/services/${s.slug}` },
        ]),
      )}
      title={fit(s.h1, 'جدة')}
      desc={s.desc.slice(0, 155)}
    >
      <Hero
        h={{
          img: s.img,
          alt: `${s.h1} — ${BRAND.name}`,
          kick: s.badge,
          h1: s.h1,
          lead: s.short,
          dots: s.points.slice(0, 3),
          msg,
        }}
      />
      <FocusText
        k="تفاصيل الخدمة ومشتملاتها"
        t={s.title}
        body={s.desc}
        img={s.gal[0] ?? s.img}
        points={s.points}
      />
      <section class="sx sx-alt">
        <div class="wrap">
          <Head k="ماذا تشمل هذه الخدمة؟" t="المشتملات الأساسية في كل حجز" />
          <div class="ksvc-inc" style="max-width:920px;margin-inline:auto">
            {s.includes.map((inc) => (
              <div class="rv">
                <b>{inc.t}</b>
                <span>{inc.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {s.gal.length > 1 && (
        <FocusGrid
          k="من أعمالنا الميدانية"
          t={`لقطات حقيقية من ${s.title}`}
          items={s.gal.map((g) => ({ img: g, t: s.title, d: s.short }))}
        />
      )}
      <ArrangementsSec />
      <FaqSec items={FAQ.slice(0, 4)} />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 3. OCCASIONS (صفحة المناسبات المخصصة فقط) ═════════════════ */
export const Occasions = () => {
  const msg = `السلام عليكم، أرغب في ضيافة لمناسبة مع ${BRAND.name}.`
  return (
    <Layout
      path="/occasions"
      hero="ev-vip-2"
      jsonld={graph(crumbLd([{ name: 'المناسبات', path: '/occasions' }]))}
      title="ضيافة المناسبات في جدة — أعراس وشركات وعزاء"
      desc="ضيافة لكل مناسبة في جدة مع القهوة الملكية: أعراس وملكات، مجالس عزاء، مؤتمرات ومعارض، تخرّج، استقبال مواليد، ومخيمات. 0504968113."
    >
      <Hero
        h={{
          img: 'ev-vip-2',
          alt: `ضيافة مناسبات فاخرة — ${BRAND.name}`,
          kick: 'المناسبات والفعاليات',
          h1: 'ضيافة المناسبات في جدة',
          lead: 'لكل مناسبةٍ طاقمها وزيّها وترتيبها المكتوب — من الأعراس والمؤتمرات حتى المجالس والعزاء.',
          msg,
        }}
      />
      <OccasionsSec place="جدة" />
      <section class="sx">
        <div class="wrap">
          <Head
            k="تفاصيل المناسبات"
            t="كيف نُدير كل مناسبة على أصولها؟"
            sub="كل مناسبة لها بروتوكول مختلف في الزيّ وتوقيت الصبّ ونوع التقديمات."
          />
          <div class="arr-grid">
            {OCCASIONS.map((o, i) => (
              <article class="arr-card rv" style={`--i:${i}`}>
                <h3>{o.title}</h3>
                <p class="arr-sub">{o.desc}</p>
                <ul class="arr-pts">
                  {o.needs.map((n) => (
                    <li>{n}</li>
                  ))}
                </ul>
                <a class="btn btn-gold btn-block" href={`/occasions/${o.slug}`}>
                  تفاصيل {o.title}
                  <Ico n="arrow" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ArrangementsSec />
      <FaqSec items={FAQ.slice(0, 5)} />
      <EndCta msg={msg} />
    </Layout>
  )
}

export const OccasionDetail = ({ o }: { o: Occasion }) => {
  const msg = `السلام عليكم، أرغب في ضيافة لمناسبة (${o.title}) مع ${BRAND.name}.`
  return (
    <Layout
      path={`/occasions/${o.slug}`}
      hero={o.img}
      title={fit(o.h1, 'جدة')}
      desc={o.desc.slice(0, 155)}
      jsonld={graph(
        eventLd(o.h1, o.desc, `/occasions/${o.slug}`, o.img),
        crumbLd([
          { name: 'المناسبات', path: '/occasions' },
          { name: o.title, path: `/occasions/${o.slug}` },
        ]),
      )}
    >
      <Hero
        h={{
          img: o.img,
          alt: `${o.h1} — ${BRAND.name}`,
          kick: 'المناسبات',
          h1: o.h1,
          lead: o.d,
          dots: o.needs.slice(0, 3),
          msg,
        }}
      />
      <FocusText k="كيف نُدير هذه المناسبة" t={o.title} body={o.desc} img={o.img} points={o.needs} />
      <ServicesSec place="جدة" />
      <OccasionsSec place="جدة" />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 4. MENU / OFFERINGS (صفحة التقديمات المخصصة فقط — مثل كيف الضيافة /offerings) ══ */
export const Menu = () => {
  const msg = `السلام عليكم، أرغب في قائمة ضيافة من ${BRAND.name}.`
  return (
    <Layout
      path="/menu"
      hero="sw-station"
      jsonld={graph(crumbLd([{ name: 'قائمة الضيافة', path: '/menu' }]), {
        '@type': 'Menu',
        name: `قائمة الضيافة — ${BRAND.name}`,
        hasMenuSection: MENU.map((m) => ({ '@type': 'MenuSection', name: m.cat, url: `${SITE}/menu/${m.slug}` })),
      })}
      title="قائمة الضيافة — قهوة وتمور وحلى وأكلات شعبية"
      desc="قائمة القهوة الملكية في جدة: قهوة سعودية وشاي، مشروبات باردة، تمور فاخرة، حلى وشرقيات، فواكه، مقبلات، وأكلات شعبية بصور حقيقية."
    >
      <Hero
        h={{
          img: 'sw-station',
          alt: `محطة ضيافة وحلى — ${BRAND.name}`,
          kick: 'التقديمات والمعدات',
          h1: 'ما الذي يصل إلى ضيوفك؟',
          lead: 'أكثر من ٧٠ صنفاً من القهوة السعودية والتمور الفاخرة والحلى والأكلات الشعبية — بصورها الحقيقية.',
          dots: ['المشروبات الحارة والباردة', 'التمور والحلى والشرقيات', 'المعجنات والأكلات الشعبية'],
          msg,
        }}
      />
      <MenuSec showAllCategories />
      <EndCta msg={msg} />
    </Layout>
  )
}

export const MenuCategory = ({ m }: { m: MenuCat }) => {
  const msg = `السلام عليكم، أرغب في طلب (${m.cat}) من ${BRAND.name}.`
  return (
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
      title={fit(m.cat, 'قائمة الضيافة')}
      desc={m.blurb.slice(0, 155)}
    >
      <Hero
        h={{
          img: m.hero,
          alt: `${m.cat} — ${BRAND.name}`,
          kick: 'قائمة التقديمات',
          h1: m.cat,
          lead: oneLine(m.blurb),
          msg,
        }}
      />
      <FocusGrid
        k={`${m.items.length} صنفاً في هذا القسم`}
        t={m.cat}
        items={m.items.filter((i) => i.img).map((i) => ({ img: i.img!, t: i.n, d: i.d }))}
      />
      <section class="sx sx-alt">
        <div class="wrap">
          <Head k="بقية أقسام القائمة" t="تصفّح الأقسام الأخرى" />
          <div class="seo-hub-grid" style="justify-content:center">
            {MENU.map((cat) => (
              <a
                class="seo-hub-link"
                href={`/menu/${cat.slug}`}
                aria-current={cat.slug === m.slug ? 'page' : undefined}
              >
                {cat.cat} ({cat.items.length})
              </a>
            ))}
          </div>
        </div>
      </section>
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 5. GALLERY / PORTFOLIO (صفحة أعمالنا المخصصة فقط — مثل كيف الضيافة /portfolio) ══ */
export const Gallery = () => {
  const msg = `السلام عليكم، أعجبتني أعمالكم في ${BRAND.name} وأرغب في حجز ضيافة مماثلة.`
  return (
    <Layout
      path="/gallery"
      hero="ev-vip-2"
      jsonld={graph(galleryLd('/gallery', GALLERY), crumbLd([{ name: 'معرض الأعمال', path: '/gallery' }]))}
      title="معرض الأعمال — صور حقيقية من مناسباتنا في جدة"
      desc="شاهد صور أعمال القهوة الملكية في جدة: قهوجيين وصبابين بزي موحّد، سوقيات ذهبية، دلال نحاسية، ومحطات حلى وتمور من مناسبات حقيقية."
    >
      <Hero
        h={{
          img: 'ev-vip-2',
          alt: `معرض أعمال ${BRAND.name} في جدة`,
          kick: 'معرض الأعمال الموثّق',
          h1: 'صور حقيقية من مناسبات نفّذناها',
          lead: 'كل صورة هنا توثيق حقيقي لطاقمنا وعدّتنا المذهّبة في القاعات والمؤتمرات والمجالس.',
          msg,
        }}
      />
      <WorksSec expandAll />
      <CrewSec />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 6. LOCATIONS & LOCAL SEO PAGES ════════════════════════════ */
export const Locations = () => {
  const msg = `السلام عليكم، أرغب في حجز ضيافة مع ${BRAND.name}.`
  return (
    <Layout
      path="/locations"
      hero="ev-team-1"
      jsonld={graph(crumbLd([{ name: 'مناطق الخدمة', path: '/locations' }]))}
      title="تغطية خدمات الضيافة — جدة ومدن المملكة"
      desc="القهوة الملكية لخدمات الضيافة: مقرّنا الرئيسي جدة ونخدم الرياض ومكة المكرمة والمدينة المنورة والدمام والخبر والطائف وأبها وينبع وتبوك. 0504968113."
    >
      <Hero
        h={{
          img: 'ev-team-1',
          alt: `فريق الضيافة — ${BRAND.name}`,
          kick: 'نطاق التغطية',
          h1: 'ضيافة القهوة الملكية في جدة والمملكة',
          lead: 'مقرّنا الرئيسي جدة، وفرقنا المقيمة تخدم مناسباتكم في ١٠ مدن سعودية بنفس المعيار الملكي.',
          msg,
        }}
      />
      <section class="sx">
        <div class="wrap">
          <Head
            k="المدن المشمولة بالتغطية"
            t="فرق مقيمة في ١٠ مدن رئيسية"
            sub="اختر مدينتك للاطلاع على الأحياء المشمولة وتفاصيل الطاقم في منطقتك."
          />
          <div class="arr-grid">
            {CITIES.map((c, i) => (
              <article class="arr-card rv" style={`--i:${i}`}>
                <h3>ضيافة {c.name}</h3>
                <p class="arr-sub">{c.intro.slice(0, 140)}…</p>
                <ul class="arr-pts">
                  {c.local.slice(0, 3).map((l) => (
                    <li>{l}</li>
                  ))}
                </ul>
                <a class="btn btn-gold btn-block" href={`/locations/${c.slug}`}>
                  صفحة {c.name}
                  <Ico n="arrow" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section class="sx sx-alt" aria-label="دليل صفحات الخدمة">
        <div class="wrap">
          <Head
            k="دليل الصفحات المتخصصة"
            t="اختر الخدمة والمدينة مباشرة"
          />
          <div class="seo-hub-grid" style="justify-content:center">
            {JEDDAH_PAGES.map((jp) => (
              <a class="seo-hub-link" href={`/${jp.slug}`}>
                {jp.chip}
              </a>
            ))}
            {CITIES.map((c) => (
              <a class="seo-hub-link" href={`/locations/${c.slug}`}>
                ضيافة {c.name}
              </a>
            ))}
            {FAMILIES.map((f) =>
              CITIES.map((c) => (
                <a class="seo-hub-link" href={`/${f.prefix}-${c.slug}`}>
                  {f.noun} {c.name}
                </a>
              )),
            )}
          </div>
        </div>
      </section>
      <EndCta msg={msg} />
    </Layout>
  )
}

const cityFaq = (noun: string, c: City) => [
  {
    q: `كم ${noun} أحتاج لمناسبة في ${c.inName}؟`,
    a: `نحسب فرداً لكل ٣٠ ضيفاً تقريباً، ومباشراً للمناسبات فوق ١٠٠ ضيف. أرسل عدد ضيوفك على واتساب ${BRAND.phoneDisplay} ونرسل لك التشكيل مكتوباً.`,
  },
  {
    q: `هل تصلون إلى كل أحياء ${c.inName}؟`,
    a: `نعم — نغطي ${c.districts.slice(0, 6).join('، ')} وغيرها، إضافةً إلى ${c.venues.slice(0, 2).join(' و')}.`,
  },
  {
    q: `كم سعر ${noun} في ${c.inName}؟`,
    a: 'يعتمد على عدد الضيوف ومدة المناسبة ونوع التقديمات، ويصلك عرض سعر مكتوب ومفصّل قبل أي تأكيد.',
  },
  {
    q: `كيف أحجز ${noun} في ${c.inName}؟`,
    a: `اتصل أو أرسل واتساب على ${BRAND.phoneDisplay}: التاريخ، الحيّ، وعدد الضيوف.`,
  },
]

export const CityHub = ({ c }: { c: City }) => {
  const img = c.slug === JED ? 'ev-team-1' : c.hero
  const faq = cityFaq('قهوجي', c)
  const msg = `السلام عليكم، أرغب في حجز ضيافة في ${c.name} مع ${BRAND.name}.`
  return (
    <Layout
      path={`/locations/${c.slug}`}
      hero={img}
      jsonld={graph(
        serviceLd(`ضيافة ${c.name} — ${BRAND.name}`, c.intro, `/locations/${c.slug}`, img, c.name),
        faqLd(faq),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: c.name, path: `/locations/${c.slug}` },
        ]),
      )}
      title={fit(`ضيافة ${c.name}`, 'قهوجيين وصبابين وقهوة عربية', 'قهوجيين وصبابين')}
      desc={c.intro.slice(0, 155)}
    >
      <Hero
        h={{
          img,
          alt: `ضيافة ${c.name} — ${BRAND.name}`,
          kick: c.region,
          h1: `قهوجيين وضيافة مناسبات في ${c.inName}`,
          lead: `قهوجيين وصبابين وقهوجيات بزيٍّ رسمي موحّد في ${c.inName} — حضور قبل الموعد وعرض سعر مكتوب.`,
          dots: c.local.slice(0, 3),
          msg,
        }}
      />
      <FocusText k={`خدمتنا في ${c.inName}`} t={`ضيافة ${c.inName} بمعيار ملكي`} body={c.intro} points={c.local} img={c.hero} />
      <section class="sx sx-alt">
        <div class="wrap">
          <Head k={`نطاق التغطية في ${c.inName}`} t={`الأحياء والقاعات التي نخدمها في ${c.inName}`} />
          <div class="seo-hub-grid" style="justify-content:center">
            {c.districts.map((d) => (
              <span class="seo-hub-link">حي {d}</span>
            ))}
            {c.venues.map((v) => (
              <span class="seo-hub-link">{v}</span>
            ))}
          </div>
          <div class="seo-hub-grid" style="justify-content:center;margin-top:16px">
            {FAMILIES.map((f) => (
              <a class="seo-hub-link" href={`/${f.prefix}-${c.slug}`}>
                {f.noun} {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>
      <ServicesSec place={c.inName} />
      <FaqSec items={faq} />
      <EndCta msg={msg} />
    </Layout>
  )
}

export const FamilyCity = ({ f, c }: { f: Family; c: City }) => {
  const title = `${f.noun} ${c.name}`
  const img = c.slug === JED ? FAM_HERO[f.prefix] ?? c.hero : c.hero
  const faq = cityFaq(f.noun === 'ضيافة مناسبات' ? 'فرداً من الطاقم' : f.noun, c)
  const msg = `السلام عليكم، أرغب في حجز ${title} مع ${BRAND.name}.`
  return (
    <Layout
      path={`/${f.prefix}-${c.slug}`}
      hero={img}
      jsonld={graph(
        serviceLd(`${title} — ${BRAND.name}`, familyCopy(f, c), `/${f.prefix}-${c.slug}`, img, c.name),
        faqLd(faq),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: c.name, path: `/locations/${c.slug}` },
          { name: title, path: `/${f.prefix}-${c.slug}` },
        ]),
      )}
      title={fit(title, `${f.kicker} بزي رسمي`, f.kicker)}
      desc={familyCopy(f, c).slice(0, 155)}
    >
      <Hero
        h={{
          img,
          alt: `${title} — ${BRAND.name}`,
          kick: `${f.kicker} · ${c.name}`,
          h1: `${f.noun} في ${c.inName}`,
          lead: `${f.kicker} بزيٍّ رسمي موحّد في ${c.inName} — حضور قبل الموعد وعرض سعر مكتوب.`,
          dots: f.bullets.slice(0, 3).map((b) => b.t),
          msg,
        }}
      />
      <FocusText
        k={f.kicker}
        t={`${f.noun} في ${c.inName}`}
        body={familyCopy(f, c)}
        points={f.bullets.map((b) => b.t)}
        img={c.hero}
      />
      <ServicesSec place={c.inName} />
      <ArrangementsSec />
      <FaqSec items={faq} />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 7. ABOUT (صفحة من نحن المخصصة فقط — مثل كيف الضيافة /about) ══ */
export const About = () => {
  const msg = `السلام عليكم، أرغب في التعرّف على خدمات ${BRAND.name}.`
  return (
    <Layout
      path="/about"
      hero="ev-team-1"
      jsonld={graph(orgLd(), crumbLd([{ name: 'من نحن', path: '/about' }]))}
      title={`عن ${BRAND.name} — ضيافة عربية رسمية في جدة`}
      desc={`${BRAND.name} (${BRAND.latin}): ضيافة عربية رسمية من جدة — قهوجيين وصبابين وقهوجيات بزي موحّد وعدّة مذهّبة. اتصال وواتساب ${BRAND.phoneLocal}.`}
    >
      <Hero
        h={{
          img: 'ev-team-1',
          alt: `فريق ${BRAND.name}`,
          kick: 'تعرّف علينا',
          h1: `من نحن في ${BRAND.name}`,
          lead: 'ضيافة عربية رسمية من جدة منذ ٢٠١٤ — بمعيار مكتوب وثابت في كل مناسبة.',
          wordmark: true,
          msg,
        }}
      />
      <FocusText
        k="قصّتنا والتزامنا"
        t="بدأنا بدلّة وصينية — وجعلنا الضيافة مهنة بمعيار مكتوب"
        body={`انطلقت ${BRAND.name} (${BRAND.latin}) من جدة عام ${BRAND.since} بفكرة واضحة: أن الضيافة السعودية الأصيلة تستحق أن تُدار بانضباط المؤسسات وفخامة القصور. الفريق الذي يصلك مدرَّب على يدنا، والعدّة النحاسية المذهّبة تُصقل وتُعقَّم قبل كل خروج، والمشرف الميداني يضبط المسار من أول فنجال حتى وداع آخر ضيف.`}
        img="ev-vip-1"
        points={[
          'حضور قبل الموعد بساعتين وتجهيز كامل للموقع',
          'طاقم رجالي وطاقم نسائي مستقل بزيّ رسمي موحّد',
          'قهوة سعودية تُحضّر طازجة بالهيل والزعفران',
          'عقود رسمية وفواتير ضريبية للجهات والشركات',
        ]}
      />
      <PartnersStrip />
      <WhoSec place="جدة" />
      <section class="sx sx-alt" id="how">
        <div class="wrap">
          <Head
            k="آلية العمل"
            t="أربع خطوات — من رسالتك إلى آخر فنجال"
          />
          <div class="arr-grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">
            {STEPS.map((st, i) => (
              <article class="arr-card rv" style={`--i:${i}`}>
                <span class="rolx-k">الخطوة ٠{i + 1}</span>
                <h3>{st.t}</h3>
                <p class="arr-sub" style="margin:0">{st.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section class="sx" id="values">
        <div class="wrap">
          <Head k="مبادئنا" t="ستة التزامات لا نتنازل عنها في أي مناسبة" />
          <div class="arr-grid">
            {PILLARS.map((p, i) => (
              <article class="arr-card rv" style={`--i:${i}`}>
                <h3>{p.t}</h3>
                <p class="arr-sub" style="margin:0">{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <RolesSec />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 8. FAQ (صفحة الأسئلة الشائعة المخصصة فقط) ════════════════ */
export const FaqPage = () => {
  const msg = `السلام عليكم، عندي استفسار حول خدمات ${BRAND.name}.`
  return (
    <Layout
      path="/faq"
      hero="ev-booth-2"
      jsonld={graph(faqLd(FAQ), crumbLd([{ name: 'أسئلة متكررة', path: '/faq' }]))}
      title="أسئلة شائعة عن القهوجيين والضيافة في جدة"
      desc="إجابات واضحة من القهوة الملكية عن حجز القهوجيين والصبابين والقهوجيات في جدة، طريقة حساب التكلفة، ضيافة العزاء، والفواتير الضريبية."
    >
      <Hero
        h={{
          img: 'ev-booth-2',
          alt: `ركن ضيافة — ${BRAND.name}`,
          kick: 'الأسئلة الشائعة',
          h1: 'أسئلة وأجوبة صريحة قبل الحجز',
          lead: 'كل ما يتكرر السؤال عنه حول الطاقم والعدّة وطريقة الحجز والفواتير الضريبية.',
          msg,
        }}
      />
      <FaqSec items={FAQ} />
      <ArrangementsSec />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 9. CONTACT (صفحة تواصل معنا المخصصة فقط — مثل كيف الضيافة /contact) ══ */
export const Contact = () => {
  const msg = `السلام عليكم، أرغب في حجز ضيافة مناسبة مع ${BRAND.name}.`
  return (
    <Layout
      path="/contact"
      hero="ev-booth-2"
      jsonld={graph(
        orgLd(),
        { '@type': 'ContactPage', url: `${SITE}/contact`, name: `تواصل مع ${BRAND.name}` },
        crumbLd([{ name: 'تواصل معنا', path: '/contact' }]),
      )}
      title="رقم قهوجي جدة — تواصل واحجز ضيافتك 0504968113"
      desc={`احجز ضيافة مناسبتك في جدة مع ${BRAND.name} عبر الاتصال المباشر أو واتساب ${BRAND.phoneDisplay} أو البريد ${BRAND.email}. استقبال الحجوزات ٢٤ ساعة.`}
    >
      <Hero
        h={{
          img: 'ev-booth-2',
          alt: `تواصل مع ${BRAND.name}`,
          kick: 'تواصل مباشر ٢٤/٧',
          h1: 'احجز ضيافة مناسبتك الآن',
          lead: `رقم موحّد للاتصال المباشر والواتساب: ${BRAND.phoneDisplay} — أو عبر البريد الرسمي ${BRAND.email}`,
          msg,
        }}
      />
      <section class="sx">
        <div class="wrap" style="max-width:760px">
          <Head
            k="قنوات التواصل الرسمية"
            t="اختر الطريقة الأنسب لك"
            sub="واتساب هو الأسرع للحصول على عرض سعر مكتوب ومفصّل خلال دقائق."
          />
          <nav class="klinks-list" aria-label="قنوات التواصل الرسمية">
            <a
              class="klink-card"
              href={wa(msg)}
              target="_blank"
              rel="noopener"
              style="--tint:#25D366"
              data-track="whatsapp"
              data-location="contact-page"
            >
              <span class="klink-ic"><Ico n="chat" /></span>
              <span class="klink-tx">
                <b>WhatsApp <i>— واتساب فوري</i></b>
                <small class="ltr">{BRAND.phoneDisplay}</small>
              </span>
              <span class="klink-arr"><Ico n="arrow" /></span>
            </a>

            <a
              class="klink-card"
              href={`tel:${BRAND.phoneLocal}`}
              style="--tint:#E2C68E"
              data-track="call"
              data-location="contact-page"
            >
              <span class="klink-ic"><Ico n="phone" /></span>
              <span class="klink-tx">
                <b>Call <i>— اتصال مباشر ٢٤/٧</i></b>
                <small class="ltr">{BRAND.phoneDisplay}</small>
              </span>
              <span class="klink-arr"><Ico n="arrow" /></span>
            </a>

            <a
              class="klink-card"
              href={`mailto:${BRAND.email}`}
              style="--tint:#C5A059"
            >
              <span class="klink-ic"><Ico n="send" /></span>
              <span class="klink-tx">
                <b>Email <i>— البريد الإلكتروني</i></b>
                <small class="ltr">{BRAND.email}</small>
              </span>
              <span class="klink-arr"><Ico n="arrow" /></span>
            </a>

            <a
              class="klink-card"
              href={BRAND.mapsUrl}
              target="_blank"
              rel="noopener"
              style="--tint:#34A853"
            >
              <span class="klink-ic"><Ico n="maps" /></span>
              <span class="klink-tx">
                <b>Google Maps <i>— الموقع الرئيسي</i></b>
                <small>جدة · المملكة العربية السعودية</small>
              </span>
              <span class="klink-arr"><Ico n="arrow" /></span>
            </a>
          </nav>
        </div>
      </section>
      <RoyalConcierge place="جدة" />
      <FaqSec items={FAQ.slice(0, 4)} />
    </Layout>
  )
}

/* ══ 10. FAST BOOKING (صفحة الحجز الفوري المستقلة للزبون المستعجل — /booking) ══ */
export const FastBooking = () => {
  const msg = `السلام عليكم، أرغب في حجز ضيافة عاجلة في جدة مع ${BRAND.name}.`
  return (
    <Layout
      path="/booking"
      hero="ev-vip-2"
      jsonld={graph(
        orgLd(),
        serviceLd(
          `حجز قهوجي وصبابين فوري في جدة — ${BRAND.name}`,
          'حدّد نوع مناسبتك وعدد الضيوف والطاقم المطلوب في ١٠ ثوانٍ فقط، واحصل على التشكيل المثالي وعرض السعر المكتوب عبر واتساب فوراً.',
          '/booking',
          'ev-vip-2',
          'جدة',
        ),
        crumbLd([{ name: 'حجز فوري في ١٠ ثوانٍ', path: '/booking' }]),
      )}
      title="حجز قهوجي فوري في جدة — حدّد مناسبتك في ١٠ ثوانٍ"
      desc="صفحة الحجز السريع للزبون المستعجل من القهوة الملكية في جدة: اختر نوع المناسبة والطاقم وعدد الضيوف في ٣ نقرات، ويصلك الترتيب وعرض السعر عبر واتساب 0504968113."
    >
      <section class="fast-hero">
        <div class="wrap fast-page-intro">
          <span class="fast-kicker">للزبون المستعجل · حجز فوري بدون انتظار</span>
          <h1 class="fast-h1">مُحدّد الضيافة الملكي السريع في ١٠ ثوانٍ</h1>
          <p class="fast-lead">
            اختر ٣ نقرات فقط (نوع المناسبة + الطاقم + عدد الضيوف)، وسنحسب لك الترتيب الأنسب فوراً ونجهّز لك رسالة واتساب مكتوبة جاهزة للإرسال.
          </p>
        </div>
      </section>
      <RoyalConcierge place="جدة" />
      <ArrangementsSec />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 11. JEDDAH KEYWORD PAGES ═════════════════════════════════ */
export const JeddahLanding = ({ p }: { p: JeddahPage }) => (
  <Layout
    path={`/${p.slug}`}
    hero={p.hero}
    title={p.title}
    desc={p.desc}
    jsonld={graph(
      serviceLd(`${p.h1} — ${BRAND.name}`, p.body[0], `/${p.slug}`, p.hero, 'جدة'),
      faqLd(p.faq),
      crumbLd([
        { name: 'مناطق الخدمة', path: '/locations' },
        { name: 'جدة', path: '/locations/jeddah' },
        { name: p.chip, path: `/${p.slug}` },
      ]),
    )}
  >
    <Hero
      h={{
        img: p.hero,
        alt: `${p.h1} — ${BRAND.name}`,
        kick: `${p.kicker} · جدة`,
        h1: p.h1,
        lead: p.lead,
        dots: p.bullets.slice(0, 3).map((b) => b.t),
        msg: p.msg,
      }}
    />
    <FocusText
      k={p.chip}
      t={`كيف ندير ${p.chip} بمعيار ${BRAND.name}`}
      body={p.body.join(' ')}
      points={p.bullets.map((b) => b.t)}
      img={p.hero}
    />
    <ServicesSec place="جدة" />
    <CrewSec />
    <FaqSec items={p.faq} />
    <EndCta msg={p.msg} />
  </Layout>
)

/* ══ 12. 404 ══════════════════════════════════════════════════ */
export const NotFound = () => (
  <Layout
    path="/404"
    noindex
    hero="hero-real"
    title="الصفحة غير موجودة"
    desc="الصفحة التي تبحث عنها غير متاحة — تفضّل بالعودة إلى الصفحة الرئيسية للقهوة الملكية."
  >
    <Hero
      h={{
        img: 'hero-real',
        tall: 'hero-real-tall',
        alt: `فريق ${BRAND.name}`,
        kick: 'خطأ ٤٠٤',
        h1: 'هذه الصفحة غير متاحة',
        lead: 'تفضّل بالعودة إلى الصفحة الرئيسية أو تواصل معنا مباشرة عبر واتساب أو الاتصال.',
        msg: `السلام عليكم، أرغب في الاستفسار عن خدمات الضيافة لدى ${BRAND.name}.`,
      }}
    />
  </Layout>
)
