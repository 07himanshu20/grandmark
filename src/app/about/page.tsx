import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Blocks from '@/components/Blocks'
import CoreValues from '@/components/CoreValues'
import PartnerGrid from '@/components/PartnerGrid'
import { ContactCta, PageHero, StatStrip } from '@/components/sections'
import { Eyebrow, LineHeading, SectionNo, TextLink } from '@/components/ui'
import { bodyOf, descriptionOf, aboutTeam, getPage, sliceUntil, statLinesOf } from '@/content'
import { coreValuesAbout } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About Us',
  description: descriptionOf(getPage('/about')),
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const page = getPage('/about')
  if (!page) notFound()

  // Everything above the team directory is prose; the directory itself is
  // rendered from structured partner data instead of raw blocks.
  // bodyOf strips the <h1> and the figures; CORE VALUES onward is its own section
  const prose = sliceUntil(bodyOf(page), 'CORE VALUES')

  return (
    <>
      <PageHero
        title="About G R A N D M A R K & Associates"
        lines={['About G R A N D M A R K', '& Associates']}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        route={'/about'}
      />

      <StatStrip lines={statLinesOf(getPage('/about'))} />

      <section className="section bg-white">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-5">
                  <SectionNo n="01" />
                  <Eyebrow>Who we are</Eyebrow>
                </div>
                <LineHeading
                  lines={['A firm built', 'since 1991']}
                  className="t-h3 mt-6 font-extrabold text-ink"
                />
                <div className="mt-8 flex flex-col items-start gap-3">
                  <TextLink href="/partners">Our Partners</TextLink>
                  <TextLink href="/contact">Our Offices</TextLink>
                  <TextLink href="/about/the-firm">About the Firm</TextLink>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <Blocks blocks={prose} />
            </div>
          </div>
        </div>
      </section>

      <CoreValues values={coreValuesAbout} />

      <section className="section bg-paper-2">
        <div className="shell">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-5">
                <SectionNo n="02" />
                <Eyebrow>Our Team</Eyebrow>
              </div>
              <LineHeading
                lines={['Our Team']}
                className="t-h2 mt-6 font-extrabold text-ink"
              />
            </div>
            <TextLink href="/partners">Our Partners</TextLink>
          </div>

          <PartnerGrid people={aboutTeam} className="mt-14" />
        </div>
      </section>

      <ContactCta />
    </>
  )
}
