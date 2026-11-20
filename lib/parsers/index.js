import { detectFormat } from './format.js'
import { parseEpub } from './epub.js'
import { parseMarkdown } from './markdown.js'
import { parsePdf } from './pdf.js'
import { parseText } from './text.js'

export async function parseBook(buffer, options = {}) {
  const format = detectFormat(buffer, options.filename, options.mime)
  if (format === 'epub') return parseEpub(buffer, options)
  if (format === 'markdown') return parseMarkdown(buffer, options)
  if (format === 'txt') return parseText(buffer, options)
  return parsePdf(buffer, options)
}

export { detectFormat, parseEpub, parseMarkdown, parsePdf, parseText }
