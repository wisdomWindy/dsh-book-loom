import iconv from 'iconv-lite'
import jschardet from 'jschardet'
import { codedError, cleanWhitespace } from '../util.js'
import { finalizeBook, makeChapter } from './common.js'

const TITLE_PATTERNS = [
  /^(第[一二三四五六七八九十百千0-9]+[章节部卷篇]\s*.*)$/u,
  /^(chapter|part|section)\s+[0-9ivxlcdm]+\b.*$/i,
  /^(序言|前言|引言|结语|后记|附录)(?:\s|$).*/u,
]

export function decodeText(buffer, requestedEncoding) {
  if (requestedEncoding) {
    if (!iconv.encodingExists(requestedEncoding)) throw codedError('INVALID_ENCODING', `Unsupported encoding: ${requestedEncoding}`)
    return { text: iconv.decode(buffer, requestedEncoding), encoding: requestedEncoding, confidence: 1 }
  }
  if (buffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
    return { text: buffer.subarray(3).toString('utf8'), encoding: 'UTF-8', confidence: 1 }
  }
  const detected = jschardet.detect(buffer)
  const encoding = detected.encoding || 'UTF-8'
  const confidence = Number(detected.confidence || 0)
  if (confidence < 0.45) {
    throw codedError('ENCODING_REQUIRED', 'Text encoding is uncertain; choose an encoding before importing', 422, {
      detectedEncoding: encoding,
      confidence,
      choices: ['UTF-8', 'GB18030', 'Big5', 'Shift_JIS', 'Windows-1252'],
    })
  }
  return { text: iconv.decode(buffer, encoding), encoding, confidence }
}

export function parseText(buffer, options = {}) {
  const decoded = decodeText(buffer, options.encoding)
  const lines = decoded.text.replace(/\r\n?/g, '\n').split('\n')
  const sections = []
  let current = { title: options.title || stripExtension(options.filename), text: [] }
  for (const line of lines) {
    const value = line.trim()
    const title = TITLE_PATTERNS.some((pattern) => pattern.test(value)) || (value.length > 0 && value.length < 48 && /^\S.{0,45}\S$/.test(value) && current.text.at(-1) === '')
    if (title && current.text.some(Boolean)) {
      sections.push(current)
      current = { title: value, text: [] }
    } else {
      current.text.push(value)
    }
  }
  if (current.text.some(Boolean) || sections.length === 0) sections.push(current)
  const chapters = sections.map((section, index) => makeChapter({
    title: section.title || `Section ${index + 1}`,
    index,
    text: cleanWhitespace(section.text.join('\n')),
    sourceAnchor: { confidence: sections.length > 1 ? 'medium' : 'low' },
  }))
  return finalizeBook(stripExtension(options.filename), 'txt', chapters, { encoding: decoded.encoding, encodingConfidence: decoded.confidence })
}

function stripExtension(filename = '') {
  return filename.replace(/\.txt$/i, '') || 'Text book'
}
