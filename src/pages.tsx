/**
 * Every URL, rebuilt on <OnePage>. Each page keeps its own <title>,
 * description, canonical, JSON-LD, H1, opening line and FAQ — so each
 * URL ranks for its own intent — while the body is the full luxury site
 * without city chips cluttering the page.
 */
import { Layout, SITE } from './layout'
import { BRAND, SERVICES, OCCASIONS, MENU, GALLERY, FAQ, type Service, type Occasion, type MenuCat } from './data'
import { CITIES, FAMILIES, familyCopy, type City, type Family } from './cities'
import { JEDDAH_PAGES, type JeddahPage } from './jeddah'
import { graph, orgLd, siteLd, faqLd, crumbLd, serviceLd, eventLd, menuLd, galleryLd } from './ld'
import { OnePage, FocusText, FocusGrid, oneLine } from './onepage'

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

/* ══ HOME ══════════════════════════════════════════════════════ */
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

/* ══ SERVICES ══════════════════════════════════════════════════ */
export const Services = () => (
  <Layout
    path="/services"
    hero="ev-team-1"
    jsonld={graph(crumbLd([{ name: 'الخدمات', path: '/services' }]))}
    title="خدمات الضيافة في جدة — قهوجيين وقهوجيات وتقديمات"
    desc="خدمات ضيافة متكاملة في جدة من القهوة الملكية: قهوجيين للرجال، قهوجيات للنساء، سقاية زمزم، تمور وحلى، بوفيه، عدّة نحاسية، وضيافة ملكية. 0504968113."
  >
    <OnePage
      hero={{
        img: 'ev-team-1',
        alt: `طاقم ضيافة بزي موحّد — ${BRAND.name}`,
        kick: 'الخدمات المتكاملة',
        h1: 'خدمات الضيافة في جدة',
        lead: 'كل ما تحتاجه مناسبتك — من طاقم واحد وعرضٍ واحد ومشرفٍ ميداني واحد.',
        msg: `السلام عليكم، أرغب في معرفة خدمات الضيافة لدى ${BRAND.name}.`,
      }}
      focus={
        <FocusGrid
          k="أقسام الضيافة"
          t="ثمانية أقسام — تُطلب منفردة أو مجتمعة"
          items={SERVICES.map((s) => ({ img: s.img, t: s.title, d: s.short }))}
        />
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
      hero={{
        img: s.img,
        alt: `${s.h1} — ${BRAND.name}`,
        kick: s.badge,
        h1: s.h1,
        lead: s.short,
        dots: s.points.slice(0, 3),
        msg: `السلام عليكم، أرغب في حجز: ${s.title} من ${BRAND.name}.`,
      }}
      focus={
        <>
          <FocusText
            k="تفاصيل الخدمة"
            t={s.title}
            body={s.desc}
            img={s.gal[0] ?? s.img}
            points={s.points.slice(0, 4)}
          />
          {s.gal.length > 1 && (
            <FocusGrid
              k="من أعمالنا"
              t={`لقطات حقيقية من ${s.title}`}
              items={s.gal.slice(0, 4).map((g) => ({ img: g, t: s.title }))}
            />
          )}
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
    desc="ضيافة لكل مناسبة في جدة مع القهوة الملكية: أعراس وملكات، مجالس عزاء، مؤتمرات ومعارض، تخرّج، استقبال مواليد، ومخيمات. 0504968113."
  >
    <OnePage
      hero={{
        img: 'ev-vip-2',
        alt: `ضيافة مناسبات فاخرة — ${BRAND.name}`,
        kick: 'المناسبات والفعاليات',
        h1: 'ضيافة المناسبات في جدة',
        lead: 'لكل مناسبةٍ طاقمها وزيّها وترتيبها المكتوب.',
        msg: `السلام عليكم، أرغب في ضيافة لمناسبة مع ${BRAND.name}.`,
      }}
    />
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
      hero={{
        img: o.img,
        alt: `${o.h1} — ${BRAND.name}`,
        kick: 'المناسبات',
        h1: o.h1,
        lead: o.d,
        dots: o.needs.slice(0, 3),
        msg: `السلام عليكم، أرغب في ضيافة لمناسبة (${o.title}) مع ${BRAND.name}.`,
      }}
      focus={<FocusText k="كيف نُدير هذه المناسبة" t={o.title} body={o.desc} points={o.needs} />}
    />
  </Layout>
)

/* ══ LOCATIONS (Clean Directory for SEO Crawlability, Zero Body Clutter) ═ */
export const Locations = () => (
  <Layout
    path="/locations"
    hero="ev-team-1"
    jsonld={graph(crumbLd([{ name: 'مناطق الخدمة', path: '/locations' }]))}
    title="تغطية خدمات الضيافة — جدة ومدن المملكة"
    desc="القهوة الملكية لخدمات الضيافة: مقرّنا الرئيسي جدة ونخدم الرياض ومكة المكرمة والمدينة المنورة والدمام والخبر والطائف وأبها وينبع وتبوك. 0504968113."
  >
    <OnePage
      hero={{
        img: 'ev-team-1',
        alt: `فريق الضيافة — ${BRAND.name}`,
        kick: 'نطاق التغطية',
        h1: 'ضيافة القهوة الملكية في جدة والمملكة',
        lead: 'مقرّنا الرئيسي جدة، وفرقنا المقيمة تخدم مناسباتكم بنفس المعيار الملكي.',
        msg: `السلام عليكم، أرغب في حجز ضيافة مع ${BRAND.name}.`,
      }}
      focus={
        <section class="sx sx-focus" aria-label="دليل صفحات الخدمة">
          <div class="wrap">
            <div class="focx focx-solo">
              <div class="focx-txt rv">
                <p class="sx-k">دليل الصفحات المتخصصة</p>
                <h2>اختر الصفحة المناسبة لطلبك</h2>
                <p class="focx-body">
                  خصّصنا لكل خدمة ومدينة صفحة مستقلة تحتوي على تفاصيل التغطية والأحياء والأسئلة الشائعة الخاصة بها:
                </p>
                <div class="seo-hub-grid">
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
            </div>
          </div>
        </section>
      }
    />
  </Layout>
)

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
      <OnePage
        place={c.inName}
        faq={faq}
        hero={{
          img,
          alt: `ضيافة ${c.name} — ${BRAND.name}`,
          kick: c.region,
          h1: `قهوجيين وضيافة مناسبات في ${c.inName}`,
          lead: `قهوجيين وصبابين وقهوجيات بزيٍّ رسمي موحّد في ${c.inName} — حضور قبل الموعد وعرض سعر مكتوب.`,
          dots: c.local.slice(0, 3),
          msg: `السلام عليكم، أرغب في حجز ضيافة في ${c.name} مع ${BRAND.name}.`,
        }}
        focus={<FocusText k={`خدمتنا في ${c.inName}`} t={`ضيافة ${c.inName} بمعيار ملكي`} body={c.intro} points={c.local} img={c.hero} />}
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
      <OnePage
        place={c.inName}
        faq={faq}
        hero={{
          img,
          alt: `${title} — ${BRAND.name}`,
          kick: `${f.kicker} · ${c.name}`,
          h1: `${f.noun} في ${c.inName}`,
          lead: `${f.kicker} بزيٍّ رسمي موحّد في ${c.inName} — حضور قبل الموعد وعرض سعر مكتوب.`,
          dots: f.bullets.slice(0, 3).map((b) => b.t),
          msg: `السلام عليكم، أرغب في حجز ${title} مع ${BRAND.name}.`,
        }}
        focus={
          <FocusText
            k={f.kicker}
            t={`${f.noun} في ${c.inName}`}
            body={familyCopy(f, c)}
            points={f.bullets.map((b) => b.t)}
            img={c.hero}
          />
        }
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
    desc="قائمة القهوة الملكية في جدة: قهوة سعودية وشاي، مشروبات باردة، تمور فاخرة، حلى وشرقيات، فواكه، مقبلات، وأكلات شعبية بصور حقيقية."
  >
    <OnePage
      hero={{
        img: 'sw-station',
        alt: `محطة ضيافة وحلى — ${BRAND.name}`,
        kick: 'قائمة التقديمات',
        h1: 'قائمة الضيافة والتقديمات',
        lead: 'قهوة سعودية وتمور فاخرة وحلى وأكلات شعبية — بصور حقيقية من مناسباتنا.',
        msg: `السلام عليكم، أرغب في قائمة ضيافة من ${BRAND.name}.`,
      }}
    />
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
      hero={{
        img: m.hero,
        alt: `${m.cat} — ${BRAND.name}`,
        kick: 'قائمة التقديمات',
        h1: m.cat,
        lead: oneLine(m.blurb),
        msg: `السلام عليكم، أرغب في طلب (${m.cat}) من ${BRAND.name}.`,
      }}
      focus={
        <FocusGrid
          k={`${m.items.length} صنفاً`}
          t={m.cat}
          items={m.items.filter((i) => i.img).map((i) => ({ img: i.img!, t: i.n, d: i.d }))}
        />
      }
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
    desc="شاهد صور أعمال القهوة الملكية في جدة: قهوجيين وصبابين بزي موحّد، سوقيات ذهبية، دلال نحاسية، ومحطات حلى وتمور من مناسبات حقيقية."
  >
    <OnePage
      hero={{
        img: 'ev-vip-2',
        alt: `معرض أعمال ${BRAND.name} في جدة`,
        kick: 'معرض الأعمال',
        h1: 'صور حقيقية من مناسبات نفّذناها',
        lead: 'كل صورة هنا توثيق حقيقي لطاقمنا وعدّتنا في الميدان.',
        msg: `السلام عليكم، أعجبتني أعمالكم في ${BRAND.name} وأرغب في حجز ضيافة مماثلة.`,
      }}
      focus={<FocusGrid k="المعرض الكامل" t="لقطات من مناسباتنا" items={GALLERY.map((g) => ({ img: g.img, t: g.cap }))} />}
    />
  </Layout>
)

/* ══ ABOUT / FAQ / CONTACT ═════════════════════════════════════ */
export const About = () => (
  <Layout
    path="/about"
    hero="ev-team-1"
    jsonld={graph(orgLd(), crumbLd([{ name: 'من نحن', path: '/about' }]))}
    title={`عن ${BRAND.name} — ضيافة عربية رسمية في جدة`}
    desc={`${BRAND.name} (${BRAND.latin}): ضيافة عربية رسمية من جدة — قهوجيين وصبابين وقهوجيات بزي موحّد وعدّة مذهّبة. اتصال وواتساب ${BRAND.phoneLocal}.`}
  >
    <OnePage
      hero={{
        img: 'ev-team-1',
        alt: `فريق ${BRAND.name}`,
        kick: 'من نحن',
        h1: `${BRAND.name} لخدمات الضيافة`,
        lead: 'ضيافة عربية رسمية من جدة منذ ٢٠١٤ — بمعيار مكتوب وثابت في كل مناسبة.',
        wordmark: true,
        msg: `السلام عليكم، أرغب في التعرّف على خدمات ${BRAND.name}.`,
      }}
      focus={
        <FocusText
          k="هويتنا والتزامنا"
          t="الضيافة عندنا مهنة لها أصول"
          body={`انطلقت ${BRAND.name} من جدة بفكرة واحدة: أن الضيافة السعودية الأصيلة تستحق أن تُدار بمعيارٍ مكتوب ومنظّم. الفريق الذي يصلك مدرَّب على يدنا، والعدّة النحاسية المذهّبة تُصقل وتُعقَّم قبل كل خروج، والمشرف الميداني يضبط المسار من أول فنجال حتى وداع آخر ضيف.`}
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
    title="أسئلة شائعة عن القهوجيين والضيافة في جدة"
    desc="إجابات واضحة من القهوة الملكية عن حجز القهوجيين والصبابين والقهوجيات في جدة، طريقة حساب التكلفة، ضيافة العزاء، والفواتير الضريبية."
  >
    <OnePage
      faq={FAQ}
      hero={{
        img: 'ev-booth-2',
        alt: `ركن ضيافة — ${BRAND.name}`,
        kick: 'الأسئلة الشائعة',
        h1: 'أسئلة وأجوبة قبل الحجز',
        lead: 'كل ما يتكرر السؤال عنه حول الطاقم والعدّة والحجز — بإجابات صريحة.',
        msg: `السلام عليكم، عندي استفسار حول خدمات ${BRAND.name}.`,
      }}
    />
  </Layout>
)

export const Contact = () => (
  <Layout
    path="/contact"
    hero="ev-booth-2"
    jsonld={graph(
      orgLd(),
      { '@type': 'ContactPage', url: `${SITE}/contact`, name: `تواصل مع ${BRAND.name}` },
      crumbLd([{ name: 'تواصل معنا', path: '/contact' }]),
    )}
    title="رقم قهوجي جدة — تواصل واحجز ضيافتك 0504968113"
    desc={`احجز ضيافة مناسبتك في جدة مع ${BRAND.name} عبر الاتصال المباشر أو واتساب ${BRAND.phoneDisplay}. استقبال الحجوزات ٢٤ ساعة وعرض سعر مكتوب.`}
  >
    <OnePage
      hero={{
        img: 'ev-booth-2',
        alt: `تواصل مع ${BRAND.name}`,
        kick: 'تواصل مباشر ٢٤/٧',
        h1: 'احجز ضيافة مناسبتك الآن',
        lead: `رقم موحّد للاتصال المباشر والواتساب: ${BRAND.phoneDisplay}`,
        msg: `السلام عليكم، أرغب في حجز ضيافة مناسبة مع ${BRAND.name}.`,
      }}
    />
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
      serviceLd(`${p.h1} — ${BRAND.name}`, p.body[0], `/${p.slug}`, p.hero, 'جدة'),
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
      hero={{
        img: p.hero,
        alt: `${p.h1} — ${BRAND.name}`,
        kick: `${p.kicker} · جدة`,
        h1: p.h1,
        lead: p.lead,
        dots: p.bullets.slice(0, 3).map((b) => b.t),
        msg: p.msg,
      }}
      focus={
        <FocusText
          k={p.chip}
          t={`كيف ندير ${p.chip} بمعيار ${BRAND.name}`}
          body={p.body.join(' ')}
          points={p.bullets.map((b) => b.t)}
          img={p.hero}
        />
      }
    />
  </Layout>
)

/* ══ 404 ═══════════════════════════════════════════════════════ */
export const NotFound = () => (
  <Layout
    path="/404"
    noindex
    hero="hero-real"
    title="الصفحة غير موجودة"
    desc="الصفحة التي تبحث عنها غير متاحة — تفضّل بالعودة إلى الصفحة الرئيسية للقهوة الملكية."
  >
    <OnePage
      hero={{
        img: 'hero-real',
        tall: 'hero-real-tall',
        alt: `فريق ${BRAND.name}`,
        kick: 'خطأ ٤٠٤',
        h1: 'هذه الصفحة غير متاحة',
        lead: 'لكن فريق الضيافة جاهز لخدمتك — تصفّح خدماتنا أدناه أو تواصل معنا مباشرة.',
        msg: `السلام عليكم، أرغب في الاستفسار عن خدمات الضيافة لدى ${BRAND.name}.`,
      }}
    />
  </Layout>
)
