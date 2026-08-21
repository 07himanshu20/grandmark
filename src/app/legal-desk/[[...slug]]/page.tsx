import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Blocks from '@/components/Blocks'
import EnquiryForm from '@/components/EnquiryForm'
import { ContactCta, PageHero } from '@/components/sections'
import { Eyebrow, LineHeading, SectionNo } from '@/components/ui'
import { getPage, indexOfHeading } from '@/content'
import { crumbsFor, routesUnder } from '@/lib/routes'
import { legalForm, site } from '@/lib/site'

type Params = { slug?: string[] }

const routeOf = (slug?: string[]) =>
  '/legal-desk' + (slug?.length ? '/' + slug.join('/') : '')

export function generateStaticParams(): Params[] {
  return routesUnder('/legal-desk').map((r) => {
    const rest = r.replace('/legal-desk', '').split('/').filter(Boolean)
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
  return page ? { title: page.title, alternates: { canonical: page.route } } : {}
}

export default async function LegalDeskPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const route = routeOf(slug)
  const page = getPage(route)
  if (!page) notFound()

  // The Legal Opinion Desk form is embedded at the foot of this page in the
  // source; we cut the body there and render the form as a real form.
  const cut = indexOfHeading(page.blocks, 'Legal Opinion Desk')
  const body = (cut === -1 ? page.blocks : page.blocks.slice(0, cut)).filter(
    (b) => b.type !== 'h1',
  )
  const hasForm = cut !== -1

  return (
    <>
      <PageHero
        title={page.title}
        lines={[page.title]}
        crumbs={crumbsFor(route)}
        route={route}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <Blocks blocks={body} />
          </div>
        </div>
      </section>

      {hasForm && (
        <section className="section bg-paper-2">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-5">
                <SectionNo n="02" />
                <Eyebrow>{legalForm.heading}</Eyebrow>
              </div>
              <LineHeading
                lines={['Legal Opinion Desk']}
                className="t-h2 mt-6 font-extrabold text-ink"
              />
              <p data-reveal className="mt-7 text-[0.95rem] text-body">
                {legalForm.mailPrompt}{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-gm-700"
                >
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
      )}

      <ContactCta />
    </>
  )
}
