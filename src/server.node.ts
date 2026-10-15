/**
 * Node entry — for container hosts (Spaceship Hyperlift, any Docker/VPS).
 * Same Hono app as Cloudflare/Vercel; this file only adds what those
 * platforms provide for free: static files, compression, port binding.
 *
 *   npm run build:node  → dist-node/server.mjs (single bundled file)
 *   PORT=8080 node dist-node/server.mjs
 */
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import app from './index'

const STATIC_ROOT = process.env.STATIC_ROOT ?? './public'
const PORT = Number(process.env.PORT ?? 8080)

const root = new Hono()

root.use('*', compress())

root.get('/healthz', (c) => c.text('ok'))

root.use(
  '/static/*',
  serveStatic({
    root: STATIC_ROOT,
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, max-age=31536000, immutable')
      c.header('X-Content-Type-Options', 'nosniff')
    },
  }),
)

// Everything else (pages, sitemap, robots, branded 404) → the app
root.all('*', (c) => app.fetch(c.req.raw, c.env))

const server = serve({ fetch: root.fetch, port: PORT, hostname: '0.0.0.0' }, (i) =>
  console.log(`qahwajeen listening on :${i.port}`),
)

const stop = () => server.close(() => process.exit(0))
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
