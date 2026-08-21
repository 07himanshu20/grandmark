'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { homeHeading, site } from '@/lib/site'
import { slides as heroSlides } from '@/content'
import { Arrow } from './ui'

const HEAD = ['Now we have presence in', '14 Cities Across India']

/** Figures shown under the headline — each is stated on the firm's own site. */
const FACTS = [
  { v: '1991', k: 'Present since' },
  { v: '18', k: 'Partners' },
  { v: '14', k: 'Offices across India' },
]

/** The home page's own "Learn More" destinations, kept intact. */
const LEARN = [
  { label: 'About G R A N D M A R K', href: '/about/the-firm' },
  { label: 'Our Partners', href: '/partners' },
  { label: 'Our Offices', href: '/contact' },
]

export default function Hero() {
  const [i, setI] = useState(0)
  const [ready, setReady] = useState(false)
  const paused = useRef(false)

  useEffect(() => {
    // hold the entrance for a beat so the reveal reads as deliberate
    const t = window.setTimeout(() => setReady(true), 90)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (!paused.current) setI((v) => (v + 1) % heroSlides.length)
    }, 6200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-gm-950 pb-14 pt-40 md:pb-20"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      aria-label="Introduction"
    >
      {/* ------------------------------------------------ photograph stack */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {heroSlides.map((s, idx) => (
          <div
            key={s.img}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ opacity: idx === i ? 1 : 0 }}
          >
            <Image
              src={s.img}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className="scale-105 object-cover"
              style={{
                transform: idx === i ? 'scale(1.1)' : 'scale(1.02)',
                transition: 'transform 8s linear',
                filter: 'blur(3px) saturate(1.05)',
              }}
            />
          </div>
        ))}
        {/* readability + brand wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(6,25,42,.96) 0%, rgba(8,33,55,.93) 45%, rgba(6,25,42,.86) 78%, rgba(6,25,42,.8) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(58rem 34rem at 78% 78%, rgba(47,118,176,.34), transparent 66%)',
          }}
        />
        {/* vertical rules — a quiet echo of the letter-spaced wordmark */}
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
            backgroundSize: '7.5rem 100%',
          }}
        />
      </div>

      <div className="shell relative">
        {/* ---------------------------------------------------- wordmark */}
        <span
          className={`t-spaced !tracking-[0.42em] block text-gm-300 transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          {site.spacedName}
        </span>

        {/* ---------------------------------------------------- headline */}
        <h1 className="t-display mt-7 max-w-[16ch] text-white">
          <span className="sr-only">{homeHeading}</span>
          {HEAD.map((line, idx) => (
            <span key={line} className="gm-line-mask" aria-hidden="true">
              <span
                className="block transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)]"
                style={{
                  transform: ready ? 'translate3d(0,0,0)' : 'translate3d(0,105%,0)',
                  transitionDelay: `${170 + idx * 105}ms`,
                }}
              >
                {idx === 1 ? (
                  <>
                    <span className="text-gm-300">14 Cities</span> Across India
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        {/* -------------------------------------------------- key figures */}
        <div
          className={`mt-11 flex flex-wrap items-end gap-x-12 gap-y-6 transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '520ms' }}
        >
          {FACTS.map((f) => (
            <div key={f.k}>
              <p className="t-num font-display text-4xl font-extrabold leading-none text-white md:text-5xl">
                {f.v}
              </p>
              <p className="mt-2 text-[0.78rem] tracking-wide text-white/55">
                {f.k}
              </p>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------- learn more */}
        <div
          className={`mt-11 flex flex-wrap items-center gap-x-3 gap-y-3 transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '660ms' }}
        >
          {LEARN.map((l, idx) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                idx === 0
                  ? 'bg-white text-gm-800 hover:bg-gm-100'
                  : 'border border-white/25 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              {l.label}
              <Arrow />
            </Link>
          ))}
        </div>

        {/* --------------------------------------------- slide switcher */}
        <div
          className={`mt-14 transition-all duration-1000 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '820ms' }}
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-white/12 pt-5">
            {heroSlides.map((s, idx) => (
              <button
                key={s.img}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show ${s.label}`}
                aria-current={idx === i}
                className={`group relative px-3 py-2 text-left text-[0.72rem] leading-tight transition-colors duration-400 ${
                  idx === i ? 'text-white' : 'text-white/40 hover:text-white/75'
                }`}
              >
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{idx + 1}</span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -top-[21px] h-[2px] origin-left bg-gm-300 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                    idx === i ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- scroll hint */}
      <span
        aria-hidden="true"
        className={`absolute bottom-7 right-6 hidden items-center gap-3 text-[0.68rem] tracking-[0.24em] text-white/35 lg:flex ${
          ready ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}
        style={{ transitionDelay: '1000ms' }}
      >
        SCROLL
        <span className="relative block h-10 w-px overflow-hidden bg-white/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[gmScroll_2.2s_ease-in-out_infinite] bg-gm-300" />
        </span>
      </span>

      <style jsx>{`
        @keyframes gmScroll {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(300%);
          }
        }
      `}</style>
    </section>
  )
}
