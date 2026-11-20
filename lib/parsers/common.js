import { cleanWhitespace, stableId } from '../util.js'

export function paragraphsFromText(text, chapterId, anchor = {}) {
  const chunks = cleanWhitespace(text).split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean)
  return chunks.map((value, index) => ({
    id: stableId('para', chapterId, String(index), value.slice(0, 120)),
    index,
    text: value,
    anchor: { chapterId, paragraphIndex: index, ...anchor },
  }))
}

export function makeChapter({ title, level = 1, index, text, sourceAnchor = {}, parentId = null }) {
  const id = stableId('chapter', String(index), title, String(sourceAnchor.href || sourceAnchor.page || ''))
  return {
    id,
    title: title?.trim() || `Chapter ${index + 1}`,
    level,
    index,
    parentId,
    sourceAnchor,
    paragraphs: paragraphsFromText(text, id, sourceAnchor),
    structureConfidence: sourceAnchor.confidence || 'high',
  }
}

export function finalizeBook(title, format, chapters, metadata = {}) {
  const nonEmpty = chapters.filter((chapter) => chapter.paragraphs.length > 0)
  return {
    title: title?.trim() || 'Untitled book',
    format,
    metadata,
    chapters: nonEmpty.map((chapter, index) => ({ ...chapter, index })),
  }
}
