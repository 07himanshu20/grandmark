import Image from 'next/image'
import Link from 'next/link'
import type { Card, Page } from '@/content'
import { bodyOf, headingOf, hasExpertBlock } from '@/content'
import Blocks from './Blocks'
import { AskExpert, ContactCta, PageHero } from './sections'
import { Arrow, Eyebrow, SectionNo } from './ui'
import { knowMore } from '@/lib/site'

/* --------------------------------------------------------- child cards */
export function ServiceCards({
  cards,
  eyebrow = 'Explore',
  heading,
}: {
  cards: Card[]
  eyebrow?: string
  heading?: string
}) {
  return (
    <section className="section-tight bg-paper-2">
      <div className="shell">
        {(eyebrow || heading) && (
          <div className="mb-12 flex items-center gap-5">
            <SectionNo n={String(cards.length).padStart(2, '0')} />
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}

        <div data-stagger="0.07" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Link
              key={c.href + i}
              href={c.href}
              data-reveal
              className="card-lift group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gm-50">
                <Image
                  src={c.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="zoom-img object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-gm-950/55 via-transparent to-gm-950/45"
                />
                <span className="t-num t-spaced absolute left-5 top-4 text-white/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[1rem] font-bold leading-snug tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                  {c.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-gm-600">
                  <span className="link-underline">{knowMore}</span>
                  <Arrow />
                </span>
              </div>

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gm-600 transition-transform duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- generic page */
/**
 * Standard inner-page shell: masthead, the page's own content rendered
 * verbatim, any child cards, and the shared closing blocks.
 */
export default function ContentPage({
  page,
  crumbs,
  heroRoute,
  lines,
  intro,
  cardsEyebrow,
  children,
  showCta = true,
}: {
  page: Page
  crumbs?: { label: string; href?: string }[]
  heroRoute?: string
  lines?: string[]
  intro?: string
  cardsEyebrow?: string
  children?: React.ReactNode
  showCta?: boolean
}) {
  const body = bodyOf(page)
  const title = headingOf(page)
  const cards = page.cards ?? []

  return (
    <>
      <PageHero
        title={title}
        lines={lines}
        crumbs={crumbs}
        route={heroRoute ?? page.route}
        intro={intro}
      />

      {body.length > 0 && (
        <section className="section bg-white">
          <div className="shell">
            <div className="mx-auto max-w-4xl">
              <Blocks blocks={body} />
            </div>
          </div>
        </section>
      )}

      {children}

      {cards.length > 0 && (
        <ServiceCards cards={cards} eyebrow={cardsEyebrow ?? 'Explore'} />
      )}

      {hasExpertBlock(page) && <AskExpert />}
      {showCta && <ContactCta />}
    </>
  )
}
