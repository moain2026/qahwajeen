import type { Child } from 'hono/jsx'
import { imgSrc, imgSet } from './ui'
import { hasImg } from './imgmap'
import { BRAND } from './data'
import { CITIES, FAMILIES } from './cities'
import { raw } from './icons'

const V = '10' // asset cache-bust
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
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <title>{full}</title>
        <meta name="description" content={desc} />
        {noindex ? null : <link rel="canonical" href={`${SITE}${path}`} />}
        <meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
        <meta name="author" content={BRAND.name} />

        {/* Geo signals */}
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Jeddah" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content={BRAND.name} />
        <meta property="og:title" content={full} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE}${path}`} />
        <meta property="og:image" content={`${SITE}${imgSrc(hero)}`} />
        <meta property="og:image:alt" content={BRAND.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={full} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={`${SITE}${imgSrc(hero)}`} />

        {/* Icons */}
        <link rel="icon" href={`/static/img/favicon.png?v=${V}`} type="image/png" />
        <link rel="apple-touch-icon" href={`/static/img/apple-touch-icon.png?v=${V}`} />
        <meta name="apple-mobile-web-app-title" content={BRAND.name} />

        {/* Fonts — self-hosted (same origin, no third-party round-trips).
            @font-face lives at the top of style.css; only the small body
            face is preloaded — the display face swaps in when ready. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/static/fonts/tajawal-400-arabic.woff2"
          crossorigin=""
        />

        {/* LCP preload — per-page hero (the QR page has no hero image).
            When an art-directed portrait twin exists, the preload has to be
            split by the SAME media query the <picture> uses, otherwise the
            phone downloads the landscape file it will never paint. */}
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

        {/* ── Header ── */}
        <header class="hdr" id="hdr">
          <div class="hdr-in">
            <a href="/" class="brand">
              <img
                src="/static/img/logo-192.webp"
                srcset="/static/img/logo-192.webp 192w, /static/img/logo-512.webp 512w"
                sizes="52px"
                alt=""
                width="52"
                height="52"
              />
              <span class="brand-txt">
                <b>{BRAND.name}</b>
                <span>{BRAND.latin}</span>
              </span>
            </a>


            <div class="hdr-act">
              <a href={`tel:${BRAND.phoneLocal}`} class="hdr-tel" aria-label="اتصل بنا">
                <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
              </a>
              <a href={BRAND.whatsapp} class="btn btn-gold hdr-cta" rel="noopener" target="_blank">
                <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
                واتساب
              </a>
              <button class="burger" id="burger" aria-label="فتح القائمة" aria-expanded="false" aria-controls="sheet">
                <span dangerouslySetInnerHTML={{ __html: raw('menu') }} />
              </button>
            </div>
          </div>
        </header>

        {/* ── Side drawer: basics only (the page itself is the site) ── */}
        <div class="sheet-bd" id="sheetBd" hidden></div>
        <nav class="sheet drawer" id="sheet" aria-label="القائمة" aria-hidden="true">
          <div class="dr-top">
            <span class="sheet-id">
              <img src="/static/img/logo-192.webp" alt="" width="40" height="40" loading="lazy" />
              <span>
                <b>{BRAND.name}</b>
                <small>QAHWAJEEN · JEDDAH</small>
              </span>
            </span>
            <button class="dr-x" type="button" id="sheetX" aria-label="إغلاق القائمة">
              <span dangerouslySetInnerHTML={{ __html: raw('close') }} />
            </button>
          </div>

          <a class="dr-call" href={`tel:${BRAND.phoneLocal}`}>
            <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
            <span>
              <b>اتصل الآن</b>
              <small class="ltr">{BRAND.phoneDisplay}</small>
            </span>
          </a>
          <a class="dr-wa" href={BRAND.whatsapp} rel="noopener" target="_blank">
            <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
            <span>
              <b>واتساب</b>
              <small>نردّ خلال دقائق</small>
            </span>
          </a>

          <div class="dr-list">
            <a href="/" aria-current={path === '/' ? 'page' : undefined}>
              <span dangerouslySetInnerHTML={{ __html: raw('home') }} />
              الرئيسية
            </a>
            <a href="/#works">
              <span dangerouslySetInnerHTML={{ __html: raw('images') }} />
              أعمالنا
            </a>
            <a href="/#services">
              <span dangerouslySetInnerHTML={{ __html: raw('grid') }} />
              الخدمات
            </a>
            <a href="/#faq">
              <span dangerouslySetInnerHTML={{ __html: raw('help') }} />
              أسئلة شائعة
            </a>
          </div>

          <p class="dr-foot">جدة · استقبال الحجوزات ٢٤ ساعة</p>
        </nav>

        <main id="main">{children}</main>

        {/* ── Footer: brand + one number + compact local links (crawlable) ── */}
        <footer class="ftr">
          <div class="wrap">
            <div class="ftr-mini">
              <img src="/static/img/logo-192.webp" alt="" width="56" height="56" loading="lazy" />
              <b>{BRAND.name}</b>
              <small>QAHWAJEEN · LUXURY HOSPITALITY · JEDDAH</small>
              <a class="ftr-phone ltr" href={`tel:${BRAND.phoneLocal}`}>
                {BRAND.phoneDisplay}
              </a>
            </div>
            <details class="ftr-mesh">
              <summary class="ftr-h">نخدم في</summary>
              <div class="mesh">
                {FAMILIES.map((f) =>
                  CITIES.map((c) => (
                    <a href={`/${f.prefix}-${c.slug}`}>
                      {f.noun} {c.name}
                    </a>
                  )),
                )}
              </div>
            </details>
            <div class="ftr-base">
              <span>© {new Date().getFullYear()} {BRAND.name}</span>
              <span>جدة — المملكة العربية السعودية</span>
            </div>
          </div>
        </footer>

        {/* ── Floating action dock (mobile conversion) ── */}
        {!bare && (
          <div class="dock" id="dock">
            <a href={`tel:${BRAND.phoneLocal}`} class="dock-btn dock-tel">
              <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
              اتصل
            </a>
            <a href={BRAND.whatsapp} class="dock-btn dock-wa" rel="noopener" target="_blank">
              <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
              واتساب
            </a>
          </div>
        )}

        {/* ── Bottom contact bar: no page navigation (burger lives in the header); centre = one-tap call ── */}
        {!bare && (
        <nav class="bnav" aria-label="تواصل سريع">
          <a href={BRAND.whatsapp} class="b-wa" rel="noopener" target="_blank">
            <span dangerouslySetInnerHTML={{ __html: raw('chat') }} />
            واتساب
          </a>
          <a href={`tel:${BRAND.phoneLocal}`} class="center" aria-label={`اتصل الآن ${BRAND.phoneDisplay}`}>
            <span dangerouslySetInnerHTML={{ __html: raw('phone') }} />
            <em>اتصل الآن</em>
          </a>
          <a
            href={`${BRAND.whatsapp}?text=${encodeURIComponent('السلام عليكم، أرغب في عرض سعر لضيافة مناسبة في جدة.')}`}
            class="b-quote"
            rel="noopener"
            target="_blank"
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
