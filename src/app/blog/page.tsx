import type { Metadata } from 'next'
import EmptyState from '@/components/EmptyState'
import { ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, SectionNo } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Blog',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog"
        lines={['Blog']}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        route={'/blog'}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="01" />
            <Eyebrow>Insights</Eyebrow>
          </div>
          <div className="mt-12">
            <EmptyState
              message="There are no published blog entries at the moment. Please check back, or get in touch with the firm directly."
              links={[
                { label: 'Knowledge Pool', href: '/knowledge-pool' },
                { label: 'Contact Us', href: '/contact' },
              ]}
            />
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
