# GRANDMARK & ASSOCIATES — website redesign

A front-end rebuild of [grandmarkca.com](https://www.grandmarkca.com/) as a
modern Next.js application. **The firm's content is preserved verbatim** — only
the visual design, layout, motion and interaction are new. No WordPress.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), fully static |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Fonts | Plus Jakarta Sans (display) + Inter (body), self-hosted via `next/font` |

## Running it

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static production build
npm start
```

## How content works

Nothing is hand-typed. All 70 pages were scraped from the live site and
compiled into `src/content/data.json`, which the app renders. The pipeline
lives in `tools/`:

```
tools/parse.py          rendered HTML  ->  structured blocks
tools/build_content.py  blocks         ->  partners, offices, profiles
tools/gen.py            everything     ->  src/content/data.json
```

`src/content/index.ts` is the typed accessor layer over that data.

Two normalisations happen once, in the parser, and therefore apply to every
page rather than being patched per template:

- **Unbalanced markup.** The old theme emitted list wrappers containing stray
  `<p>` tags, so logical lines are split on paragraph boundaries as well as
  `<br>`.
- **Bullet glyphs.** List markers were authored as literal characters
  (`⇒ Registration of Companies`, `• Handled 50 assignments`). A marker is
  presentation, not content, so it is stripped and the line promoted to a real
  list item — which is why the rebuild never shows a doubled bullet.

## Design system

Anchored on the firm's own brand blue, `#185987`, extended into a full scale in
`src/app/globals.css`. Light theme throughout: white and off-white surfaces,
blue reserved for emphasis and interaction.

The firm writes its own name letter-spaced (`G R A N D M A R K`), so wide
tracking became the identity motif — section eyebrows, the footer wordmark and
the faint vertical rules behind each masthead all echo it.

## Motion

One engine, `src/components/Motion.tsx`, scans for data attributes rather than
requiring every element to be wrapped in a component:

| Attribute | Effect |
|---|---|
| `.gm-lines` / `.gm-line-inner` | headline lines slide up out of a clipping mask |
| `[data-reveal]` | fade + rise (`fade`, `right`, `scale` variants) |
| `[data-stagger]` | children cascade in sequence |
| `.gm-imgmask` | frame wipes open while the photo settles from over-scale |
| `[data-counter]` | count-up; `data-counter-format="plain"` for years |
| `[data-parallax]` | scroll-linked drift |
| `[data-marquee]` | seamless infinite marquee |
| `[data-progress]` | scroll progress bar |

Elements are hidden **only** when JS is driving them (`html.gm-anim`), so the
page stays fully readable if JS fails. Under `prefers-reduced-motion` the class
is never applied, no animation runs, and every element renders in its final
state.

## Masthead imagery

Hero images are resolved, not hand-assigned — see `src/lib/routes.ts`:

1. Art direction (a handful of deliberate editorial choices).
2. The firm's own home-slider pairing of banner → service, read from the source.
3. The page's own imagery.
4. The firm's flagship banner.

Every candidate must pass `fillsAMasthead`, which checks the file's **measured**
dimensions (recorded in `data.json` at build time). That is what stops a
300×180 flag, a 263×263 headshot or a 657×137 logo from being stretched across
a full-bleed banner — no filename rules and no per-route exception list.
`PageHero` resolves its own image from the route, so a page cannot ship without
a masthead by forgetting to pass one.

## Verification

```bash
node tools/qa.mjs          # 9 breakpoints x 18 pages: overflow, JS errors,
                           # reduced-motion, heading order, alt text
python3 tools/fidelity.py  # every scraped string still present in the rebuild
python3 tools/linkcheck.py # broken links, missing images, thin pages
node tools/shot.mjs        # screenshots to /tmp/gmshots
```

The dev server must be running for all four.

## Defects found in the current live site

Carried over faithfully where they are content, corrected where they are plain
errors — worth fixing at source:

- **Two partner profiles have a wrong `mailto:`.** Suraj Singh Rajawat's and
  Suryanarayana Malapaka's profile pages both link to `abhishek@grandmarkca.com`
  while *displaying* their own addresses. The rebuild uses the displayed
  address.
- **Typos in service card titles** — "VALUTIONS", "FINANCIAL RESTRUCTING",
  "IND-AS IMPLEMENTATIOM". Preserved exactly as published; only the link
  destinations were resolved.
- **Inconsistent figures.** "More than 700 / 750 / 500 man-years"; "100 plus"
  experts on most pages but "400 plus" on Contact. Each page keeps its own
  wording.
- **A dead nav link.** "Corporate Law & Compliances" pointed at `?page_id=218`;
  it is now a dropdown parent over its two real children.
- **Hyderabad-2** is illustrated with a photograph of Ahmedabad.
- **Blog, Knowledge Pool and Events have no published entries.** They render an
  honest empty state rather than invented articles.
