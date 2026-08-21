import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/Hero'
import { Arrow, Eyebrow, LineHeading, SectionNo, TextLink } from '@/components/ui'
import { CityMarquee, ContactCta } from '@/components/sections'
import {
  coreValuesHome,
  desks,
  globalCapabilities,
  globalPitch,
  homeIntro,
  homeServices,
  homeStats,
  site,
} from '@/lib/site'
import { partners } from '@/content'

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ==================================================== THE FIRM === */}
      <section className="section bg-white">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5">
              <SectionNo n="01" />
              <Eyebrow>The Firm</Eyebrow>
            </div>

            <div className="mt-8 space-y-6">
              {homeIntro.map((p, i) => (
                <p
                  key={i}
                  data-reveal
                  data-delay={String(i * 0.08)}
                  className={
                    i === 0
                      ? 'text-[1.12rem] leading-[1.72] text-ink md:text-[1.22rem]'
                      : 'text-[1.02rem] leading-[1.75] text-body'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <p data-reveal className="mt-10 t-spaced text-muted">
              Learn More :
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
              <TextLink href="/about/the-firm">About {site.shortSpaced}</TextLink>
              <TextLink href="/partners">Our Partners</TextLink>
              <TextLink href="/contact">Our Offices</TextLink>
            </div>
          </div>

          {/* ------------------------------------------- core values card */}
          <aside className="lg:col-span-5">
            <div
              data-reveal="scale"
              className="relative overflow-hidden rounded-3xl border border-line bg-paper-2 p-8 md:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(24,89,135,.16), transparent)',
                }}
              />
              <h2 className="t-spaced relative text-gm-600">Core Values</h2>
              <ul data-stagger="0.07" className="relative mt-7 space-y-4">
                {coreValuesHome.map((v, i) => (
                  <li
                    key={i}
                    data-reveal
                    className="group flex items-baseline gap-4 border-b border-line/80 pb-4 last:border-0"
                  >
                    <span className="sr-only">{v.letter + v.rest}</span>
                    <span
                      aria-hidden="true"
                      className="font-display text-3xl font-extrabold leading-none text-gm-600 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1"
                    >
                      {v.letter}
                    </span>
                    <span aria-hidden="true" className="text-[0.98rem] leading-snug text-body">
                      {v.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ==================================================== NUMBERS ==== */}
      <section className="relative overflow-hidden bg-gm-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(56rem 30rem at 8% 0%, rgba(47,118,176,.42), transparent 62%), radial-gradient(46rem 26rem at 96% 100%, rgba(24,89,135,.5), transparent 60%)',
          }}
        />
        <div className="shell relative section-tight">
          <div className="flex items-center gap-5">
            <SectionNo n="02" />
            <Eyebrow className="!text-gm-300">By the numbers</Eyebrow>
          </div>

          <dl
            data-stagger="0.1"
            className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {homeStats.map((s) => (
              <div key={s.label} data-reveal className="border-t border-white/15 pt-6">
                <dd className="t-num font-display text-[3.1rem] font-extrabold leading-none text-white md:text-[3.6rem]">
                  {s.prefix && (
                    <span className="mr-1 block text-[0.72rem] font-medium tracking-wide text-white/45">
                      {s.prefix}
                    </span>
                  )}
                  <span
                    data-counter={s.value}
                    data-counter-format={s.group ? undefined : 'plain'}
                  >
                    0
                  </span>
                </dd>
                <dt className="mt-3 text-[0.86rem] leading-snug text-white/55">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>

          <p data-reveal className="mt-12 max-w-3xl text-[0.95rem] text-white/55">
            Access to 100 plus professional experts and advisers across Indian and
            overseas
          </p>
        </div>
      </section>

      {/* =================================================== SERVICES ==== */}
      <section className="section bg-paper-2">
        <div className="shell">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-5">
                <SectionNo n="03" />
                <Eyebrow>What we do</Eyebrow>
              </div>
              <LineHeading
                lines={['Our Services']}
                className="t-h2 mt-6 font-extrabold text-ink"
              />
            </div>
            <TextLink href="/services">Learn More</TextLink>
          </div>

          <div
            data-stagger="0.075"
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {homeServices.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                data-reveal
                className="card-lift group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="zoom-img object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-gm-950/55 via-transparent to-gm-950/45"
                  />
                  <span className="t-num t-spaced absolute left-5 top-4 text-white/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 items-start justify-between gap-4 p-6">
                  <h3 className="text-[1.02rem] font-bold leading-snug tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                    {s.label}
                  </h3>
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-gm-600 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:border-gm-600 group-hover:bg-gm-600 group-hover:text-white">
                    <Arrow />
                  </span>
                </div>

                {/* border sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gm-600 transition-transform duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== GLOBAL ==== */}
      <section className="section bg-white">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-5">
              <SectionNo n="04" />
              <Eyebrow>Global Services</Eyebrow>
            </div>
            <LineHeading
              lines={['A complete Global', 'Business Consulting']}
              className="t-h2 mt-6 font-extrabold text-ink"
            />
            <p data-reveal className="sr-only">
              {globalPitch}
            </p>

            <ul data-stagger="0.06" className="mt-9 flex flex-wrap gap-2.5">
              {globalCapabilities.map((c) => (
                <li
                  key={c}
                  data-reveal
                  className="rounded-full border border-gm-100 bg-gm-50 px-4 py-2 text-[0.72rem] font-semibold tracking-wide text-gm-700"
                >
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <TextLink href="/global-services">Global Services</TextLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul data-stagger="0.07" className="grid gap-3 sm:grid-cols-2">
              {desks.map((d) => (
                <li key={d.href} data-reveal>
                  <Link
                    href={d.href}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper-2 px-6 py-5 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:border-gm-200 hover:bg-white hover:shadow-[0_20px_44px_-26px_rgba(15,26,38,.35)]"
                  >
                    <span className="flex items-center gap-4">
                      <span className="t-num t-spaced !text-[0.66rem] text-gm-400">
                        {d.code}
                      </span>
                      <span className="text-[1.05rem] font-bold tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                        {d.label}
                      </span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-gm-600 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:border-gm-600 group-hover:bg-gm-600 group-hover:text-white">
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================== PARTNERS === */}
      <section className="section bg-paper-2">
        <div className="shell">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-5">
                <SectionNo n="05" />
                <Eyebrow>Our Team</Eyebrow>
              </div>
              <LineHeading
                lines={['Our Partners']}
                className="t-h2 mt-6 font-extrabold text-ink"
              />
            </div>
            <TextLink href="/partners">Our Partners</TextLink>
          </div>

          <div
            data-stagger="0.06"
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {partners.slice(0, 8).map((p) => (
              <Link
                key={p.name}
                href={p.href || '/partners'}
                data-reveal
                className="card-lift group overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gm-50">
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    className="zoom-img object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-gm-950/75 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[0.92rem] font-bold leading-snug tracking-tight text-ink transition-colors duration-400 group-hover:text-gm-700">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[0.78rem] text-muted">{p.designation}</p>
                  <p className="mt-0.5 text-[0.78rem] text-gm-600">
                    {p.qualifications}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CityMarquee />
      <ContactCta />
    </>
  )
}
