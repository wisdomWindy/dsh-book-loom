import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { codedError, cleanWhitespace } from '../util.js'
import { finalizeBook, makeChapter, paragraphsFromText } from './common.js'

export async function parsePdf(buffer, options = {}) {
  let loadingTask
  let document
  try {
    loadingTask = getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
      useWorkerFetch: false,
      isEvalSupported: false,
      verbosity: 0,
    })
    document = await loadingTask.promise
  } catch {
    throw codedError('INVALID_PDF', 'The PDF is encrypted, damaged, or unsupported', 422)
  }
  try {
    const pages = []
    let totalCharacters = 0
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const content = await page.getTextContent()
    const viewport = page.getViewport({ scale: 1 })
    const lines = groupPdfLines(content.items, viewport)
      const text = cleanWhitespace(lines.join('\n'))
      totalCharacters += text.length
      pages.push({ pageNumber, text, title: inferPageTitle(lines, pageNumber) })
      page.cleanup()
    }
    if (totalCharacters < Math.max(20, document.numPages * 8)) {
      throw codedError('OCR_REQUIRED', 'This PDF has no usable text layer. Run OCR before importing it.', 422)
    }
    const outline = await resolveOutline(document)
    const chapters = outline.length > 0 ? chaptersFromOutline(pages, outline) : pages.map((page, index) => makeChapter({
      title: page.title,
      index,
      text: page.text,
      sourceAnchor: { page: page.pageNumber, confidence: 'low' },
    }))
    const metadata = await document.getMetadata().catch(() => null)
    const title = metadata?.info?.Title || stripExtension(options.filename)
    const pageCount = document.numPages
    return finalizeBook(title, 'pdf', chapters, { pages: pageCount, navigation: outline.length > 0 ? 'outline' : 'page-heuristic', layout: 'page-anchored' })
  } finally {
    await loadingTask.destroy().catch(() => {})
  }
}

async function resolveOutline(document) {
  const root = await document.getOutline().catch(() => null)
  if (!root?.length) return []
  const flattened = []
  const visit = async (items, level = 1) => {
    for (const item of items) {
      let destination = item.dest
      if (typeof destination === 'string') destination = await document.getDestination(destination).catch(() => null)
      let page = null
      if (Array.isArray(destination) && destination[0]) {
        page = typeof destination[0] === 'number' ? destination[0] + 1 : await document.getPageIndex(destination[0]).then((value) => value + 1).catch(() => null)
      }
      if (page) flattened.push({ title: cleanWhitespace(item.title) || `Page ${page}`, page, level })
      if (item.items?.length) await visit(item.items, Math.min(6, level + 1))
    }
  }
  await visit(root)
  return flattened.filter((item, index, values) => index === 0 || item.page !== values[index - 1].page || item.title !== values[index - 1].title)
    .sort((a, b) => a.page - b.page || a.level - b.level)
}

function chaptersFromOutline(pages, outline) {
  return outline.map((entry, index) => {
    const endPage = outline[index + 1]?.page || pages.length + 1
    const sectionPages = pages.filter((page) => page.pageNumber >= entry.page && page.pageNumber < endPage)
    const chapter = makeChapter({ title: entry.title, level: entry.level, index, text: sectionPages.map((page) => page.text).join('\n\n'), sourceAnchor: { page: entry.page, confidence: 'high' } })
    chapter.paragraphs = sectionPages.flatMap((page) => paragraphsFromText(page.text, chapter.id, { page: page.pageNumber, confidence: 'high' }))
      .map((paragraph, paragraphIndex) => ({ ...paragraph, index: paragraphIndex, anchor: { ...paragraph.anchor, paragraphIndex } }))
    return chapter
  }).filter((chapter) => chapter.paragraphs.length > 0)
}

export function groupPdfLines(items, viewport = {}) {
  const rows = []
  for (const item of items) {
    const text = String(item.str || '').trim()
    if (!text) continue
    const y = Math.round(Number(item.transform?.[5] || 0) / 3) * 3
    let row = rows.find((candidate) => Math.abs(candidate.y - y) <= 3)
    if (!row) {
      row = { y, items: [] }
      rows.push(row)
    }
    row.items.push({ x: Number(item.transform?.[4] || 0), width: Number(item.width || 0), text })
  }
  rows.sort((a, b) => b.y - a.y)
  for (const row of rows) row.items.sort((a, b) => a.x - b.x)
  const pageWidth = Number(viewport.width || 0)
  const pageHeight = Number(viewport.height || 0)
  if (!pageWidth || !pageHeight) return rows.map(rowText)

  const midpoint = pageWidth / 2
  const metadata = rows.map((row) => {
    const left = row.items.filter((item) => item.x < midpoint)
    const right = row.items.filter((item) => item.x >= midpoint)
    const leftText = itemsText(left)
    const rightText = itemsText(right)
    const spanning = row.items.some((item) => item.x < pageWidth * 0.3 && item.x + item.width > pageWidth * 0.7)
    const tableLike = leftText.length < 64 && rightText.length > 0 && rightText.length < 16
    const columnSeed = !spanning && leftText.length >= 25 && rightText.length >= 25 && !tableLike
    return { row, left, right, leftText, rightText, spanning, columnSeed }
  })
  const seedIndexes = metadata.map((item, index) => item.columnSeed ? index : -1).filter((index) => index >= 0)
  if (seedIndexes.length < 2) return rows.map(rowText)

  let start = seedIndexes[0]
  while (start > 0) {
    const current = metadata[start]
    const previous = metadata[start - 1]
    if (previous.row.y - current.row.y > 30 || previous.spanning || (previous.left.length === 0 && previous.right.length === 0)) break
    start -= 1
  }
  let end = seedIndexes.at(-1)
  while (end + 1 < metadata.length) {
    const next = metadata[end + 1]
    if (next.row.y <= pageHeight * 0.12 || next.spanning) break
    end += 1
  }

  const before = metadata.slice(0, start).map(({ row }) => rowText(row))
  const section = metadata.slice(start, end + 1)
  const leftColumn = section.map(({ left }) => itemsText(left)).filter(Boolean)
  const rightColumn = section.map(({ right }) => itemsText(right)).filter(Boolean)
  const after = metadata.slice(end + 1).map(({ row }) => rowText(row))
  return [...before, ...leftColumn, ...rightColumn, ...after]
}

function itemsText(items) { return items.map((item) => item.text).join(' ') }
function rowText(row) { return itemsText(row.items) }

function inferPageTitle(lines, pageNumber) {
  const candidate = lines.find((line) => line.length >= 2 && line.length <= 80)
  return candidate || `Page ${pageNumber}`
}

function stripExtension(value = '') { return value.replace(/\.pdf$/i, '') || 'PDF book' }
