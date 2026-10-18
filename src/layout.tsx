import type { Child } from 'hono/jsx'
import { html, raw as rawHtml } from 'hono/html'
import { imgSrc, imgSet } from './ui'
import { hasImg } from './imgmap'
import { BRAND, SHOW, SOCIAL_LINKS, TRACKING } from './data'
import { raw } from './icons'

const V = '26' // asset cache-bust — bump on every CSS/JS change
export const SITE = 'https://qahwajeen.com'

/**
 * One header for every page: brand + ONE contact action.
 * Page navigation lives in the menu sheet (mobile) / inline links (desktop),
 * so no contact button is ever repeated inside the header itself.
 */
const NAV = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'الخدمات' },
  { href: '/menu', label: 'التقديمات' },
  { href: '/occasions', label: 'المناسبات' },
  { href: '/gallery', label: 'أعمالنا' },
  { href: '/faq', label: 'الأسئلة' },
  { href: '/links', label: 'تواصل معنا' },
] as const

type Props = {
  title: string
  desc: string
  path: string
  children: Child
  jsonld?: object
  /** name of the LCP image for this page (no size suffix) */
  hero?: string
  /** pages without a photo hero (links, booking, 404) */
  bare?: boolean
  /** error pages: noindex + no canonical */
  noindex?: boolean
}

const isActive = (href: string, path: string) =>
  href === '/' ? path === '/' : path === href || path.startsWith(href + '/')

/** Consent Mode v2 + gtag — only emitted when an ID is configured. */
const Tracking = () => {
  const ids = [TRACKING.ga4, TRACKING.ads].filter(Boolean)
  if (!ids.length) return null
  const cfg = {
    ga4: TRACKING.ga4,
    ads: TRACKING.ads,
    labels: { call: TRACKING.adsCallLabel, whatsapp: TRACKING.adsWhatsappLabel, booking: TRACKING.adsBookingLabel },
  }
  return html`<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('js',new Date());${rawHtml(ids.map((id) => `gtag('config','${id}');`).join(''))}
window.__trk=${rawHtml(JSON.stringify(cfg))};
addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${rawHtml(ids[0])}';document.head.appendChild(s)},1200)});
</script>`
}

export const Layout = ({ title, desc, path, children, jsonld, hero = 'hero-real', bare, noindex }: Props) => {
  const full = `${title} | ${BRAND.name}`
  const canonUrl = `${SITE}${path}`
  const ogImg = `${SITE}${imgSrc(hero)}`
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#04100c" />
        <title>{full}</title>
        <meta name="description" content={desc} />
        {noindex ? (
          <meta name="robots" content="noindex,follow" />
        ) : (
          <>
            <link rel="canonical" href={canonUrl} />
            <link rel="alternate" hreflang="ar-SA" href={canonUrl} />
            <link rel="alternate" hreflang="x-default" href={canonUrl} />
            <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
          </>
        )}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content={BRAND.name} />
        <meta property="og:title" content={full} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonUrl} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:alt" content={`${title} — ${BRAND.name}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={full} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImg} />

        <link rel="icon" href={`/static/img/favicon.png?v=${V}`} type="image/png" />
        <link rel="apple-touch-icon" href={`/static/img/apple-touch-icon.png?v=${V}`} />

        {/* Body + display fonts (Amiri renders the brand and every H1 — the LCP text) */}
        <link rel="preload" as="font" type="font/woff2" href="/static/fonts/tajawal-400-arabic.woff2" crossorigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/static/fonts/amiri-700-arabic.woff2" crossorigin="" />

        {/* LCP preload — per-page hero, split by the same media query as <picture> */}
        {bare ? null : hasImg(`${hero}-tall`) ? (
          <>
            <link rel="preload" as="image" media="(max-width:767px)" href={imgSrc(`${hero}-tall`)}
              imagesrcset={imgSet(`${hero}-tall`)} imagesizes="100vw" fetchpriority="high" />
            <link rel="preload" as="image" media="(min-width:768px)" href={imgSrc(hero)}
              imagesrcset={imgSet(hero)} imagesizes="100vw" fetchpriority="high" />
          </>
        ) : (
          <link rel="preload" as="image" href={imgSrc(hero)} imagesrcset={imgSet(hero)} imagesizes="100vw" fetchpriority="high" />
        )}

        <link rel="stylesheet" href={`/static/style.css?v=${V}`} />
        {html`<script>document.documentElement.classList.add('js')</script>`}
        <Tracking />
        {jsonld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />}
      </head>
      <body>
        <a href="#main" class="sr skip">تجاوز إلى المحتوى</a>
        <div class="sprog" id="sprog" aria-hidden="true"></div>

        {/* ── Header: brand · page links (desktop) · ONE call action · menu (mobile) ── */}
        <header class="hdr hdr-top" id="hdr">
          <div class="wrap hdr-shell">
            <a href="/" class="brand" aria-label={`${BRAND.name} — الصفحة الرئيسية`}>
              <img src="/static/img/logo-96.webp" alt="" width="44" height="44" />
              <span class="brand-txt" aria-hidden="true">
                <b>{BRAND.name}</b>
                <span>{BRAND.latin}</span>
              </span>
            </a>

            <nav class="top-pages" id="topNav" aria-label="صفحات الموقع">
              {NAV.map((item) => (
                <a href={item.href} class="top-link" aria-current={isActive(item.href, path) ? 'page' : undefined}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div class="hdr-act">
              <a href={`tel:${BRAND.phoneLocal}`} class="hdr-call" data-track="call" data-location="header">
                <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
                <b class="ltr">{BRAND.phoneDisplay}</b>
              </a>
              <button type="button" class="hdr-menu" id="menuBtn" aria-controls="topNav" aria-expanded="false" aria-label="القائمة">
                <span dangerouslySetInnerHTML={{ __html: raw('menu') }} />
              </button>
            </div>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer class="ftr">
          <div class="wrap">
            <div class="ftr-mini">
              <img src="/static/img/logo-96.webp" alt="" width="56" height="56" loading="lazy" />
              <b>{BRAND.name}</b>
              <small>{BRAND.latin} · ضيافة المناسبات في جدة</small>
              <a class="ftr-phone ltr" href={`tel:${BRAND.phoneLocal}`} data-track="call" data-location="footer">
                {BRAND.phoneDisplay}
              </a>
              {SHOW.email && (
                <a class="ftr-mail ltr" href={`mailto:${BRAND.email}`} data-track="email" data-location="footer">
                  {BRAND.email}
                </a>
              )}
              {SOCIAL_LINKS.length > 0 && (
                <p class="ftr-social">
                  {SOCIAL_LINKS.map((s) => (
                    <a href={s.href} rel="noopener me" target="_blank">{s.label}</a>
                  ))}
                </p>
              )}
            </div>
            <nav class="ftr-links" aria-label="روابط الموقع">
              {NAV.map((item) => (
                <a href={item.href}>{item.label}</a>
              ))}
              <a href="/booking">حجز سريع</a>
            </nav>
            <div class="ftr-base">
              <span>© {new Date().getFullYear()} {BRAND.name} · جدة — المملكة العربية السعودية</span>
              <span class="ftr-dev">
                تطوير وتصميم{' '}
                <a href="https://alabbasi.uk" target="_blank" rel="noopener" class="ftr-dev-lnk">Alabbasi Tech</a>
              </span>
            </div>
          </div>
        </footer>

        {/* ── Bottom bar (mobile): the two real channels. Hidden while the hero's own buttons are visible ── */}
        <nav class="bnav" aria-label="تواصل سريع">
          <a href={BRAND.whatsapp} class="b-wa" rel="noopener" target="_blank" data-track="whatsapp" data-location="bottom-bar">
            <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
            واتساب
          </a>
          <a href={`tel:${BRAND.phoneLocal}`} class="b-call" data-track="call" data-location="bottom-bar">
            <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
            اتصال
          </a>
        </nav>

        <div class="toast" id="toast" role="status" aria-live="polite">
          <span id="toastMsg"></span>
        </div>

        <script src={`/static/app.js?v=${V}`} defer></script>
      </body>
    </html>
  )
}
