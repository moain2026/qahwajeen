/**
 * Page views. One URL = one search intent (Jeddah only):
 *   /                        قهوجي وصبابين جدة
 *   /services, /services/:s  خدمات الضيافة
 *   /occasions               ضيافة مناسبات جدة
 *   /qahwajiat-jeddah …      one Jeddah keyword page per intent (jeddah.ts)
 *   /menu, /gallery, /faq, /booking, /links (contact + about)
 */
import { Layout, SITE } from './layout'
import {
  BRAND,
  SERVICES,
  OCCASIONS,
  MENU,
  MENU_FAQ,
  GALLERY,
  FAQ,
  occUrl,
  type Service,
  type Occasion,
} from './data'
import { type JeddahPage } from './jeddah'
import { graph, orgLd, siteLd, faqLd, crumbLd, serviceLd, eventLd, galleryLd } from './ld'
import { Ico } from './blocks'
import { Img, capOf } from './ui'
import {
  OnePage,
  Hero,
  Head,
  ServicesSec,
  CrewSec,
  RolesSec,
  ArrangementsSec,
  MenuSec,
  WorksSec,
  OccasionsSec,
  FaqSec,
  EndCta,
  RoyalConcierge,
  FocusText,
  FocusGrid,
} from './onepage'

/** keep <title> ≤ 60 chars (Layout appends " | القهوة الملكية") */
const fit = (base: string, ...suffixes: string[]) => {
  const budget = 60 - ` | ${BRAND.name}`.length
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
    hero="qahwajiin-team-uniform-reception-hall"
    jsonld={graph(orgLd(), siteLd(), galleryLd('/', GALLERY.slice(0, 12)), faqLd(FAQ.slice(0, 6)))}
    title="قهوجي وصبابين جدة — ضيافة مناسبات فاخرة"
    desc="قهوجي وصبابين في جدة من القهوة الملكية: طاقم رجالي ونسائي بزي رسمي، دلال مذهّبة، قهوة سعودية وتمور. عرض سعر مكتوب — اتصال وواتساب 0504968113."
  >
    <OnePage
      hero={{
        img: 'qahwajiin-team-uniform-reception-hall',
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
      hero="qahwajiin-team-uniform-reception-hall"
      jsonld={graph(crumbLd([{ name: 'الخدمات', path: '/services' }]), faqLd(FAQ.slice(0, 5)))}
      title="خدمات الضيافة في جدة — قهوجيين وتقديمات"
      desc="خدمات الضيافة في جدة من القهوة الملكية: قهوجيين ومباشرين، قهوجيات وصبابات، سقيا زمزم، تمور وحلى، بوفيه، عدّة نحاسية وسوّاس ذهبي. 0504968113."
    >
      <Hero
        h={{
          img: 'qahwajiin-team-uniform-reception-hall',
          alt: `طاقم ضيافة بزي موحّد — ${BRAND.name}`,
          kick: 'الخدمات',
          h1: 'خدمات الضيافة في جدة',
          lead: 'طاقم رجالي ونسائي، وعدّة وتقديمات وتجهيزات — بعرض سعر واحد ومشرف ميداني واحد.',
          dots: ['الطاقم الرجالي', 'الطاقم النسائي', 'العدّة والتجهيزات'],
          msg,
        }}
      />
      <ServicesSec place="جدة" k="كل الخدمات" t="اختر ما تحتاجه مناسبتك" />
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
          t={`لقطات من ${s.title}`}
          items={s.gal.map((g) => ({ img: g, t: capOf(g, s.title) }))}
        />
      )}
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
      hero="two-qahwajiin-embroidered-daglah-dates-tray"
      jsonld={graph(crumbLd([{ name: 'المناسبات', path: '/occasions' }]), faqLd(FAQ.slice(0, 4)))}
      title="ضيافة مناسبات جدة — أعراس وشركات وعزاء"
      desc="ضيافة لكل مناسبة في جدة مع القهوة الملكية: أعراس وملكات، مجالس عزاء، مؤتمرات ومعارض، تخرّج، استقبال مواليد، ومخيمات. 0504968113."
    >
      <Hero
        h={{
          img: 'two-qahwajiin-embroidered-daglah-dates-tray',
          alt: `ضيافة مناسبات فاخرة — ${BRAND.name}`,
          kick: 'المناسبات',
          h1: 'ضيافة مناسبات في جدة',
          lead: 'لكل مناسبةٍ طاقمها وزيّها وترتيبها المكتوب — من الأعراس والمؤتمرات حتى المجالس والعزاء.',
          msg,
        }}
      />
      <section class="sx">
        <div class="wrap">
          <Head
            k="لكل مناسبة ترتيبها"
            t="كيف نُدير كل مناسبة؟"
            sub="لكل مناسبة زيّ وتوقيت صبّ وتقديمات مختلفة."
          />
          <div class="arr-grid">
            {OCCASIONS.map((o, i) => (
              <article class="arr-card arr-ph rv" style={`--i:${i}`}>
                <Img n={o.img} alt={`${o.h1} — ${BRAND.name} في جدة`} sizes="(min-width:1024px) 380px, 92vw" cls="arr-img" />
                <h3>{o.title}</h3>
                <p class="arr-sub">{o.desc}</p>
                <ul class="arr-pts">
                  {o.needs.map((n) => (
                    <li>{n}</li>
                  ))}
                </ul>
                <a class="lnk" href={occUrl(o.slug)}>
                  تفاصيل {o.title}
                  <Ico n="arrow" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FaqSec items={FAQ.slice(0, 4)} />
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
      <ServicesSec place="جدة" only={o.services} k="الخدمات المناسبة" t={`ما نقدّمه في ${o.title}`} />
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
      hero="dessert-buffet-creme-caramel-petit-fours"
      jsonld={graph(crumbLd([{ name: 'التقديمات', path: '/menu' }]), {
        '@type': 'Menu',
        name: `قائمة الضيافة — ${BRAND.name}`,
        url: `${SITE}/menu`,
        hasMenuSection: MENU.map((m) => ({
          '@type': 'MenuSection',
          name: m.cat,
          url: `${SITE}/menu#${m.slug}`,
          hasMenuItem: m.items.map((it) => ({ '@type': 'MenuItem', name: it.n, description: it.d })),
        })),
      }, faqLd(MENU_FAQ))}
      title="تقديمات ومنيو ضيافة جدة — قهوة وتمور وحلى"
      desc="كل تقديمات القهوة الملكية في جدة بصفحة واحدة: مشروبات حارة وباردة، تمور، حلويات، معجنات، مقبلات، فواكه، معدات التقديم والتوزيعات."
    >
      <Hero
        h={{
          img: 'dessert-buffet-creme-caramel-petit-fours',
          alt: `محطة ضيافة وحلى — ${BRAND.name}`,
          kick: 'التقديمات',
          h1: 'تقديمات ومنيو ضيافة المناسبات في جدة',
          lead: 'قهوة سعودية وشاي، مشروبات باردة، تمور وحلى، مقبلات وأكلات شعبية — تختار منها ما يناسب مناسبتك.',
          dots: ['المشروبات الحارة والباردة', 'التمور والحلى والشرقيات', 'المعجنات والأكلات الشعبية'],
          msg,
        }}
      />
      <MenuSec showAllCategories />
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
      hero="two-qahwajiin-embroidered-daglah-dates-tray"
      jsonld={graph(galleryLd('/gallery', GALLERY), crumbLd([{ name: 'معرض الأعمال', path: '/gallery' }]))}
      title="صور أعمالنا — قهوجيين وضيافة مناسبات في جدة"
      desc="صور أعمال القهوة الملكية في جدة: قهوجيين وصبابين بزي موحّد، سقيا زمزم وسوّاس ذهبي، دلال نحاسية، ومحطات حلى وتمور من مناسبات خدمناها."
    >
      <Hero
        h={{
          img: 'two-qahwajiin-embroidered-daglah-dates-tray',
          alt: `معرض أعمال ${BRAND.name} في جدة`,
          kick: 'معرض الأعمال',
          h1: 'صور أعمال القهوة الملكية في جدة',
          lead: 'طاقمنا وعدّتنا في قاعات ومؤتمرات ومجالس خدمناها.',
          msg,
        }}
      />
      <WorksSec expandAll />
      <CrewSec />
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
      hero="two-qahwajiin-coffee-booth-dallah-dates"
      jsonld={graph(faqLd(FAQ), crumbLd([{ name: 'أسئلة متكررة', path: '/faq' }]))}
      title="أسئلة شائعة عن حجز قهوجي في جدة"
      desc="إجابات القهوة الملكية عن حجز القهوجيين والصبابين والقهوجيات في جدة: طريقة حساب التكلفة، الطاقم النسائي، موعد الحجز، العدّة والتنظيف."
    >
      <Hero
        h={{
          img: 'two-qahwajiin-coffee-booth-dallah-dates',
          alt: `ركن ضيافة — ${BRAND.name}`,
          kick: 'الأسئلة الشائعة',
          h1: 'أسئلة شائعة عن حجز قهوجي في جدة',
          lead: 'الطاقم، العدّة، التكلفة، وموعد الحجز — بإجابات مختصرة.',
          msg,
        }}
      />
      <FaqSec items={FAQ} />
      <EndCta msg={msg} />
    </Layout>
  )
}

/* ══ 10. BOOKING — 3 choices → prefilled WhatsApp ══ */
export const FastBooking = () => (
  <Layout
    path="/booking"
    hero="two-qahwajiin-embroidered-daglah-dates-tray"
    bare
    jsonld={graph(crumbLd([{ name: 'الحجز', path: '/booking' }]))}
    title="احجز قهوجي وصبابين في جدة — طلب سريع"
    desc="احجز ضيافة مناسبتك في جدة مع القهوة الملكية: اختر نوع المناسبة والطاقم وعدد الضيوف، وأرسل الطلب عبر واتساب ليصلك عرض سعر مكتوب. 0504968113."
  >
    <RoyalConcierge place="جدة" h1 />
    <ArrangementsSec />
  </Layout>
)

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
      crumbLd([{ name: p.chip, path: `/${p.slug}` }]),
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
    <ServicesSec place="جدة" only={p.services} k="الخدمات المرتبطة" t={`ما يشمله حجز ${p.chip}`} />
    <FaqSec items={p.faq} />
    <EndCta msg={p.msg} />
  </Layout>
)

/* ══ 12. 404 ══════════════════════════════════════════════════ */
export const NotFound = () => (
  <Layout
    path="/404"
    noindex
    hero="qahwajiin-team-uniform-reception-hall"
    title="الصفحة غير موجودة"
    desc="الصفحة التي تبحث عنها غير متاحة — تفضّل بالعودة إلى الصفحة الرئيسية للقهوة الملكية."
  >
    <Hero
      h={{
        img: 'qahwajiin-team-uniform-reception-hall',
        alt: `فريق ${BRAND.name}`,
        kick: 'خطأ ٤٠٤',
        h1: 'هذه الصفحة غير متاحة',
        lead: 'تفضّل بالعودة إلى الصفحة الرئيسية أو تواصل معنا مباشرة عبر واتساب أو الاتصال.',
        msg: `السلام عليكم، أرغب في الاستفسار عن خدمات الضيافة لدى ${BRAND.name}.`,
      }}
    />
  </Layout>
)
