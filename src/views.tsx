/**
 * Social QR & Links landing page view (/social and /links).
 * (All other routes live in src/pages.tsx on top of <OnePage>.)
 */
import { Layout, SITE } from './layout'
import { Icon } from './icons'
import { BRAND, SOCIAL } from './data'
import { graph, orgLd, siteLd, crumbLd } from './ld'
import { Ico } from './blocks'

export const Social = ({ path = '/social' }: { path?: '/social' | '/links' }) => {
  const contact = SOCIAL.filter((s) => s.kind === 'contact' && (s.n !== 'send'))
  const social = SOCIAL.filter((s) => s.kind === 'social')
  const place = SOCIAL.filter((s) => s.kind === 'place')
  return (
    <Layout
      path={path}
      hero="sawas-3"
      bare
      jsonld={graph(
        orgLd(),
        siteLd(),
        crumbLd([{ name: 'حساباتنا والباركود', path }]),
        {
          '@type': 'ProfilePage',
          '@id': `${SITE}${path}#profile`,
          url: `${SITE}${path}`,
          name: `حسابات ${BRAND.name} والباركود الرسمي`,
          description: `صفحة الروابط والباركود الرسمية لـ ${BRAND.name} في جدة — تواصل عبر واتساب أو الاتصال المباشر 0504968113 وتابع جميع حساباتنا.`,
          inLanguage: 'ar',
          mainEntity: { '@id': `${SITE}/#business` },
        },
      )}
      title="حساباتنا والباركود — كل روابط التواصل السريع"
      desc={`صفحة الروابط والباركود الرسمية لـ ${BRAND.name} في جدة: امسح رمز QR أو اضغط للتواصل عبر واتساب، الاتصال المباشر ${BRAND.phoneLocal}، الحجز الفوري، وحسابات التواصل.`}
    >
      <section class="sx" id="sx">
        <div class="sx-orb sx-orb1" aria-hidden="true" />
        <div class="sx-orb sx-orb2" aria-hidden="true" />
        <div class="sx-orb sx-orb3" aria-hidden="true" />
        <div class="sx-grid" aria-hidden="true" />

        <div class="sx-in">
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

          <h1 class="sx-h1">حسابات {BRAND.name} والباركود الرسمي</h1>
          <p class="sx-sub">{BRAND.tagline} · جدة والمملكة</p>
          <div class="sx-rule" aria-hidden="true">
            <i />
          </div>
          <p class="sx-lead">اضغط أي زر للتواصل المباشر أو امسح الباركود بكاميرا الجوال.</p>

          <div class="sx-prime">
            {contact.map((s) => (
              <a
                class="sx-big tilt"
                href={s.href}
                style={`--hue:${s.hue}`}
                rel="noopener"
                target={s.href.startsWith('http') ? '_blank' : undefined}
              >
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
            <a
              class="sx-big tilt"
              href="/booking"
              style="--hue:#e2c68e"
            >
              <span class="sx-big-ico">
                <Icon n="sparkle" />
              </span>
              <span class="sx-big-txt">
                <b>حجز سريع في ١٠ ثوانٍ</b>
                <em>حدّد مناسبتك وعدد الضيوف</em>
              </span>
              <span class="sx-big-note">للزبون المستعجل</span>
              <span class="sx-shine" aria-hidden="true" />
            </a>
          </div>

          <div class="qr-card tilt rv">
            <div class="qr-frame">
              <img
                src="/static/img/qr.png"
                alt={`باركود صفحة تواصل ${BRAND.name}`}
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
              />
              <span class="qr-corner qr-tl" aria-hidden="true" />
              <span class="qr-corner qr-tr" aria-hidden="true" />
              <span class="qr-corner qr-bl" aria-hidden="true" />
              <span class="qr-corner qr-br" aria-hidden="true" />
            </div>
            <div class="qr-txt">
              <h2>امسح الباركود (QR Code)</h2>
              <p>وجّه كاميرا جوالك على الرمز لفتح صفحة روابط {BRAND.name} وحفظ الرقم {BRAND.phoneDisplay} مباشرة.</p>
              <div class="qr-btns">
                <button class="btn btn-gold" type="button" id="shareBtn" data-share="/social">
                  <Ico n="share" />
                  مشاركة صفحة الباركود
                </button>
                <button class="btn btn-line" type="button" id="copyBtn" data-copy={BRAND.phoneDisplay}>
                  <Ico n="copy" />
                  نسخ الرقم: {BRAND.phoneDisplay}
                </button>
              </div>
            </div>
          </div>

          <h2 class="sx-h2">كل حساباتنا على المنصات</h2>
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

          <h2 class="sx-h2">تصفّح أقسام الموقع</h2>
          <div class="sx-links">
            <a href="/">الرئيسية</a>
            <a href="/booking">حجز فوري في ١٠ ثوانٍ</a>
            <a href="/services">الخدمات</a>
            <a href="/menu">قائمة الضيافة</a>
            <a href="/gallery">معرض الأعمال</a>
            <a href="/occasions">المناسبات</a>
            <a href="/locations">مناطق الخدمة</a>
            <a href="/about">من نحن</a>
            <a href="/contact">تواصل معنا</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
