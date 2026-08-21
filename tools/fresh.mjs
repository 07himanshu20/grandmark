import { chromium } from 'playwright'
const [url, w, out] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(w), height: Number(w) < 700 ? 844 : 900 }, deviceScaleFactor: 2 })
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.waitForTimeout(2500)
const st = await p.evaluate(() => {
  const h = document.querySelector('header')
  const logo = h?.querySelector('img')
  const btt = document.querySelector('button[aria-label="Back to top"]')
  return {
    scrollY: window.scrollY,
    headerBg: getComputedStyle(h).backgroundColor,
    logoFilter: logo ? getComputedStyle(logo).filter : null,
    bttOpacity: btt ? getComputedStyle(btt).opacity : null,
  }
})
console.log(JSON.stringify(st, null, 1))
await p.screenshot({ path: out })
console.log('saved', out)
await b.close()
