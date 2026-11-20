import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'

const entry = await fs.readFile(new URL('../src/client-entry.js', import.meta.url), 'utf8')
const source = await fs.readFile(new URL('../src/client-app.jsx', import.meta.url), 'utf8')
const styles = await fs.readFile(new URL('../src/styles.js', import.meta.url), 'utf8')
const graphUtils = await import('../src/graph-utils.js')
const manifest = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('client loader, manifest, and DSH main-panel contracts stay aligned', () => {
  assert.equal(manifest.name, '@local/dsh-book-loom')
  assert.equal(manifest.engines.dsh, '0.2.2-rc.3')
  assert.deepEqual(manifest.dsh.compatibility.dshReleases, { '0.2.2-rc.3': 'compatible' })
  assert.match(entry, /id: '@local\/dsh-book-loom'/)
  assert.match(entry, /__BOOK_LOOM_REACT__/)
  assert.match(source, /ctx\.slots\.inject\('main'/)
  assert.match(source, /name: 'main', key: 'book-loom'/)
  assert.match(source, /ctx\.slots\.inject\('sidebar\.panellist'/)
  assert.match(source, /name: 'sidebar\.panellist', id: 'book-loom'/)
})

test('client has error containment, progressive reveal, and both graph renderers', () => {
  assert.match(source, /class BookLoomBoundary extends React\.Component/)
  assert.match(source, /progressiveReveal/)
  assert.match(source, /nodes\.length > 200 \? <CanvasGraph/)
  assert.match(source, /<SvgGraph/)
  assert.match(styles, /prefers-reduced-motion/)
  assert.match(source, /OCR/)
  assert.match(source, /PreviewEditor/)
  assert.match(source, /PathControls/)
  assert.match(source, /compareKeywordSets/)
  assert.match(source, /onPointerMove/)
  assert.match(source, /annotationColors/)
  assert.match(source, /onVisibleChapter/)
})

test('styles use DSH design tokens without hexadecimal colors', () => {
  assert.match(styles, /var\(--dsw-/)
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i)
  assert.match(styles, /@media\(max-width:720px\)/)
})

test('shortest path and multi-chapter keyword comparison are deterministic', () => {
  const relations = [
    { id: 'ab', source: 'a', target: 'b', type: 'structure' },
    { id: 'bc', source: 'b', target: 'c', type: 'concept' },
    { id: 'ad', source: 'a', target: 'd', type: 'theme' },
  ]
  assert.deepEqual(graphUtils.shortestPath(relations, 'a', 'c'), { nodeIds: ['a', 'b', 'c'], edgeIds: ['ab', 'bc'] })
  assert.deepEqual(graphUtils.shortestPath(relations, 'a', 'c', 'structure'), { nodeIds: [], edgeIds: [] })
  const compared = graphUtils.compareKeywordSets([
    { id: 'a', keywords: [{ term: 'feedback' }, { term: 'system' }] },
    { id: 'b', keywords: [{ term: 'feedback' }, { term: 'action' }] },
  ], ['a', 'b'])
  assert.deepEqual([...compared.shared], ['feedback'])
})
