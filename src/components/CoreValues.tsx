/**
 * The firm's core values are written as an acrostic on its own site
 * ("W ork Ethics", "E mployees – Our most valuable asset"...). We keep the
 * wording exactly and let the leading letters carry the typographic weight.
 */
export default function CoreValues({
  values,
  heading = 'CORE VALUES',
}: {
  values: { letter: string; rest: string }[]
  heading?: string
}) {
  return (
    <section className="section-tight bg-gm-950 text-white">
      <div className="shell">
        <h2 className="t-spaced text-gm-300">{heading}</h2>

        <ul
          data-stagger="0.08"
          className="mt-10 grid gap-x-10 gap-y-2 md:grid-cols-2"
        >
          {values.map((v, i) => (
            <li
              key={i}
              data-reveal
              className="group flex items-baseline gap-5 border-b border-white/10 py-5"
            >
              <span className="sr-only">{v.letter + v.rest}</span>
              <span
                aria-hidden="true"
                className="font-display text-[2.6rem] font-extrabold leading-none text-gm-400 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:text-white"
              >
                {v.letter}
              </span>
              <span
                aria-hidden="true"
                className="text-[1.02rem] leading-snug text-white/75 transition-colors duration-400 group-hover:text-white"
              >
                {v.rest}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
