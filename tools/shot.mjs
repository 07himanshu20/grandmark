import { chromium } from 'playwright'

const BASE = 'http://localhost:4321'
const OUT = '/tmp/gmshots'

const targets = process.argv[2]
  ? JSON.parse(process.argv[2])
  : [
      ['home', '/', 1440],
      ['services', '/services', 1440],
      ['service-detail', '/services/tax-consulting/direct-tax', 1440],
      ['about', '/about', 1440],
      ['partners', '/partners', 1440],
      ['profile', '/partners/ca-easwara-pillai', 1440],
      ['global', '/global-services', 1440],
      ['legal', '/legal-desk', 1440],
      ['contact', '/contact', 1440],
      ['home-mobile', '/', 390],
      ['services-mobile', '/services', 390],
      ['contact-mobile', '/contact', 390],
    ]

const browser = await chromium.launch()
const errors = []

for (const [name, path, width] of targets) {
  const page = await browser.newPage({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 2,
  })
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${path} :: ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`${path} :: ${e.message}`))

  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 })
  // let entrance animations settle, then scroll through to trigger reveals
  await page.waitForTimeout(1400)
  await page.evaluate(async () => {
    // re-measure each step: images loading in changes the page height
    let y = 0
    while (y < document.body.scrollHeight) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 200))
      y += 500
    }
    await new Promise((r) => setTimeout(r, 1200))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 800))
  })
  await page.waitForTimeout(600)

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })

  // horizontal-overflow check
  const overflow = await page.evaluate(() => {
    const d = document.documentElement
    return d.scrollWidth > d.clientWidth ? d.scrollWidth - d.clientWidth : 0
  })
  if (overflow) errors.push(`${path} @${width}px :: horizontal overflow ${overflow}px`)

  console.log(`${name.padEnd(18)} ${path.padEnd(42)} ${width}px  ok`)
  await page.close()
}

await browser.close()
console.log('\n--- CONSOLE / PAGE ERRORS ---')
console.log(errors.length ? errors.join('\n') : '  none')
