import fs from 'node:fs/promises'
import path from 'node:path'
import { STORAGE_SCHEMA_VERSION } from './constants.js'
import { codedError, safeFilename } from './util.js'

export class BookStore {
  constructor(root, logger = console) {
    this.root = root
    this.booksRoot = path.join(root, 'books')
    this.logger = logger
    this.ready = this.initialize()
    this.writeChain = Promise.resolve()
  }

  async initialize() {
    await fs.mkdir(this.booksRoot, { recursive: true })
  }

  async list() {
    await this.ready
    const entries = await fs.readdir(this.booksRoot, { withFileTypes: true })
    const summaries = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      try {
        const book = await this.read(entry.name)
        summaries.push(summarize(book))
      } catch (error) {
        this.logger.warn(`dsh-book-loom: skipped unreadable book ${entry.name}: ${error.message}`)
      }
    }
    return summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async read(bookId) {
    await this.ready
    assertId(bookId)
    try {
      const raw = await fs.readFile(path.join(this.booksRoot, bookId, 'book.json'), 'utf8')
      const value = JSON.parse(raw)
      if (value.schemaVersion !== STORAGE_SCHEMA_VERSION) throw codedError('SCHEMA_MISMATCH', 'Stored book requires an unsupported migration', 409)
      return value
    } catch (error) {
      if (error.code === 'ENOENT') throw codedError('BOOK_NOT_FOUND', 'Book was not found', 404)
      if (error instanceof SyntaxError) throw codedError('BOOK_DATA_DAMAGED', 'Stored book data is damaged', 500)
      throw error
    }
  }

  async write(book) {
    await this.ready
    assertId(book.id)
    const directory = path.join(this.booksRoot, book.id)
    const next = { ...book, schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: new Date().toISOString() }
    this.writeChain = this.writeChain.then(async () => {
      await fs.mkdir(directory, { recursive: true })
      await atomicJson(path.join(directory, 'book.json'), next)
    })
    await this.writeChain
    return next
  }

  async update(bookId, updater) {
    const book = await this.read(bookId)
    const next = await updater(structuredClone(book))
    return this.write(next)
  }

  async saveOriginal(bookId, filename, buffer) {
    assertId(bookId)
    const directory = path.join(this.booksRoot, bookId)
    await fs.mkdir(directory, { recursive: true })
    const target = path.join(directory, safeFilename(filename))
    await fs.writeFile(target, buffer, { flag: 'wx' })
    return target
  }

  async remove(bookId) {
    await this.ready
    assertId(bookId)
    await fs.rm(path.join(this.booksRoot, bookId), { recursive: true, force: true })
    return { removed: true, bookId }
  }

  async clear() {
    await this.ready
    await fs.rm(this.booksRoot, { recursive: true, force: true })
    await fs.mkdir(this.booksRoot, { recursive: true })
    return { cleared: true }
  }
}

function summarize(book) {
  return {
    id: book.id,
    title: book.title,
    format: book.format,
    filename: book.filename,
    chapterCount: book.chapters?.length || 0,
    conceptCount: book.concepts?.length || 0,
    relationCount: book.relations?.length || 0,
    progress: book.userState?.progress || 0,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  }
}

async function atomicJson(target, value) {
  const temporary = `${target}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(temporary, `${JSON.stringify(value)}\n`, 'utf8')
  await fs.rename(temporary, target)
}

function assertId(value) {
  if (!/^book_[a-f0-9-]{8,64}$/i.test(String(value || ''))) throw codedError('INVALID_BOOK_ID', 'Invalid book id')
}
