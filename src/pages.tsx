/**
 * Every URL, rebuilt on <OnePage>. Each page keeps its own <title>,
 * description, canonical, JSON-LD, H1, opening line and FAQ — so each
 * URL ranks for its own intent — while the body is the full site.
 */
import { Layout, SITE } from './layout'
import { BRAND, SERVICES, MENU, GALLERY, FAQ, type Service, type Occasion, type MenuCat } from './data'
import { familyCopy, type City, type Family } from './cities'
import { type JeddahPage } from './jeddah'
import { graph, orgLd, siteLd, faqLd, crumbLd, serviceLd, eventLd, menuLd, galleryLd } from './ld'
import { OnePage, FocusText, FocusGrid, oneLine } from './onepage'

const JED = 'jeddah'
/** real-team photos for Jeddah pages */
const FAM_HERO: Record<string, string> = {
  qahwajiin: 'ev-team-1',
  'sababin-qahwa': 'ev-booth-2',
  'diyafa-munasabat': 'ev-vip-2',
}

/** keep <title> inside Google's ~70-char budget (Layout appends " | brand") */
const fit = (base: string, ...suffixes: string[]) => {
  const budget = 70 - ` | ${BRAND.name}`.length
  for (const s of suffixes) {
    const t = s ? `${base} — ${s}` : base
    if (t.length <= budget) return t
  }
  return base
}

/* ══ HOME ══════════════════════════════════════════════════════ */
export const Home = () => (
  <Layout
    path="/"
    hero="hero-real"
    jsonld={graph(orgLd(), siteLd(), faqLd(FAQ.slice(0, 5)))}
    title="قهوجيين وصبابين جدة — ضيافة مناسبات فاخرة"
    desc="قهوجيين وصبابين وقهوجيات في جدة: طاقم بزي رسمي موحّد، قهوة عربية تُحضَّر في الموقع، دلال ذهبية وتقديمات فاخرة. اتصال وواتساب 0504968113."
  >
    <OnePage
      hero={{
        img: 'hero-real',
        tall: 'hero-real-tall',
        alt: 'فريق قهوجيين وصبابين بزي موحّد في مناسبة بجدة',
        kick: 'JEDDAH · SAUDI ARABIA',
        h1: 'قهوجيين وصبابين جدة',
        lead: 'طاقم بزيٍّ رسمي، ودلال ذهبية، وضيافة تليق بمكانة ضيوفك.',
        wordmark: true,
        msg: 'السلام عليكم، أرغب في حجز ضيافة لمناسبة في جدة.',
      }}
      faq={FAQ.slice(0, 5)}
    />
  </Layout>
)

/* ══ SERVICES ══════════════════════════════════════════════════ */
export const Services = () => (
  <Layout
    path="/services"
    hero="ev-team-1"
    jsonld={graph(crumbLd([{ name: 'الخدمات', path: '/services' }]))}
    title="خدمات الضيافة في جدة — قهوجيين وقهوجيات وتقديمات"
    desc="خدمات ضيافة كاملة في جدة: قهوجيين للرجال، قهوجيات للنساء، سقاية زمزم، تمور وحلى، بوفيه، عدّة نحاسية، ضيافة ملكية وإضافات."
  >
    <OnePage
      hero={{ img: 'ev-team-1', alt: 'طاقم ضيافة بزي موحّد', kick: 'الخدمات', h1: 'خدمات الضيافة في جدة', lead: 'كل ما تحتاجه مناسبتك — من طاقم واحد وعرضٍ واحد.', msg: 'السلام عليكم، أرغب في معرفة خدمات الضيافة.' }}
      focus={
        <FocusGrid k="أقسام الضيافة" t="ثمانية أقسام — تُطلب منفردة أو كاملة" items={SERVICES.map((s) => ({ img: s.img, t: s.title, d: s.short }))} />
      }
    />
  </Layout>
)

export const ServiceDetail = ({ s }: { s: Service }) => (
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
    <OnePage
      hero={{ img: s.img, alt: s.title, kick: s.badge, h1: s.h1, lead: s.short, msg: `السلام عليكم، أرغب في حجز: ${s.title}` }}
      focus={
        <>
          <FocusText k="عن الخدمة" t={s.title} body={s.desc} img={s.gal[0] ?? s.img} points={s.points.slice(0, 4)} />
          {s.gal.length > 1 && <FocusGrid k="من أعمالنا" t={`لمحة من ${s.title}`} items={s.gal.slice(0, 4).map((g) => ({ img: g, t: s.title }))} />}
        </>
      }
    />
  </Layout>
)

/* ══ OCCASIONS ═════════════════════════════════════════════════ */
export const Occasions = () => (
  <Layout
    path="/occasions"
    hero="ev-vip-2"
    jsonld={graph(crumbLd([{ name: 'المناسبات', path: '/occasions' }]))}
    title="ضيافة المناسبات في جدة — أعراس وشركات وعزاء"
    desc="ضيافة لكل مناسبة في جدة: أعراس وملكات، مجالس عزاء، مؤتمرات ومعارض، تخرّج، استقبال مواليد، ومخيمات."
  >
    <OnePage hero={{ img: 'ev-vip-2', alt: 'ضيافة مناسبة فاخرة', kick: 'المناسبات', h1: 'ضيافة المناسبات في جدة', lead: 'لكل مناسبةٍ طاقمها وزيّها وترتيبها.', msg: 'السلام عليكم، أرغب في ضيافة لمناسبة.' }} />
  </Layout>
)

export const OccasionDetail = ({ o }: { o: Occasion }) => (
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
    <OnePage
      hero={{ img: o.img, alt: o.title, kick: 'المناسبات', h1: o.h1, lead: o.d, msg: `السلام عليكم، أرغب في ضيافة لمناسبة: ${o.title}` }}
      focus={<FocusText k="كيف نُدير هذه المناسبة" t={o.title} body={o.desc} points={o.needs} />}
    />
  </Layout>
)

/* ══ LOCATIONS ═════════════════════════════════════════════════ */
export const Locations = () => (
  <Layout
    path="/locations"
    hero="ev-team-1"
    jsonld={graph(crumbLd([{ name: 'مناطق الخدمة', path: '/locations' }]))}
    title="مناطق الخدمة — جدة أولاً وكل مدن المملكة"
    desc="مقرّنا جدة ونخدم الرياض ومكة المكرمة والمدينة المنورة والدمام والخبر والطائف وأبها وينبع وتبوك."
  >
    <OnePage hero={{ img: 'ev-team-1', alt: 'فريق الضيافة', kick: 'مناطق الخدمة', h1: 'جدة أولاً — وكل مدن المملكة', lead: 'مقرّنا جدة، وفرقنا تصل إلى مدن المملكة الرئيسية.', msg: 'السلام عليكم، أرغب في حجز ضيافة.' }} />
  </Layout>
)

const cityFaq = (noun: string, c: City) => [
  { q: `كم ${noun} أحتاج لمناسبة في ${c.inName}؟`, a: `فرد لكل ٣٠ ضيفاً تقريباً، ومباشر للمناسبات فوق ١٠٠ ضيف. أرسل عدد ضيوفك على واتساب ${BRAND.phoneDisplay} ونرسل لك التشكيل مكتوباً.` },
  { q: `هل تصلون إلى كل أحياء ${c.inName}؟`, a: `نعم — ${c.districts.slice(0, 6).join('، ')} وغيرها، إضافةً إلى ${c.venues.slice(0, 2).join(' و')}.` },
  { q: `كم سعر ${noun} في ${c.inName}؟`, a: 'يعتمد على عدد الضيوف ومدة المناسبة ونوع التقديمات، ويصلك عرض سعر مكتوب قبل أي تأكيد.' },
  { q: `كيف أحجز ${noun} في ${c.inName}؟`, a: `اتصل أو أرسل واتساب على ${BRAND.phoneDisplay}: التاريخ، الحيّ، وعدد الضيوف.` },
]

export const CityHub = ({ c }: { c: City }) => {
  const img = c.slug === JED ? 'ev-team-1' : c.hero
  const faq = cityFaq('قهوجي', c)
  return (
    <Layout
      path={`/locations/${c.slug}`}
      hero={img}
      jsonld={graph(
        serviceLd(`ضيافة ${c.name}`, c.intro, `/locations/${c.slug}`, img, c.name),
        faqLd(faq),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: c.name, path: `/locations/${c.slug}` },
        ]),
      )}
      title={fit(`ضيافة ${c.name}`, 'قهوجيين وصبابين وقهوة عربية', 'قهوجيين وصبابين')}
      desc={c.intro.slice(0, 155)}
    >
      <OnePage
        place={c.inName}
        faq={faq}
        hero={{ img, alt: `ضيافة ${c.name}`, kick: c.region, h1: `ضيافة ${c.inName}`, lead: `قهوجيين وصبابين وقهوجيات بزيٍّ موحّد في ${c.inName}.`, msg: `السلام عليكم، أرغب في حجز ضيافة في ${c.name}` }}
        focus={<FocusText k={`عن خدمتنا في ${c.inName}`} t={`ضيافة ${c.inName}`} body={c.intro} points={c.local} />}
      />
    </Layout>
  )
}

export const FamilyCity = ({ f, c }: { f: Family; c: City }) => {
  const title = `${f.noun} ${c.name}`
  const img = c.slug === JED ? FAM_HERO[f.prefix] ?? c.hero : c.hero
  const faq = cityFaq(f.noun === 'ضيافة مناسبات' ? 'فرداً من الطاقم' : f.noun, c)
  return (
    <Layout
      path={`/${f.prefix}-${c.slug}`}
      hero={img}
      jsonld={graph(
        serviceLd(title, familyCopy(f, c), `/${f.prefix}-${c.slug}`, img, c.name),
        faqLd(faq),
        crumbLd([
          { name: 'مناطق الخدمة', path: '/locations' },
          { name: c.name, path: `/locations/${c.slug}` },
          { name: title, path: `/${f.prefix}-${c.slug}` },
        ]),
      )}
      title={fit(title, `${f.kicker} بأسعار واضحة`, f.kicker, 'أسعار واضحة')}
      desc={familyCopy(f, c).slice(0, 155)}
    >
      <OnePage
        place={c.inName}
        faq={faq}
        hero={{ img, alt: title, kick: f.kicker, h1: title, lead: `${f.kicker} بزيٍّ موحّد في ${c.inName} — حضور قبل الموعد وعرض سعر مكتوب.`, msg: `السلام عليكم، أرغب في حجز ${title}` }}
        focus={<FocusText k={f.kicker} t={`${f.noun} في ${c.inName}`} body={familyCopy(f, c)} points={f.bullets.map((b) => b.t)} />}
      />
    </Layout>
  )
}

/* ══ MENU ══════════════════════════════════════════════════════ */
export const Menu = () => (
  <Layout
    path="/menu"
    hero="sw-station"
    jsonld={graph(crumbLd([{ name: 'قائمة الضيافة', path: '/menu' }]), {
      '@type': 'Menu',
      name: `قائمة الضيافة — ${BRAND.name}`,
      hasMenuSection: MENU.map((m) => ({ '@type': 'MenuSection', name: m.cat, url: `${SITE}/menu/${m.slug}` })),
    })}
    title="قائمة الضيافة — قهوة وتمور وحلى وأكلات شعبية"
    desc="قهوة عربية وشاي، مشروبات باردة، تمور فاخرة، حلى، فواكه، مقبلات، ساندويتشات، معجنات وأكلات شعبية — بصور حقيقية."
  >
    <OnePage hero={{ img: 'sw-station', alt: 'محطة ضيافة', kick: 'التقديمات', h1: 'قائمة الضيافة', lead: 'قهوة وتمور وحلى وأكلات شعبية — بصور حقيقية من تقديماتنا.', msg: 'السلام عليكم، أرغب في قائمة ضيافة.' }} />
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
    title={fit(m.cat, 'قائمة الضيافة')}
    desc={m.blurb.slice(0, 155)}
  >
    <OnePage
      hero={{ img: m.hero, alt: m.cat, kick: 'التقديمات', h1: m.cat, lead: oneLine(m.blurb), msg: `السلام عليكم، أرغب في: ${m.cat}` }}
      focus={<FocusGrid k={`${m.items.length} صنفاً`} t={m.cat} items={m.items.filter((i) => i.img).map((i) => ({ img: i.img!, t: i.n, d: i.d }))} />}
    />
  </Layout>
)

/* ══ GALLERY ═══════════════════════════════════════════════════ */
export const Gallery = () => (
  <Layout
    path="/gallery"
    hero="ev-vip-2"
    jsonld={graph(galleryLd('/gallery', GALLERY), crumbLd([{ name: 'معرض الأعمال', path: '/gallery' }]))}
    title="معرض الأعمال — صور حقيقية من مناسباتنا في جدة"
    desc="صور من ضيافاتنا الفعلية في جدة: فرق بزي موحّد، أركان قهوة، ضيافة ملكية، وتقديمات."
  >
    <OnePage
      hero={{ img: 'ev-vip-2', alt: 'من أعمالنا', kick: 'أعمالنا', h1: 'صور من مناسبات نفّذناها', lead: 'كل صورة هنا من مناسبة حقيقية.', msg: 'السلام عليكم، أعجبتني أعمالكم وأرغب في ضيافة مثلها.' }}
      focus={<FocusGrid k="المعرض" t="من مناسباتنا" items={GALLERY.map((g) => ({ img: g.img, t: g.cap }))} />}
    />
  </Layout>
)

/* ══ ABOUT / FAQ / CONTACT ═════════════════════════════════════ */
export const About = () => (
  <Layout
    path="/about"
    hero="ev-team-1"
    jsonld={graph(orgLd(), crumbLd([{ name: 'من نحن', path: '/about' }]))}
    title={`عن ${BRAND.name} — ضيافة عربية رسمية من جدة`}
    desc={`${BRAND.name}: ضيافة عربية رسمية من جدة — قهوجيين وصبابين وقهوجيات بزي موحّد. اتصال وواتساب ${BRAND.phoneLocal}.`}
  >
    <OnePage
      hero={{ img: 'ev-team-1', alt: BRAND.name, kick: 'من نحن', h1: `عن ${BRAND.name}`, lead: 'ضيافة عربية رسمية من جدة — بمعيار ثابت في كل مناسبة.', msg: 'السلام عليكم، أرغب في التعرّف على خدماتكم.' }}
      focus={
        <FocusText
          k="قصتنا"
          t="الضيافة عندنا مهنة"
          body="انطلقنا من جدة بفكرة واحدة: أن الضيافة السعودية تستحق أن تُدار بمعيار مكتوب. الفريق الذي يصلك موظّف عندنا ومدرَّب على يدنا، والمباشر الذي يمسك مناسبتك معروف لك قبل الموعد."
          img="ev-vip-1"
        />
      }
    />
  </Layout>
)

export const FaqPage = () => (
  <Layout
    path="/faq"
    hero="ev-booth-2"
    jsonld={graph(faqLd(FAQ), crumbLd([{ name: 'أسئلة متكررة', path: '/faq' }]))}
    title="أسئلة متكررة عن القهوجيين والضيافة في جدة"
    desc="أجوبة مباشرة عن الحجز والتكلفة والتغطية والطاقم النسائي وضيافة العزاء والفواتير النظامية."
  >
    <OnePage faq={FAQ} hero={{ img: 'ev-booth-2', alt: 'ركن ضيافة', kick: 'أسئلة متكررة', h1: 'أسئلة وأجوبة', lead: 'كل ما يُسأل عنه قبل الحجز — بأجوبة صريحة.', msg: 'السلام عليكم، عندي سؤال عن خدمات الضيافة.' }} />
  </Layout>
)

export const Contact = () => (
  <Layout
    path="/contact"
    hero="ev-booth-2"
    jsonld={graph(orgLd(), { '@type': 'ContactPage', url: `${SITE}/contact`, name: `تواصل مع ${BRAND.name}` }, crumbLd([{ name: 'تواصل معنا', path: '/contact' }]))}
    title="تواصل معنا واحجز ضيافتك — 0504968113"
    desc={`احجز ضيافة مناسبتك في جدة عبر واتساب أو الهاتف ${BRAND.phoneDisplay}. عرض سعر مكتوب خلال ساعات.`}
  >
    <OnePage hero={{ img: 'ev-booth-2', alt: 'ركن ضيافة', kick: 'تواصل معنا', h1: 'احجز ضيافتك', lead: `رقم واحد للاتصال والواتساب: ${BRAND.phoneDisplay}`, msg: 'السلام عليكم، أرغب في حجز ضيافة.' }} />
  </Layout>
)

/* ══ JEDDAH KEYWORD PAGES ══════════════════════════════════════ */
export const JeddahLanding = ({ p }: { p: JeddahPage }) => (
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
    <OnePage
      faq={p.faq}
      hero={{ img: p.hero, alt: p.h1, kick: p.kicker, h1: p.h1, lead: p.lead, msg: p.msg }}
      focus={<FocusText k={p.chip} t="كيف نخدم مناسبتك في جدة" body={p.body.join(' ')} points={p.bullets.map((b) => b.t)} />}
    />
  </Layout>
)

/* ══ 404 ═══════════════════════════════════════════════════════ */
export const NotFound = () => (
  <Layout path="/404" noindex hero="hero-real" title="الصفحة غير موجودة" desc="الصفحة غير متاحة — تفضّل بالعودة إلى الرئيسية.">
    <OnePage hero={{ img: 'hero-real', tall: 'hero-real-tall', alt: 'فريق الضيافة', kick: 'خطأ ٤٠٤', h1: 'هذه الصفحة غير موجودة', lead: 'لكن الضيافة موجودة — تصفّح من هنا أو تواصل معنا مباشرة.', msg: 'السلام عليكم، أرغب في الاستفسار عن الضيافة.' }} />
  </Layout>
)

