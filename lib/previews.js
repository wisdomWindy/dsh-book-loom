import { makeChapter } from './parsers/common.js'
import { codedError } from './util.js'

export function publicPreview(preview) {
  return {
    id: preview.id,
    filename: preview.options.filename,
    title: preview.parsed.title,
    format: preview.parsed.format,
    metadata: preview.parsed.metadata,
    createdAt: preview.createdAt,
    chapters: preview.parsed.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      level: chapter.level,
      paragraphCount: chapter.paragraphs.length,
      characterCount: chapter.paragraphs.reduce((total, item) => total + item.text.length, 0),
      confidence: chapter.structureConfidence,
      excerpt: chapter.paragraphs[0]?.text.slice(0, 180) || '',
    })),
  }
}

export function editPreview(parsed, operation = {}) {
  const chapters = parsed.chapters
  const index = chapters.findIndex((chapter) => chapter.id === operation.chapterId)
  if (index < 0) throw codedError('CHAPTER_NOT_FOUND', 'Preview chapter was not found', 404)
  if (operation.action === 'update') {
    const title = String(operation.title || '').trim()
    const level = Number(operation.level)
    if (!title || title.length > 180) throw codedError('INVALID_TITLE', 'Chapter title must contain 1 to 180 characters')
    if (!Number.isInteger(level) || level < 1 || level > 6) throw codedError('INVALID_LEVEL', 'Chapter level must be between 1 and 6')
    chapters[index] = { ...chapters[index], title, level, structureConfidence: 'user-confirmed' }
  } else if (operation.action === 'merge') {
    if (index === 0) throw codedError('INVALID_MERGE', 'The first chapter cannot merge with a previous chapter')
    const previous = chapters[index - 1]
    const current = chapters[index]
    chapters.splice(index - 1, 2, rebuildChapter(previous, index - 1, {
      title: String(operation.title || previous.title).trim() || previous.title,
      paragraphs: [...previous.paragraphs, ...current.paragraphs],
      confidence: 'user-confirmed',
    }))
  } else if (operation.action === 'split') {
    const chapter = chapters[index]
    const paragraphIndex = Number(operation.paragraphIndex)
    if (!Number.isInteger(paragraphIndex) || paragraphIndex < 1 || paragraphIndex >= chapter.paragraphs.length) {
      throw codedError('INVALID_SPLIT', 'Split position must be between chapter paragraphs')
    }
    const secondTitle = String(operation.title || `${chapter.title} (2)`).trim()
    if (!secondTitle || secondTitle.length > 180) throw codedError('INVALID_TITLE', 'Split chapter title must contain 1 to 180 characters')
    chapters.splice(index, 1,
      rebuildChapter(chapter, index, { paragraphs: chapter.paragraphs.slice(0, paragraphIndex), confidence: 'user-confirmed' }),
      rebuildChapter(chapter, index + 1, { title: secondTitle, paragraphs: chapter.paragraphs.slice(paragraphIndex), confidence: 'user-confirmed' }),
    )
  } else {
    throw codedError('INVALID_PREVIEW_ACTION', 'Preview action must be update, merge, or split')
  }
  parsed.chapters = reindexChapters(chapters)
  return parsed
}

export function structureOnlyBook(parsed) {
  const chapters = reindexChapters(parsed.chapters).map((chapter) => ({
    ...chapter,
    wordCount: chapter.paragraphs.reduce((total, item) => total + item.text.split(/\s+/).filter(Boolean).length, 0),
    keywords: [],
    summary: chapter.paragraphs[0]?.text.slice(0, 420) || '',
  }))
  const relations = []
  for (let index = 1; index < chapters.length; index += 1) {
    const source = chapters[index - 1]
    const target = chapters[index]
    relations.push({
      id: `relation_structure_${source.id}_${target.id}`,
      type: 'structure',
      source: source.id,
      target: target.id,
      weight: 1,
      evidence: ['reading order'],
      inferred: false,
      anchors: [source.paragraphs[0]?.anchor, target.paragraphs[0]?.anchor].filter(Boolean),
    })
  }
  return { ...parsed, chapters, concepts: [], relations }
}

function rebuildChapter(chapter, index, options = {}) {
  const paragraphs = options.paragraphs || chapter.paragraphs
  return makeChapter({
    title: options.title || chapter.title,
    level: chapter.level,
    index,
    text: paragraphs.map((item) => item.text).join('\n\n'),
    sourceAnchor: { ...chapter.sourceAnchor, confidence: options.confidence || chapter.structureConfidence },
    parentId: null,
  })
}

function reindexChapters(chapters) {
  const oldToNew = new Map()
  const next = chapters.map((chapter, index) => {
    const rebuilt = rebuildChapter(chapter, index)
    oldToNew.set(chapter.id, rebuilt.id)
    return rebuilt
  })
  return next.map((chapter, index) => ({
    ...chapter,
    index,
    parentId: chapters[index].parentId ? oldToNew.get(chapters[index].parentId) || null : null,
  }))
}
