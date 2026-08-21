import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4321/contact', { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.waitForTimeout(2000)

// scroll the way a person does, re-measuring as images load
await p.evaluate(async () => {
  let y = 0
  while (y < document.body.scrollHeight) {
    window.scrollTo(0, y)
    await new Promise(r => setTimeout(r, 200))
    y += 500
  }
  await new Promise(r => setTimeout(r, 1200))
})

const hidden = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const o = parseFloat(getComputedStyle(el).opacity)
    if (o < 0.9) out.push({
      tag: el.tagName,
      cls: el.className.toString().slice(0, 45),
      text: (el.textContent || '').trim().slice(0, 38),
      opacity: o,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    })
  })
  return { total: document.querySelectorAll('[data-reveal]').length, hidden: out, pageH: document.body.scrollHeight, scrollY: window.scrollY }
})
console.log(JSON.stringify(hidden, null, 1))
await b.close()
