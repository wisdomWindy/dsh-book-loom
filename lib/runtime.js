import crypto from 'node:crypto'
import { addAnnotation, removeAnnotation } from './annotations.js'
import { indexBook } from './indexer.js'
import { parseBook } from './parsers/index.js'
import { buildRelations } from './relations.js'
import { editPreview, publicPreview, structureOnlyBook } from './previews.js'
import { codedError } from './util.js'

export class BookLoomRuntime {
  constructor(store, config, logger = console) {
    this.store = store
    this.config = config
    this.logger = logger
    this.jobs = new Map()
    this.previews = new Map()
    this.closing = false
  }

  async state() {
    return {
      books: await this.store.list(),
      jobs: [...this.jobs.values()].map(publicJob),
      previews: [...this.previews.values()].map(publicPreview),
      capabilities: {
        formats: ['epub', 'markdown', 'txt', 'pdf'],
        maxBookBytes: this.config.maxBookBytes,
        maxGraphNodes: this.config.maxGraphNodes,
      },
    }
  }

  async createPreview(buffer, options = {}) {
    if (this.closing) throw codedError('SHUTTING_DOWN', 'BookLoom is shutting down', 503)
    if (buffer.byteLength > this.config.maxBookBytes) throw codedError('BOOK_TOO_LARGE', `Book exceeds ${this.config.maxBookBytes} bytes`, 413)
    this.prunePreviews()
    if (this.previews.size >= 4) throw codedError('PREVIEW_LIMIT', 'Finish or cancel an existing chapter preview first', 429)
    const parsed = await parseBook(buffer, options)
    const preview = {
      id: `preview_${crypto.randomUUID()}`,
      parsed,
      buffer,
      options: { ...options, filename: options.filename || 'book' },
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 30 * 60_000,
    }
    this.previews.set(preview.id, preview)
    return publicPreview(preview)
  }

  preview(previewId) {
    this.prunePreviews()
    const preview = this.previews.get(previewId)
    if (!preview) throw codedError('PREVIEW_NOT_FOUND', 'Import preview was not found or expired', 404)
    return publicPreview(preview)
  }

  editPreview(previewId, operation) {
    const preview = this.previews.get(previewId)
    if (!preview) throw codedError('PREVIEW_NOT_FOUND', 'Import preview was not found or expired', 404)
    editPreview(preview.parsed, operation)
    return publicPreview(preview)
  }

  cancelPreview(previewId) {
    const removed = this.previews.delete(previewId)
    if (!removed) throw codedError('PREVIEW_NOT_FOUND', 'Import preview was not found or expired', 404)
    return { cancelled: true, previewId }
  }

  async confirmPreview(previewId) {
    const preview = this.previews.get(previewId)
    if (!preview) throw codedError('PREVIEW_NOT_FOUND', 'Import preview was not found or expired', 404)
    this.previews.delete(previewId)
    const bookId = `book_${crypto.randomUUID()}`
    const controller = new AbortController()
    const job = this.createJob(bookId, preview.options.filename, controller)
    const now = new Date().toISOString()
    await this.store.write({
      ...structureOnlyBook(preview.parsed),
      id: bookId,
      filename: preview.options.filename,
      createdAt: now,
      updatedAt: now,
      analysisStatus: 'processing',
      annotations: [],
      userState: defaultUserState(this.config),
    })
    if (this.config.retainOriginalFile) await this.store.saveOriginal(bookId, preview.options.filename, preview.buffer)
    job.stage = 'keywords'
    job.progress = 0.42
    job.promise = this.runConfirmedImport(job, preview.parsed).catch((error) => this.failJob(job, error))
    return publicJob(job)
  }

  importBook(buffer, options = {}) {
    if (this.closing) throw codedError('SHUTTING_DOWN', 'BookLoom is shutting down', 503)
    if (buffer.byteLength > this.config.maxBookBytes) throw codedError('BOOK_TOO_LARGE', `Book exceeds ${this.config.maxBookBytes} bytes`, 413)
    const id = `book_${crypto.randomUUID()}`
    const controller = new AbortController()
    const job = this.createJob(id, options.filename || 'book', controller)
    job.promise = this.runImport(job, buffer, options).catch((error) => this.failJob(job, error))
    return publicJob(job)
  }

  createJob(bookId, filename, controller) {
    const job = { id: `job_${crypto.randomUUID()}`, bookId, filename, stage: 'queued', progress: 0, status: 'running', error: null, controller, startedAt: new Date().toISOString() }
    this.jobs.set(job.id, job)
    return job
  }

  failJob(job, error) {
    if (job.status === 'cancelled') return
    job.status = 'failed'
    job.error = { code: error.code || 'IMPORT_FAILED', message: error.message, data: error.data }
    this.logger.warn(`dsh-book-loom: import ${job.id} failed: ${error.code || error.message}`)
  }

  async runImport(job, buffer, options) {
    this.setStage(job, 'structure', 0.12)
    assertActive(job)
    const parsed = await parseBook(buffer, options)
    assertActive(job)
    this.setStage(job, 'keywords', 0.42)
    const indexed = indexBook(parsed)
    assertActive(job)
    this.setStage(job, 'relations', 0.72)
    const connected = buildRelations(indexed, this.config)
    validateTraceability(connected)
    assertActive(job)
    this.setStage(job, 'saving', 0.9)
    const now = new Date().toISOString()
    const book = await this.store.write({
      ...connected,
      id: job.bookId,
      filename: options.filename || 'book',
      createdAt: now,
      updatedAt: now,
      annotations: [],
      userState: defaultUserState(this.config),
    })
    if (this.config.retainOriginalFile) await this.store.saveOriginal(job.bookId, options.filename || 'book', buffer)
    job.status = 'completed'
    job.stage = 'completed'
    job.progress = 1
    job.completedAt = new Date().toISOString()
    return book
  }

  async runConfirmedImport(job, parsed) {
    assertActive(job)
    await yieldTurn()
    this.setStage(job, 'keywords', 0.48)
    const indexed = indexBook(parsed)
    assertActive(job)
    await yieldTurn()
    this.setStage(job, 'relations', 0.74)
    const connected = buildRelations(indexed, this.config)
    validateTraceability(connected)
    assertActive(job)
    this.setStage(job, 'saving', 0.92)
    const current = await this.store.read(job.bookId)
    const book = await this.store.write({ ...connected, id: job.bookId, filename: job.filename, createdAt: current.createdAt, annotations: current.annotations || [], userState: current.userState, analysisStatus: 'complete' })
    job.status = 'completed'; job.stage = 'completed'; job.progress = 1; job.completedAt = new Date().toISOString()
    return book
  }

  async book(bookId) { return this.store.read(bookId) }

  async updateProgress(bookId, progress, progressiveReveal) {
    const value = Number(progress)
    if (!Number.isFinite(value) || value < 0 || value > 1) throw codedError('INVALID_PROGRESS', 'Progress must be between 0 and 1')
    return this.store.update(bookId, (book) => {
      book.userState ||= {}
      book.userState.progress = value
      if (typeof progressiveReveal === 'boolean') book.userState.progressiveReveal = progressiveReveal
      return book
    })
  }

  async updateSettings(bookId, input = {}) {
    const allowed = new Set(['brand', 'success', 'warning', 'error'])
    const kinds = ['highlight', 'underline', 'comment', 'concept']
    return this.store.update(bookId, (book) => {
      book.userState ||= {}
      book.userState.annotationColors ||= { highlight: 'brand', underline: 'success', comment: 'warning', concept: 'error' }
      for (const kind of kinds) if (allowed.has(input.annotationColors?.[kind])) book.userState.annotationColors[kind] = input.annotationColors[kind]
      return book
    })
  }

  async annotate(bookId, input) {
    let annotation
    await this.store.update(bookId, (book) => { annotation = addAnnotation(book, input); return book })
    return annotation
  }

  async removeAnnotation(bookId, annotationId) {
    let removed
    await this.store.update(bookId, (book) => { removed = removeAnnotation(book, annotationId); return book })
    return removed
  }

  async removeBook(bookId) { return this.store.remove(bookId) }
  async clearAll() { return this.store.clear() }

  cancel(jobId) {
    const job = this.jobs.get(jobId)
    if (!job) throw codedError('JOB_NOT_FOUND', 'Import job was not found', 404)
    job.status = 'cancelled'
    job.stage = 'cancelled'
    job.controller.abort()
    return publicJob(job)
  }

  async close() {
    this.closing = true
    this.previews.clear()
    for (const job of this.jobs.values()) {
      if (job.status === 'running') {
        job.status = 'cancelled'
        job.controller.abort()
      }
    }
    await Promise.allSettled([...this.jobs.values()].map((job) => job.promise).filter(Boolean))
  }

  setStage(job, stage, progress) { job.stage = stage; job.progress = progress }

  prunePreviews() {
    const now = Date.now()
    for (const [id, preview] of this.previews) if (preview.expiresAt <= now) this.previews.delete(id)
  }
}

function yieldTurn() { return new Promise((resolve) => setImmediate(resolve)) }
function defaultUserState(config) { return { progress: 0, progressiveReveal: config.defaultProgressiveReveal, selectedView: 'chapters', annotationColors: { highlight: 'brand', underline: 'success', comment: 'warning', concept: 'error' } } }

function publicJob(job) {
  return {
    id: job.id,
    bookId: job.bookId,
    filename: job.filename,
    stage: job.stage,
    progress: job.progress,
    status: job.status,
    error: job.error,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
  }
}

function assertActive(job) {
  if (job.controller.signal.aborted) throw codedError('IMPORT_CANCELLED', 'Import was cancelled', 409)
}

function validateTraceability(book) {
  for (const chapter of book.chapters) {
    chapter.paragraphs = chapter.paragraphs.filter((paragraph) => paragraph.anchor?.chapterId === chapter.id)
  }
  book.concepts = book.concepts.filter((concept) => concept.occurrences.length > 0 && concept.occurrences.every((item) => item.chapterId && item.paragraphId))
  book.relations = book.relations.filter((relation) => relation.anchors?.length === 2 && relation.anchors.every((anchor) => anchor.chapterId && anchor.paragraphId))
}
