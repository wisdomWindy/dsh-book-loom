import { chromium } from 'playwright-core'

const [baseUrl, token] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const context = await browser.newContext({ viewport: { width: 1200, height: 800 } })
const page = await context.newPage()
const traffic = []
page.on('response', (response) => {
  const url = response.url()
  if (/book|client|module|plugin/i.test(url)) traffic.push({ status: response.status(), url })
})
page.on('console', (message) => traffic.push({ console: message.type(), text: message.text() }))
await page.goto(`${baseUrl}/?token=${encodeURIComponent(token)}`, { waitUntil: 'domcontentloaded' })
for (let index = 0; index < 40; index += 1) {
  const button = page.getByRole('button', { name: '继续', exact: true })
  if (await button.count()) { await button.first().click(); break }
  await page.waitForTimeout(250)
}
await page.waitForTimeout(5000)
const state = await page.evaluate(() => ({
  title: document.title,
  text: document.body.innerText.slice(0, 3000),
  globals: Object.keys(window).filter((key) => /module|plugin/i.test(key)),
  loaderKeys: window.__ModuleLoader__ ? Object.keys(window.__ModuleLoader__) : [],
  buttons: [...document.querySelectorAll('button')].map((button) => ({ text: button.innerText, aria: button.getAttribute('aria-label'), title: button.getAttribute('title') })).filter((item) => item.text || item.aria || item.title).slice(0, 120),
  resources: performance.getEntriesByType('resource').map((entry) => entry.name).filter((url) => /book|client|module|plugin/i.test(url)),
}))
console.log(JSON.stringify({ traffic, state }, null, 2))
await browser.close()
