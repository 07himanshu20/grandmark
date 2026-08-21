import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const p = await ctx.newPage()
await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const h1 = document.querySelector('h1')
  const inner = h1.querySelectorAll('.gm-line-mask > span')
  const box = h1.getBoundingClientRect()
  return {
    gmAnim: document.documentElement.classList.contains('gm-anim'),
    h1Visible: box.height > 20 && box.top < window.innerHeight,
    lineTransforms: [...inner].map(s => getComputedStyle(s).transform),
    heroText: h1.innerText.replace(/\s+/g, ' ').trim().slice(0, 60),
  }
})
console.log(JSON.stringify(r, null, 1))
await p.screenshot({ path: '/tmp/gmshots/reduced-motion.png' })
await b.close()
