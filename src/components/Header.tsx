'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { nav, type NavItem } from '@/content'
import { site } from '@/lib/site'
import { Arrow } from './ui'

function isActive(pathname: string, item: NavItem): boolean {
  if (!item.href) {
    return (item.children ?? []).some((c) => isActive(pathname, c))
  }
  if (item.href === '/') return pathname === '/'
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

/* ------------------------------------------------------------- desktop */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-2.5 w-2.5 shrink-0 transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  )
}

/** Services gets a full-width mega panel; everything else a simple column. */
function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const cols = item.children ?? []
  const wide = cols.some((c) => (c.children?.length ?? 0) > 0)

  if (!wide) {
    return (
      <ul className="w-[19rem] p-2.5">
        {cols.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href ?? '#'}
              onClick={onNavigate}
              className="group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[0.9rem] text-body transition-colors duration-300 hover:bg-gm-50 hover:text-gm-800"
            >
              <span>{c.label}</span>
              <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    // CSS columns rather than a grid: one very long service group would
    // otherwise set the row height and strand the shorter groups beside it.
    <div className="w-[min(62rem,88vw)] columns-3 gap-x-10 p-9">
      {cols.map((c) => (
        <div key={c.label} className="mb-8 break-inside-avoid last:mb-0">
          {c.href ? (
            <Link
              href={c.href}
              onClick={onNavigate}
              className="group mb-3 flex items-start gap-2 text-[0.82rem] font-bold leading-snug tracking-tight text-ink transition-colors hover:text-gm-600"
            >
              <span className="link-underline">{c.label}</span>
            </Link>
          ) : (
            <p className="mb-3 text-[0.82rem] font-bold leading-snug tracking-tight text-ink">
              {c.label}
            </p>
          )}
          <span className="mb-3 block h-px w-8 bg-gm-200" />
          <ul className="space-y-1.5">
            {(c.children ?? []).map((g) => (
              <li key={g.label}>
                <Link
                  href={g.href ?? '#'}
                  onClick={onNavigate}
                  className="block text-[0.82rem] leading-relaxed text-muted transition-colors duration-300 hover:text-gm-700"
                >
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- mobile */
function MobileItem({
  item,
  depth,
  onNavigate,
}: {
  item: NavItem
  depth: number
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const kids = item.children ?? []
  const pad = ['pl-0', 'pl-4', 'pl-8'][Math.min(depth, 2)]

  if (!kids.length) {
    return (
      <Link
        href={item.href ?? '#'}
        onClick={onNavigate}
        className={`block border-b border-line/70 py-3.5 text-[0.95rem] text-body transition-colors hover:text-gm-700 ${pad}`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className={`border-b border-line/70 ${pad}`}>
      <div className="flex items-center justify-between">
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            className="flex-1 py-3.5 text-[0.95rem] font-semibold text-ink"
          >
            {item.label}
          </Link>
        ) : (
          <span className="flex-1 py-3.5 text-[0.95rem] font-semibold text-ink">
            {item.label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
          className="grid h-10 w-10 shrink-0 place-items-center text-gm-600"
        >
          <Chevron open={open} />
        </button>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-1">
            {kids.map((k) => (
              <MobileItem
                key={k.label}
                item={k}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- header */
export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const overlay = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenKey(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenKey(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const solid = scrolled || !overlay || openKey !== null

  const hoverOpen = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenKey(label)
  }
  const hoverClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 140)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gm-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          solid
            ? 'border-b border-line/80 bg-white/90 backdrop-blur-xl'
            : 'border-b border-white/10 bg-transparent'
        }`}
        onMouseLeave={hoverClose}
      >
        {/* utility bar — the firm's published phone and email */}
        <div
          className={`hidden overflow-hidden border-b transition-all duration-500 lg:block ${
            scrolled
              ? 'max-h-0 border-transparent opacity-0'
              : `max-h-12 opacity-100 ${solid ? 'border-line/70' : 'border-white/15'}`
          }`}
        >
          <div className="shell flex items-center justify-end gap-7 py-2 text-[0.76rem]">
            <a
              href={`tel:${site.phones[0].replace(/[^+\d]/g, '')}`}
              className={`link-underline transition-colors ${
                solid ? 'text-muted hover:text-gm-700' : 'text-white/80 hover:text-white'
              }`}
            >
              {site.phoneLine}
            </a>
            <a
              href={`mailto:${site.email}`}
              className={`link-underline transition-colors ${
                solid ? 'text-muted hover:text-gm-700' : 'text-white/80 hover:text-white'
              }`}
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="shell flex items-center justify-between gap-6 py-3.5">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center"
            aria-label={`${site.name} — home`}
          >
            <span
              className={`inline-flex items-center rounded-xl transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                solid ? '' : 'bg-white/95 px-3 py-1.5 shadow-[0_6px_18px_-8px_rgba(6,25,42,.6)]'
              }`}
            >
              <Image
                src={site.logo}
                alt={site.name}
                width={210}
                height={54}
                priority
                className="h-8 w-auto md:h-10"
              />
            </span>
          </Link>

          {/* ------------------------------------------------ desktop nav */}
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(pathname, item)
                const open = openKey === item.label
                const hasKids = (item.children?.length ?? 0) > 0
                const wide = (item.children ?? []).some(
                  (c) => (c.children?.length ?? 0) > 0,
                )
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => hasKids && hoverOpen(item.label)}
                  >
                    <Link
                      href={item.href ?? '#'}
                      onClick={(e) => {
                        if (!item.href) e.preventDefault()
                      }}
                      aria-expanded={hasKids ? open : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`group relative flex items-center gap-1.5 px-3.5 py-2.5 text-[0.82rem] font-medium tracking-tight transition-colors duration-300 ${
                        solid
                          ? active
                            ? 'text-gm-700'
                            : 'text-body hover:text-gm-700'
                          : active
                            ? 'text-white'
                            : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {item.label}
                      {hasKids && <Chevron open={open} />}
                      {/* animated underline / active indicator */}
                      <span
                        className={`pointer-events-none absolute inset-x-3.5 bottom-1 h-px origin-left bg-current transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
                          active || open
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>

                    {hasKids && (
                      <div
                        onMouseEnter={() => hoverOpen(item.label)}
                        className={`absolute top-full z-40 pt-3 ${
                          wide
                            ? 'left-1/2 -translate-x-1/2'
                            : 'left-1/2 -translate-x-1/2'
                        } ${open ? '' : 'pointer-events-none'}`}
                      >
                        <div
                          className={`origin-top overflow-hidden rounded-2xl border border-line bg-white shadow-[0_36px_80px_-30px_rgba(15,26,38,.35)] transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
                            open
                              ? 'translate-y-0 scale-100 opacity-100'
                              : '-translate-y-2 scale-[.98] opacity-0'
                          }`}
                        >
                          <MegaPanel item={item} onNavigate={() => setOpenKey(null)} />
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ------------------------------------------------- mobile btn */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border transition-colors duration-400 xl:hidden ${
              solid || mobileOpen
                ? 'border-line text-ink hover:border-gm-300'
                : 'border-white/30 text-white'
            }`}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-[1.5px] w-full origin-center bg-current transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileOpen ? 'scale-x-0 opacity-0' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-full origin-center bg-current transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {/* scroll progress */}
        <span
          data-progress
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gm-600"
        />
      </header>

      {/* --------------------------------------------------- mobile panel */}
      <div
        className={`fixed inset-0 z-40 xl:hidden ${
          mobileOpen ? '' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <nav
          aria-label="Mobile"
          className={`absolute right-0 top-0 h-full w-[min(26rem,92vw)] overflow-y-auto overscroll-contain bg-white pb-16 pt-28 shadow-2xl transition-transform duration-600 ease-[cubic-bezier(.22,1,.36,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-6">
            {nav.map((item) => (
              <MobileItem
                key={item.label}
                item={item}
                depth={0}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}

            <div className="mt-8 space-y-2 rounded-2xl bg-gm-50 p-5">
              <p className="t-spaced text-gm-600">Contact Us</p>
              <a
                href={`tel:${site.phones[0].replace(/[^+\d]/g, '')}`}
                className="block text-sm text-body"
              >
                {site.phoneLine}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="block text-sm font-semibold text-gm-700"
              >
                {site.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
