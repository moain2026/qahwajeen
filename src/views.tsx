/**
 * /links — the ONE contact + about page (/contact, /about, /social, /qr 301 here).
 * Only channels the owner actually has: WhatsApp, call, email — plus the
 * quick booking page and the QR card that points back to this URL.
 */
import { Layout, SITE } from './layout'
import { BRAND, FAQ } from './data'
import { graph, orgLd, crumbLd, faqLd } from './ld'
import { Ico, wa } from './blocks'
import { Faq } from './ui'

const LINKS_FAQ = [FAQ[0], FAQ[2], FAQ[3]]

export const Social = () => {
  const path = '/links'
  const waMsg = `السلام عليكم، أرغب في حجز ضيافة لمناسبة في جدة مع ${BRAND.name}.`
  const channels = [
    { id: 'whatsapp', name: 'واتساب', sub: BRAND.phoneDisplay, href: wa(waMsg), icon: 'chat', ext: true, ltr: true, tint: '#25D366' },
    { id: 'call', name: 'اتصال', sub: BRAND.phoneDisplay, href: `tel:${BRAND.phoneLocal}`, icon: 'phone', ext: false, ltr: true, tint: '#E2C68E' },
    { id: 'email', name: 'البريد الإلكتروني', sub: BRAND.email, href: `mailto:${BRAND.email}`, icon: 'send', ext: false, ltr: true, tint: '#d9b56d' },
    { id: 'booking', name: 'طلب حجز سريع', sub: 'اختر المناسبة والطاقم وعدد الضيوف', href: '/booking', icon: 'sparkle', ext: false, ltr: false, tint: '#f3d48b' },
  ] as const

  return (
    <Layout
      path={path}
      hero="ev-team-1"
      bare
      jsonld={graph(
        orgLd(),
        {
          '@type': 'ContactPage',
          '@id': `${SITE}${path}#webpage`,
          url: `${SITE}${path}`,
          name: `تواصل مع ${BRAND.name}`,
          inLanguage: 'ar-SA',
          isPartOf: { '@id': `${SITE}/#site` },
          about: { '@id': `${SITE}/#business` },
        },
        crumbLd([{ name: 'تواصل معنا', path }]),
        faqLd(LINKS_FAQ),
      )}
      title="تواصل معنا — رقم قهوجي جدة 0504968113"
      desc={`تواصل مع ${BRAND.name} لحجز قهوجيين وصبابين وضيافة مناسبات في جدة: اتصال وواتساب ${BRAND.phoneLocal}، والبريد ${BRAND.email}.`}
    >
      <section class="klinks-hero" aria-labelledby="links-h1">
        <div class="wrap klinks-head">
          <div class="klinks-lh-row">
            <div class="klinks-emblem" aria-hidden="true">
              <img src="/static/img/logo-512.webp" alt="" width="112" height="112" decoding="async" fetchpriority="high" />
            </div>
            <div class="klinks-lh-tx">
              <span class="klinks-label">تواصل معنا</span>
              <h1 id="links-h1">
                {BRAND.name} <em>{BRAND.latin}</em>
              </h1>
              <p class="klinks-tag">قهوجيين · صبابين · قهوجيات · ضيافة مناسبات في جدة</p>
            </div>
          </div>
          <p class="klinks-sub">رقم واحد للاتصال والواتساب. أرسل التاريخ والحي وعدد الضيوف ويصلك عرض سعر مكتوب.</p>
        </div>
      </section>

      <section class="klinks-sec" id="channels" aria-label="قنوات التواصل">
        <div class="wrap klinks-wrap">
          <ul class="klinks-list" role="list">
            {channels.map((ch, i) => (
              <li>
                <a
                  class={`klink-card ch-${ch.id}`}
                  href={ch.href}
                  target={ch.ext ? '_blank' : undefined}
                  rel={ch.ext ? 'noopener' : undefined}
                  style={`--tint:${ch.tint};--i:${i}`}
                  data-track={ch.id === 'booking' ? undefined : ch.id}
                  data-location="links-page"
                >
                  <span class="klink-ic" aria-hidden="true">
                    <Ico n={ch.icon} />
                  </span>
                  <span class="klink-tx">
                    <span class="klink-name">
                      <b>{ch.name}</b>
                    </span>
                    <small class={ch.ltr ? 'ltr' : undefined}>{ch.sub}</small>
                  </span>
                  <span class="klink-arr" aria-hidden="true">
                    <Ico n="arrow" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <section class="links-about rv" aria-labelledby="about-h">
            <h2 id="about-h">من نحن</h2>
            <p>
              {BRAND.name} فريق ضيافة من جدة: قهوجيين وصبابين ومباشرين، وطاقم نسائي مستقل من القهوجيات والصبابات،
              بزيٍّ رسمي موحّد ودلال نحاسية مصقولة. نخدم الأعراس والملكات، ومجالس العزاء، والمؤتمرات والمعارض،
              والمناسبات العائلية في أحياء جدة وقاعاتها واستراحاتها.
            </p>
            <ul class="svx-pts">
              <li>عرض سعر مكتوب قبل أي تأكيد</li>
              <li>حضور قبل الموعد لتجهيز ركن الضيافة</li>
              <li>رفع وتنظيف منطقة التقديم بعد المناسبة</li>
            </ul>
          </section>

          <div class="qr-card rv" id="qr">
            <div class="qr-frame">
              <img
                src="/static/img/qr.png"
                alt={`رمز QR يفتح صفحة التواصل qahwajeen.com/links`}
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="qr-txt">
              <h2>رمز QR لصفحة التواصل</h2>
              <p>امسح الرمز بكاميرا الجوال لفتح هذه الصفحة، أو شاركها مباشرة.</p>
              <div class="qr-btns">
                <button class="btn btn-line" type="button" data-share="/links">
                  <Ico n="share" />
                  مشاركة الصفحة
                </button>
                <button class="btn btn-line" type="button" data-copy={BRAND.phoneLocal}>
                  <Ico n="copy" />
                  نسخ الرقم
                </button>
              </div>
            </div>
          </div>

          <section class="links-faq" aria-labelledby="links-faq-h">
            <h2 id="links-faq-h">أسئلة قبل التواصل</h2>
            <Faq items={LINKS_FAQ} />
          </section>
        </div>
      </section>
    </Layout>
  )
}
