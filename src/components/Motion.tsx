'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'

/**
 * A single scroll-motion engine for the whole site.
 *
 * Rather than wrapping every element in a component, it scans the page for
 * data attributes and wires the matching effect. Each section therefore gets a
 * coordinated sequence (heading lines -> supporting copy -> media -> cards)
 * from ordinary markup.
 *
 * If the visitor prefers reduced motion, nothing here runs at all and the
 * `gm-anim` class is never applied, so every element renders in its final
 * state.
 */
export default function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.documentElement.classList.remove('gm-anim')
      return
    }

    document.documentElement.classList.add('gm-anim')

    // ---------------------------------------------------- smooth scrolling
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // -------------------------------------------------- heading lines
      // Each line sits in an overflow-hidden frame and slides up into place.
      gsap.utils.toArray<HTMLElement>('.gm-lines').forEach((group) => {
        const lines = group.querySelectorAll('.gm-line-inner')
        if (!lines.length) return
        gsap.to(lines, {
          y: '0%',
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.085,
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        })
      })

      // ------------------------------------------------- generic reveals
      // Anything inside a [data-stagger] parent is left alone here — that
      // parent drives its own children as one cascade.
      gsap.utils
        .toArray<HTMLElement>('[data-reveal]')
        .filter((el) => !el.parentElement?.closest('[data-stagger]'))
        .forEach((el) => {
          const delay = parseFloat(el.dataset.delay || '0')
          gsap.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.95,
            ease: EASE,
            delay,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

      // ---------------------------------------------- staggered children
      // A [data-stagger] parent animates its [data-reveal] children in
      // sequence, which is what gives card grids their cascade.
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((parent) => {
        const kids = parent.querySelectorAll<HTMLElement>('[data-reveal]')
        if (!kids.length) return
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: EASE,
          stagger: parseFloat(parent.dataset.stagger || '0.09'),
          scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
        })
      })

      // -------------------------------------------------- image reveals
      // The frame wipes open from the bottom while the photo inside eases
      // back from a slight over-scale — the two together read as one move.
      gsap.utils.toArray<HTMLElement>('.gm-imgmask').forEach((frame) => {
        const inner = frame.firstElementChild
        const tl = gsap.timeline({
          scrollTrigger: { trigger: frame, start: 'top 86%', once: true },
        })
        tl.to(frame, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.15,
          ease: 'power4.inOut',
        })
        if (inner) {
          tl.to(inner, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0.1)
        }
      })

      // ------------------------------------------------------- parallax
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || '12')
        gsap.fromTo(
          el,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // ------------------------------------------------------- counters
      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
        const end = parseFloat(el.dataset.counter || '0')
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            const n = Math.round(obj.v)
            // years must not be grouped ("1991", never "1,991")
            el.textContent =
              el.dataset.counterFormat === 'plain' ? String(n) : n.toLocaleString('en-IN')
          },
        })
      })

      // -------------------------------------------------------- marquee
      gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((track) => {
        const speed = parseFloat(track.dataset.marquee || '38')
        const half = track.scrollWidth / 2
        if (half <= 0) return
        gsap.to(track, {
          x: -half,
          duration: speed,
          ease: 'none',
          repeat: -1,
          modifiers: { x: (x) => `${parseFloat(x) % half}px` },
        })
      })

      // ------------------------------------------- scroll progress bar
      const bar = document.querySelector<HTMLElement>('[data-progress]')
      if (bar) {
        gsap.to(bar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.25 },
        })
      }
    })

    // Trigger positions are measured from layout, so they must be recomputed
    // once late-arriving fonts and images have settled — otherwise a section
    // can be scrolled past while its trigger still points at a stale offset.
    const refresh = () => ScrollTrigger.refresh()
    const settle = window.setTimeout(refresh, 320)
    window.addEventListener('load', refresh)

    document.fonts?.ready.then(refresh).catch(() => {})

    const pending = Array.from(document.images).filter((img) => !img.complete)
    let left = pending.length
    const onImg = () => {
      if (--left <= 0) refresh()
    }
    pending.forEach((img) => {
      img.addEventListener('load', onImg, { once: true })
      img.addEventListener('error', onImg, { once: true })
    })

    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('load', refresh)
      ctx.revert()
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pathname])

  return null
}
