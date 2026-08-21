import Link from 'next/link'
import { Arrow } from '@/components/ui'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[76svh] items-center overflow-hidden bg-gm-950 pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(56rem 30rem at 20% 10%, rgba(47,118,176,.4), transparent 62%)',
        }}
      />
      <div className="shell relative">
        <p className="t-spaced !tracking-[0.4em] text-gm-300">{site.shortSpaced}</p>
        <h1 className="t-display mt-6 text-white">Page not found</h1>
        <p className="mt-6 max-w-lg text-white/60">
          The page you are looking for is not available. Please use the menu, or
          return to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gm-800 transition-all duration-500 hover:bg-gm-100"
          >
            Home
            <Arrow />
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:border-white hover:bg-white/10"
          >
            Contact Us
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
