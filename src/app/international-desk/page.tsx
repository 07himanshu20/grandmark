import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/ContentPage'
import { getPage } from '@/content'

export const metadata: Metadata = {
  title: 'International Desk',
  alternates: { canonical: '/international-desk' },
}

export default function InternationalDeskPage() {
  const page = getPage('/international-desk')
  if (!page) notFound()

  return (
    <ContentPage
      page={page}
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Global Services', href: '/global-services' },
        { label: 'International Desk' },
      ]}
      heroRoute={'/international-desk'}
      lines={['International Desk']}
    />
  )
}
