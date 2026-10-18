/**
 * Official Links & QR Code Landing Page (`/links` and `/social`).
 * Modelled on https://keifaldiafa.com/links, tailored exclusively to
 * «القهوة الملكية — ROYAL COFFEE» with ONLY our real, active channels:
 *   1. WhatsApp (050 496 8113)
 *   2. Direct Call (050 496 8113)
 *   3. Fast 10-Second Booking (/booking)
 *   4. Official Website (qahwajeen.com)
 *   5. Official Email (qahwajiyin@gmail.com)
 *   6. Google Maps Location (Jeddah, Saudi Arabia)
 *   7. Official QR Code card (share / copy)
 * Unused social media accounts are strictly hidden.
 */
import { Layout, SITE } from './layout'
import { BRAND } from './data'
import { graph, orgLd, siteLd, crumbLd } from './ld'
import { Ico, wa } from './blocks'

export const Social = ({ path = '/links' }: { path?: '/links' | '/social' }) => {
  const waMsg = `السلام عليكم، وصلتكم من صفحة الروابط والباركود. أرغب بالاستفسار عن خدمات ${BRAND.name} لمناسبة.`
  const channels = [
    {
      id: 'whatsapp',
      en: 'WhatsApp',
      ar: 'واتساب فوري',
      sub: BRAND.phoneDisplay,
      note: 'الأسرع للردّ وعرض السعر المكتوب',
      href: wa(waMsg),
      tint: '#25D366',
      icon: 'chat',
      ext: true,
      ltr: true,
    },
    {
      id: 'call',
      en: 'Call',
      ar: 'اتصال مباشر ٢٤/٧',
      sub: BRAND.phoneDisplay,
      note: 'استقبال الحجوزات على مدار الساعة',
      href: `tel:${BRAND.phoneLocal}`,
      tint: '#E2C68E',
      icon: 'phone',
      ext: false,
      ltr: true,
    },
    {
      id: 'booking',
      en: 'Fast Booking',
      ar: 'حجز سريع في ١٠ ثوانٍ',
      sub: 'حدّد مناسبتك وعدد الضيوف فوراً',
      note: 'مُحدّد الضيافة الملكي للزبون المستعجل',
      href: '/booking',
      tint: '#f3d48b',
      icon: 'sparkle',
      ext: false,
      ltr: false,
    },
    {
      id: 'website',
      en: 'Website',
      ar: 'الموقع الرسمي',
      sub: 'qahwajeen.com',
      note: 'تصفّح الخدمات والتقديمات ومعرض الأعمال',
      href: '/',
      tint: '#c5a059',
      icon: 'home',
      ext: false,
      ltr: true,
    },
    {
      id: 'email',
      en: 'Email',
      ar: 'البريد الإلكتروني الرسمي',
      sub: BRAND.email,
      note: 'لعروض الأسعار المؤسسية والجهات والشركات',
      href: `mailto:${BRAND.email}`,
      tint: '#d9b56d',
      icon: 'send',
      ext: false,
      ltr: true,
    },
    {
      id: 'maps',
      en: 'Google Maps',
      ar: 'الموقع على الخريطة',
      sub: 'جدة · المملكة العربية السعودية',
      note: 'المقر الرئيسي ومركز العمليات',
      href: BRAND.mapsUrl,
      tint: '#34A853',
      icon: 'maps',
      ext: true,
      ltr: false,
    },
  ] as const

  return (
    <Layout
      path={path}
      hero="sawas-3"
      bare
      jsonld={graph(
        orgLd(),
        siteLd(),
        crumbLd([{ name: 'روابطنا والباركود', path }]),
        {
          '@type': 'WebPage',
          '@id': `${SITE}${path}#webpage`,
          url: `${SITE}${path}`,
          name: `روابط ${BRAND.name} — تواصل معنا`,
          description: `كل قنوات التواصل الرسمية مع ${BRAND.name} في صفحة واحدة: واتساب ${BRAND.phoneLocal}، اتصال مباشر، الموقع الرسمي، البريد الإلكتروني ${BRAND.email}، والموقع على خرائط Google.`,
          isPartOf: { '@id': `${SITE}/#site` },
          inLanguage: 'ar',
          mainEntity: { '@id': `${SITE}/#business` },
        },
      )}
      title="روابطنا والباركود — تواصل مع القهوة الملكية"
      desc={`كل قنوات التواصل الرسمية مع ${BRAND.name} في صفحة واحدة: واتساب ${BRAND.phoneLocal}، اتصال مباشر، الموقع الرسمي qahwajeen.com، والبريد الإلكتروني ${BRAND.email}.`}
    >
      <section class="klinks-hero" aria-label="تواصل معنا">
        <div class="wrap klinks-head">
          <div class="klinks-lh-row">
            <div class="klinks-emblem" aria-hidden="true">
              <span class="klinks-orbit" />
              <span class="klinks-orbit o2" />
              <img
                src="/static/img/logo-512.webp"
                alt={BRAND.name}
                width="112"
                height="112"
                decoding="async"
                fetchpriority="high"
              />
            </div>
            <div class="klinks-lh-tx">
              <span class="klinks-label">تواصل معنا · OFFICIAL LINKS</span>
              <h1>
                {BRAND.name} <em>{BRAND.latin}</em>
              </h1>
              <p class="klinks-tag">قهوجيين · صبّابين · قهوجيات · ضيافة ملكية فاخرة</p>
            </div>
          </div>
          <p class="klinks-sub">
            اختر القناة الأنسب لك — واتساب هو الأسرع، والاستشارة وعرض السعر المكتوب مجانيان بلا التزام.
          </p>
        </div>
      </section>

      <section class="klinks-sec" id="channels" aria-label="قنوات التواصل الرسمية">
        <div class="wrap klinks-wrap">
          <nav class="klinks-list" aria-label={`قنوات التواصل مع ${BRAND.name}`}>
            {channels.map((ch, i) => (
              <a
                class={`klink-card ch-${ch.id}`}
                href={ch.href}
                target={ch.ext ? '_blank' : undefined}
                rel={ch.ext ? 'noopener' : undefined}
                style={`--tint:${ch.tint};--i:${i}`}
                aria-label={`${ch.ar} — ${ch.sub}`}
                data-track={ch.id === 'whatsapp' ? 'whatsapp' : ch.id === 'call' ? 'call' : undefined}
                data-location="links-page"
              >
                <span class="klink-shine" aria-hidden="true" />
                <span class="klink-ic" aria-hidden="true">
                  <Ico n={ch.icon} />
                </span>
                <span class="klink-tx">
                  <span class="klink-name">
                    <b>{ch.en}</b>
                    <i>— {ch.ar}</i>
                  </span>
                  <small class={ch.ltr ? 'ltr' : undefined}>{ch.sub}</small>
                  <em class="klink-note">{ch.note}</em>
                </span>
                <span class="klink-arr" aria-hidden="true">
                  <Ico n="arrow" />
                </span>
              </a>
            ))}
          </nav>

          {/* Official QR Code Card for scanning & sharing */}
          <div class="qr-card rv" id="qr">
            <div class="qr-frame">
              <img
                src="/static/img/qr.png"
                alt={`باركود صفحة تواصل ${BRAND.name}`}
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="qr-txt">
              <h2>امسح الباركود الرسمي (QR Code)</h2>
              <p>
                وجّه كاميرا الجوال إلى الرمز لفتح صفحة روابط <b>{BRAND.name}</b> مباشرة — أو انسخ الرقم الموحّد والمعتمد:{' '}
                <strong class="ltr">{BRAND.phoneDisplay}</strong>
              </p>
              <div class="qr-btns">
                <button class="btn btn-gold" type="button" id="shareBtn" data-share="/links">
                  <Ico n="share" />
                  مشاركة صفحة الروابط
                </button>
                <button class="btn btn-line" type="button" id="copyBtn" data-copy={BRAND.phoneDisplay}>
                  <Ico n="copy" />
                  نسخ الرقم: {BRAND.phoneDisplay}
                </button>
              </div>
            </div>
          </div>

          <p class="klinks-note">
            نعمل على مدار الساعة (٢٤/٧) طوال أيام الأسبوع، ونستقبل طلبات المناسبات الرسمية والخاصة والعاجلة في جدة وجميع مدن المملكة.
          </p>

          <div class="sx-links" aria-label="روابط أقسام الموقع">
            <a href="/">الصفحة الرئيسية</a>
            <a href="/booking">حجز فوري في ١٠ ثوانٍ</a>
            <a href="/services">خدماتنا</a>
            <a href="/menu">قائمة التقديمات</a>
            <a href="/gallery">معرض أعمالنا</a>
            <a href="/occasions">المناسبات</a>
            <a href="/locations">المدن</a>
            <a href="/about">من نحن</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
