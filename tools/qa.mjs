import { chromium } from 'playwright'

const BASE = 'http://localhost:4321'
const WIDTHS = [1920, 1440, 1366, 1280, 1024, 768, 480, 390, 375]
const PAGES = [
  '/', '/about', '/about/the-firm', '/partners', '/partners/ca-easwara-pillai',
  '/services', '/services/tax-consulting', '/services/tax-consulting/direct-tax',
  '/global-services', '/global-services/usa-desk', '/legal-desk',
  '/legal-opinion-desk', '/contact', '/sectors', '/blog', '/knowledge-pool',
  '/events', '/international-desk',
]

const browser = await chromium.launch()
const problems = []

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 844 : 900 } })
  for (const path of PAGES) {
    const page = await ctx.newPage()
    page.on('pageerror', (e) => problems.push(`JS  ${path} @${w}: ${e.message}`))
    page.on('console', (m) => { if (m.type() === 'error') problems.push(`CON ${path} @${w}: ${m.text()}`) })
    try {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(700)
      const r = await page.evaluate(() => {
        const d = document.documentElement
        const over = d.scrollWidth - d.clientWidth
        // find any element sticking out past the viewport
        let culprit = null
        if (over > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const b = el.getBoundingClientRect()
            if (b.right > d.clientWidth + 2 && b.width > 0 && b.height > 0) {
              culprit = el.tagName + '.' + (el.className.toString().slice(0, 40) || '')
              break
            }
          }
        }
        return { over, culprit }
      })
      if (r.over > 1) problems.push(`OVF ${path} @${w}px: +${r.over}px  ${r.culprit ?? ''}`)
    } catch (e) {
      problems.push(`ERR ${path} @${w}: ${e.message.slice(0, 80)}`)
    }
    await page.close()
  }
  await ctx.close()
  console.log(`checked ${w}px`)
}

// reduced motion: nothing may stay hidden
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
for (const path of ['/', '/about', '/services', '/contact']) {
  const page = await rm.newPage()
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(1200)
  const hidden = await page.evaluate(() => {
    let n = 0
    document.querySelectorAll('[data-reveal], .gm-line-inner').forEach((el) => {
      const cs = getComputedStyle(el)
      if (parseFloat(cs.opacity) < 0.9 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)')) n++
    })
    return { n, animClass: document.documentElement.classList.contains('gm-anim') }
  })
  if (hidden.n > 0) problems.push(`RM  ${path}: ${hidden.n} elements still hidden under prefers-reduced-motion`)
  console.log(`reduced-motion ${path}: ${hidden.n} hidden, gm-anim=${hidden.animClass}`)
  await page.close()
}
await rm.close()

// heading hierarchy + alt text
const a11y = await browser.newContext({ viewport: { width: 1440, height: 900 } })
for (const path of ['/', '/about', '/services/tax-consulting/direct-tax', '/contact', '/partners/ca-easwara-pillai']) {
  const page = await a11y.newPage()
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(500)
  const res = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1])
    const imgs = [...document.querySelectorAll('img')].filter(i => i.alt === null || i.alt === undefined)
    let jumps = []
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) jumps.push(`${hs[i-1]}->${hs[i]}`)
    return { h1: hs.filter(x => x === 1).length, jumps, missingAlt: imgs.length, total: hs.length }
  })
  if (res.h1 !== 1) problems.push(`A11Y ${path}: ${res.h1} <h1> elements (expected 1)`)
  if (res.missingAlt) problems.push(`A11Y ${path}: ${res.missingAlt} img without alt`)
  console.log(`a11y ${path}: h1=${res.h1} headings=${res.total} jumps=${res.jumps.join(',') || 'none'}`)
  await page.close()
}
await a11y.close()

await browser.close()
console.log('\n================ PROBLEMS ================')
console.log(problems.length ? [...new Set(problems)].join('\n') : '  none')
