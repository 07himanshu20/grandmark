import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { getPage } from '@/content'
import { crumbsFor, routesUnder } from '@/lib/routes'

type Params = { slug?: string[] }

const routeOf = (slug?: string[]) =>
  '/services' + (slug?.length ? '/' + slug.join('/') : '')

export function generateStaticParams(): Params[] {
  return routesUnder('/services').map((r) => {
    const rest = r.replace('/services', '').split('/').filter(Boolean)
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
  if (!page) return {}
  return {
    title: page.title,
    alternates: { canonical: page.route },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const route = routeOf(slug)
  const page = getPage(route)
  if (!page) notFound()

  return (
    <ContentPage
      page={page}
      crumbs={crumbsFor(route)}
      heroRoute={route}
      cardsEyebrow={route === '/services' ? 'What we do' : 'Our capabilities'}
    />
  )
}
