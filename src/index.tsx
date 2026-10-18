import { Hono } from 'hono'
import { html } from 'hono/html'
import { BRAND, SERVICES, OCCASIONS, MENU, GALLERY, STAFF, SHOW } from './data'
import { CITIES, FAMILIES, cityBySlug, localPaths } from './cities'
import { SITE } from './layout'
import { imgSrc } from './ui'
import {
  Home,
  Services,
  ServiceDetail,
  Occasions,
  OccasionDetail,
  Locations,
  CityHub,
  FamilyCity,
  Menu,
  MenuCategory,
  Gallery,
  About,
  FaqPage,
  Contact,
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
  const s = SERVICES.find((x) => x.slug === c.req.param('slug'))
  if (!s) return page(c, <NotFound />, 404)
  return page(c, <ServiceDetail s={s} />)
})

app.get('/occasions', (c) => page(c, <Occasions />))

app.get('/occasions/:slug', (c) => {
  const o = OCCASIONS.find((x) => x.slug === c.req.param('slug'))
  if (!o) return page(c, <NotFound />, 404)
  return page(c, <OccasionDetail o={o} />)
})

app.get('/menu', (c) => page(c, <Menu />))

app.get('/menu/:slug', (c) => {
  const m = MENU.find((x) => x.slug === c.req.param('slug'))
  if (!m) return page(c, <NotFound />, 404)
  return page(c, <MenuCategory m={m} />)
})

app.get('/gallery', (c) => page(c, <Gallery />))
app.get('/prices', (c) => c.redirect('/contact', 301))
app.get('/about', (c) => page(c, <About />))
app.get('/faq', (c) => page(c, <FaqPage />))
app.get('/contact', (c) => page(c, <Contact />))
app.get('/booking', (c) => page(c, <FastBooking />))
app.get('/concierge', (c) => c.redirect('/booking', 301))
app.get('/links', (c) => page(c, <Social path="/links" />))
app.get('/social', (c) => c.redirect('/links', 301))
app.get('/qr', (c) => c.redirect('/links', 301))

/* ══════════════════════════════════════════════════════════
 * LOCAL SEO — 41 pages
 * ══════════════════════════════════════════════════════════ */
app.get('/locations', (c) => page(c, <Locations />))

app.get('/locations/:slug', (c) => {
  const city = cityBySlug(c.req.param('slug'))
  if (!city) return page(c, <NotFound />, 404)
  return page(c, <CityHub c={city} />)
})

/** Jeddah keyword pages — qahwajiat-jeddah, coffee-break-jeddah … */
for (const jp of JEDDAH_PAGES) {
  app.get(`/${jp.slug}`, (c) => page(c, <JeddahLanding p={jeddahBySlug(jp.slug)!} />))
}

/** qahwajiin-jeddah · sababin-qahwa-riyadh · diyafa-munasabat-makkah … */
app.get('/:combo{(qahwajiin|sababin-qahwa|diyafa-munasabat)-[a-z]+}', (c) => {
  const combo = c.req.param('combo')
  const fam = FAMILIES.find((f) => combo.startsWith(f.prefix + '-'))
  if (!fam) return page(c, <NotFound />, 404)
  const city = cityBySlug(combo.slice(fam.prefix.length + 1))
  if (!city) return page(c, <NotFound />, 404)
  return page(c, <FamilyCity f={fam} c={city} />)
})

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
      `Sitemap: ${SITE}/sitemap-images.xml`,
      '',
    ].join('\n'),
    200,
    { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  ),
)

app.get('/sitemap.xml', (c) => {
  type ImgTag = { loc: string; title: string; cap?: string; geo?: string }
  type Entry = { loc: string; p: string; f: string; imgs?: ImgTag[] }
  const e: Entry[] = []
  const add = (loc: string, p: string, f = 'monthly', imgs?: ImgTag[]) => e.push({ loc, p, f, imgs })

  add('/', '1.0', 'weekly', [
    {
      loc: `${SITE}${imgSrc('hero-real')}`,
      title: `قهوجي وصبابين جدة — ${BRAND.name}`,
      cap: `فريق قهوجيين وصبابين بزي سعودي رسمي موحّد في جدة — ${BRAND.name}`,
      geo: 'جدة، المملكة العربية السعودية',
    },
    ...STAFF.map((s) => ({
      loc: `${SITE}${imgSrc(s.img)}`,
      title: `${s.t} — ${BRAND.name}`,
      cap: `${s.t} (${s.d}) — ${BRAND.name} في جدة`,
      geo: 'جدة، المملكة العربية السعودية',
    })),
  ])
  add('/services', '0.9', 'monthly', SERVICES.map((s) => ({
    loc: `${SITE}${imgSrc(s.img)}`,
    title: `${s.h1} — ${BRAND.name}`,
    cap: s.short,
    geo: 'جدة، المملكة العربية السعودية',
  })))
  for (const s of SERVICES) {
    add(`/services/${s.slug}`, '0.8', 'monthly', s.gal.map((g) => ({
      loc: `${SITE}${imgSrc(g)}`,
      title: `${s.title} — ${BRAND.name}`,
      cap: `${s.h1} — ${BRAND.name}`,
      geo: 'جدة، المملكة العربية السعودية',
    })))
  }
  add('/occasions', '0.8', 'monthly')
  for (const o of OCCASIONS) {
    add(`/occasions/${o.slug}`, '0.7', 'monthly', [
      {
        loc: `${SITE}${imgSrc(o.img)}`,
        title: `${o.h1} — ${BRAND.name}`,
        cap: o.d,
        geo: 'جدة، المملكة العربية السعودية',
      },
    ])
  }
  add('/menu', '0.8', 'monthly')
  for (const m of MENU) {
    add(
      `/menu/${m.slug}`,
      '0.7',
      'monthly',
      m.items
        .filter((it) => it.img)
        .map((it) => ({
          loc: `${SITE}${imgSrc(it.img!)}`,
          title: `${it.n} — ${BRAND.name}`,
          cap: `${it.n}: ${it.d}`,
          geo: 'جدة، المملكة العربية السعودية',
        })),
    )
  }
  add(
    '/gallery',
    '0.8',
    'weekly',
    GALLERY.map((g) => ({
      loc: `${SITE}${imgSrc(g.img)}`,
      title: `${g.cap} — ${BRAND.name}`,
      cap: `${g.cap} — ضيافة ${BRAND.name} في جدة`,
      geo: 'جدة، المملكة العربية السعودية',
    })),
  )
  add('/about', '0.6', 'yearly')
  add('/faq', '0.6', 'monthly')
  add('/contact', '0.8', 'yearly')
  add('/booking', '0.9', 'weekly')
  add('/links', '0.8', 'monthly')

  // Jeddah keyword pages — home market, top priority
  for (const jp of JEDDAH_PAGES) {
    add(`/${jp.slug}`, '1.0', 'weekly', [
      {
        loc: `${SITE}${imgSrc(jp.hero)}`,
        title: `${jp.h1} — ${BRAND.name}`,
        cap: jp.lead,
        geo: 'جدة، المملكة العربية السعودية',
      },
    ])
  }

  // local SEO spine — city hubs get higher priority than family pages
  for (const p of localPaths()) {
    if (p === '/locations') add(p, '0.9', 'monthly')
    else if (p.endsWith('-jeddah') || p === '/locations/jeddah') add(p, '1.0', 'weekly')
    else if (p.startsWith('/locations/')) {
      const city = cityBySlug(p.split('/')[2])
      add(p, city && city.priority === 1 ? '0.9' : '0.8')
    } else add(p, '0.8')
  }

  const now = new Date().toISOString().slice(0, 10)
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    e
      .map((x) => {
        const imgXml = (x.imgs ?? [])
          .map(
            (im) =>
              `<image:image>` +
              `<image:loc>${xmlEsc(im.loc)}</image:loc>` +
              `<image:title>${xmlEsc(im.title)}</image:title>` +
              (im.cap ? `<image:caption>${xmlEsc(im.cap)}</image:caption>` : '') +
              (im.geo ? `<image:geo_location>${xmlEsc(im.geo)}</image:geo_location>` : '') +
              `</image:image>`,
          )
          .join('')
        return (
          `  <url><loc>${SITE}${x.loc}</loc><lastmod>${now}</lastmod>` +
          `<changefreq>${x.f}</changefreq><priority>${x.p}</priority>${imgXml}</url>`
        )
      })
      .join('\n') +
    `\n</urlset>\n`

  return c.body(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

/* Dedicated Google Images Sitemap for maximum visual indexing */
app.get('/sitemap-images.xml', (c) => {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `  <url>\n` +
    `    <loc>${SITE}/gallery</loc>\n` +
    GALLERY.map(
      (g) =>
        `    <image:image>` +
        `<image:loc>${xmlEsc(`${SITE}${imgSrc(g.img)}`)}</image:loc>` +
        `<image:title>${xmlEsc(`${g.cap} — ${BRAND.name}`)}</image:title>` +
        `<image:caption>${xmlEsc(`${g.cap} — خدمات ضيافة ${BRAND.name} في جدة`)}</image:caption>` +
        `<image:geo_location>${xmlEsc('جدة، المملكة العربية السعودية')}</image:geo_location>` +
        `</image:image>`,
    ).join('\n') +
    `\n  </url>\n` +
    SERVICES.map(
      (s) =>
        `  <url>\n` +
        `    <loc>${SITE}/services/${s.slug}</loc>\n` +
        s.gal
          .map(
            (g) =>
              `    <image:image>` +
              `<image:loc>${xmlEsc(`${SITE}${imgSrc(g)}`)}</image:loc>` +
              `<image:title>${xmlEsc(`${s.h1} — ${BRAND.name}`)}</image:title>` +
              `<image:caption>${xmlEsc(`${s.short} — ${BRAND.name}`)}</image:caption>` +
              `<image:geo_location>${xmlEsc('جدة، المملكة العربية السعودية')}</image:geo_location>` +
              `</image:image>`,
          )
          .join('\n') +
        `\n  </url>`,
    ).join('\n') +
    `\n</urlset>\n`

  return c.body(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

app.notFound((c) => page(c, <NotFound />, 404))

export default app
