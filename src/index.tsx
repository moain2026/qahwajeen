import { Hono } from 'hono'
import { html } from 'hono/html'
import { SERVICES, OCCASIONS, MENU, CONTENT_DATE, SVC_URL, OCC_URL, SEARCH } from './data'
import { SITE } from './layout'
import { imgSrc } from './ui'
import { IMG_OLD } from './imgmeta'
import { IMG } from './imgmap'
import {
  Home,
  Services,
  ServiceDetail,
  Occasions,
  OccasionDetail,
  Menu,
  Gallery,
  FaqPage,
  FastBooking,
  NotFound,
  JeddahLanding,
} from './pages'
import { Social } from './views'
import { JEDDAH_PAGES, jeddahBySlug } from './jeddah'

const app = new Hono()

const xmlEsc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/* Security headers for every Worker response (Cloudflare `_headers`
 * does not apply to Worker/Functions output) + trailing-slash 301. */
app.use('*', async (c, next) => {
  const { pathname, search, hostname } = new URL(c.req.url)
  // Canonical host: www → apex (single indexable origin)
  if (hostname === 'www.qahwajeen.com') {
    return c.redirect(SITE + pathname.replace(/(.)\/+$/, '$1') + search, 301)
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return c.redirect(pathname.replace(/\/+$/, '') + search, 301)
  }
  await next()
  // Platform preview hosts must never compete with qahwajeen.com in Google
  if (/\.(vercel\.app|pages\.dev)$/.test(hostname)) {
    c.header('X-Robots-Tag', 'noindex, nofollow')
  }
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  if ((c.res.headers.get('Content-Type') || '').includes('text/html')) {
    c.header('Cache-Control', 'public, max-age=0, must-revalidate')
  }
})

/** hono/jsx does not emit a doctype — prepend it here. */
const page = (c: any, node: any, status = 200) =>
  c.html(html`<!DOCTYPE html>${node}`, status)

/* ══════════════════════════════════════════════════════════
 * CORE ROUTES
 * ══════════════════════════════════════════════════════════ */
app.get('/', (c) => page(c, <Home />))

app.get('/services', (c) => page(c, <Services />))

app.get('/services/:slug', (c) => {
  const slug = c.req.param('slug')
  if (SVC_URL[slug]) return c.redirect(SVC_URL[slug], 301)
  const s = SERVICES.find((x) => x.slug === slug)
  if (!s) return page(c, <NotFound />, 404)
  return page(c, <ServiceDetail s={s} />)
})

app.get('/occasions', (c) => page(c, <Occasions />))

app.get('/occasions/:slug', (c) => {
  const slug = c.req.param('slug')
  if (OCC_URL[slug]) return c.redirect(OCC_URL[slug], 301)
  const o = OCCASIONS.find((x) => x.slug === slug)
  if (!o) return page(c, <NotFound />, 404)
  return page(c, <OccasionDetail o={o} />)
})

app.get('/menu', (c) => page(c, <Menu />))

// one offerings page (Keif-style): old per-category pages fold into their section
app.get('/menu/:slug', (c) => {
  const m = MENU.find((x) => x.slug === c.req.param('slug'))
  return c.redirect(m ? `/menu#${m.slug}` : '/menu', 301)
})

app.get('/gallery', (c) => page(c, <Gallery />))
app.get('/faq', (c) => page(c, <FaqPage />))
app.get('/booking', (c) => page(c, <FastBooking />))
app.get('/links', (c) => page(c, <Social />))

for (const jp of JEDDAH_PAGES) {
  app.get(`/${jp.slug}`, (c) => page(c, <JeddahLanding p={jeddahBySlug(jp.slug)!} />))
}

/* ══════════════════════════════════════════════════════════
 * RETIRED URLs — exactly one 301 hop to the page that now owns the intent
 * ══════════════════════════════════════════════════════════ */
const MOVED: Record<string, string> = {
  '/about': '/links',
  '/contact': '/links',
  '/prices': '/links',
  '/social': '/links',
  '/qr': '/links',
  '/concierge': '/booking',
  '/locations': '/',
  '/qahwajiin-jeddah': '/',
  '/sababin-qahwa-jeddah': '/',
  '/diyafa-munasabat-jeddah': '/occasions',
}
for (const [from, to] of Object.entries(MOVED)) app.get(from, (c) => c.redirect(to, 301))
// old multi-city pages: the business serves Jeddah only
app.get('/locations/:slug', (c) => c.redirect('/', 301))
app.get('/:combo{(qahwajiin|sababin-qahwa|diyafa-munasabat)-[a-z]+}', (c) => c.redirect('/', 301))

/* ══════════════════════════════════════════════════════════
 * MACHINE ROUTES (robots.txt + sitemap.xml + image tags)
 * ══════════════════════════════════════════════════════════ */
app.get('/robots.txt', (c) =>
  c.text(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${SITE}/sitemap.xml`,
      '',
    ].join('\n'),
    200,
    { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  ),
)

/** Every canonical, indexable 200 URL — the single source for sitemap.xml. */
const sitemapPaths = () => [
  '/',
  '/services',
  ...SERVICES.filter((x) => !SVC_URL[x.slug]).map((s) => `/services/${s.slug}`),
  '/occasions',
  ...OCCASIONS.filter((x) => !OCC_URL[x.slug]).map((o) => `/occasions/${o.slug}`),
  ...JEDDAH_PAGES.map((jp) => `/${jp.slug}`),
  '/menu',
  '/gallery',
  '/faq',
  '/booking',
  '/links',
]

/** Content images of a rendered page = every <img> with real alt text
 *  (alt="" is decorative by WCAG and stays out of the index on purpose).
 *  Reading the rendered HTML means a new photo is indexed automatically. */
const pageImages = (html: string) => {
  const out: string[] = []
  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    const alt = /\balt="([^"]*)"/.exec(tag)?.[1]?.trim()
    const src = /\b(?:data-)?src="(\/static\/img\/[^"]+)"/.exec(tag)?.[1]
    if (!alt || !src || /aria-hidden="true"/.test(tag)) continue
    const m = /\/static\/img\/(.+?)-(?:sm|md|lg)\.webp$/.exec(src)
    out.push(m ? imgSrc(m[1]) : src) // largest variant of each photo — once per page
  }
  return [...new Set(out)]
}

let sitemapCache: string | null = null
app.get('/sitemap.xml', async (c) => {
  if (!sitemapCache) {
    const rows: string[] = []
    for (const path of sitemapPaths()) {
      const r = await app.request(`http://internal${path}`)
      if (r.status !== 200) continue // never list a non-200 URL
      const imgs = pageImages(await r.text())
      rows.push(
        `  <url><loc>${SITE}${path}</loc><lastmod>${CONTENT_DATE}</lastmod>` +
          imgs.map((u) => `<image:image><image:loc>${xmlEsc(SITE + u)}</image:loc></image:image>`).join('') +
          `</url>`,
      )
    }
    sitemapCache =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
      rows.join('\n') +
      `\n</urlset>\n`
  }
  return c.body(sitemapCache, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

// IndexNow ownership file (Bing · Yandex · Seznam · Naver). Key is public by protocol.
app.get(`/${SEARCH.indexNowKey}.txt`, (c) =>
  c.text(SEARCH.indexNowKey, 200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }),
)

app.get('/sitemap-images.xml', (c) => c.redirect('/sitemap.xml', 301))
app.get('/favicon.ico', (c) => c.redirect('/static/img/favicon.png', 301))

/* Retired photo file names (before the 2026-10 image rename) → one 301 hop to
 * the new descriptive file. Static files are served by the platform first, so
 * this only ever runs for URLs that no longer exist on disk. */
app.get('/static/img/:file{.+\\.webp}', (c) => {
  const m = /^(.+?)-(sm|md|lg)\.webp$/.exec(c.req.param('file'))
  const to = m && IMG_OLD[m[1]]
  if (!m || !to || !IMG[to]) return c.notFound()
  const v = IMG[to][0].includes(m[2]) ? m[2] : IMG[to][0][IMG[to][0].length - 1]
  return c.redirect(`/static/img/${to}-${v}.webp`, 301)
})

app.notFound((c) => page(c, <NotFound />, 404))

export default app
