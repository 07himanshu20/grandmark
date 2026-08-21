import Link from 'next/link'
import Image from 'next/image'
import {
  site,
  footerIntro,
  footerLinks,
  footerLinksTitle,
  footerPresence,
  cities,
} from '@/lib/site'
import { Arrow, TextLink } from './ui'
import { serviceIndex } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gm-950 text-white/70">
      {/* soft blue wash so the panel reads as brand, not flat black */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(80rem 40rem at 12% 0%, rgba(24,89,135,.55), transparent 60%), radial-gradient(60rem 34rem at 92% 8%, rgba(47,118,176,.32), transparent 62%)',
        }}
      />

      <div className="shell relative">
        {/* ------------------------------------------------------- top */}
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center rounded-xl bg-white px-4 py-2.5">
              <Image
                src={site.logo}
                alt={site.name}
                width={230}
                height={58}
                className="h-9 w-auto"
              />
            </span>
            <div className="mt-7 space-y-1.5 text-[0.95rem] leading-relaxed text-white/65">
              {footerIntro.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-gm-200"
              >
                <span className="link-underline">Read more…</span>
                <Arrow />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="t-spaced mb-6 text-gm-300">{footerLinksTitle}</h2>
            <ul className="space-y-3">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="link-underline">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="t-spaced mb-6 text-gm-300">Services</h2>
            <ul className="space-y-3">
              {serviceIndex.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-[0.95rem] leading-snug text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="link-underline">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------- contact */}
        <div className="grid gap-10 border-t border-white/10 py-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="t-spaced mb-5 text-gm-300">Contact Us</h2>
            <p className="text-lg font-semibold tracking-tight text-white">
              {site.phoneLine}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-block text-[0.95rem] text-white/70 transition-colors hover:text-white"
            >
              <span className="link-underline">{site.email}</span>
            </a>
          </div>

          <div className="lg:col-span-7">
            <h2 className="t-spaced mb-5 text-gm-300">{footerPresence}</h2>
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {cities.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-white/12 px-3.5 py-1.5 text-[0.72rem] tracking-wide text-white/60 transition-colors duration-300 hover:border-gm-400/60 hover:text-white"
                >
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
              <TextLink href="/contact" className="!text-gm-200 hover:!text-white">
                Our Offices
              </TextLink>
              <TextLink href="/partners" className="!text-gm-200 hover:!text-white">
                Our Partners
              </TextLink>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------- bottom */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-7 text-[0.8rem] text-white/45 sm:flex-row sm:items-center">
          <p>{site.copyright}</p>
          <p className="t-spaced !tracking-[0.3em] text-white/30">
            {site.shortSpaced}
          </p>
        </div>
      </div>
    </footer>
  )
}
