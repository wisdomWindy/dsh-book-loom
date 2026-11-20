import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import { indexBook } from '../lib/indexer.js'
import { parseMarkdown } from '../lib/parsers/index.js'
import { buildRelations } from '../lib/relations.js'

const chapterCount = 300
const paragraph = 'Observation connects evidence to action through a durable feedback system. Context, sequence, source anchors, and reflection keep every decision traceable.'
const source = Array.from({ length: chapterCount }, (_, chapter) => `# Chapter ${chapter + 1}\n\n${Array.from({ length: 16 }, (_, index) => `${paragraph} Chapter ${chapter + 1} paragraph ${index + 1} develops theme-${chapter % 12}.`).join('\n\n')}`).join('\n\n')
const buffer = Buffer.from(source)

const structureStarted = performance.now()
const parsed = parseMarkdown(buffer, { filename: 'performance-300-pages.md' })
const structureMs = performance.now() - structureStarted

const analysisStarted = performance.now()
const indexed = indexBook(parsed)
const connected = buildRelations(indexed, { similarityThreshold: 0.72 })
const analysisMs = performance.now() - analysisStarted
const totalMs = structureMs + analysisMs

assert.equal(parsed.chapters.length, chapterCount)
assert.ok(structureMs < 3000, `structure parse exceeded 3 seconds: ${structureMs.toFixed(1)}ms`)
assert.ok(totalMs < 60_000, `full analysis exceeded 60 seconds: ${totalMs.toFixed(1)}ms`)
assert.ok(connected.relations.length > 0)

console.log(JSON.stringify({
  fixtureBytes: buffer.byteLength,
  approximateWords: source.split(/\s+/).length,
  chapters: parsed.chapters.length,
  concepts: connected.concepts.length,
  relations: connected.relations.length,
  structureMs: Number(structureMs.toFixed(1)),
  analysisMs: Number(analysisMs.toFixed(1)),
  totalMs: Number(totalMs.toFixed(1)),
  thresholds: { structureMs: 3000, totalMs: 60000 },
}))
