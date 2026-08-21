import { TextLink } from './ui'

/**
 * Some sections of the current site have no published entries yet. Rather than
 * invent articles, we present an honest, well-designed placeholder that keeps
 * the visitor moving.
 */
export default function EmptyState({
  message,
  links = [
    { label: 'Our Services', href: '/services' },
    { label: 'Contact Us', href: '/contact' },
  ],
}: {
  message: string
  links?: { label: string; href: string }[]
}) {
  return (
    <div
      data-reveal="scale"
      className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gm-200 bg-gm-50/60 px-8 py-16 text-center"
    >
      <span
        aria-hidden="true"
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-gm-500 ring-1 ring-gm-100"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10l2 2h6.5A1.5 1.5 0 0 1 20 7.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5Z" />
        </svg>
      </span>

      <p className="mt-6 text-[0.98rem] text-body">{message}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {links.map((l) => (
          <TextLink key={l.href} href={l.href}>
            {l.label}
          </TextLink>
        ))}
      </div>
    </div>
  )
}
