import { pages, getPage, imageSizes, slides } from '@/content'

/* ==========================================================================
   MASTHEAD IMAGERY
   Selection is derived, not hand-assigned per route:

   1. Art direction — the few deliberate editorial choices.
   2. The firm's own slider pairing. The home slider links each full-width
      banner to the service it illustrates, so that mapping is real data.
   3. The page's own imagery, but only if it is physically large enough.
   4. The firm's flagship banner.

   Every candidate must pass `fillsAMasthead`, which measures the actual file.
   That is what stops a 300x180 flag, a 263x263 headshot or a 657x137 logo
   from being stretched across a full-bleed banner — no filename rules and no
   per-route exceptions to keep in sync.
   ======================================================================== */

const DEFAULT_HERO = '/img/GM_Home_Banner_Business-Consulting.jpg'

/** Minimums for an image asked to fill a full-width masthead. */
const MIN_HERO_WIDTH = 1200
const MIN_HERO_ASPECT = 1.5

/** Deliberate editorial choices, not workarounds. */
const ART_DIRECTION: Record<string, string> = {
  '/global-services': '/img/world_connection-scaled-1.jpg',
  '/international-desk': '/img/world_connection-scaled-1.jpg',
  '/legal-desk': '/img/GM_Home_Banner_Corporate-Law-Compliances.jpg',
  '/legal-opinion-desk': '/img/GM_Home_Banner_Corporate-Law-Compliances.jpg',
}

/** True when the file is genuinely large and landscape enough for a masthead. */
export function fillsAMasthead(src: string): boolean {
  const dims = imageSizes[src.replace('/img/', '')]
  if (!dims) return false
  const [w, h] = dims
  return w >= MIN_HERO_WIDTH && w / h >= MIN_HERO_ASPECT
}

/** This route and each of its ancestors, most specific first. */
function selfAndAncestors(route: string): string[] {
  const parts = route.split('/').filter(Boolean)
  const out: string[] = []
  for (let i = parts.length; i > 0; i--) out.push('/' + parts.slice(0, i).join('/'))
  out.push('/')
  return out
}

export function heroFor(route: string): string {
  const chain = selfAndAncestors(route)

  for (const r of chain) {
    const art = ART_DIRECTION[r]
    if (art && fillsAMasthead(art)) return art
  }

  for (const r of chain) {
    const slide = slides.find((s) => s.href === r)
    if (slide && fillsAMasthead(slide.img)) return slide.img
  }

  const own = getPage(route)?.blocks.find(
    (b) => b.type === 'img' && fillsAMasthead(b.src),
  )
  if (own && own.type === 'img') return own.src

  return DEFAULT_HERO
}

/* ------------------------------------------------------------ breadcrumbs */

/** Labels for path segments that have no page of their own. */
const SEGMENT_LABELS: Record<string, string> = {
  '/services': 'Services',
  '/global-services': 'Global Services',
  '/partners': 'Partners',
  '/about': 'About Us',
  '/legal-desk': 'Legal Desk',
  '/knowledge-pool': 'Knowledge Pool',
}

export function titleFor(route: string): string {
  return getPage(route)?.title ?? SEGMENT_LABELS[route] ?? route
}

/** Trail from Home down to, and including, the current page. */
export function crumbsFor(route: string): { label: string; href?: string }[] {
  const parts = route.split('/').filter(Boolean)
  const trail: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }]
  let acc = ''
  parts.forEach((p, i) => {
    acc += '/' + p
    trail.push({ label: titleFor(acc), href: i === parts.length - 1 ? undefined : acc })
  })
  return trail
}

/** Every route under a prefix, for generateStaticParams. */
export function routesUnder(prefix: string): string[] {
  return Object.keys(pages).filter((r) => r === prefix || r.startsWith(prefix + '/'))
}
