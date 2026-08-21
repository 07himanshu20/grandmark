import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120))
  }
})
await p.waitForTimeout(1500)
const info = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('.gm-lines').forEach((el) => {
    const cs = getComputedStyle(el)
    const inner = el.querySelector('.gm-line-inner')
    const ics = inner ? getComputedStyle(inner) : null
    out.push({
      text: el.textContent.trim().slice(0, 42),
      color: cs.color,
      innerTransform: ics ? ics.transform : 'n/a',
      rect: JSON.stringify(el.getBoundingClientRect().toJSON()).slice(0, 60),
    })
  })
  return out
})
console.log(JSON.stringify(info, null, 1))
await b.close()
