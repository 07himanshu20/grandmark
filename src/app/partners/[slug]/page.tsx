import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Blocks from '@/components/Blocks'
import { ContactCta, PageHero } from '@/components/sections'
import { Arrow, Eyebrow, SectionNo, TextLink } from '@/components/ui'
import { profiles, partners } from '@/content'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return Object.keys(profiles).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const p = profiles[slug]
  if (!p) return {}
  return {
    title: p.name,
    description: [p.designation, p.qualifications, p.memberSince]
      .filter(Boolean)
      .join(' · '),
    alternates: { canonical: `/partners/${slug}` },
  }
}

export default async function PartnerProfile({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const p = profiles[slug]
  if (!p) notFound()

  const others = partners.filter((x) => x.href !== `/partners/${slug}`).slice(0, 4)

  const meta = [
    { k: 'Designation', v: p.designation },
    { k: 'Qualifications', v: p.qualifications },
    { k: 'Membership', v: p.memberSince },
  ].filter((m) => m.v)

  return (
    <>
      <PageHero
        title={p.name}
        lines={[p.name]}
        route={`/partners/${slug}`}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Partners', href: '/partners' },
          { label: p.name },
        ]}
        intro={p.designation}
      />

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* -------------------------------------------------- identity */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="gm-imgmask overflow-hidden rounded-2xl border border-line bg-gm-50">
                <Image
                  src={p.photo}
                  alt={p.name}
                  width={620}
                  height={775}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>

              <dl className="mt-8 space-y-4">
                {meta.map((m) => (
                  <div key={m.k} className="border-b border-line pb-4">
                    <dt className="t-spaced text-muted">{m.k}</dt>
                    <dd className="mt-1.5 text-[0.95rem] font-medium text-ink">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 space-y-2.5">
                {p.phone && (
                  <a
                    href={`tel:${p.phone.replace(/[^+\d]/g, '')}`}
                    className="block text-[0.9rem] text-body transition-colors hover:text-gm-700"
                  >
                    <span className="link-underline">{p.phone}</span>
                  </a>
                )}
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="block break-all text-[0.9rem] font-semibold text-gm-700 transition-colors hover:text-gm-900"
                  >
                    <span className="link-underline">{p.email}</span>
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* ----------------------------------------------------- bio */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-5">
              <SectionNo n="01" />
              <Eyebrow>Profile</Eyebrow>
            </div>

            {p.bio.length > 0 ? (
              <Blocks blocks={p.bio} className="mt-9" />
            ) : (
              <p data-reveal className="mt-9 text-[1.02rem] text-body">
                {[p.designation, p.qualifications, p.memberSince]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            <div className="mt-12">
              <TextLink href="/partners">Our Partners</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- other partners */}
      <section className="section-tight bg-paper-2">
        <div className="shell">
          <div className="flex items-center gap-5">
            <SectionNo n="02" />
            <Eyebrow>Our Team</Eyebrow>
          </div>

          <ul
            data-stagger="0.07"
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {others.map((o) => (
              <li key={o.name} data-reveal>
                <Link
                  href={o.href || '/partners'}
                  className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-gm-50">
                    <Image
                      src={o.photo}
                      alt={o.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="zoom-img object-cover object-top"
                    />
                  </span>
                  <span className="flex flex-1 items-start justify-between gap-3 p-5">
                    <span>
                      <span className="block text-[0.9rem] font-bold leading-snug tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                        {o.name}
                      </span>
                      <span className="mt-1 block text-[0.76rem] text-muted">
                        {o.designation}
                      </span>
                    </span>
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-gm-600 transition-all duration-500 group-hover:border-gm-600 group-hover:bg-gm-600 group-hover:text-white">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
