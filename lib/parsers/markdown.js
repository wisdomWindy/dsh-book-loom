import { Lexer } from 'marked'
import { cleanWhitespace } from '../util.js'
import { finalizeBook, makeChapter } from './common.js'

export function parseMarkdown(buffer, options = {}) {
  const source = buffer.toString('utf8')
  const tokens = Lexer.lex(source)
  const sections = []
  let current = { title: options.title || options.filename || 'Markdown book', level: 1, text: [] }
  let bookTitle = ''
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth <= 3) {
      if (!bookTitle && token.depth === 1) bookTitle = token.text
      if (current.text.length || sections.length) sections.push(current)
      current = { title: cleanWhitespace(token.text), level: token.depth, text: [] }
      continue
    }
    if (token.type === 'space') current.text.push('')
    else if (typeof token.text === 'string' && token.type !== 'code') current.text.push(cleanWhitespace(token.text))
    else if (token.type === 'code') current.text.push(token.text)
  }
  if (current.text.length || sections.length === 0) sections.push(current)
  const chapters = sections.map((section, index) => makeChapter({
    title: section.title,
    level: section.level,
    index,
    text: section.text.join('\n\n'),
    sourceAnchor: { line: 1, confidence: 'high' },
  }))
  return finalizeBook(bookTitle || options.title || stripExtension(options.filename), 'markdown', chapters)
}

function stripExtension(filename = '') {
  return filename.replace(/\.(md|markdown)$/i, '') || 'Markdown book'
}
