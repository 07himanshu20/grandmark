import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Blocks from '@/components/Blocks'
import EmptyState from '@/components/EmptyState'
import { ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, SectionNo } from '@/components/ui'
import { bodyOf, getPage } from '@/content'
import { crumbsFor, routesUnder } from '@/lib/routes'

type Params = { slug?: string[] }

const routeOf = (slug?: string[]) =>
  '/knowledge-pool' + (slug?.length ? '/' + slug.join('/') : '')

export function generateStaticParams(): Params[] {
  return routesUnder('/knowledge-pool').map((r) => {
    const rest = r.replace('/knowledge-pool', '').split('/').filter(Boolean)
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

export default async function KnowledgePoolPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const route = routeOf(slug)
  const page = getPage(route)
  if (!page) notFound()

  const body = bodyOf(page)

  return (
    <>
      <PageHero
        title={page.title}
        lines={[page.title]}
        crumbs={crumbsFor(route)}
        route={route}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="01" />
            <Eyebrow>Knowledge Pool</Eyebrow>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            {body.length > 0 ? (
              <Blocks blocks={body} />
            ) : (
              <EmptyState message="There are no entries published here at the moment. Please check back, or get in touch with the firm directly." />
            )}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
