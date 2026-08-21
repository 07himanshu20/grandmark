import Link from 'next/link'
import Image from 'next/image'
import { Arrow, Eyebrow, LineHeading, TextLink } from './ui'
import { askExpert, cities, site } from '@/lib/site'
import { heroFor } from '@/lib/routes'

/* ------------------------------------------------------------ page hero */
/**
 * Inner-page masthead. Uses one of the firm's own photographs as a treated
 * background layer with real, animatable HTML text on top.
 */
export function PageHero({
  title,
  lines,
  crumbs,
  image,
  route,
  intro,
}: {
  title: string
  lines?: string[]
  crumbs?: { label: string; href?: string }[]
  /** explicit override; normally the masthead is resolved from `route` */
  image?: string
  route?: string
  intro?: string
}) {
  const head = lines?.length ? lines : [title]
  const src = image ?? (route ? heroFor(route) : undefined)

  return (
    <section className="relative overflow-hidden bg-gm-950 pb-16 pt-36 md:pb-24 md:pt-48">
      {src && (
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
            style={{ filter: 'blur(4px)' }}
          />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,25,42,.92) 0%, rgba(10,39,64,.86) 45%, rgba(6,25,42,.95) 100%)',
        }}
      />
      {/* fine grid motif — the firm's letter-spaced wordmark, echoed as rules */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)',
          backgroundSize: '7.5rem 100%',
        }}
      />

      <div className="shell relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.74rem] text-white/50">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="transition-colors hover:text-white"
                    >
                      <span className="link-underline">{c.label}</span>
                    </Link>
                  ) : (
                    <span className="text-white/80">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <LineHeading
          as="h1"
          lines={head}
          className="t-h1 max-w-5xl font-extrabold text-white"
        />

        {intro && (
          <p
            data-reveal
            data-delay="0.25"
            className="t-lead mt-7 max-w-2xl text-white/70"
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- stat ribbon */
export function StatStrip({ lines }: { lines: string[] }) {
  if (!lines.length) return null
  return (
    <section className="border-b border-line bg-paper-2">
      <div className="shell py-9">
        {lines.map((l, i) => (
          <p
            key={i}
            data-reveal
            data-delay={String(i * 0.1)}
            className={
              i === 0
                ? 'text-[0.95rem] font-semibold tracking-tight text-ink md:text-lg'
                : 'mt-1.5 text-[0.92rem] text-muted'
            }
          >
            {l}
          </p>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- city marquee */
export function CityMarquee({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  const row = [...cities, ...cities]

  return (
    <section
      className={`overflow-hidden border-y py-6 ${
        dark ? 'border-white/10 bg-gm-950' : 'border-line bg-white'
      }`}
      aria-label="Our offices"
    >
      <div data-marquee="42" className="gm-marquee items-center gap-10">
        {row.map((c, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span
              className={`t-spaced !text-[0.8rem] ${
                dark ? 'text-white/50' : 'text-muted'
              }`}
            >
              {c}
            </span>
            <span
              aria-hidden="true"
              className={`h-1 w-1 rounded-full ${
                dark ? 'bg-gm-400/60' : 'bg-gm-300'
              }`}
            />
          </span>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------- ask the expert */
/** The shared block that closes every service page, wording untouched. */
export function AskExpert() {
  return (
    <section className="section-tight bg-gm-50">
      <div className="shell">
        <div className="grid items-center gap-10 rounded-3xl border border-gm-100 bg-white p-8 shadow-[0_28px_60px_-40px_rgba(15,26,38,.4)] md:p-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{askExpert.title}</Eyebrow>
            <div className="mt-5 space-y-2">
              {askExpert.lines.map((l) => (
                <p
                  key={l}
                  data-reveal
                  className="text-[1.02rem] leading-relaxed text-body"
                >
                  {l}
                </p>
              ))}
            </div>
            <p data-reveal className="mt-6 text-sm text-muted">
              {askExpert.mailPrompt}{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-gm-700"
              >
                <span className="link-underline">{site.email}</span>
              </a>
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <TextLink href="/partners">{askExpert.teamCta}</TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- closing CTA */
export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-gm-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 32rem at 18% 12%, rgba(47,118,176,.5), transparent 62%), radial-gradient(52rem 30rem at 88% 88%, rgba(24,89,135,.55), transparent 60%)',
        }}
      />
      <div className="shell relative section-tight">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="!text-gm-300">{site.shortSpaced}</Eyebrow>
            <LineHeading
              lines={['Now we have presence in', '14 Cities Across India']}
              className="t-h2 mt-6 font-extrabold text-white"
            />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p data-reveal className="mb-6 max-w-sm text-white/65">
              {site.phoneLine}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gm-800 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-gm-100"
              >
                Our Offices
                <Arrow />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:border-white hover:bg-white/10"
              >
                {site.email}
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
