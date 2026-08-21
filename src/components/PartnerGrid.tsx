import Image from 'next/image'
import Link from 'next/link'
import { partners, type Partner } from '@/content'
import { Arrow } from './ui'

/** Premium people directory — one card per partner, details untouched. */
export default function PartnerGrid({
  limit,
  className = '',
  people,
}: {
  limit?: number
  className?: string
  /** defaults to the Partners page directory */
  people?: Partner[]
}) {
  const src = people ?? partners
  const list = limit ? src.slice(0, limit) : src

  return (
    <ul
      data-stagger="0.055"
      className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {list.map((p) => {
        const href = p.href || '/partners'
        return (
          <li key={p.name} data-reveal>
            <div className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
              <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-gm-50">
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="zoom-img object-cover object-top"
                />
                {/* details slide up over the photograph on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-gm-950 via-gm-950/45 to-transparent opacity-0 transition-opacity duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-white opacity-0 transition-all duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  {p.cardName && p.cardName !== p.name && (
                    <span className="block text-[0.8rem] font-semibold leading-snug">
                      {p.cardName}
                    </span>
                  )}
                  {p.cardRole && (
                    <span className="block text-[0.72rem] tracking-wide text-white/75">
                      {p.cardRole}
                    </span>
                  )}
                  <span className="mt-1.5 inline-flex items-center gap-2 text-[0.8rem] font-semibold">
                    View full profile
                    <Arrow />
                  </span>
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[0.95rem] font-bold leading-snug tracking-tight text-ink">
                  <Link
                    href={href}
                    className="transition-colors duration-400 hover:text-gm-700"
                  >
                    <span className="link-underline">{p.name}</span>
                  </Link>
                </h3>
                <p className="mt-1.5 text-[0.78rem] text-muted">{p.designation}</p>
                <p className="mt-0.5 text-[0.78rem] font-medium text-gm-600">
                  {p.qualifications}
                </p>
                <p className="mt-3 text-[0.74rem] text-muted">{p.memberSince}</p>

                <a
                  href={`mailto:${p.email}`}
                  className="mt-4 block break-all text-[0.74rem] text-body transition-colors duration-300 hover:text-gm-700"
                >
                  <span className="link-underline">{p.email}</span>
                </a>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
