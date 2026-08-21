import raw from './data.json'

export type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'img'; src: string }

export type NavItem = { label: string; href?: string; children?: NavItem[] }

/** A home-slider slide: the firm's own pairing of banner to destination. */
export type Slide = { img: string; href: string; label: string }

export type Card = { title: string; img: string; href: string }

export type Page = {
  route: string
  title: string
  sourceUrl: string
  blocks: Block[]
  /** hub pages expose their children as link cards */
  cards?: Card[]
}

export type Partner = {
  name: string
  /** caption name on the photo card, which differs from the heading on some records */
  cardName: string
  cardRole: string
  designation: string
  qualifications: string
  memberSince: string
  email: string
  photo: string
  href: string
}

export type Profile = {
  slug: string
  name: string
  title: string
  designation: string
  qualifications: string
  memberSince: string
  email: string
  phone: string
  photo: string
  href: string
  bio: Block[]
}

export type Office = {
  city: string
  contact: string
  phone: string
  email: string
  address: string
  maps: string
  /** the firm's own photograph of that city, shown on its office card */
  photo: string
}

const data = raw as unknown as {
  nav: NavItem[]
  aboutTeam: Partner[]
  slides: Slide[]
  /** measured pixel dimensions of every bundled asset, keyed by filename */
  imageSizes: Record<string, [number, number]>
  pages: Record<string, Page>
  partners: Partner[]
  profiles: Record<string, Profile>
  offices: Office[]
}

export const nav = data.nav
export const pages = data.pages
export const partners = data.partners
/** The About page prints its own team directory, worded slightly differently. */
export const aboutTeam = data.aboutTeam
export const profiles = data.profiles
export const offices = data.offices
export const slides = data.slides
export const imageSizes = data.imageSizes

export const getPage = (route: string): Page | undefined => data.pages[route]

/** Body blocks with the trailing site-furniture ("Knowledge Pool" / "Ask the
 *  Expert") removed — those are rendered by a dedicated component instead. */
function bodyBlocks(page: Page): Block[] {
  const stop = page.blocks.findIndex(
    (b) =>
      'text' in b &&
      ['knowledge pool', 'ask the expert'].includes(b.text.trim().toLowerCase()),
  )
  return stop === -1 ? page.blocks : page.blocks.slice(0, stop)
}

export function bodyOf(page: Page | undefined): Block[] {
  if (!page) return []
  return bodyBlocks(page).filter(
    (b) =>
      // the page <h1> is rendered by the masthead, and the figures by the
      // stat strip — neither belongs in the body as well
      b.type !== 'h1' && !('text' in b && STAT_LINE.test(b.text)),
  )
}

export function headingOf(page: Page | undefined): string {
  if (!page) return ''
  const h1 = page.blocks.find((b) => b.type === 'h1')
  return h1 && 'text' in h1 ? h1.text : page.title
}

/**
 * The masthead figures a page states about the firm. Each page carries its
 * own wording — the Contact page says "400 plus" where the About pages say
 * "100 plus" — so they are read from the page rather than shared.
 */
const STAT_LINE =
  /(man-years of experience|professional experts and advisers)/i

export function statLinesOf(page: Page | undefined): string[] {
  if (!page) return []
  return bodyBlocks(page)
    .filter((b) => 'text' in b && STAT_LINE.test(b.text))
    .map((b) => ('text' in b ? b.text : ''))
}

/** Meta description: the page's own figures, else its opening paragraph. */
export function descriptionOf(page: Page | undefined): string {
  if (!page) return ''
  const stats = statLinesOf(page)
  if (stats.length) return stats.join(' ')
  const first = bodyBlocks(page).find((b) => b.type === 'p')
  return first && 'text' in first ? first.text.slice(0, 200) : ''
}

/** Index of the block whose text matches `heading` (case-insensitive). */
export function indexOfHeading(blocks: Block[], heading: string): number {
  return blocks.findIndex(
    (b) => 'text' in b && b.text.trim().toLowerCase() === heading.toLowerCase(),
  )
}

/** Blocks between two headings, excluding the headings themselves. */
export function sliceBetween(
  blocks: Block[],
  from: string,
  to?: string,
): Block[] {
  const a = indexOfHeading(blocks, from)
  if (a === -1) return []
  const b = to ? indexOfHeading(blocks, to) : -1
  return blocks.slice(a + 1, b === -1 ? undefined : b)
}

/** Everything up to the given heading (heading excluded). */
export function sliceUntil(blocks: Block[], heading: string): Block[] {
  const i = indexOfHeading(blocks, heading)
  return i === -1 ? blocks : blocks.slice(0, i)
}

/** True when a page carries the shared "Ask the Expert" footer block. */
export function hasExpertBlock(page: Page | undefined): boolean {
  if (!page) return false
  return page.blocks.some(
    (b) =>
      'text' in b &&
      ['ask the expert', 'knowledge pool'].includes(b.text.trim().toLowerCase()),
  )
}
