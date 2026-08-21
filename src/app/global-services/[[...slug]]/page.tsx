import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import Blocks from '@/components/Blocks'
import { ContactCta, PageHero } from '@/components/sections'
import { Arrow, Eyebrow, LineHeading, SectionNo } from '@/components/ui'
import { bodyOf, getPage } from '@/content'
import { crumbsFor, routesUnder } from '@/lib/routes'
import { desks, globalCapabilities, globalPitch } from '@/lib/site'

type Params = { slug?: string[] }

const routeOf = (slug?: string[]) =>
  '/global-services' + (slug?.length ? '/' + slug.join('/') : '')

export function generateStaticParams(): Params[] {
  return routesUnder('/global-services').map((r) => {
    const rest = r.replace('/global-services', '').split('/').filter(Boolean)
    return rest.length ? { slug: rest } : { slug: undefined }
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getPage(routeOf(slug))
  return page ? { title: page.title, alternates: { canonical: page.route } } : {}
}

export default async function GlobalPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const route = routeOf(slug)
  const page = getPage(route)
  if (!page) notFound()

  /* ------------------------------------------------- the landing page */
  if (route === '/global-services') {
    // the flag images sit out of order in the source markup, so the desk grid
    // is built from the desk list itself and only the text blocks are rendered
    const body = bodyOf(page).filter(
      (b) =>
        b.type !== 'img' &&
        !(b.type === 'h3' && desks.some((d) => d.label === b.text)) &&
        !(b.type === 'p' && b.text === globalPitch) &&
        !(
          b.type === 'ul' &&
          b.items.every((i) => globalCapabilities.includes(i))
        ),
    )

    return (
      <>
        <PageHero
          title={page.title}
          lines={['A complete Global', 'Business Consulting']}
          crumbs={crumbsFor(route)}
          route={route}
        />

        <section className="section bg-white">
          <div className="shell">
            <div className="flex items-center gap-5">
              <SectionNo n="01" />
              <Eyebrow>{globalPitch}</Eyebrow>
            </div>

            <ul data-stagger="0.07" className="mt-10 flex flex-wrap gap-2.5">
              {globalCapabilities.map((c) => (
                <li
                  key={c}
                  data-reveal
                  className="rounded-full border border-gm-100 bg-gm-50 px-5 py-2.5 text-[0.76rem] font-semibold tracking-wide text-gm-700"
                >
                  {c}
                </li>
              ))}
            </ul>

            {/* ------------------------------------------- desk grid */}
            <div className="mt-16 flex items-center gap-5">
              <SectionNo n="02" />
              <Eyebrow>Our Desks</Eyebrow>
            </div>

            <ul
              data-stagger="0.07"
              className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {desks.map((d) => (
                <li key={d.href} data-reveal>
                  <Link
                    href={d.href}
                    className="card-lift group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-line bg-white px-7 py-8"
                  >
                    <span>
                      <span className="t-num t-spaced !text-[0.66rem] text-gm-400">
                        {d.code}
                      </span>
                      <span className="mt-2 block text-[1.35rem] font-extrabold tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                        {d.label}
                      </span>
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-gm-600 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:border-gm-600 group-hover:bg-gm-600 group-hover:text-white">
                      <Arrow />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gm-600 transition-transform duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {body.length > 0 && (
          <section className="section-tight bg-paper-2">
            <div className="shell">
              <div className="mx-auto max-w-4xl">
                <Blocks blocks={body} />
              </div>
            </div>
          </section>
        )}

        <ContactCta />
      </>
    )
  }

  /* ------------------------------------------------------ desk pages */
  return (
    <ContentPage
      page={page}
      crumbs={crumbsFor(route)}
      heroRoute={route}
      lines={[page.title]}
    />
  )
}
