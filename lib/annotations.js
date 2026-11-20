import { codedError, stableId } from './util.js'

const KINDS = new Set(['highlight', 'underline', 'comment', 'concept'])
const COLORS = new Set(['brand', 'success', 'warning', 'error'])

export function addAnnotation(book, input) {
  const paragraph = findParagraph(book, input.chapterId, input.paragraphId)
  const start = integer(input.start, 0, paragraph.text.length)
  const end = integer(input.end, start + 1, paragraph.text.length)
  const kind = KINDS.has(input.kind) ? input.kind : 'highlight'
  const annotation = {
    id: stableId('annotation', book.id, paragraph.id, String(start), String(end), String(Date.now())),
    kind,
    chapterId: input.chapterId,
    paragraphId: input.paragraphId,
    start,
    end,
    text: paragraph.text.slice(start, end),
    note: typeof input.note === 'string' ? input.note.slice(0, 4000) : '',
    color: COLORS.has(input.color) ? input.color : 'brand',
    createdAt: new Date().toISOString(),
  }
  book.annotations ||= []
  book.annotations.push(annotation)
  if (kind === 'concept') addUserConcept(book, annotation)
  return annotation
}

export function removeAnnotation(book, annotationId) {
  const annotations = book.annotations || []
  const index = annotations.findIndex((item) => item.id === annotationId)
  if (index < 0) throw codedError('ANNOTATION_NOT_FOUND', 'Annotation was not found', 404)
  const [removed] = annotations.splice(index, 1)
  if (removed.kind === 'concept') book.concepts = book.concepts.filter((concept) => concept.annotationId !== removed.id)
  return removed
}

function addUserConcept(book, annotation) {
  const label = annotation.text.trim()
  if (!label) return
  book.concepts.push({
    id: stableId('concept', 'user', annotation.id),
    label,
    frequency: 1,
    chapterCount: 1,
    firstChapterId: annotation.chapterId,
    source: 'user',
    annotationId: annotation.id,
    occurrences: [{
      chapterId: annotation.chapterId,
      paragraphId: annotation.paragraphId,
      offset: annotation.start,
      length: annotation.end - annotation.start,
      excerpt: annotation.text,
      anchor: { chapterId: annotation.chapterId, paragraphId: annotation.paragraphId },
    }],
  })
}

function findParagraph(book, chapterId, paragraphId) {
  const chapter = book.chapters.find((item) => item.id === chapterId)
  const paragraph = chapter?.paragraphs.find((item) => item.id === paragraphId)
  if (!paragraph) throw codedError('PARAGRAPH_NOT_FOUND', 'Source paragraph was not found', 404)
  return paragraph
}

function integer(value, min, max) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < min || number > max) throw codedError('INVALID_RANGE', 'Annotation range is invalid')
  return number
}
