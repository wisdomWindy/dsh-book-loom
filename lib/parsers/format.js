import path from 'node:path'
import { codedError } from '../util.js'

const EXTENSIONS = new Map([
  ['.epub', 'epub'], ['.md', 'markdown'], ['.markdown', 'markdown'],
  ['.txt', 'txt'], ['.pdf', 'pdf'],
])

export function detectFormat(buffer, filename = '', mime = '') {
  const lowerMime = String(mime).split(';')[0].trim().toLowerCase()
  const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, Math.min(buffer.byteLength, 16))
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return 'pdf'
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && filename.toLowerCase().endsWith('.epub')) return 'epub'
  if (lowerMime === 'application/epub+zip') return 'epub'
  if (lowerMime === 'application/pdf') return 'pdf'
  if (lowerMime === 'text/markdown' || lowerMime === 'text/x-markdown') return 'markdown'
  if (lowerMime === 'text/plain') return 'txt'
  const format = EXTENSIONS.get(path.extname(filename).toLowerCase())
  if (format) return format
  throw codedError('UNSUPPORTED_FORMAT', 'Supported formats are EPUB, Markdown, TXT, and text-based PDF. Convert DOCX, MOBI, AZW3, or HTML to EPUB or Markdown before importing.', 415)
}
