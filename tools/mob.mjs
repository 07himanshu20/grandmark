import { chromium } from 'playwright'
const [url, out, ...ys] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.waitForTimeout(1500)
await p.evaluate(async () => {
  let y = 0
  while (y < document.body.scrollHeight) { window.scrollTo(0, y); await new Promise(r=>setTimeout(r,150)); y += 500 }
})
await p.waitForTimeout(800)
for (const y of ys) {
  await p.evaluate((yy) => window.scrollTo(0, Number(yy)), y)
  await p.waitForTimeout(700)
  await p.screenshot({ path: `${out}-${y}.png` })
  console.log('saved', `${out}-${y}.png`)
}
await b.close()
