import type { Metadata } from 'next'
import Image from 'next/image'
import EnquiryForm from '@/components/EnquiryForm'
import { CityMarquee, PageHero, StatStrip } from '@/components/sections'
import { Arrow, Eyebrow, LineHeading, SectionNo } from '@/components/ui'
import { descriptionOf, offices, getPage, statLinesOf } from '@/content'
import {
  contactForm,
  cityLine,
  site,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `${descriptionOf(getPage('/contact'))} ${cityLine}`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        lines={['Contact Us']}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
        route={'/contact'}
      />

      <StatStrip lines={statLinesOf(getPage('/contact'))} />

      {/* ------------------------------------------------------ offices */}
      <section className="section bg-white">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="01" />
            <Eyebrow>Our Offices</Eyebrow>
          </div>

          <LineHeading
            lines={['Our Offices']}
            className="t-h2 mt-6 font-extrabold text-ink"
          />

          <p data-reveal className="mt-7 max-w-4xl text-[0.9rem] leading-relaxed tracking-wide text-muted">
            {cityLine}
          </p>

          <p data-reveal className="mt-5 text-[0.95rem] text-body">
            {contactForm.generalEnquiry}{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-gm-700"
            >
              <span className="link-underline">{site.email}</span>
            </a>
          </p>

          <ul
            data-stagger="0.05"
            className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {offices.map((o) => (
              <li key={o.city} data-reveal>
                <div className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                  {o.photo && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gm-50">
                      <Image
                        src={o.photo}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="zoom-img object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-gm-950/80 via-gm-950/20 to-transparent"
                      />
                      <h3 className="absolute inset-x-0 bottom-0 p-6 text-[1.25rem] font-extrabold tracking-tight text-white">
                        {o.city}
                      </h3>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-7">
                  {!o.photo && (
                    <h3 className="text-[1.15rem] font-extrabold tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                      {o.city}
                    </h3>
                  )}
                  <span className="block h-px w-8 bg-gm-200 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-16 group-hover:bg-gm-500" />

                  {o.contact && (
                    <div className="mt-5">
                      <p className="t-spaced text-muted">{contactForm.pointOfContact}</p>
                      <p className="mt-1.5 text-[0.95rem] font-semibold text-ink">
                        {o.contact}
                      </p>
                    </div>
                  )}

                  {o.phone && (
                    <p className="mt-4 text-[0.9rem] text-body">{o.phone}</p>
                  )}

                  {o.email && (
                    <p className="mt-1.5 break-all text-[0.86rem]">
                      {o.email.split(' | ').map((e, i) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="text-gm-700 transition-colors hover:text-gm-900"
                        >
                          <span className="link-underline">{e}</span>
                          {i === 0 && o.email.split(' | ').length > 1 && (
                            <span className="text-muted"> | </span>
                          )}
                        </a>
                      ))}
                    </p>
                  )}

                  {o.address && (
                    <p className="mt-5 flex-1 text-[0.9rem] leading-relaxed text-body">
                      {o.address}
                    </p>
                  )}

                  {o.maps && (
                    <a
                      href={o.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/map mt-5 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-gm-600 transition-colors hover:text-gm-800"
                    >
                      <span className="link-underline">View on map</span>
                      <Arrow />
                    </a>
                  )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CityMarquee />

      {/* --------------------------------------------------------- form */}
      <section className="section bg-paper-2">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-5">
              <SectionNo n="02" />
              <Eyebrow>{contactForm.heading}</Eyebrow>
            </div>
            <LineHeading
              lines={['Contact Us']}
              className="t-h2 mt-6 font-extrabold text-ink"
            />
            <div className="mt-8 space-y-2">
              <p data-reveal className="text-lg font-semibold tracking-tight text-ink">
                {site.phoneLine}
              </p>
              <a
                href={`mailto:${site.email}`}
                data-reveal
                className="inline-block text-[0.95rem] text-gm-700"
              >
                <span className="link-underline">{site.email}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              data-reveal="scale"
              className="rounded-3xl border border-line bg-white p-7 shadow-[0_28px_60px_-42px_rgba(15,26,38,.45)] md:p-9"
            >
              <EnquiryForm
                heading={contactForm.heading}
                fields={[
                  { name: 'name', label: contactForm.fields.name, required: true },
                  {
                    name: 'email',
                    label: contactForm.fields.email,
                    type: 'email',
                    required: true,
                  },
                  {
                    name: 'phone',
                    label: contactForm.fields.phone,
                    type: 'tel',
                    required: true,
                  },
                ]}
                subjectLabel={contactForm.fields.subject}
                subjects={contactForm.subjects}
                messageLabel={contactForm.fields.message}
                note={`Your message opens in your mail app, addressed to ${site.email}.`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
