import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, SectionNo } from '@/components/ui'
import { getPage } from '@/content'

export const metadata: Metadata = {
  title: 'Sectors',
  alternates: { canonical: '/sectors' },
}

export default function SectorsPage() {
  const page = getPage('/sectors')
  if (!page) notFound()

  const images = page.blocks.filter((b) => b.type === 'img')

  return (
    <>
      <PageHero
        title="Sectors"
        lines={['Sectors']}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Sectors' },
        ]}
        route={'/sectors'}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="01" />
            <Eyebrow>Sectors we serve</Eyebrow>
          </div>

          <div
            data-stagger="0.08"
            className="mt-12 grid gap-6 sm:grid-cols-2"
          >
            {images.map(
              (b, i) =>
                b.type === 'img' && (
                  <figure
                    key={i}
                    data-reveal
                    className="group overflow-hidden rounded-2xl border border-line bg-paper-2"
                  >
                    <div className="overflow-hidden">
                      <Image
                        src={b.src}
                        alt=""
                        width={1100}
                        height={700}
                        className="zoom-img h-auto w-full object-cover"
                      />
                    </div>
                  </figure>
                ),
            )}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
