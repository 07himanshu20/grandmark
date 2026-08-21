import type { Metadata } from 'next'
import EnquiryForm from '@/components/EnquiryForm'
import { AskExpert, ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, LineHeading, SectionNo } from '@/components/ui'
import { legalForm, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Legal Opinion Desk',
  alternates: { canonical: '/legal-opinion-desk' },
}

export default function LegalOpinionDeskPage() {
  return (
    <>
      <PageHero
        title="Legal Opinion Desk"
        lines={['Legal Opinion Desk']}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Legal Desk', href: '/legal-desk' },
          { label: 'Legal Opinion Desk' },
        ]}
        route={'/legal-opinion-desk'}
      />

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-5">
              <SectionNo n="01" />
              <Eyebrow>{legalForm.heading}</Eyebrow>
            </div>
            <LineHeading
              lines={['Legal Opinion Desk']}
              className="t-h2 mt-6 font-extrabold text-ink"
            />
            <p data-reveal className="mt-7 text-[0.95rem] text-body">
              {legalForm.mailPrompt}{' '}
              <a href={`mailto:${site.email}`} className="font-semibold text-gm-700">
                <span className="link-underline">{site.email}</span>
              </a>
            </p>
          </div>

          <div className="lg:col-span-7">
            <div
              data-reveal="scale"
              className="rounded-3xl border border-line bg-white p-7 shadow-[0_28px_60px_-42px_rgba(15,26,38,.45)] md:p-9"
            >
              <EnquiryForm
                heading={legalForm.heading}
                fields={[
                  { name: 'name', label: legalForm.fields.name, required: true },
                  { name: 'org', label: legalForm.fields.org, required: true },
                  {
                    name: 'mobile',
                    label: legalForm.fields.mobile,
                    type: 'tel',
                    required: true,
                  },
                  {
                    name: 'email',
                    label: legalForm.fields.email,
                    type: 'email',
                    required: true,
                  },
                ]}
                subjectLabel={legalForm.fields.subject}
                subjects={legalForm.subjects}
                messageLabel={legalForm.fields.message}
                note={`Your message opens in your mail app, addressed to ${site.email}.`}
              />
            </div>
          </div>
        </div>
      </section>

      <AskExpert />
      <ContactCta />
    </>
  )
}
