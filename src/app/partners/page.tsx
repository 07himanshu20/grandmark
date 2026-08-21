import type { Metadata } from 'next'
import PartnerGrid from '@/components/PartnerGrid'
import { ContactCta, PageHero, StatStrip } from '@/components/sections'
import { Eyebrow, SectionNo } from '@/components/ui'
import { descriptionOf, partners, getPage, statLinesOf } from '@/content'


export const metadata: Metadata = {
  title: 'Our Partners',
  description: descriptionOf(getPage('/partners')),
  alternates: { canonical: '/partners' },
}

export default function PartnersPage() {
  return (
    <>
      <PageHero
        title="Our Partners"
        lines={['Our Partners']}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Partners' },
        ]}
        route={'/partners'}
      />

      <StatStrip lines={statLinesOf(getPage('/partners'))} />

      <section className="section bg-paper-2">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n={String(partners.length)} />
            <Eyebrow>Partners</Eyebrow>
          </div>

          <PartnerGrid className="mt-12" />
        </div>
      </section>

      <ContactCta />
    </>
  )
}
