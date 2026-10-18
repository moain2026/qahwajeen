import type { Child } from 'hono/jsx'
import { imgSrc, imgSet } from './ui'
import { hasImg } from './imgmap'
import { BRAND } from './data'
import { raw } from './icons'

const V = '16' // asset cache-bust
export const SITE = 'https://qahwajeen.com'

const TOP_NAV = [
  { href: '/', label: 'الرئيسية', match: '/', hot: false },
  { href: '/booking', label: 'حجز فوري', match: '/booking', hot: true },
  { href: '/services', label: 'الخدمات', match: '/services', hot: false },
  { href: '/menu', label: 'التقديمات', match: '/menu', hot: false },
  { href: '/gallery', label: 'أعمالنا', match: '/gallery', hot: false },
  { href: '/occasions', label: 'المناسبات', match: '/occasions', hot: false },
  { href: '/locations', label: 'المدن', match: '/locations', hot: false },
  { href: '/about', label: 'من نحن', match: '/about', hot: false },
  { href: '/social', label: 'حساباتنا', match: '/social', hot: false },
  { href: '/contact', label: 'تواصل', match: '/contact', hot: false },
] as const

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

        {/* ── Header: Top Horizontal Navigation Bar (No Side Drawer) ── */}
        <header class="hdr hdr-top" id="hdr">
          <div class="wrap hdr-shell">
            <div class="hdr-row">
              <a href="/" class="brand" title="الرئيسية">
                <img
                  src="/static/img/logo-192.webp"
                  srcset="/static/img/logo-192.webp 192w, /static/img/logo-512.webp 512w"
                  sizes="48px"
                  alt={BRAND.name}
                  width="48"
                  height="48"
                />
                <span class="brand-txt">
                  <b>{BRAND.name}</b>
                  <span>{BRAND.latin}</span>
                </span>
              </a>

              <div class="hdr-act">
                <a
                  href={`tel:${BRAND.phoneLocal}`}
                  class="hdr-call-pill"
                  aria-label={`اتصل بـ ${BRAND.name} ${BRAND.phoneDisplay}`}
                  data-track="call"
                  data-location="header"
                >
                  <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
                  <b class="ltr">{BRAND.phoneDisplay}</b>
                </a>
                <a
                  href={BRAND.whatsapp}
                  class="btn btn-gold hdr-wa-btn"
                  rel="noopener"
                  target="_blank"
                  data-track="whatsapp"
                  data-location="header"
                >
                  <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
                  <span>تواصل الآن</span>
                </a>
              </div>
            </div>

            <nav class="top-pages" aria-label="صفحات الموقع">
              {TOP_NAV.map((item) => {
                const isHome = item.href === '/'
                const active = isHome
                  ? path === '/'
                  : item.match === '/social'
                    ? path === '/social' || path === '/links'
                    : path === item.match || path.startsWith(item.match + '/')
                return (
                  <a
                    href={item.href}
                    class={'top-link' + (item.hot ? ' is-hot' : '')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.hot && <span class="top-dot" aria-hidden="true" />}
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        {/* ── Footer: clean luxury brand signature + Developer credit ── */}
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
              <a href="/booking">حجز سريع</a>
              <a href="/services">الخدمات</a>
              <a href="/menu">التقديمات</a>
              <a href="/occasions">المناسبات</a>
              <a href="/gallery">أعمالنا</a>
              <a href="/locations">المدن</a>
              <a href="/faq">الأسئلة الشائعة</a>
              <a href="/about">من نحن</a>
              <a href="/social">حساباتنا والباركود</a>
              <a href="/contact">تواصل معنا</a>
            </nav>
            <div class="ftr-base">
              <span>© {new Date().getFullYear()} {BRAND.name} ({BRAND.latin}) · جدة — المملكة العربية السعودية</span>
              <span class="ftr-dev">
                تطوير وتصميم{' '}
                <a
                  href="https://alabbasi.uk"
                  target="_blank"
                  rel="noopener"
                  class="ftr-dev-lnk"
                >
                  Alabbasi Tech
                </a>
              </span>
            </div>
          </div>
        </footer>

        {/* ── Bottom contact bar: WhatsApp + prominent center Call + Fast Booking ── */}
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
              href="/booking"
              class="b-quote"
              data-track="fast-booking"
              data-location="bottom-bar"
            >
              <span dangerouslySetInnerHTML={{ __html: raw('sparkle') }} />
              حجز فوري
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
