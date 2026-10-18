/**
 * Home sections. <OnePage> composes the home page; inner pages reuse
 * single sections so each URL shows only its own topic.
 */
import type { Child } from 'hono/jsx'
import {
  BRAND,
  SERVICES,
  OCCASIONS,
  MENU,
  GALLERY,
  FAQ,
  STAFF,
  ROLES,
  WHY,
  AUDIENCE,
  ARRANGEMENTS,
  HERO_METRICS,
  CONCIERGE,
  svcUrl,
  occUrl,
  type Service,
} from './data'
import { Img, HeroPic, Faq, imgSrc, imgSet } from './ui'
import { Ico, wa } from './blocks'

/** first-screen copy is ONE short line — cut at a clause/word boundary */
export const oneLine = (t: string, max = 88) => {
  const c = t.split(/[.،—–:]/)[0].trim()
  if (c.length <= max && c.length > 20) return c
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

const n2 = (i: number) => String(i + 1).padStart(2, '0')

/* ── section header ─────────────────────────────────────────── */
export const Head = ({ k, t, sub, start, light }: { k: string; t: string; sub?: string; start?: boolean; light?: boolean }) => (
  <header class={'sx-head rv' + (start ? ' sx-start' : '') + (light ? ' sx-light' : '')}>
    <p class="sx-k">{k}</p>
    <h2>{t}</h2>
    <i class="sx-rule" aria-hidden="true" />
    {sub && <p class="sx-sub">{sub}</p>}
  </header>
)

export type HeroSpec = {
  img: string
  tall?: string
  alt: string
  kick: string
  h1: string
  lead: string
  wordmark?: boolean
  dots?: readonly string[]
  msg: string
}

/* ═══ 1. FIRST SCREEN — Royal Emerald & Gold Frosted Glass Card + Animated Background ═══ */
export const Hero = ({ h }: { h: HeroSpec }) => {
  const dots = h.dots ?? ['فعاليات رسمية', 'فعاليات الشركات', 'مناسبات خاصة']
  return (
    <section class={'hero hero-lux hero-art' + (h.wordmark ? ' is-home' : ' is-inner')}>
      <div class="hero-bg">
        {/* Primary LCP Frame */}
        <div class="hero-slide s1">
          {h.tall ? (
            <HeroPic wide={h.img} tall={h.tall} alt={h.alt} eager />
          ) : (
            <Img n={h.img} alt={h.alt} sizes="100vw" eager />
          )}
        </div>
        {/* Animated Crossfading Background Frames (Cinematic Ken-Burns) */}
        {/* ambient slides: fetched by app.js only after load (data-src) */}
        <div class="hero-slide s2" aria-hidden="true">
          <img data-src={imgSrc('ev-vip-2')} data-srcset={imgSet('ev-vip-2')} sizes="100vw" alt="" width="1600" height="900" decoding="async" />
        </div>
        <div class="hero-slide s3" aria-hidden="true">
          <img data-src={imgSrc('ev-booth-5')} data-srcset={imgSet('ev-booth-5')} sizes="100vw" alt="" width="1600" height="900" decoding="async" />
        </div>
      </div>

      {/* Cinematic Ambient Light Rays + Floating Golden Shimmer Particles */}
      <div class="hero-fx" aria-hidden="true">
        <span class="h-ray r1" />
        <span class="h-ray r2" />
        <span class="h-orb o1" />
        <span class="h-orb o2" />
        <i class="h-spark p1" />
        <i class="h-spark p2" />
        <i class="h-spark p3" />
        <i class="h-spark p4" />
        <i class="h-spark p5" />
        <i class="h-spark p6" />
        <i class="h-spark p7" />
        <i class="h-spark p8" />
      </div>

      <div class="hero-veil" aria-hidden="true" />
      <div class="hero-in">
        <div class="glass tilt">
          <span class="glass-corner c-tl" aria-hidden="true" />
          <span class="glass-corner c-tr" aria-hidden="true" />
          <span class="glass-corner c-bl" aria-hidden="true" />
          <span class="glass-corner c-br" aria-hidden="true" />
          <span class="glass-shimmer" aria-hidden="true" />
          <p class="glass-kick">{h.kick}</p>
          {h.wordmark ? (
            <>
              <p class="glass-name">{BRAND.name}</p>
              <i class="glass-bar" aria-hidden="true" />
              <p class="glass-latin">{BRAND.latin}</p>
              <p class="glass-sub">LUXURY HOSPITALITY</p>
            </>
          ) : (
            <p class="glass-sub glass-sub-inner">
              {BRAND.name} · {BRAND.latin}
            </p>
          )}
          <h1 class="glass-h1">{h.h1}</h1>
          <p class="glass-lead">{h.lead}</p>
          <ul class="glass-dots" aria-label="مجالات الضيافة">
            {dots.map((d) => (
              <li>{d}</li>
            ))}
          </ul>
        </div>

        <div class="hero-cta">
          <a
            class="btn btn-gold btn-lg"
            href={`tel:${BRAND.phoneLocal}`}
            data-track="call"
            data-location="hero"
          >
            <Ico n="phone" />
            اتصل الآن
          </a>
          <a
            class="btn btn-line btn-lg"
            href={wa(h.msg)}
            rel="noopener"
            target="_blank"
            data-track="whatsapp"
            data-location="hero"
          >
            <Ico n="chat" />
            واتساب فوري
          </a>
        </div>

        {/* Royal Trust Ribbon — immediate credibility below the fold */}
        <ul class="hero-metrics" aria-label="ما يميّز خدمتنا">
          {HERO_METRICS.map((m) => (
            <li>
              <b>{m.num}</b>
              <small>{m.label}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ═══ 2. WHO WE SERVE (لمن نخدم — 3 عقود ملكية مدمجة) ═══ */
export const WhoSec = ({ place = 'جدة' }: { place?: string }) => (
  <section class="sx sx-who" id="who">
    <div class="wrap">
      <Head
        k="لمن نخدم"
        t="طاقم واحد مدرَّب — وزيّ وتقديم بحسب طابع مناسبتك"
      />
      <div class="who-grid">
        {AUDIENCE.map((a, i) => (
          <a class="who-card rv" style={`--i:${i}`} href={a.href}>
            <span class="who-num" aria-hidden="true">٠{i + 1}</span>
            <Img
              n={a.img}
              alt={`${a.t} — ${BRAND.name} في ${place}`}
              sizes="(min-width:1024px) 260px, 31vw"
            />
            <span class="who-cap">
              <b>{a.t}</b>
              <small>{a.d}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
)

/* ═══ ROYAL 10-SECOND CONCIERGE (مُحدّد الضيافة الملكي السريع — يُعرض في صفحته المستقلة /booking) ═══ */
export const RoyalConcierge = ({ place, h1 }: { place: string; h1?: boolean }) => {
  const defOcc = CONCIERGE.occasions[0].id
  const defCrew = CONCIERGE.crews[0].id
  const defGuest = CONCIERGE.guests[1]
  const defMsg = `السلام عليكم، أرغب في عرض سعر من ${BRAND.name} في ${place}:\n• نوع المناسبة: ${defOcc}\n• الطاقم المطلوب: ${defCrew}\n• عدد الضيوف: ${defGuest.id}`

  return (
    <section class="sx sx-concierge" id="concierge" aria-labelledby="concierge-title">
      <div class="wrap">
        <div class="conc-box rv" id="concBox" data-place={place} data-brand={BRAND.name} data-wa={BRAND.whatsapp}>
          <div class="conc-head">
            {h1 ? (
              <h1 id="concierge-title">احجز قهوجي وصبابين في جدة بثلاث اختيارات</h1>
            ) : (
              <h2 id="concierge-title">احجز بثلاث اختيارات</h2>
            )}
            <p>اختر نوع المناسبة والطاقم وعدد الضيوف، ونجهّز لك رسالة واتساب بالتفاصيل — ويصلك عرض السعر المكتوب.</p>
          </div>

          <div class="conc-steps">
            {/* Step 1: Occasion */}
            <div class="conc-step">
              <span class="conc-lbl">
                <em>١</em> نوع المناسبة
              </span>
              <div class="conc-pills" role="group" aria-label="نوع المناسبة" data-conc-group="occ">
                {CONCIERGE.occasions.map((o, i) => (
                  <button
                    type="button"
                    class={'conc-pill' + (i === 0 ? ' on' : '')}
                    data-val={o.id}
                    aria-pressed={i === 0 ? 'true' : 'false'}
                  >
                    <Ico n={o.icon} />
                    <span>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Crew */}
            <div class="conc-step">
              <span class="conc-lbl">
                <em>٢</em> نوع الطاقم
              </span>
              <div class="conc-pills" role="group" aria-label="نوع الطاقم" data-conc-group="crew">
                {CONCIERGE.crews.map((c, i) => (
                  <button
                    type="button"
                    class={'conc-pill' + (i === 0 ? ' on' : '')}
                    data-val={c.id}
                    aria-pressed={i === 0 ? 'true' : 'false'}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Guests */}
            <div class="conc-step">
              <span class="conc-lbl">
                <em>٣</em> عدد الضيوف التقريبي
              </span>
              <div class="conc-pills" role="group" aria-label="عدد الضيوف" data-conc-group="guest">
                {CONCIERGE.guests.map((g, i) => (
                  <button
                    type="button"
                    class={'conc-pill' + (i === 1 ? ' on' : '')}
                    data-val={g.id}
                    data-rec={g.rec}
                    aria-pressed={i === 1 ? 'true' : 'false'}
                  >
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Smart Recommendation + Instant CTA */}
          <div class="conc-foot">
            <div class="conc-rec">
              <span class="conc-rec-k">الترتيب المقترح لمناسبتك:</span>
              <b id="concRecText">{defGuest.rec}</b>
            </div>
            <div class="conc-actions">
              <a
                id="concWaBtn"
                class="btn btn-gold btn-lg conc-cta"
                href={wa(defMsg)}
                rel="noopener"
                target="_blank"
                data-track="booking"
                data-location="concierge"
              >
                <Ico n="chat" />
                <span>أرسل الطلب عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Compact 2-column Service Card with inline <details> drawer */
export const CompactServiceCard = ({ s, place, brief }: { s: Service; place: string; brief?: boolean }) => (
  <article class="ksvc-card rv" id={`s-${s.slug}`}>
    <div class="ksvc-media">
      <Img
        n={s.img}
        alt={`${s.h1} — ${BRAND.name} في ${place}`}
        sizes="(min-width:1024px) 280px, 45vw"
      />
      <span class="ksvc-badge">{s.badge}</span>
    </div>
    <div class="ksvc-body">
      <h3>{s.title}</h3>
      <p class="ksvc-short">{s.short}</p>
      {brief ? (
        <a class="lnk" href={svcUrl(s.slug)}>
          تفاصيل الخدمة
          <Ico n="arrow" />
        </a>
      ) : (
      <details class="ksvc-more">
        <summary>
          <span>التفاصيل ومشتملات الخدمة</span>
          <Ico n="chevron" />
        </summary>
        <div class="ksvc-drawer">
          <p class="ksvc-desc">{s.desc}</p>
          <ul class="ksvc-pts">
            {s.points.map((pt) => (
              <li>{pt}</li>
            ))}
          </ul>
          <div class="ksvc-inc">
            {s.includes.map((inc) => (
              <div>
                <b>{inc.t}</b>
                <span>{inc.d}</span>
              </div>
            ))}
          </div>
          <div class="ksvc-actions">
            <a
              class="btn btn-gold btn-sm"
              href={wa(`السلام عليكم، أرغب في حجز خدمة (${s.title}) من ${BRAND.name}.`)}
              rel="noopener"
              target="_blank"
              data-track="whatsapp"
              data-location={`service-${s.slug}`}
            >
              <Ico n="chat" />
              اطلب هذه الخدمة
            </a>
            <a class="lnk" href={svcUrl(s.slug)}>
              صفحة الخدمة
              <Ico n="arrow" />
            </a>
          </div>
        </div>
      </details>
      )}
    </div>
  </article>
)

/* ═══ 3. OUR WORKS SECTION ═══ */
export const WorksSec = ({ expandAll = false }: { expandAll?: boolean }) => (
  <section class="sx sx-alt" id="works">
    <div class="wrap">
      <Head
        k="أعمالنا"
        t="صور من مناسبات خدمناها"
        sub="اسحب للتصفّح، واضغط على أي صورة لتكبيرها."
      />
      <div class="works-toolbar">
        <div class="works-filters" id="worksFilters" role="group" aria-label="تصفية معرض الأعمال">
          <button type="button" class="w-pill on" data-wcat="all" aria-pressed="true">الكل ({GALLERY.length})</button>
          <button type="button" class="w-pill" data-wcat="فريق" aria-pressed="false">الطاقم والزيّ</button>
          <button type="button" class="w-pill" data-wcat="ملكية" aria-pressed="false">الضيافة الملكية</button>
          <button type="button" class="w-pill" data-wcat="عدّة" aria-pressed="false">الدلال والعدّة</button>
          <button type="button" class="w-pill" data-wcat="تقديمات" aria-pressed="false">التقديمات والحلى</button>
          <button type="button" class="w-pill" data-wcat="إضافات" aria-pressed="false">الخيام والإضافات</button>
        </div>
        <div class="rail-ctrls" aria-label="تحكم بتمرير المعرض">
          <button type="button" class="rail-btn" data-rail-target="worksRail" data-dir="prev" aria-label="السابق">
            <Ico n="arrow" />
          </button>
          <span class="k-swipe-hint" aria-hidden="true">اسحب للتصفّح</span>
          <button type="button" class="rail-btn is-next" data-rail-target="worksRail" data-dir="next" aria-label="التالي">
            <Ico n="arrow" />
          </button>
        </div>
      </div>
      <div class="k-rail is-auto" id="worksRail" data-auto-rail="step" role="region" aria-label="معرض أعمال القهوة الملكية">
        {GALLERY.slice(0, 12).map((g) => (
          <button
            type="button"
            class="k-work-card galx-it"
            data-wcat={g.cat}
            data-full={g.img}
            data-cap={g.cap}
            aria-label={`${g.cap} — تكبير الصورة`}
          >
            <Img
              n={g.img}
              alt={`${g.cap} — ${BRAND.name}`}
              sizes="(min-width:1024px) 280px, 64vw"
            />
            <span class="k-work-tag">{g.cat}</span>
            <span class="k-work-cap">{g.cap}</span>
          </button>
        ))}
      </div>

      {/* Expandable full gallery inline */}
      <div class="galx-extra" id="galx" hidden={!expandAll}>
        <div class="k-gal-grid">
          {GALLERY.slice(12).map((g) => (
            <button
              type="button"
              class="k-work-card galx-it"
              data-wcat={g.cat}
              data-full={g.img}
              data-cap={g.cap}
              aria-label={`${g.cap} — تكبير الصورة`}
            >
              <Img
                n={g.img}
                alt={`${g.cap} — ${BRAND.name}`}
                sizes="(min-width:1024px) 240px, 46vw"
              />
              <span class="k-work-tag">{g.cat}</span>
              <span class="k-work-cap">{g.cap}</span>
            </button>
          ))}
        </div>
      </div>

      {!expandAll && (
        <div class="sx-more">
          <button
            type="button"
            class="btn btn-line"
            id="galMore"
            aria-controls="galx"
            aria-expanded="false"
          >
            معرض الأعمال الكامل ({GALLERY.length} صورة)
            <Ico n="chevron" />
          </button>
        </div>
      )}
    </div>
  </section>
)

/* ═══ 4. CREW & ATTIRE SECTION ═══ */
export const CrewSec = () => (
  <section class="sx" id="crew">
    <div class="wrap">
      <Head
        k="الطاقم والزيّ الرسمي"
        t="اختر زيّ طاقمك"
        sub="قهوجيين وصبابين ومباشرين بزيٍّ موحّد — وطاقم نسائي مستقل للمناسبات النسائية."
      />
      <div class="rail-bar">
        <div class="rail-ctrls" aria-label="تحكم بتمرير أزياء الطاقم">
          <button type="button" class="rail-btn" data-rail-target="crewRail" data-dir="prev" aria-label="الزي السابق">
            <Ico n="arrow" />
          </button>
          <span class="k-swipe-hint" aria-hidden="true">اسحب للتصفّح</span>
          <button type="button" class="rail-btn is-next" data-rail-target="crewRail" data-dir="next" aria-label="الزي التالي">
            <Ico n="arrow" />
          </button>
        </div>
      </div>
      <div class="k-rail k-rail-crew is-auto" id="crewRail" data-auto-rail="pingpong" role="region" aria-label="أزياء طاقم القهوة الملكية">
        {STAFF.map((s, idx) => (
          <figure class="k-crew-card">
            <span class="crew-badge">زيّ ٠{idx + 1}</span>
            <Img
              n={s.img}
              alt={`${s.t} — ${s.d} من ${BRAND.name}`}
              sizes="(min-width:1024px) 240px, 52vw"
            />
            <figcaption>
              <b>{s.t}</b>
              <small>{s.d}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)

/* ═══ 5. OFFERINGS & MENU SECTION ═══ */
export const MenuSec = ({ showAllCategories = false }: { showAllCategories?: boolean }) => (
  <section class="sx sx-alt" id="menu">
    <div class="wrap">
      <Head
        k="التقديمات"
        t={showAllCategories ? 'أقسام القائمة' : 'ما الذي يصل إلى ضيوفك؟'}
        sub="تختار ما يناسب مناسبتك، ونستبعد أي صنف أو نضيف بدائل عند الطلب."
      />
      {!showAllCategories ? (
        <>
          {/* Home: a short, calm preview — 8 signature items + one clear path to the full menu */}
          <div class="dishx">
            {MENU.flatMap((m) => m.items.filter((it) => it.img).slice(0, 1).map((it) => ({ it, m }))).slice(0, 8).map(({ it, m }) => (
              <a class="dishx-card" href={`/menu/${m.slug}`}>
                <Img n={it.img!} alt={`${it.n} — ${m.cat} من ${BRAND.name}`} sizes="(min-width:1024px) 220px, 44vw" />
                <span class="dishx-cap">
                  <b>{m.cat}</b>
                  <small>{it.n}</small>
                </span>
              </a>
            ))}
          </div>
          <div class="sx-more">
            <a class="btn btn-line" href="/menu">
              القائمة الكاملة
              <Ico n="arrow" />
            </a>
          </div>
        </>
      ) : (
        /* /menu: one calm card per category — cover photo + item list + link to the full category page */
        <>
          <nav class="mcat-nav" aria-label="أقسام القائمة">
            {MENU.map((m) => (
              <a class="mcat-chip" href={`#${m.slug}`}>{m.cat}</a>
            ))}
          </nav>
          <div class="mcat-grid">
            {MENU.map((m) => (
              <article class="mcat rv" id={m.slug}>
                <a class="mcat-media" href={`/menu/${m.slug}`} tabindex={-1} aria-hidden="true">
                  <Img n={m.hero} alt="" sizes="(min-width:1024px) 380px, 92vw" />
                </a>
                <div class="mcat-body">
                  <h3>{m.cat}</h3>
                  <p class="mcat-blurb">{m.blurb}</p>
                  <ul class="mcat-list">
                    {m.items.map((it) => (
                      <li>
                        <b>{it.n}</b>
                        <small>{it.d}</small>
                      </li>
                    ))}
                  </ul>
                  <a class="lnk" href={`/menu/${m.slug}`}>
                    صور {m.cat}
                    <Ico n="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
)

/* ═══ 6. ALL SERVICES SECTION ═══ */
export const ServicesSec = ({ place = 'جدة', only, brief, k = 'الخدمات', t = 'كل ما تحتاجه مناسبتك — من طاقم واحد' }: { place?: string; only?: readonly string[]; brief?: boolean; k?: string; t?: string }) => {
  if (only) {
    const list = SERVICES.filter((s) => only.includes(s.slug))
    return (
      <section class="sx" id="services">
        <div class="wrap">
          <Head k={k} t={t} />
          <div class="ksvc-grid">
            {list.map((s) => (
              <CompactServiceCard s={s} place={place} brief={brief} />
            ))}
          </div>
        </div>
      </section>
    )
  }
  const menSvcs = SERVICES.filter((s) => ['qahwajiin', 'zamzam'].includes(s.slug))
  const womenSvcs = SERVICES.filter((s) => ['qahwajiat', 'offerings'].includes(s.slug))
  const royalSvcs = SERVICES.filter((s) => ['royal', 'equipment', 'buffet', 'extras'].includes(s.slug))

  return (
    <section class="sx" id="services">
      <div class="wrap">
        <Head
          k={k}
          t={t}
          sub={brief ? undefined : "اضغط «التفاصيل» في أي بطاقة لعرض مشتملات الخدمة."}
        />

        <div class="ksvc-group" id="g-male">
          <h3 class="ksvc-gtitle">
            <span>الطاقم الرجالي</span>
          </h3>
          <div class="ksvc-grid">
            {menSvcs.map((s) => (
              <CompactServiceCard s={s} place={place} brief={brief} />
            ))}
          </div>
        </div>

        <div class="ksvc-group" id="g-female">
          <h3 class="ksvc-gtitle">
            <span>الطاقم النسائي والتقديمات</span>
          </h3>
          <div class="ksvc-grid">
            {womenSvcs.map((s) => (
              <CompactServiceCard s={s} place={place} brief={brief} />
            ))}
          </div>
        </div>

        <div class="ksvc-group" id="g-royal">
          <h3 class="ksvc-gtitle">
            <span>تجهيزات ملكية ولمسات فنية</span>
          </h3>
          <div class="ksvc-grid">
            {royalSvcs.map((s) => (
              <CompactServiceCard s={s} place={place} brief={brief} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══ 7. ROLES SECTION ═══ */
export const RolesSec = () => (
  <section class="sx sx-alt" id="roles">
    <div class="wrap">
      <Head
        k="كيف نعمل"
        t="ماذا يفعل طاقمنا في مناسبتك؟"
        sub="ثلاثة أدوار يعرفها أهل الضيافة في السعودية — ونوزّعها على عدد ضيوفك وشكل المكان."
      />
      <div class="rolx">
        {ROLES.map((r, i) => (
          <article class="rolx-card rv" style={`--i:${i}`}>
            <div class="rolx-txt">
              <span class="rolx-k">الأدوار · {n2(i)}</span>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
            </div>
            <span class="rolx-img">
              <Img
                n={r.img}
                alt={`دور ${r.t} في خدمة الضيافة — ${BRAND.name}`}
                sizes="(min-width:1024px) 360px, 90vw"
              />
            </span>
          </article>
        ))}
      </div>
    </div>
  </section>
)

/* ═══ 8. TEAM ARRANGEMENTS SECTION ═══ */
export const ArrangementsSec = () => (
  <section class="sx" id="arrangements">
    <div class="wrap">
      <Head
        k="الترتيبات"
        t="كيف نرتّب الطاقم لمناسبتك"
        sub="ثلاثة تشكيلات شائعة — ويُحسب عدد الطاقم بدقة على عدد ضيوفك ومساحة المكان."
      />
      <div class="arr-grid">
        {ARRANGEMENTS.map((ar, i) => (
          <article class="arr-card rv" style={`--i:${i}`}>
            <h3>{ar.title}</h3>
            <p class="arr-sub">{ar.sub}</p>
            <ul class="arr-pts">
              {ar.points.map((pt) => (
                <li>{pt}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div class="sx-more">
        <a
          class="btn btn-line"
          href={wa('السلام عليكم، أرغب في ترتيب طاقم ضيافة لمناسبتي مع القهوة الملكية.')}
          rel="noopener"
          target="_blank"
          data-track="whatsapp"
          data-location="arrangements"
        >
          <Ico n="chat" />
          اسألنا عن الترتيب المناسب
        </a>
      </div>
    </div>
  </section>
)

/* ═══ 9. OCCASIONS SECTION ═══ */
export const OccasionsSec = ({ place = 'جدة' }: { place?: string }) => (
  <section class="sx sx-alt" id="occasions">
    <div class="wrap">
      <Head
        k="المناسبات"
        t="ضيافة مُفصَّلة لكل نوع مناسبة"
      />
      <div class="occx">
        {OCCASIONS.map((o, i) => (
          <a class="occx-card rv" style={`--i:${i}`} href={occUrl(o.slug)}>
            <Img
              n={o.img}
              alt={`${o.h1} — ${BRAND.name} في ${place}`}
              sizes="(min-width:1024px) 280px, 46vw"
            />
            <span class="occx-cap">
              <b>{o.title}</b>
              <small>{o.d}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
)

/* ═══ 10. WHY US SECTION ═══ */
export const WhySec = ({ place = 'جدة' }: { place?: string }) => (
  <section class="sx" id="why">
    <div class="wrap wrap-nar">
      <Head k="لماذا نحن" t={`لماذا يختارنا منظّمو الفعاليات في ${place}؟`} />
      <ul class="why-bars">
        {WHY.map((w, i) => (
          <li class="rv" style={`--i:${i}`}>
            <i aria-hidden="true">✦</i>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

/* ═══ 11. FAQ SECTION ═══ */
export const FaqSec = ({ items = FAQ.slice(0, 6) }: { items?: readonly { q: string; a: string }[] }) => (
  <section class="sx sx-alt" id="faq">
    <div class="wrap wrap-nar">
      <Head k="الأسئلة الشائعة" t="إجابات صريحة قبل تأكيد حجزك" />
      <Faq items={items} />
    </div>
  </section>
)

/* ═══ 12. FINAL CALL & LIGHTBOX ═══ */
export const EndCta = ({ msg }: { msg: string }) => (
  <>
    <section class="endx" id="contact">
      <div class="endx-bg">
        <Img n="ev-vip-2" alt="" sizes="100vw" />
      </div>
      <div class="endx-in wrap rv">
        <div class="endx-card">
          <p class="sx-k">احجز ضيافتك</p>
          <h2>مناسبتك القادمة — نتولّى ضيافتها</h2>
          <p class="sx-sub">
            أرسل التاريخ والحي وعدد الضيوف، ويصلك عرض سعر مكتوب قبل أي تأكيد.
          </p>
          <div class="hx-cta">
            <a
              class="btn btn-gold btn-lg"
              href={`tel:${BRAND.phoneLocal}`}
              data-track="call"
              data-location="footer-cta"
            >
              <Ico n="phone" />
              <span class="ltr">{BRAND.phoneDisplay}</span>
            </a>
            <a
              class="btn btn-line btn-lg"
              href={wa(msg)}
              rel="noopener"
              target="_blank"
              data-track="whatsapp"
              data-location="footer-cta"
            >
              <Ico n="chat" />
              واتساب
            </a>
          </div>
        </div>
      </div>
    </section>

    <dialog class="lbx" id="lbx" aria-label="معاينة الصورة بحجم كامل">
      <button type="button" class="lbx-x" aria-label="إغلاق المعاينة">
        <Ico n="close" />
      </button>
      <button type="button" class="lbx-nav lbx-prev" aria-label="الصورة السابقة">
        <Ico n="chevron" />
      </button>
      <figure class="lbx-fig">
        <img alt="" width="900" height="1200" decoding="async" />
        <figcaption id="lbxCap"></figcaption>
      </figure>
      <button type="button" class="lbx-nav lbx-next" aria-label="الصورة التالية">
        <Ico n="chevron" />
      </button>
    </dialog>
  </>
)

/* ═══ THE FULL HOMEPAGE EXPERIENCE (Used on `/` and Local City Landing Pages) ═══ */
export const OnePage = ({
  hero,
  focus,
  faq = FAQ.slice(0, 6),
  place = 'جدة',
}: {
  hero: HeroSpec
  focus?: Child
  faq?: readonly { q: string; a: string }[]
  place?: string
}) => (
  <>
    <Hero h={hero} />
    <WhoSec place={place} />
    {focus}
    <WorksSec />
    <CrewSec />
    <MenuSec />
    <ServicesSec place={place} brief />
    <RolesSec />
    <ArrangementsSec />
    <OccasionsSec place={place} />
    <WhySec place={place} />
    <FaqSec items={faq} />
    <EndCta msg={hero.msg} />
  </>
)

/* ═══ FOCUS BLOCKS — each URL's own content (compact & proportional) ═══ */
export const FocusText = ({
  k,
  t,
  body,
  img,
  points,
}: {
  k: string
  t: string
  body: string
  img?: string
  points?: readonly string[]
}) => (
  <section class="sx sx-focus">
    <div class="wrap">
      <div class={'focx' + (img ? '' : ' focx-solo')}>
        <div class="focx-txt rv">
          <p class="sx-k">{k}</p>
          <h2>{t}</h2>
          <p class="focx-body">{body}</p>
          {points && (
            <ul class="svx-pts">
              {points.map((p) => (
                <li>{p}</li>
              ))}
            </ul>
          )}
        </div>
        {img && (
          <span class="focx-img rv">
            <Img n={img} alt={`${t} — ${BRAND.name}`} sizes="(min-width:1024px) 440px, 88vw" />
          </span>
        )}
      </div>
    </div>
  </section>
)

export const FocusGrid = ({
  k,
  t,
  items,
}: {
  k: string
  t: string
  items: { img: string; t: string; d?: string }[]
}) => (
  <section class="sx sx-focus">
    <div class="wrap">
      <Head k={k} t={t} />
      <div class="dishx">
        {items.map((i) => (
          <figure class="dishx-card rv">
            <Img n={i.img} alt={`${i.t} — ${BRAND.name}`} sizes="(min-width:1024px) 240px, 44vw" />
            <figcaption>
              <b>{i.t}</b>
              {i.d && <small>{i.d}</small>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)
