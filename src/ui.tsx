/**
 * Shared presentational atoms & molecules.
 * Pure, stateless, no side effects — composed by views.
 *
 * IMAGE CONVENTION: every asset exists ONLY as
 *   {name}-sm.webp (480w) · {name}-md.webp (900w) · {name}-lg.webp (1600w)
 * There is no bare {name}.webp. Always go through <Img> / <Pic>.
 */
import { raw } from './icons'
import { IMG, varW } from './imgmap'

const B = '/static/img'

/* ── Responsive image (the ONE place srcsets are built) ──────
 * Reads the generated IMG map so we only ever emit variants that
 * actually exist on disk — zero 404s, correct intrinsic ratio.  */
export const Img = ({
  n,
  alt,
  sizes = '(min-width:1024px) 380px, (min-width:768px) 46vw, 92vw',
  eager = false,
  cls,
  ratio,
}: {
  n: string
  alt: string
  sizes?: string
  eager?: boolean
  cls?: string
  ratio?: number
}) => {
  const rec = IMG[n]
  const av = rec ? rec[0] : ['sm', 'md']
  const iw = rec ? rec[1] : 900
  const ih = rec ? rec[2] : 675
  const best = av[av.length - 1]
  const w = ratio ? 1200 : iw
  const h = ratio ? Math.round(1200 / ratio) : ih
  return (
    <img
      class={cls}
      src={`${B}/${n}-${best}.webp`}
      srcset={av.map((s) => `${B}/${n}-${s}.webp ${varW(n, s)}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
    />
  )
}

/* ── Art-directed hero image ─────────────────────────────────
 * A 16:9 still cropped into a tall phone frame keeps only a narrow
 * vertical sliver — on a 390px screen that meant the dallah fell
 * outside the crop and users saw nothing but blurred bokeh. So the
 * phone gets its own PORTRAIT composition and the desktop keeps the
 * landscape one, selected by <source media> so only one is ever
 * fetched. `tall` must be a registered name in the IMG map.        */
export const HeroPic = ({
  wide,
  tall,
  alt,
  eager = false,
}: {
  wide: string
  tall: string
  alt: string
  eager?: boolean
}) => {
  const w = IMG[wide]
  const t = IMG[tall]
  const set = (n: string, av: string[]) =>
    av.map((s) => `${B}/${n}-${s}.webp ${varW(n, s)}w`).join(', ')
  return (
    <picture>
      {/* phones & small tablets: portrait crop */}
      <source
        media="(max-width:767px)"
        srcset={set(tall, t ? t[0] : ['sm', 'md'])}
        sizes="100vw"
        width={t ? t[1] : 900}
        height={t ? t[2] : 1600}
      />
      <img
        src={`${B}/${wide}-${w ? w[0][w[0].length - 1] : 'md'}.webp`}
        srcset={set(wide, w ? w[0] : ['sm', 'md'])}
        sizes="100vw"
        alt={alt}
        width={w ? w[1] : 1600}
        height={w ? w[2] : 893}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}

/** Largest existing variant path — for LCP preload / OG images. */
export const imgSrc = (n: string) => {
  const rec = IMG[n]
  const av = rec ? rec[0] : ['md']
  return `${B}/${n}-${av[av.length - 1]}.webp`
}
export const imgSet = (n: string) => {
  const rec = IMG[n]
  const av = rec ? rec[0] : ['sm', 'md']
  return av.map((s) => `${B}/${n}-${s}.webp ${varW(n, s)}w`).join(', ')
}

/* ── FAQ accordion ─────────────────────────────────────────── */
export const Faq = ({ items }: { items: readonly { q: string; a: string }[] }) => (
  <div class="faq rv">
    {items.map((f) => (
      <details>
        <summary>
          {f.q}
          <span class="chev" aria-hidden="true" dangerouslySetInnerHTML={{ __html: raw('chevron') }} />
        </summary>
        <div class="ans">{f.a}</div>
      </details>
    ))}
  </div>
)
