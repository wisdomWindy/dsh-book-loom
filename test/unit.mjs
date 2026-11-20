import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import test from 'node:test'
import { strToU8, zipSync } from 'fflate'
import { addAnnotation } from '../lib/annotations.js'
import { DEFAULTS, resolveConfig } from '../lib/config.js'
import { indexBook } from '../lib/indexer.js'
import { parseEpub, parseMarkdown, parsePdf, parseText } from '../lib/parsers/index.js'
import { groupPdfLines } from '../lib/parsers/pdf.js'
import { handleRequest } from '../lib/panel-api.js'
import { editPreview, structureOnlyBook } from '../lib/previews.js'
import { buildRelations } from '../lib/relations.js'
import { BookLoomRuntime } from '../lib/runtime.js'
import { BookStore } from '../lib/store.js'

const markdown = Buffer.from(`# The Loom\n\nOpening paragraph about systems and feedback.\n\n## Foundations\n\nSystems connect causes to effects. Feedback changes systems over time.\n\n## Practice\n\nPractice uses feedback to improve systems. Therefore the argument continues.\n`)

test('configuration clamps unsafe values and rejects traversal', () => {
  const { config, warnings } = resolveConfig({ dataDirectory: '../outside', maxBookBytes: -1, analysisConcurrency: 99, similarityThreshold: 8 })
  assert.equal(config.dataDirectory, DEFAULTS.dataDirectory)
  assert.equal(config.maxBookBytes, 1024)
  assert.equal(config.analysisConcurrency, 8)
  assert.equal(config.similarityThreshold, 0.95)
  assert.ok(warnings.length >= 4)
})

test('Markdown parser uses headings but does not promote fenced code', () => {
  const value = parseMarkdown(Buffer.from('# Book\n\nIntro.\n\n```md\n## Not a chapter\n```\n\n## Real chapter\n\nBody text.'), { filename: 'book.md' })
  assert.equal(value.title, 'Book')
  assert.equal(value.chapters.length, 2)
  assert.equal(value.chapters[1].title, 'Real chapter')
  assert.ok(value.chapters.every((chapter) => chapter.paragraphs.every((paragraph) => paragraph.anchor.chapterId === chapter.id)))
})

test('TXT parser decodes explicit encodings and creates chapter anchors', () => {
  const value = parseText(Buffer.from('第一章 开始\n\n这是第一部分内容。\n\n第二章 继续\n\n这是第二部分内容。'), { filename: '示例.txt', encoding: 'UTF-8' })
  assert.equal(value.metadata.encoding, 'UTF-8')
  assert.equal(value.chapters.length, 2)
  assert.equal(value.chapters[1].sourceAnchor.confidence, 'medium')
})

test('EPUB parser follows container, manifest, spine, and nav', () => {
  const archive = zipSync({
    mimetype: strToU8('application/epub+zip'),
    'META-INF/container.xml': strToU8('<?xml version="1.0"?><container><rootfiles><rootfile full-path="OPS/package.opf"/></rootfiles></container>'),
    'OPS/package.opf': strToU8('<?xml version="1.0"?><package><metadata><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">Threaded Book</dc:title></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="c1" href="one.xhtml" media-type="application/xhtml+xml"/><item id="c2" href="two.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="c1"/><itemref idref="c2"/></spine></package>'),
    'OPS/nav.xhtml': strToU8('<html xmlns="http://www.w3.org/1999/xhtml"><body><nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops"><ol><li><a href="one.xhtml">First thread</a></li><li><a href="two.xhtml">Second thread</a></li></ol></nav></body></html>'),
    'OPS/one.xhtml': strToU8('<html><body><h1>Fallback one</h1><p>Systems begin with causes and feedback.</p></body></html>'),
    'OPS/two.xhtml': strToU8('<html><body><h1>Fallback two</h1><p>Feedback connects systems across chapters.</p></body></html>'),
  })
  const value = parseEpub(Buffer.from(archive), { filename: 'thread.epub' })
  assert.equal(value.title, 'Threaded Book')
  assert.deepEqual(value.chapters.map((chapter) => chapter.title), ['First thread', 'Second thread'])
  assert.equal(value.metadata.navigation, 'nav')
})

test('PDF parser follows bookmarks and keeps page anchors', async () => {
  const value = await parsePdf(pdfFixture('Chapter One', 'Feedback systems connect cause and effect across the chapter.'), { filename: 'thread.pdf' })
  assert.equal(value.format, 'pdf')
  assert.equal(value.metadata.navigation, 'outline')
  assert.equal(value.chapters[0].title, 'Chapter One')
  assert.equal(value.chapters[0].paragraphs[0].anchor.page, 1)
})

test('PDF without a usable text layer requests OCR', async () => {
  await assert.rejects(parsePdf(pdfFixture('', ''), { filename: 'scan.pdf' }), (error) => error.code === 'OCR_REQUIRED')
})

test('PDF reading order preserves tables, columns, figures, and footnotes', () => {
  const item = (x, y, text, width = text.length * 5) => ({ str: text, width, transform: [1, 0, 0, 1, x, y] })
  const lines = groupPdfLines([
    item(54, 750, 'Page title', 250),
    item(54, 680, 'TABLE row label', 120), item(420, 680, 'PASS', 30),
    item(54, 520, 'Left notes', 70), item(326, 520, 'Right notes', 80),
    item(326, 508, 'FIGURE top label', 90),
    item(54, 494, 'L1_START left-column evidence continues', 210), item(326, 494, 'R1_START right-column interpretation follows', 230),
    item(54, 464, 'L2_END left-column evidence closes', 190), item(326, 464, 'R2_END right-column interpretation closes', 220),
    item(326, 410, 'FIGURE caption remains in the right column', 220),
    item(54, 58, 'FN1 footnote is read last', 150),
  ], { width: 612, height: 792 })
  assert.deepEqual(lines, [
    'Page title',
    'TABLE row label PASS',
    'Left notes',
    'L1_START left-column evidence continues',
    'L2_END left-column evidence closes',
    'Right notes',
    'FIGURE top label',
    'R1_START right-column interpretation follows',
    'R2_END right-column interpretation closes',
    'FIGURE caption remains in the right column',
    'FN1 footnote is read last',
  ])
})

test('index and relationship pipeline keeps every rendered item traceable', () => {
  const parsed = parseMarkdown(markdown, { filename: 'loom.md' })
  const book = buildRelations(indexBook(parsed), { similarityThreshold: 0.05 })
  assert.ok(book.concepts.length > 0)
  assert.ok(book.relations.some((item) => item.type === 'structure'))
  assert.ok(book.relations.some((item) => item.type === 'concept' || item.type === 'theme'))
  assert.ok(book.concepts.every((concept) => concept.occurrences.every((item) => item.chapterId && item.paragraphId)))
  assert.ok(book.relations.every((relation) => relation.anchors.length === 2 && relation.anchors.every((item) => item.chapterId && item.paragraphId)))
})

test('annotations validate source ranges and user concepts remain anchored', () => {
  const book = { id: 'book_12345678', ...indexBook(parseMarkdown(markdown, { filename: 'loom.md' })), annotations: [] }
  const paragraph = book.chapters[0].paragraphs[0]
  const annotation = addAnnotation(book, { kind: 'concept', color: 'javascript:bad', chapterId: book.chapters[0].id, paragraphId: paragraph.id, start: 0, end: 7 })
  assert.equal(annotation.text, paragraph.text.slice(0, 7))
  assert.equal(book.concepts.at(-1).occurrences[0].paragraphId, paragraph.id)
  assert.equal(annotation.color, 'brand')
})

test('chapter preview supports title edits, split, merge, and traceable structure output', () => {
  const parsed = parseMarkdown(markdown, { filename: 'loom.md' })
  const firstId = parsed.chapters[0].id
  editPreview(parsed, { action: 'update', chapterId: firstId, title: 'Opening', level: 1 })
  assert.equal(parsed.chapters[0].title, 'Opening')
  const splitTarget = parsed.chapters.find((chapter) => chapter.paragraphs.length > 1)
  if (splitTarget) {
    editPreview(parsed, { action: 'split', chapterId: splitTarget.id, paragraphIndex: 1, title: 'Split section' })
    const splitId = parsed.chapters.find((chapter) => chapter.title === 'Split section').id
    editPreview(parsed, { action: 'merge', chapterId: splitId })
  }
  const structure = structureOnlyBook(parsed)
  assert.equal(structure.concepts.length, 0)
  assert.ok(structure.relations.every((relation) => relation.type === 'structure' && relation.anchors.length === 2))
  assert.ok(structure.chapters.every((chapter) => chapter.paragraphs.every((paragraph) => paragraph.anchor.chapterId === chapter.id)))
})

test('preview confirmation persists structure before background analysis completes', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'book-loom-preview-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const runtime = new BookLoomRuntime(new BookStore(root), { ...DEFAULTS, dataDirectory: root })
  const preview = await runtime.createPreview(markdown, { filename: 'preview.md', mime: 'text/markdown' })
  assert.equal(preview.chapters.length, 3)
  const edited = runtime.editPreview(preview.id, { action: 'update', chapterId: preview.chapters[0].id, title: 'Confirmed opening', level: 1 })
  assert.equal(edited.chapters[0].title, 'Confirmed opening')
  const job = await runtime.confirmPreview(preview.id)
  const partial = await runtime.book(job.bookId)
  assert.equal(partial.analysisStatus, 'processing')
  assert.equal(partial.concepts.length, 0)
  await runtime.jobs.get(job.id).promise
  const complete = await runtime.book(job.bookId)
  assert.equal(complete.analysisStatus, 'complete')
  assert.ok(complete.concepts.length > 0)
  await runtime.close()
})

test('panel HTTP contract creates, edits, confirms, and reads a preview import', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'book-loom-http-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const runtime = new BookLoomRuntime(new BookStore(root), { ...DEFAULTS, dataDirectory: root })
  const created = await request(runtime, 'POST', '/api/dsh-book-loom/previews?filename=http.md', markdown, { 'content-type': 'text/markdown' })
  assert.equal(created.status, 201)
  const preview = created.body.data
  const edited = await request(runtime, 'POST', `/api/dsh-book-loom/previews/${preview.id}/edit`, JSON.stringify({ action: 'update', chapterId: preview.chapters[0].id, title: 'HTTP opening', level: 1 }), { 'content-type': 'application/json' })
  assert.equal(edited.body.data.chapters[0].title, 'HTTP opening')
  const confirmed = await request(runtime, 'POST', `/api/dsh-book-loom/previews/${preview.id}/confirm`)
  assert.equal(confirmed.status, 202)
  await runtime.jobs.get(confirmed.body.data.id).promise
  const loaded = await request(runtime, 'GET', `/api/dsh-book-loom/books/${confirmed.body.data.bookId}`)
  assert.equal(loaded.body.data.analysisStatus, 'complete')
  assert.equal(loaded.body.data.chapters[0].title, 'HTTP opening')
  await runtime.close()
})

test('runtime imports a deterministic Markdown sample and persists schema v1', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'book-loom-unit-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const store = new BookStore(root)
  const runtime = new BookLoomRuntime(store, { ...DEFAULTS, dataDirectory: root })
  const job = runtime.importBook(markdown, { filename: 'loom.md', mime: 'text/markdown' })
  await runtime.jobs.get(job.id).promise
  const state = await runtime.state()
  assert.equal(state.books.length, 1)
  assert.equal(state.jobs[0].status, 'completed')
  const book = await runtime.book(job.bookId)
  assert.equal(book.schemaVersion, 1)
  assert.equal(book.format, 'markdown')
  assert.ok(book.chapters.length >= 3)
  await runtime.close()
})

async function request(runtime, method, url, body = '', extraHeaders = {}) {
  const input = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)
  const stream = Readable.from(input ? [Buffer.from(input)] : [])
  Object.assign(stream, { method, url, headers: { host: '127.0.0.1', ...extraHeaders }, socket: { remoteAddress: '127.0.0.1' } })
  let status = 0; let text = ''
  const response = { writableEnded: false, writeHead(value) { status = value }, end(value = '') { text += value; this.writableEnded = true } }
  await handleRequest(runtime, stream, response)
  return { status, body: JSON.parse(text) }
}

function pdfFixture(title, body) {
  const content = title || body
    ? `BT /F1 16 Tf 72 720 Td (${pdfEscape(title || 'Page 1')}) Tj 0 -24 Td (${pdfEscape(body)}) Tj ET`
    : ''
  const outline = title
    ? ['/Outlines 6 0 R /PageMode /UseOutlines', '<< /Type /Outlines /First 7 0 R /Last 7 0 R /Count 1 >>', `<< /Title (${pdfEscape(title)}) /Parent 6 0 R /Dest [3 0 R /XYZ null null null] >>`]
    : ['', '', '']
  const objects = [
    `<< /Type /Catalog /Pages 2 0 R ${outline[0]} >>`,
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    outline[1] || '<< >>',
    outline[2] || '<< >>',
  ]
  let source = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(source))
    source += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = Buffer.byteLength(source)
  source += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  source += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  source += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(source)
}

function pdfEscape(value) { return String(value).replace(/([\\()])/g, '\\$1') }
