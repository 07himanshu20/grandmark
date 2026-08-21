import { chromium } from 'playwright'
const [url, selector, out] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110))
  }
})
await p.waitForTimeout(1400)
const el = await p.$(selector)
if (!el) { console.log('NOT FOUND', selector); process.exit(1) }
await el.scrollIntoViewIfNeeded()
await p.waitForTimeout(900)
await el.screenshot({ path: out })
console.log('saved', out)
await b.close()
