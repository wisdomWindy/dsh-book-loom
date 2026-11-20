import { stableId } from './util.js'

export function buildRelations(book, options = {}) {
  const threshold = Number(options.similarityThreshold || 0.22)
  const relations = []
  const conceptsByChapter = chapterConceptIndex(book.concepts)
  for (let index = 0; index < book.chapters.length; index += 1) {
    const chapter = book.chapters[index]
    if (index > 0) relations.push(relation('structure', book.chapters[index - 1], chapter, 1, ['reading order']))
    if (chapter.parentId) {
      const parent = book.chapters.find((item) => item.id === chapter.parentId)
      if (parent) relations.push(relation('structure', parent, chapter, 1, ['table of contents']))
    }
  }
  for (let leftIndex = 0; leftIndex < book.chapters.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < book.chapters.length; rightIndex += 1) {
      const left = book.chapters[leftIndex]
      const right = book.chapters[rightIndex]
      const similarity = cosine(left.keywords, right.keywords)
      if (similarity >= threshold) {
        const shared = sharedTerms(left.keywords, right.keywords).slice(0, 6)
        relations.push(relation('theme', left, right, similarity, shared))
      }
      const sharedConcepts = intersectConcepts(conceptsByChapter.get(left.id), conceptsByChapter.get(right.id), 8)
      if (sharedConcepts.length > 0) relations.push(relation('concept', left, right, Math.min(1, sharedConcepts.length / 5), sharedConcepts))
      if (rightIndex === leftIndex + 1) {
        const signals = argumentSignals(left, right)
        if (signals.length > 0) relations.push(relation('argument', left, right, Math.min(0.9, 0.35 + signals.length * 0.12), signals, true))
      }
    }
  }
  return { ...book, relations: deduplicate(relations) }
}

function chapterConceptIndex(concepts = []) {
  const result = new Map()
  for (const concept of concepts) {
    for (const chapterId of new Set(concept.occurrences.map((item) => item.chapterId))) {
      const labels = result.get(chapterId) || new Set()
      labels.add(concept.label)
      result.set(chapterId, labels)
    }
  }
  return result
}

function intersectConcepts(left = new Set(), right = new Set(), limit = 8) {
  const [small, large] = left.size <= right.size ? [left, right] : [right, left]
  const result = []
  for (const label of small) {
    if (large.has(label)) result.push(label)
    if (result.length >= limit) break
  }
  return result
}

function relation(type, source, target, weight, evidence, inferred = false) {
  return {
    id: stableId('relation', type, source.id, target.id),
    type,
    source: source.id,
    target: target.id,
    weight: Number(weight.toFixed(3)),
    evidence,
    inferred,
    anchors: [firstAnchor(source), firstAnchor(target)].filter(Boolean),
  }
}

function firstAnchor(chapter) {
  const paragraph = chapter.paragraphs[0]
  return paragraph ? { chapterId: chapter.id, paragraphId: paragraph.id, ...paragraph.anchor } : null
}

function cosine(left, right) {
  const a = new Map(left.map((item) => [item.term, item.weight]))
  const b = new Map(right.map((item) => [item.term, item.weight]))
  let dot = 0; let an = 0; let bn = 0
  for (const value of a.values()) an += value * value
  for (const [term, value] of b) { bn += value * value; dot += value * (a.get(term) || 0) }
  return an && bn ? dot / Math.sqrt(an * bn) : 0
}

function sharedTerms(left, right) {
  const rightSet = new Set(right.map((item) => item.term))
  return left.filter((item) => rightSet.has(item.term)).map((item) => item.term)
}

function argumentSignals(left, right) {
  const tail = left.paragraphs.slice(-2).map((item) => item.text).join(' ')
  const head = right.paragraphs.slice(0, 2).map((item) => item.text).join(' ')
  const patterns = [
    ['therefore', /\b(therefore|thus|consequently|next)\b/i],
    ['contrast', /\b(however|but|instead|nevertheless)\b/i],
    ['承接信号', /(因此|所以|由此|接下来|进一步)/u],
    ['转折信号', /(但是|然而|相反|不过)/u],
  ]
  return patterns.filter(([, pattern]) => pattern.test(`${tail} ${head}`)).map(([label]) => label)
}

function deduplicate(items) {
  return [...new Map(items.filter((item) => item.anchors.length === 2).map((item) => [item.id, item])).values()]
}
