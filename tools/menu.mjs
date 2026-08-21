import { chromium } from 'playwright'
const b = await chromium.launch()

// desktop mega menu
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:4321/about', { waitUntil: 'domcontentloaded', timeout: 45000 })
await p.waitForTimeout(1800)
await p.hover('nav[aria-label="Primary"] >> text=Services')
await p.waitForTimeout(900)
await p.screenshot({ path: '/tmp/gmshots/mega.png' })
console.log('mega menu saved')

// mobile drawer
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await m.goto('http://localhost:4321/about', { waitUntil: 'domcontentloaded', timeout: 45000 })
await m.waitForTimeout(1800)
await m.click('button[aria-label="Open menu"]')
await m.waitForTimeout(800)
await m.click('button[aria-label="Expand Services"]')
await m.waitForTimeout(900)
await m.screenshot({ path: '/tmp/gmshots/drawer.png' })
console.log('mobile drawer saved')
await b.close()
