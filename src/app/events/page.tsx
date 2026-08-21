import type { Metadata } from 'next'
import Blocks from '@/components/Blocks'
import EmptyState from '@/components/EmptyState'
import { ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, SectionNo } from '@/components/ui'
import { getPage, bodyOf } from '@/content'

export const metadata: Metadata = {
  title: 'Events',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  const page = getPage('/events')
  const body = bodyOf(page)

  return (
    <>
      <PageHero
        title="Events"
        lines={['Events']}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Events' },
        ]}
        route={'/events'}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="01" />
            <Eyebrow>Events</Eyebrow>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            {body.length > 0 ? (
              <Blocks blocks={body} />
            ) : (
              <EmptyState
                message="There are no events listed at the moment. Please check back, or get in touch with the firm directly."
                links={[
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact Us', href: '/contact' },
                ]}
              />
            )}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
