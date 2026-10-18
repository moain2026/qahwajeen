/**
 * Social QR landing page view.
 * (All other routes now live in src/pages.tsx on top of <OnePage>.)
 */
import { Layout, SITE } from './layout'
import { Icon } from './icons'
import { BRAND, SOCIAL } from './data'
import { graph, orgLd, siteLd } from './ld'
import { Ico } from './blocks'

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

          <h1 class="sx-h1">{BRAND.name}</h1>
          <p class="sx-sub">{BRAND.tagline}</p>
          <div class="sx-rule" aria-hidden="true">
            <i />
          </div>
          <p class="sx-lead">اضغط أي زر — يفتح التواصل مباشرة بلا خطوات.</p>

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

          <h2 class="sx-h2">تصفّح الموقع</h2>
          <div class="sx-links">
            <a href="/">الرئيسية</a>
            <a href="/services">الخدمات</a>
            <a href="/menu">قائمة الضيافة</a>
            <a href="/gallery">معرض الأعمال</a>
            <a href="/locations">مناطق الخدمة</a>
            <a href="/about">من نحن</a>
            <a href="/contact">تواصل معنا</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
