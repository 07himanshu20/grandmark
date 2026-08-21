import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Blocks from '@/components/Blocks'
import CoreValues from '@/components/CoreValues'
import { ContactCta, PageHero, StatStrip } from '@/components/sections'
import { Eyebrow, LineHeading, SectionNo, TextLink } from '@/components/ui'
import { bodyOf, descriptionOf, getPage, sliceUntil, statLinesOf } from '@/content'
import { coreValuesAbout } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About the Firm',
  description: descriptionOf(getPage('/about/the-firm')),
  alternates: { canonical: '/about/the-firm' },
}

export default function AboutFirmPage() {
  const page = getPage('/about/the-firm')
  if (!page) notFound()

  // bodyOf strips the <h1> and the figures; CORE VALUES onward is its own section
  const prose = sliceUntil(bodyOf(page), 'CORE VALUES')

  return (
    <>
      <PageHero
        title="About G R A N D M A R K & Associates"
        lines={['About G R A N D M A R K', '& Associates']}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'About the Firm' },
        ]}
        route={'/about/the-firm'}
      />

      <StatStrip lines={statLinesOf(getPage('/about/the-firm'))} />

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-5">
                <SectionNo n="01" />
                <Eyebrow>About the Firm</Eyebrow>
              </div>
              <LineHeading
                lines={['Global standards,', 'local needs']}
                className="t-h3 mt-6 font-extrabold text-ink"
              />
              <div className="mt-8 flex flex-col items-start gap-3">
                <TextLink href="/about">About Us</TextLink>
                <TextLink href="/partners">Our Partners</TextLink>
                <TextLink href="/sectors">Sectors</TextLink>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Blocks blocks={prose} />
          </div>
        </div>
      </section>

      <CoreValues values={coreValuesAbout} />
      <ContactCta />
    </>
  )
}
