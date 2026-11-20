import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const baseUrl = process.argv[2]
const token = process.argv[3]
const outputRoot = path.resolve(process.argv[4] || '.verification/ui')
if (!baseUrl || !token) throw new Error('usage: node scripts/verify-ui.mjs <baseUrl> <token> <outputRoot>')
await fs.mkdir(outputRoot, { recursive: true })

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await chromium.launch({ executablePath, headless: true })
const results = []

try {
  await verifyImportWorkflow()
  await captureLive({ width: 1440, height: 900 }, 'desktop-dark', 'dark')
  await captureLive({ width: 790, height: 900 }, 'tablet-light', 'light')
  await captureLive({ width: 360, height: 780 }, 'mobile-dark', 'dark')
  await verifyCanvasPerformance()
  await captureSynthetic('empty-state', { success: true, data: { books: [], jobs: [], capabilities: { formats: ['epub', 'markdown', 'txt', 'pdf'] } } })
  await captureSynthetic('error-state', { success: false, code: 'VERIFY_ERROR', message: 'Verification error state' }, 500)
} finally {
  await browser.close()
}

const report = { status: results.every((item) => item.status === 'PASS') ? 'PASS' : 'FAIL', results }
await fs.writeFile(path.join(outputRoot, 'ui-report.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (report.status !== 'PASS') process.exitCode = 1

async function verifyImportWorkflow() {
  const context = await browser.newContext({ viewport: { width: 1180, height: 820 }, colorScheme: 'dark', reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  try {
    await page.goto(`${baseUrl}/?token=${encodeURIComponent(token)}`, { waitUntil: 'domcontentloaded' })
    await openPanel(page)
    await page.locator('.bl-library').waitFor({ timeout: 15000 })
    await page.evaluate(async () => fetch('/api/dsh-book-loom/books', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ confirm: 'DELETE_ALL_BOOKLOOM_DATA' }) }))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await openPanel(page)
    await page.locator('.bl-file-input').first().setInputFiles(path.resolve('test/fixtures/release.md'))
    await page.locator('.bl-preview').waitFor({ timeout: 15000 })
    const initialRows = await page.locator('.bl-preview-row').count()
    await page.locator('.bl-preview-row').nth(1).getByTitle('与上一章合并').click()
    await page.waitForFunction(() => document.querySelectorAll('.bl-preview-row').length === 3)
    page.once('dialog', (dialog) => dialog.accept('1'))
    await page.locator('.bl-preview-row').first().getByTitle('按段落拆分').click()
    await page.waitForFunction(() => document.querySelectorAll('.bl-preview-row').length === 4)
    const firstTitle = page.locator('.bl-preview-row input').first()
    await firstTitle.fill('Opening Weave')
    await firstTitle.blur()
    await page.waitForTimeout(250)
    const previewScreenshot = path.join(outputRoot, 'chapter-preview.png')
    await page.screenshot({ path: previewScreenshot, fullPage: true })
    await page.getByRole('button', { name: '确认并解析' }).click()
    await page.locator('.bl-shell').waitFor({ timeout: 15000 })
    await page.waitForFunction(async () => { const payload = await (await fetch('/api/dsh-book-loom/state')).json(); return payload.data.jobs.some((job) => job.status === 'completed') }, null, { timeout: 30000 })
    const capability = await page.evaluate(async () => {
      const state = await (await fetch('/api/dsh-book-loom/state')).json()
      const summary = state.data.books.find((item) => item.title === 'The Feedback Loom')
      const detail = await (await fetch(`/api/dsh-book-loom/books/${encodeURIComponent(summary.id)}`)).json()
      return { chapters: detail.data.chapters.length, concepts: detail.data.concepts.length, relations: detail.data.relations.length, firstTitle: detail.data.chapters[0].title, anchored: detail.data.concepts.every((item) => item.occurrences.every((occurrence) => occurrence.paragraphId)) && detail.data.relations.every((item) => item.anchors.length === 2) }
    })
    await page.getByRole('button', { name: '路径模式' }).click()
    await page.locator('.bl-path-controls select').nth(0).selectOption({ index: 1 })
    await page.locator('.bl-path-controls select').nth(1).selectOption({ index: capability.chapters })
    await page.locator('.bl-path-controls output').filter({ hasText: '个节点' }).waitFor({ timeout: 5000 })
    await page.locator('.bl-path-controls > button').click()
    await page.getByRole('button', { name: '脉络' }).click()
    await page.getByRole('button', { name: '概念密度' }).click()
    await page.getByRole('button', { name: '词云' }).click()
    await page.locator('.bl-word-select label').nth(0).click()
    await page.locator('.bl-word-select label').nth(1).click()
    await page.waitForFunction(() => document.querySelectorAll('.bl-word-columns > section').length === 2)
    await page.getByRole('button', { name: '批注设置' }).click()
    await page.locator('.bl-annotation-settings').waitFor()
    const size = (await fs.stat(previewScreenshot)).size
    const pass = initialRows === 4 && capability.chapters === 4 && capability.firstTitle === 'Opening Weave' && capability.anchored && capability.concepts > 0 && capability.relations > 0 && size > 10_000 && errors.length === 0
    results.push({ name: 'import-preview-and-advanced-controls', status: pass ? 'PASS' : 'FAIL', screenshot: previewScreenshot, size, capability, errors })
  } catch (error) {
    results.push({ name: 'import-preview-and-advanced-controls', status: 'FAIL', error: error.message, errors })
  } finally { await context.close() }
}

async function captureLive(viewport, name, colorScheme) {
  const context = await browser.newContext({ viewport, colorScheme, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  try {
    await page.goto(`${baseUrl}/?token=${encodeURIComponent(token)}`, { waitUntil: 'domcontentloaded' })
    await openPanel(page)
    await page.locator('.bl-library').waitFor({ timeout: 15000 })
    const book = page.getByText('The Feedback Loom', { exact: true }).first()
    await book.waitFor({ timeout: 10000 })
    await book.click()
    await page.locator('.bl-shell').waitFor({ timeout: 10000 })
    const chapterButton = page.locator('.bl-tree-list button').nth(1)
    if (await chapterButton.isVisible()) await chapterButton.click()
    else await page.locator('.bl-reader-handle').click()
    await page.locator('.bl-reader.open').waitFor({ timeout: 5000 })
    const screenshot = path.join(outputRoot, `${name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })
    const metrics = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      graph: document.querySelectorAll('.bl-node').length,
      paragraphs: document.querySelectorAll('.bl-reader-content p').length,
      overlap: [...document.querySelectorAll('.bl-toolbar *, .bl-reader-tools *')].some((element) => element.scrollWidth > element.clientWidth + 2 && getComputedStyle(element).overflow === 'visible'),
    }))
    const size = (await fs.stat(screenshot)).size
    const pass = size > 10_000 && metrics.graph > 0 && metrics.paragraphs > 0 && metrics.bodyWidth <= metrics.viewportWidth + 2 && !metrics.overlap && errors.length === 0
    results.push({ name, status: pass ? 'PASS' : 'FAIL', screenshot, size, metrics, errors })
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.message, errors })
  } finally { await context.close() }
}

async function verifyCanvasPerformance() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', reducedMotion: 'no-preference' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  let bookId = ''
  try {
    await page.goto(`${baseUrl}/?token=${encodeURIComponent(token)}`, { waitUntil: 'domcontentloaded' })
    await openPanel(page)
    const created = await page.evaluate(async () => {
      const source = Array.from({ length: 500 }, (_, index) => `# ${index === 0 ? 'Canvas Benchmark 500' : `Node ${index + 1}`}\n\nunique${index} signal${index} detail${index} unique${index} signal${index}.`).join('\n\n')
      const preview = await (await fetch('/api/dsh-book-loom/previews?filename=canvas-500.md', { method: 'POST', headers: { 'content-type': 'text/markdown' }, body: source })).json()
      const job = await (await fetch(`/api/dsh-book-loom/previews/${preview.data.id}/confirm`, { method: 'POST' })).json()
      return job.data
    })
    bookId = created.bookId
    await page.waitForFunction(async (jobId) => { const payload = await (await fetch('/api/dsh-book-loom/state')).json(); return payload.data.jobs.some((job) => job.id === jobId && job.status === 'completed') }, created.id, { timeout: 60000 })
    await page.evaluate(async (id) => fetch(`/api/dsh-book-loom/books/${id}/progress`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ progress: 1, progressiveReveal: false }) }), bookId)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await openPanel(page)
    await page.getByText('Canvas Benchmark 500', { exact: true }).first().click()
    const canvas = page.locator('.bl-canvas-graph')
    await canvas.waitFor({ timeout: 20000 })
    const benchmark = await canvas.evaluate(async (element) => {
      const timestamps = []
      await new Promise((resolve) => {
        const step = (time) => {
          timestamps.push(time)
          element.dispatchEvent(new WheelEvent('wheel', { deltaY: timestamps.length % 2 ? -1 : 1, bubbles: true, cancelable: true }))
          if (timestamps.length >= 180) resolve(); else requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
      const context2d = element.getContext('2d')
      const pixels = context2d.getImageData(0, 0, element.width, element.height).data
      let nonBlankSamples = 0
      for (let index = 3; index < pixels.length; index += 1600) if (pixels[index] > 0) nonBlankSamples += 1
      return { fps: (timestamps.length - 1) * 1000 / (timestamps.at(-1) - timestamps[0]), frames: timestamps.length, nonBlankSamples, width: element.width, height: element.height }
    })
    const screenshot = path.join(outputRoot, 'canvas-500.png')
    await page.screenshot({ path: screenshot, fullPage: true })
    const size = (await fs.stat(screenshot)).size
    const pass = benchmark.fps >= 30 && benchmark.nonBlankSamples > 0 && size > 10_000 && errors.length === 0
    results.push({ name: 'canvas-500-performance', status: pass ? 'PASS' : 'FAIL', screenshot, size, benchmark: { ...benchmark, fps: Number(benchmark.fps.toFixed(1)) }, errors })
  } catch (error) {
    results.push({ name: 'canvas-500-performance', status: 'FAIL', error: error.message, errors })
  } finally {
    if (bookId) await page.evaluate(async (id) => fetch(`/api/dsh-book-loom/books/${id}`, { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ confirm: id }) }), bookId).catch(() => {})
    await context.close()
  }
}

async function captureSynthetic(name, payload, status = 200) {
  const context = await browser.newContext({ viewport: { width: 790, height: 720 }, colorScheme: 'dark' })
  const page = await context.newPage()
  try {
    await page.route('**/api/dsh-book-loom/state', (route) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) }))
    await page.goto(`${baseUrl}/?token=${encodeURIComponent(token)}`, { waitUntil: 'domcontentloaded' })
    await openPanel(page)
    const selector = status === 200 ? '.bl-empty' : '.bl-library-error'
    await page.locator(selector).waitFor({ timeout: 15000 })
    const screenshot = path.join(outputRoot, `${name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })
    const size = (await fs.stat(screenshot)).size
    results.push({ name, status: size > 8_000 ? 'PASS' : 'FAIL', screenshot, size })
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.message })
  } finally { await context.close() }
}

async function openPanel(page) {
  const deadline = Date.now() + 15000
  while (Date.now() < deadline) {
    const continueButton = page.getByRole('button', { name: '继续', exact: true })
    if (await continueButton.count()) {
      await continueButton.first().click()
      await page.waitForTimeout(300)
    }
    const sidebarOpener = page.getByRole('button', { name: '打开侧边栏', exact: true }).first()
    if (await sidebarOpener.isVisible()) {
      await sidebarOpener.click()
      await page.waitForTimeout(300)
    }
    const candidates = [page.getByRole('button', { name: '书脉' }), page.getByTitle('书脉'), page.getByText('书脉', { exact: true })]
    for (const candidate of candidates) {
      const count = await candidate.count()
      for (let index = 0; index < count; index += 1) {
        const item = candidate.nth(index)
        if (await item.isVisible()) { await item.click(); return }
      }
    }
    await page.waitForTimeout(250)
  }
  await page.screenshot({ path: path.join(outputRoot, `missing-entry-${Date.now()}.png`), fullPage: true })
  throw new Error('BookLoom sidebar entry was not found')
}
