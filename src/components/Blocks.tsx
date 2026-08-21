import Image from 'next/image'
import type { Block } from '@/content'

/** A tick marker used for every service capability list. */
function Tick() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.45rem] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gm-50 text-gm-600 ring-1 ring-gm-100 transition-colors duration-400 group-hover/li:bg-gm-600 group-hover/li:text-white group-hover/li:ring-gm-600"
    >
      <svg
        viewBox="0 0 12 12"
        className="h-2.5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 6.2 5 8.6l4.5-5" />
      </svg>
    </span>
  )
}

/**
 * Renders the firm's page content verbatim. Only the presentation changes:
 * headings become section rules, and capability lists become ticked grids.
 */
export default function Blocks({
  blocks,
  className = '',
}: {
  blocks: Block[]
  className?: string
}) {
  if (!blocks.length) return null

  return (
    <div className={`space-y-10 ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul
              key={i}
              data-stagger="0.05"
              className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2"
            >
              {b.items.map((it, j) => (
                <li
                  key={j}
                  data-reveal
                  className="group/li flex items-start gap-3.5 text-[0.97rem] leading-relaxed text-body"
                >
                  <Tick />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (b.type === 'img') {
          return (
            <figure key={i} className="gm-imgmask overflow-hidden rounded-2xl">
              <Image
                src={b.src}
                alt=""
                width={1200}
                height={760}
                className="h-auto w-full object-cover"
              />
            </figure>
          )
        }

        if (b.type === 'h2') {
          return (
            <div key={i} data-reveal className="pt-4">
              <span className="mb-4 block h-px w-10 bg-gm-300" />
              <h2 className="t-h3 font-bold text-ink">{b.text}</h2>
            </div>
          )
        }

        if (b.type === 'h3' || b.type === 'h4') {
          // rendered as <h2>: these sit directly under the page <h1>, so
          // emitting <h3> here would skip a heading level
          return (
            <h2
              key={i}
              data-reveal
              className="pt-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-gm-700"
            >
              {b.text}
            </h2>
          )
        }

        if (b.type === 'h5' || b.type === 'h6' || b.type === 'h1') {
          return (
            <h3 key={i} data-reveal className="t-h3 font-bold text-ink">
              {b.text}
            </h3>
          )
        }

        // Plain paragraph. Lines that were authored with a literal bullet
        // glyph are normalised into real list items upstream, so nothing here
        // needs to special-case markers.
        return (
          <p key={i} data-reveal className="text-[1.02rem] leading-[1.75] text-body">
            {b.text}
          </p>
        )
      })}
    </div>
  )
}
