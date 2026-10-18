import type { Child } from 'hono/jsx'
import { imgSrc, imgSet } from './ui'
import { hasImg } from './imgmap'
import { BRAND } from './data'
import { raw } from './icons'

const V = '13' // asset cache-bust
export const SITE = 'https://qahwajeen.com'

type Props = {
  title: string
  desc: string
  path: string
  children: Child
  jsonld?: object
  /** name of the LCP image for this page (no size suffix) */
  hero?: string
  /** hide the floating action dock (e.g. on the QR page) */
  bare?: boolean
  /** error pages: noindex + no canonical */
  noindex?: boolean
}

export const Layout = ({ title, desc, path, children, jsonld, hero = 'souqiya', bare, noindex }: Props) => {
  const full = `${title} | ${BRAND.name}`
  const canonUrl = `${SITE}${path}`
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#04100c" />
        <title>{full}</title>
        <meta name="description" content={desc} />
        {noindex ? null : (
          <>
            <link rel="canonical" href={canonUrl} />
            <link rel="alternate" hreflang="ar-SA" href={canonUrl} />
            <link rel="alternate" hreflang="ar" href={canonUrl} />
            <link rel="alternate" hreflang="x-default" href={canonUrl} />
          </>
        )}
        <meta
          name="robots"
          content={
            noindex
              ? 'noindex,follow'
              : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
          }
        />
        <meta name="author" content={BRAND.name} />

        {/* Geo signals — Jeddah primary headquarters */}
        <meta name="geo.region" content="SA-02" />
        <meta name="geo.placename" content="Jeddah" />
        <meta name="geo.position" content="21.4858;39.1925" />
        <meta name="ICBM" content="21.4858, 39.1925" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content={BRAND.name} />
        <meta property="og:title" content={full} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonUrl} />
        <meta property="og:image" content={`${SITE}${imgSrc(hero)}`} />
        <meta property="og:image:alt" content={`${title} — ${BRAND.name}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={full} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={`${SITE}${imgSrc(hero)}`} />

        {/* Icons */}
        <link rel="icon" href={`/static/img/favicon.png?v=${V}`} type="image/png" />
        <link rel="apple-touch-icon" href={`/static/img/apple-touch-icon.png?v=${V}`} />
        <meta name="apple-mobile-web-app-title" content={BRAND.name} />

        {/* Fonts — self-hosted (same origin, no third-party round-trips). */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/static/fonts/tajawal-400-arabic.woff2"
          crossorigin=""
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/static/fonts/amiri-700-arabic.woff2"
          crossorigin=""
        />

        {/* LCP preload — per-page hero */}
        {bare ? (
          <link rel="preload" as="image" href="/static/img/logo-512.webp" fetchpriority="high" />
        ) : hasImg(`${hero}-tall`) ? (
          <>
            <link
              rel="preload"
              as="image"
              media="(max-width:767px)"
              href={imgSrc(`${hero}-tall`)}
              imagesrcset={imgSet(`${hero}-tall`)}
              imagesizes="100vw"
              fetchpriority="high"
            />
            <link
              rel="preload"
              as="image"
              media="(min-width:768px)"
              href={imgSrc(hero)}
              imagesrcset={imgSet(hero)}
              imagesizes="100vw"
              fetchpriority="high"
            />
          </>
        ) : (
          <link
            rel="preload"
            as="image"
            href={imgSrc(hero)}
            imagesrcset={imgSet(hero)}
            imagesizes="100vw"
            fetchpriority="high"
          />
        )}

        <link rel="stylesheet" href={`/static/style.css?v=${V}`} />
        {jsonld && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
        )}
      </head>
      <body>
        <a href="#main" class="sr">تجاوز إلى المحتوى</a>
        <div class="pgline" id="pgline" aria-hidden="true"></div>
        <div class="sprog" id="sprog" aria-hidden="true"></div>

        {/* ── Header ── */}
        <header class="hdr" id="hdr">
          <div class="hdr-in">
            <a href="/" class="brand">
              <img
                src="/static/img/logo-192.webp"
                srcset="/static/img/logo-192.webp 192w, /static/img/logo-512.webp 512w"
                sizes="52px"
                alt={BRAND.name}
                width="52"
                height="52"
              />
              <span class="brand-txt">
                <b>{BRAND.name}</b>
                <span>{BRAND.latin}</span>
              </span>
            </a>

            <div class="hdr-act">
              <a
                href={`tel:${BRAND.phoneLocal}`}
                class="hdr-tel"
                aria-label={`اتصل بـ ${BRAND.name}`}
                data-track="call"
                data-location="header"
              >
                <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
              </a>
              <a
                href={BRAND.whatsapp}
                class="btn btn-gold hdr-cta"
                rel="noopener"
                target="_blank"
                data-track="whatsapp"
                data-location="header"
              >
                <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
                واتساب
              </a>
              <button
                class="burger"
                id="burger"
                aria-label="فتح القائمة"
                aria-expanded="false"
                aria-controls="sheet"
              >
                <span dangerouslySetInnerHTML={{ __html: raw('menu') }} />
              </button>
            </div>
          </div>
        </header>

        {/* ── Side drawer: strictly the 6 essentials (Call, WhatsApp, Home, Services, Works, FAQ) ── */}
        <div class="sheet-bd" id="sheetBd" hidden></div>
        <nav class="sheet drawer" id="sheet" aria-label="القائمة الرئيسية" aria-hidden="true">
          <div class="dr-top">
            <span class="sheet-id">
              <img src="/static/img/logo-192.webp" alt={BRAND.name} width="40" height="40" loading="lazy" />
              <span>
                <b>{BRAND.name}</b>
                <small>{BRAND.latin} · JEDDAH</small>
              </span>
            </span>
            <button class="dr-x" type="button" id="sheetX" aria-label="إغلاق القائمة">
              <span dangerouslySetInnerHTML={{ __html: raw('close') }} />
            </button>
          </div>

          <a
            class="dr-call"
            href={`tel:${BRAND.phoneLocal}`}
            data-track="call"
            data-location="drawer"
          >
            <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
            <span>
              <b>اتصل الآن</b>
              <small class="ltr">{BRAND.phoneDisplay}</small>
            </span>
          </a>
          <a
            class="dr-wa"
            href={BRAND.whatsapp}
            rel="noopener"
            target="_blank"
            data-track="whatsapp"
            data-location="drawer"
          >
            <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
            <span>
              <b>واتساب</b>
              <small>ردّ فوري وعرض سعر مكتوب</small>
            </span>
          </a>

          <div class="dr-list">
            <a href="/" aria-current={path === '/' ? 'page' : undefined}>
              <span dangerouslySetInnerHTML={{ __html: raw('home') }} />
              الرئيسية
            </a>
            <a href="#services">
              <span dangerouslySetInnerHTML={{ __html: raw('grid') }} />
              الخدمات
            </a>
            <a href="#works">
              <span dangerouslySetInnerHTML={{ __html: raw('images') }} />
              أعمالنا
            </a>
            <a href="#faq">
              <span dangerouslySetInnerHTML={{ __html: raw('help') }} />
              الأسئلة
            </a>
          </div>

          <p class="dr-foot">{BRAND.name} · استقبال الحجوزات ٢٤ ساعة</p>
        </nav>

        <main id="main">{children}</main>

        {/* ── Footer: clean luxury brand signature + zero city chips clutter ── */}
        <footer class="ftr">
          <div class="wrap">
            <div class="ftr-mini">
              <img src="/static/img/logo-192.webp" alt={BRAND.name} width="56" height="56" loading="lazy" />
              <b>{BRAND.name}</b>
              <small>{BRAND.latin} · LUXURY HOSPITALITY · JEDDAH</small>
              <a
                class="ftr-phone ltr"
                href={`tel:${BRAND.phoneLocal}`}
                data-track="call"
                data-location="footer"
              >
                {BRAND.phoneDisplay}
              </a>
            </div>
            <nav class="ftr-links" aria-label="روابط سريعة">
              <a href="/">الرئيسية</a>
              <a href="/services">الخدمات</a>
              <a href="/menu">التقديمات</a>
              <a href="/occasions">المناسبات</a>
              <a href="/gallery">أعمالنا</a>
              <a href="/faq">الأسئلة الشائعة</a>
              <a href="/about">من نحن</a>
              <a href="/contact">تواصل معنا</a>
            </nav>
            <div class="ftr-base">
              <span>© {new Date().getFullYear()} {BRAND.name} ({BRAND.latin})</span>
              <span>جدة — المملكة العربية السعودية</span>
            </div>
          </div>
        </footer>

        {/* ── Bottom contact bar: WhatsApp + prominent center Call + Quote ── */}
        {!bare && (
          <nav class="bnav" aria-label="تواصل سريع">
            <a
              href={BRAND.whatsapp}
              class="b-wa"
              rel="noopener"
              target="_blank"
              data-track="whatsapp"
              data-location="bottom-bar"
            >
              <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
              واتساب
            </a>
            <a
              href={`tel:${BRAND.phoneLocal}`}
              class="center"
              aria-label={`اتصل الآن ${BRAND.phoneDisplay}`}
              data-track="call"
              data-location="bottom-bar"
            >
              <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
              <em>اتصل الآن</em>
            </a>
            <a
              href={`${BRAND.whatsapp}?text=${encodeURIComponent(`السلام عليكم، أرغب في عرض سعر لضيافة مناسبة مع ${BRAND.name}.`)}`}
              class="b-quote"
              rel="noopener"
              target="_blank"
              data-track="quote"
              data-location="bottom-bar"
            >
              <span dangerouslySetInnerHTML={{ __html: raw('send') }} />
              عرض سعر
            </a>
          </nav>
        )}

        <div class="toast" id="toast" role="status" aria-live="polite">
          <span dangerouslySetInnerHTML={{ __html: raw('check') }} />
          <span id="toastMsg"></span>
        </div>

        <script src={`/static/app.js?v=${V}`} defer></script>
      </body>
    </html>
  )
}
