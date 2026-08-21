'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      aria-label="Back to top"
      className={`group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gm-600 text-white shadow-[0_16px_32px_-12px_rgba(24,89,135,.8)] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-gm-700 ${
        show
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-400 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 16V4M5 9l5-5 5 5" />
      </svg>
    </button>
  )
}
