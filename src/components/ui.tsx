import Link from 'next/link'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ arrow */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`arrow-move h-[1em] w-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  )
}

/* ------------------------------------------------------------- eyebrow */
export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`eyebrow t-spaced ${className}`} data-reveal="fade">
      {children}
    </span>
  )
}

/* ------------------------------------------------ line-masked heading */
/**
 * Renders each supplied string as its own clipped line so the motion engine
 * can slide them up in sequence. Lines are explicit rather than measured, so
 * the server and client always agree on the markup.
 */
export function LineHeading({
  lines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
}) {
  return (
    <Tag className={`gm-lines ${className}`}>
      {lines.map((l, i) => (
        <span className="gm-line-mask" key={i}>
          <span className="gm-line-inner">{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/* -------------------------------------------------------------- buttons */
type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  className?: string
}

export function Button({
  href,
  children,
  variant = 'solid',
  className = '',
}: BtnProps) {
  const base =
    'group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]'
  const styles = {
    solid:
      'bg-gm-600 text-white hover:bg-gm-700 hover:shadow-[0_18px_36px_-14px_rgba(24,89,135,.7)]',
    outline:
      'border border-gm-200 text-gm-700 hover:border-gm-600 hover:bg-gm-600 hover:text-white',
    ghost: 'text-gm-700 hover:text-gm-900 px-0',
  }[variant]

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
      <Arrow />
    </Link>
  )
}

/** Text link with the sweeping underline used throughout the site. */
export function TextLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold text-gm-600 transition-colors hover:text-gm-800 ${className}`}
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
  )
}

/* --------------------------------------------------------------- rule */
export function Rule({ className = '' }: { className?: string }) {
  return <span className={`block h-px w-full bg-line ${className}`} />
}

/* ------------------------------------------------- section number tag */
export function SectionNo({ n }: { n: string }) {
  return (
    <span className="t-num t-spaced text-gm-400" aria-hidden="true">
      {n}
    </span>
  )
}
