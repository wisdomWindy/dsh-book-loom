import { stableId } from './util.js'

const STOP_WORDS = new Set([
  'the','and','that','this','with','from','have','for','not','are','was','were','but','you','your','into','than','then','they','their','its','can','will','would','about','which','when','what','where','who','how',
  '一个','一种','我们','你们','他们','这个','那个','这些','那些','以及','因为','所以','但是','如果','那么','可以','没有','不是','就是','进行','通过','对于','其中','已经','自己','什么','如何','这样','这种','而且','或者','并且',
])

export function indexBook(parsed, options = {}) {
  const documentFrequency = new Map()
  const chapterTerms = parsed.chapters.map((chapter) => {
    const terms = tokenize(chapter.paragraphs.map((item) => item.text).join('\n'))
    const counts = count(terms)
    for (const term of new Set(terms)) documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1)
    return counts
  })
  const chapterCount = Math.max(1, parsed.chapters.length)
  const chapters = parsed.chapters.map((chapter, chapterIndex) => {
    const weighted = [...chapterTerms[chapterIndex]].map(([term, frequency]) => ({
      term,
      frequency,
      weight: frequency * (Math.log((chapterCount + 1) / ((documentFrequency.get(term) || 0) + 1)) + 1),
    })).sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term)).slice(0, 24)
    return {
      ...chapter,
      wordCount: tokenize(chapter.paragraphs.map((item) => item.text).join(' '), true).length,
      keywords: weighted,
      summary: extractiveSummary(chapter.paragraphs, weighted.slice(0, 8).map((item) => item.term)),
    }
  })
  const concepts = buildConcepts(chapters, documentFrequency, options.maxConcepts || 160)
  return { ...parsed, chapters, concepts }
}

export function tokenize(text, includeShort = false) {
  const normalized = String(text || '').normalize('NFKC').toLowerCase()
  const matches = normalized.match(/[\p{Script=Han}]{2,8}|[\p{L}][\p{L}\p{N}_'-]{2,}/gu) || []
  const terms = []
  for (const match of matches) {
    if (/^[\p{Script=Han}]+$/u.test(match) && match.length > 4) {
      for (let length = 2; length <= Math.min(4, match.length); length += 1) {
        for (let index = 0; index <= match.length - length; index += 1) terms.push(match.slice(index, index + length))
      }
    } else {
      terms.push(match)
    }
  }
  return terms.filter((term) => !STOP_WORDS.has(term) && (includeShort || term.length >= 2))
}

function buildConcepts(chapters, documentFrequency, limit) {
  const candidates = [...documentFrequency.entries()]
    .filter(([, frequency]) => frequency >= Math.min(2, chapters.length))
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit * 2)
  const concepts = []
  for (const [label] of candidates) {
    const occurrences = []
    for (const chapter of chapters) {
      for (const paragraph of chapter.paragraphs) {
        let from = 0
        while (from < paragraph.text.length && occurrences.length < 100) {
          const offset = paragraph.text.toLowerCase().indexOf(label, from)
          if (offset < 0) break
          occurrences.push({
            chapterId: chapter.id,
            paragraphId: paragraph.id,
            offset,
            length: label.length,
            excerpt: excerptAt(paragraph.text, offset, label.length),
            anchor: paragraph.anchor,
          })
          from = offset + label.length
        }
      }
    }
    if (occurrences.length >= 2) concepts.push({
      id: stableId('concept', label),
      label,
      frequency: occurrences.length,
      chapterCount: new Set(occurrences.map((item) => item.chapterId)).size,
      firstChapterId: occurrences[0].chapterId,
      occurrences,
      source: 'extracted',
    })
    if (concepts.length >= limit) break
  }
  return concepts
}

function extractiveSummary(paragraphs, keywords) {
  const scored = paragraphs.map((paragraph, index) => ({
    text: paragraph.text,
    index,
    score: keywords.reduce((total, term) => total + (paragraph.text.toLowerCase().includes(term) ? 1 : 0), 0) + (index === 0 ? 0.5 : 0),
  })).filter((item) => item.text.length >= 24).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 2).sort((a, b) => a.index - b.index)
  return scored.map((item) => item.text).join(' ').slice(0, 420)
}

function excerptAt(text, offset, length) {
  const start = Math.max(0, offset - 42)
  const end = Math.min(text.length, offset + length + 42)
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

function count(items) {
  const result = new Map()
  for (const item of items) result.set(item, (result.get(item) || 0) + 1)
  return result
}
