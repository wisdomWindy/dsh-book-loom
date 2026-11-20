const React = require('react')
import {
  AlignLeft, BookOpen, BookOpenText, Check, ChevronDown, ChevronRight, CircleAlert,
  Cloud, Columns3, FileUp, Focus, GitFork, GitMerge, Highlighter, LoaderCircle,
  Maximize2, Network, PanelBottomOpen, Pencil, Scissors, Search, Settings2, Sparkles, Trash2,
  Underline, Waypoints, X,
} from 'lucide-react'
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force'
import { compareKeywordSets, shortestPath } from './graph-utils.js'
import { STYLES } from './styles.js'

const { useCallback, useEffect, useMemo, useRef, useState } = React
const API = '/api/dsh-book-loom'
const RELATION_LABELS = { structure: '结构', theme: '主题相似', concept: '概念共享', argument: '论证承接' }
const VIEW_LABELS = { chapters: '章节图', radial: '脉络', concepts: '概念', words: '词云' }
const DEFAULT_ANNOTATION_COLORS = { highlight: 'brand', underline: 'success', comment: 'warning', concept: 'error' }
const BUILD_MARK = '0.2.4'

export function createBookLoomPlugin() {
  const inject = ['slots', 'layout']
  function apply(ctx) {
    installStyles(ctx)
    ctx.slots.inject('main', () => {
      const dispose = ctx.slots.register({ name: 'main', key: 'book-loom' }, (props) => <BookLoomBoundary ctx={ctx} {...props} />)
      return () => { ctx.layout.selectPanel(null); dispose() }
    })
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
      name: 'sidebar.panellist', id: 'book-loom', order: 24, label: '书脉',
    }, ({ size }) => <BookOpenText size={size} />))
  }
  return { inject, apply }
}

class BookLoomBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error('BookLoom panel failed', error) }
  render() {
    if (this.state.error) return <div className="bl-fatal" role="alert"><CircleAlert size={28} /><h2>书脉暂时无法显示</h2><p>{messageOf(this.state.error)}</p><button onClick={() => this.setState({ error: null })}>重试</button></div>
    return <BookLoomApp />
  }
}

function BookLoomApp() {
  const [state, setState] = useState({ books: [], jobs: [], capabilities: {} })
  const [book, setBook] = useState(null)
  const [preview, setPreview] = useState(null)
  const [view, setView] = useState('chapters')
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState(new Set(['structure', 'theme', 'concept', 'argument']))
  const [query, setQuery] = useState('')
  const [readerOpen, setReaderOpen] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [pathMode, setPathMode] = useState(false)
  const [pathDraft, setPathDraft] = useState({ startId: '', targetId: '', type: 'all' })
  const [currentReadingId, setCurrentReadingId] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const refreshTimer = useRef(null)

  const refresh = useCallback(async () => {
    const next = await api('/state')
    setState(next)
    return next
  }, [])

  useEffect(() => { refresh().catch((reason) => setError(messageOf(reason))) }, [refresh])
  useEffect(() => {
    if (!state.jobs.some((job) => job.status === 'running')) return
    refreshTimer.current = window.setInterval(async () => {
      try {
        const next = await refresh()
        const completed = next.jobs.find((job) => job.status === 'completed' && (!state.books.some((item) => item.id === job.bookId) || book?.id === job.bookId))
        if (completed) setBook(await api(`/books/${encodeURIComponent(completed.bookId)}`))
      } catch (reason) { setError(messageOf(reason)) }
    }, 900)
    return () => window.clearInterval(refreshTimer.current)
  }, [refresh, state.jobs, state.books, book?.id])

  const openBook = useCallback(async (id) => {
    try {
      const next = await api(`/books/${encodeURIComponent(id)}`)
      setBook(next); setSelected(null); setError('')
    } catch (reason) { setError(messageOf(reason)) }
  }, [])

  async function importFile(file, encoding) {
    if (!file || uploading) return
    setUploading(true); setError('')
    try {
      const suffix = encoding ? `&encoding=${encodeURIComponent(encoding)}` : ''
      const next = await api(`/previews?filename=${encodeURIComponent(file.name)}${suffix}`, { method: 'POST', raw: file, contentType: file.type || 'application/octet-stream' })
      setPreview(next)
    } catch (reason) {
      if (reason.code === 'ENCODING_REQUIRED') {
        const encodingChoice = window.prompt(`无法确定文本编码。请输入编码：\n${(reason.data?.choices || []).join(' / ')}`, reason.data?.detectedEncoding || 'UTF-8')
        if (encodingChoice) { setUploading(false); return importFile(file, encodingChoice) }
      }
      setError(messageOf(reason))
    } finally { setUploading(false) }
  }

  async function editImportPreview(operation) {
    const next = await api(`/previews/${encodeURIComponent(preview.id)}/edit`, { method: 'POST', body: operation })
    setPreview(next)
  }

  async function confirmImportPreview() {
    setUploading(true); setError('')
    try {
      const job = await api(`/previews/${encodeURIComponent(preview.id)}/confirm`, { method: 'POST' })
      setPreview(null)
      await refresh()
      setBook(await api(`/books/${encodeURIComponent(job.bookId)}`))
    } catch (reason) { setError(messageOf(reason)) } finally { setUploading(false) }
  }

  async function cancelImportPreview() {
    try { await api(`/previews/${encodeURIComponent(preview.id)}`, { method: 'DELETE' }) } catch {}
    setPreview(null)
  }

  async function removeBook(id) {
    if (!window.confirm('删除这本书的结构化文本、图谱与批注？此操作不可撤销。')) return
    try {
      await api(`/books/${encodeURIComponent(id)}`, { method: 'DELETE', body: { confirm: id } })
      if (book?.id === id) setBook(null)
      await refresh()
    } catch (reason) { setError(messageOf(reason)) }
  }

  if (preview) return <PreviewEditor preview={preview} busy={uploading} onEdit={editImportPreview} onConfirm={confirmImportPreview} onCancel={cancelImportPreview} />
  if (!book) return <LibraryView state={state} uploading={uploading} error={error} onImport={importFile} onOpen={openBook} onRemove={removeBook} />

  const visible = visibleChapters(book)
  const selection = resolveSelection(book, selected)
  const results = searchBook(book, query)
  const pathResult = shortestPath(book.relations, pathDraft.startId, pathDraft.targetId, pathDraft.type)
  function chooseGraphItem(value) {
    if (!pathMode || value.kind !== 'chapter') { setSelected(value); return }
    setPathDraft((current) => current.startId && !current.targetId ? { ...current, targetId: value.id } : { ...current, startId: value.id, targetId: '' })
    setSelected(value)
  }

  return <main className={`bl-shell ${pathMode ? 'path-open' : ''}`} data-build={BUILD_MARK}>
    <header className="bl-toolbar">
      <button className="bl-book-button" onClick={() => { setBook(null); setSelected(null) }} title="返回书库"><BookOpen size={18} /><span>{book.title}</span><ChevronDown size={14} /></button>
      <nav className="bl-view-tabs" aria-label="视图">
        {Object.entries(VIEW_LABELS).map(([key, label]) => <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)} title={label} aria-label={label}>{viewIcon(key)}<span>{label}</span></button>)}
      </nav>
      <label className="bl-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索章节、概念或原文" /></label>
      <button className={`bl-icon-command ${pathMode ? 'active' : ''}`} onClick={() => setPathMode((value) => !value)} title="路径模式" aria-label="路径模式"><Focus size={17} /></button>
      <button className={`bl-icon-command ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen((value) => !value)} title="批注设置" aria-label="批注设置"><Settings2 size={17} /></button>
      <ProgressControl book={book} onChange={async (progress, progressiveReveal) => {
        const userState = await api(`/books/${book.id}/progress`, { method: 'POST', body: { progress, progressiveReveal } })
        setBook((current) => ({ ...current, userState }))
      }} />
    </header>
    {pathMode && <PathControls book={book} draft={pathDraft} result={pathResult} onChange={setPathDraft} onClose={() => setPathMode(false)} />}
    {settingsOpen && <AnnotationSettings colors={book.userState?.annotationColors || DEFAULT_ANNOTATION_COLORS} onChange={async (annotationColors) => { const userState = await api(`/books/${book.id}/settings`, { method: 'POST', body: { annotationColors } }); setBook((current) => ({ ...current, userState })) }} onClose={() => setSettingsOpen(false)} />}
    {book.analysisStatus === 'processing' && <div className="bl-processing"><LoaderCircle className="bl-spin" size={15} />正在补齐概念与关系</div>}
    {error && <div className="bl-banner" role="alert"><CircleAlert size={16} />{error}<button onClick={() => setError('')} title="关闭"><X size={15} /></button></div>}
    {query && <SearchResults results={results} onSelect={(item) => { setSelected(item); setReaderOpen(item.kind !== 'concept') }} />}
    <div className="bl-workspace">
      <ChapterTree chapters={book.chapters} visible={visible} selected={selected} onSelect={(item) => { setSelected({ kind: 'chapter', id: item.id }); setReaderOpen(true) }} />
      <section className="bl-canvas">
        {view === 'chapters' && <ChapterGraph book={book} chapters={visible} filters={filters} selected={selected} path={pathResult} currentReadingId={currentReadingId} onSelect={chooseGraphItem} />}
        {view === 'radial' && <RadialView book={book} chapters={visible} selected={selected} path={pathResult} currentReadingId={currentReadingId} onSelect={chooseGraphItem} />}
        {view === 'concepts' && <ConceptGraph book={book} chapters={visible} selected={selected} currentReadingId={currentReadingId} onSelect={chooseGraphItem} />}
        {view === 'words' && <WordCloud book={book} selected={selected} onSelect={setSelected} />}
        <RelationLegend filters={filters} setFilters={setFilters} />
      </section>
      <DetailPanel book={book} selection={selection} onSelect={(value) => { setSelected(value); setReaderOpen(true) }} />
    </div>
    <Reader book={book} selection={selection} open={readerOpen} onOpen={setReaderOpen} onBook={setBook} onSelect={setSelected} onVisibleChapter={setCurrentReadingId} annotationColors={book.userState?.annotationColors || DEFAULT_ANNOTATION_COLORS} />
  </main>
}

function LibraryView({ state, uploading, error, onImport, onOpen, onRemove }) {
  const input = useRef(null)
  return <main className="bl-library">
    <header><div><BookOpenText size={24} /><h1>书脉</h1></div><ImportButton input={input} uploading={uploading} onImport={onImport} /></header>
    {error && <div className="bl-library-error" role="alert"><CircleAlert size={18} />{error}</div>}
    {state.jobs.filter((job) => job.status !== 'completed').map((job) => <ImportJob key={job.id} job={job} />)}
    {state.books.length === 0 && state.jobs.length === 0 ? <section className="bl-empty">
      <div className="bl-empty-mark"><Waypoints size={34} /></div><h2>导入一本书，查看它的内部脉络</h2><p>支持 EPUB、Markdown、TXT 和含文本层的 PDF；扫描版 PDF 请先 OCR</p><ImportButton input={input} uploading={uploading} onImport={onImport} primary />
    </section> : <section className="bl-book-grid">{state.books.map((item) => <article className="bl-book-card" key={item.id}>
      <button className="bl-book-open" onClick={() => onOpen(item.id)}><span className="bl-cover"><BookOpen size={25} /></span><strong>{item.title}</strong><small>{item.chapterCount} 章 · {item.conceptCount} 个概念</small><progress value={item.progress || 0} max="1" /></button>
      <button className="bl-delete" onClick={() => onRemove(item.id)} title="删除"><Trash2 size={16} /></button>
    </article>)}</section>}
  </main>
}

function PreviewEditor({ preview, busy, onEdit, onConfirm, onCancel }) {
  const [error, setError] = useState('')
  async function edit(operation) {
    try { setError(''); await onEdit(operation) } catch (reason) { setError(messageOf(reason)) }
  }
  return <main className="bl-preview">
    <header><div><BookOpenText size={22} /><div><h1>章节树预览</h1><small>{preview.filename} · {preview.format.toUpperCase()}</small></div></div><div><button className="bl-command" onClick={onCancel} disabled={busy}><X size={16} />取消</button><button className="bl-primary" onClick={onConfirm} disabled={busy}><Check size={16} />确认并解析</button></div></header>
    {error && <div className="bl-library-error" role="alert"><CircleAlert size={17} />{error}</div>}
    <section className="bl-preview-list">{preview.chapters.map((chapter, index) => <article key={chapter.id} className="bl-preview-row">
      <span className="bl-tree-index">{index + 1}</span>
      <div className="bl-preview-fields"><label><span>标题</span><input defaultValue={chapter.title} onBlur={(event) => { const title = event.target.value.trim(); if (title && title !== chapter.title) edit({ action: 'update', chapterId: chapter.id, title, level: chapter.level }) }} /></label><label><span>层级</span><select value={chapter.level} onChange={(event) => edit({ action: 'update', chapterId: chapter.id, title: chapter.title, level: Number(event.target.value) })}>{[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={level}>H{level}</option>)}</select></label></div>
      <div className="bl-preview-meta"><span>{chapter.paragraphCount} 段</span><span>{chapter.characterCount} 字</span><span>{confidenceLabel(chapter.confidence)}</span><p>{chapter.excerpt}</p></div>
      <div className="bl-preview-actions"><button title="重命名" onClick={(event) => event.currentTarget.closest('article').querySelector('input')?.focus()}><Pencil size={15} /></button><button title="与上一章合并" disabled={index === 0} onClick={() => edit({ action: 'merge', chapterId: chapter.id })}><GitMerge size={15} /></button><button title="按段落拆分" disabled={chapter.paragraphCount < 2} onClick={() => { const value = window.prompt(`拆分位置（1-${chapter.paragraphCount - 1}）`, String(Math.max(1, Math.floor(chapter.paragraphCount / 2)))); if (value) edit({ action: 'split', chapterId: chapter.id, paragraphIndex: Number(value) }) }}><Scissors size={15} /></button></div>
    </article>)}</section>
  </main>
}

function PathControls({ book, draft, result, onChange, onClose }) {
  return <div className="bl-path-controls">
    <Focus size={16} />
    <label><span>起点</span><select value={draft.startId} onChange={(event) => onChange({ ...draft, startId: event.target.value, targetId: event.target.value === draft.targetId ? '' : draft.targetId })}><option value="">选择章节</option>{book.chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>
    <ChevronRight size={14} />
    <label><span>终点</span><select value={draft.targetId} onChange={(event) => onChange({ ...draft, targetId: event.target.value })}><option value="">选择章节</option>{book.chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>
    <label><span>关系</span><select value={draft.type} onChange={(event) => onChange({ ...draft, type: event.target.value })}><option value="all">全部</option>{Object.entries(RELATION_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <output className={draft.startId && draft.targetId && result.nodeIds.length === 0 ? 'empty' : ''}>{result.nodeIds.length > 0 ? `${result.nodeIds.length} 个节点` : draft.startId && draft.targetId ? '无可达路径' : ''}</output>
    <button onClick={onClose} title="关闭路径模式"><X size={15} /></button>
  </div>
}

function AnnotationSettings({ colors, onChange, onClose }) {
  const labels = { highlight: '高亮', underline: '划线', comment: '批注', concept: '概念' }
  const choices = ['brand', 'success', 'warning', 'error']
  return <div className="bl-annotation-settings"><header><strong>批注语义色</strong><button onClick={onClose} title="关闭"><X size={15} /></button></header>{Object.entries(labels).map(([kind, label]) => <div key={kind}><span>{label}</span><div>{choices.map((color) => <button key={color} className={colors[kind] === color ? 'active' : ''} data-color={color} title={color} aria-label={`${label}：${color}`} onClick={() => onChange({ ...colors, [kind]: color })} />)}</div></div>)}</div>
}

function ImportButton({ input, uploading, onImport, primary = false }) {
  return <><input ref={input} className="bl-file-input" type="file" accept=".epub,.md,.markdown,.txt,.pdf,application/epub+zip,text/markdown,text/plain,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = '' }} />
    <button className={primary ? 'bl-primary' : 'bl-command'} disabled={uploading} onClick={() => input.current?.click()}>{uploading ? <LoaderCircle className="bl-spin" size={17} /> : <FileUp size={17} />}导入书籍</button></>
}

function ImportJob({ job }) {
  const labels = { queued: '等待解析', structure: '正在提取章节结构', keywords: '正在抽取关键词', relations: '正在建立关系', saving: '正在保存', cancelled: '已取消' }
  return <section className={`bl-job ${job.status}`}><div><LoaderCircle className={job.status === 'running' ? 'bl-spin' : ''} size={18} /><strong>{job.filename}</strong><span>{job.error?.message || labels[job.stage] || job.stage}</span></div><progress value={job.progress || 0} max="1" /></section>
}

function ProgressControl({ book, onChange }) {
  const state = book.userState || {}
  const percent = Math.round((state.progress || 0) * 100)
  return <div className="bl-progress-control"><label title="阅读进度"><span>{percent}%</span><input type="range" min="0" max="100" value={percent} onChange={(event) => onChange(Number(event.target.value) / 100, state.progressiveReveal)} /></label><label className="bl-toggle"><input type="checkbox" checked={state.progressiveReveal !== false} onChange={(event) => onChange(state.progress || 0, event.target.checked)} /><span />只看当前进度</label></div>
}

function ChapterTree({ chapters, visible, selected, onSelect }) {
  const visibleIds = new Set(visible.map((item) => item.id))
  return <aside className="bl-tree"><h2>章节</h2><div className="bl-tree-list">{chapters.map((chapter) => <button key={chapter.id} style={{ '--bl-depth': Math.max(0, chapter.level - 1) }} className={`${selected?.id === chapter.id ? 'active ' : ''}${visibleIds.has(chapter.id) ? '' : 'locked'}`} onClick={() => onSelect(chapter)}><span className="bl-tree-index">{chapter.index + 1}</span><span>{chapter.title}</span></button>)}</div></aside>
}

function ChapterGraph({ book, chapters, filters, selected, path, currentReadingId, onSelect }) {
  const chapterIds = new Set(chapters.map((item) => item.id))
  const links = book.relations.filter((item) => filters.has(item.type) && chapterIds.has(item.source) && chapterIds.has(item.target))
  return <GraphSurface nodes={chapters.map((chapter) => ({ id: chapter.id, label: chapter.title, size: 8 + Math.min(20, Math.sqrt(chapter.wordCount || 1)), group: Math.max(1, chapter.level) }))} links={links} selected={selected} path={path} currentReadingId={currentReadingId} onSelect={(item) => onSelect(item.type ? { kind: 'relation', id: item.id } : { kind: 'chapter', id: item.id })} />
}

function ConceptGraph({ book, chapters, selected, currentReadingId, onSelect }) {
  const chapterIds = new Set(chapters.map((item) => item.id))
  const concepts = book.concepts.filter((concept) => concept.occurrences.some((item) => chapterIds.has(item.chapterId))).slice(0, 180)
  const paragraphConcepts = new Map()
  for (const concept of concepts) for (const occurrence of concept.occurrences) {
    const values = paragraphConcepts.get(occurrence.paragraphId) || []
    values.push(concept.id); paragraphConcepts.set(occurrence.paragraphId, values)
  }
  const pairs = new Map()
  for (const values of paragraphConcepts.values()) for (let a = 0; a < values.length; a += 1) for (let b = a + 1; b < values.length; b += 1) {
    const key = [values[a], values[b]].sort().join(':'); pairs.set(key, (pairs.get(key) || 0) + 1)
  }
  const links = [...pairs].map(([key, weight]) => { const [source, target] = key.split(':'); return { id: `concept-link-${key}`, source, target, type: 'concept', weight } }).slice(0, 360)
  return <GraphSurface nodes={concepts.map((concept) => ({ id: concept.id, label: concept.label, size: 7 + Math.min(24, Math.sqrt(concept.frequency) * 3), group: book.chapters.findIndex((item) => item.id === concept.firstChapterId) % 6 }))} links={links} selected={selected} currentReadingId={currentReadingId} onSelect={(item) => onSelect({ kind: 'concept', id: item.id })} />
}

function GraphSurface({ nodes, links, selected, path = { nodeIds: [], edgeIds: [] }, currentReadingId, onSelect }) {
  const [layout, setLayout] = useState([])
  useEffect(() => {
    const width = 900; const height = 620
    const next = nodes.map((node, index) => ({ ...node, x: width / 2 + Math.cos(index) * 80, y: height / 2 + Math.sin(index) * 80 }))
    const simulation = forceSimulation(next).force('charge', forceManyBody().strength(-90)).force('center', forceCenter(width / 2, height / 2)).force('collision', forceCollide().radius((node) => node.size + 13)).force('link', forceLink(links.map((item) => ({ ...item }))).id((node) => node.id).distance(70).strength(0.2)).stop()
    for (let index = 0; index < Math.min(240, 40 + nodes.length * 2); index += 1) simulation.tick()
    setLayout(next.map((node) => ({ ...node })))
    return () => simulation.stop()
  }, [nodes.map((item) => item.id).join('|'), links.map((item) => item.id).join('|')])
  return nodes.length > 200 ? <CanvasGraph nodes={layout} links={links} selected={selected} path={path} currentReadingId={currentReadingId} onSelect={onSelect} /> : <SvgGraph nodes={layout} links={links} selected={selected} path={path} currentReadingId={currentReadingId} onSelect={onSelect} />
}

function SvgGraph({ nodes, links, selected, path, currentReadingId, onSelect }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [positions, setPositions] = useState(nodes)
  const [hovered, setHovered] = useState('')
  const pan = useRef(null)
  useEffect(() => setPositions(nodes), [nodes])
  const nodeMap = new Map(positions.map((item) => [item.id, item]))
  const selectedNode = selected?.kind === 'chapter' || selected?.kind === 'concept' ? selected.id : null
  const neighbors = connectedNodeIds(links, hovered)
  const pathNodes = new Set(path.nodeIds); const pathEdges = new Set(path.edgeIds); const pathActive = pathNodes.size > 0
  useEffect(() => {
    const target = nodeMap.get(selectedNode)
    if (target) setTransform((current) => ({ ...current, x: 450 - target.x * current.scale, y: 310 - target.y * current.scale }))
  }, [selectedNode])
  return <svg className="bl-graph" viewBox="0 0 900 620" tabIndex="0" aria-label="互动图谱" onWheel={(event) => { const scale = Math.max(0.45, Math.min(2.5, transform.scale * (event.deltaY > 0 ? 0.9 : 1.1))); setTransform({ ...transform, scale }) }} onPointerDown={(event) => { if (event.target !== event.currentTarget) return; event.currentTarget.setPointerCapture(event.pointerId); pan.current = { x: event.clientX, y: event.clientY, tx: transform.x, ty: transform.y } }} onPointerMove={(event) => { if (!pan.current) return; setTransform((current) => ({ ...current, x: pan.current.tx + event.clientX - pan.current.x, y: pan.current.ty + event.clientY - pan.current.y })) }} onPointerUp={() => { pan.current = null }}>
    <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}>
      {links.map((link) => { const sourceId = typeof link.source === 'object' ? link.source.id : link.source; const targetId = typeof link.target === 'object' ? link.target.id : link.target; const source = nodeMap.get(sourceId); const target = nodeMap.get(targetId); if (!source || !target) return null; const dimmed = (hovered && sourceId !== hovered && targetId !== hovered) || (pathActive && !pathEdges.has(link.id)); return <line key={link.id} className={`bl-edge ${link.type} ${selected?.id === link.id ? 'selected' : ''} ${pathEdges.has(link.id) ? 'path' : ''} ${dimmed ? 'dimmed' : ''}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} onClick={() => onSelect(link)} /> })}
      {positions.map((node) => { const dimmed = (hovered && node.id !== hovered && !neighbors.has(node.id)) || (pathActive && !pathNodes.has(node.id)); return <g key={node.id} className={`bl-node group-${Math.abs(node.group || 0) % 6} ${selectedNode === node.id ? 'selected' : ''} ${currentReadingId === node.id ? 'reading' : ''} ${pathNodes.has(node.id) ? 'path' : ''} ${dimmed ? 'dimmed' : ''}`} transform={`translate(${node.x} ${node.y})`} role="button" tabIndex="0" onPointerEnter={() => setHovered(node.id)} onPointerLeave={() => setHovered('')} onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); pan.current = { nodeId: node.id, x: event.clientX, y: event.clientY, ox: node.x, oy: node.y, moved: false } }} onPointerMove={(event) => { if (pan.current?.nodeId !== node.id) return; const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect(); const dx = (event.clientX - pan.current.x) * 900 / rect.width / transform.scale; const dy = (event.clientY - pan.current.y) * 620 / rect.height / transform.scale; if (Math.abs(dx) + Math.abs(dy) > 2) pan.current.moved = true; setPositions((current) => current.map((item) => item.id === node.id ? { ...item, x: pan.current.ox + dx, y: pan.current.oy + dy } : item)) }} onPointerUp={() => { if (!pan.current?.moved) onSelect(node); pan.current = null }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(node) }}><circle r={node.size} /><text y={node.size + 15}>{node.label}</text></g> })}
    </g>
  </svg>
}

function CanvasGraph({ nodes, links, selected, path, currentReadingId, onSelect }) {
  const canvas = useRef(null)
  const transform = useRef({ x: 0, y: 0, scale: 1 })
  const positions = useRef(nodes)
  const interaction = useRef(null)
  const hovered = useRef('')
  useEffect(() => { positions.current = nodes; draw() }, [nodes])
  const draw = useCallback(() => {
    const element = canvas.current; if (!element) return
    const ratio = window.devicePixelRatio || 1; const rect = element.getBoundingClientRect()
    element.width = Math.max(1, rect.width * ratio); element.height = Math.max(1, rect.height * ratio)
    const context = element.getContext('2d'); context.scale(ratio, ratio); context.clearRect(0, 0, rect.width, rect.height)
    const sx = rect.width / 900; const sy = rect.height / 620; const nodeMap = new Map(positions.current.map((item) => [item.id, item])); const pathNodes = new Set(path.nodeIds); const pathEdges = new Set(path.edgeIds); const pathActive = pathNodes.size > 0; const neighbors = connectedNodeIds(links, hovered.current)
    context.save(); context.translate(transform.current.x, transform.current.y); context.scale(transform.current.scale * sx, transform.current.scale * sy)
    context.strokeStyle = cssToken('--dsw-alias-border-secondary', element)
    for (const link of links) { const sourceId = typeof link.source === 'object' ? link.source.id : link.source; const targetId = typeof link.target === 'object' ? link.target.id : link.target; const source = nodeMap.get(sourceId); const target = nodeMap.get(targetId); if (!source || !target) continue; context.globalAlpha = (hovered.current && sourceId !== hovered.current && targetId !== hovered.current) || (pathActive && !pathEdges.has(link.id)) ? 0.08 : pathEdges.has(link.id) ? 1 : 0.42; context.lineWidth = pathEdges.has(link.id) ? 3 : 1; context.beginPath(); context.moveTo(source.x, source.y); context.lineTo(target.x, target.y); context.stroke() }
    context.globalAlpha = 1
    for (const node of positions.current) { const dimmed = (hovered.current && node.id !== hovered.current && !neighbors.has(node.id)) || (pathActive && !pathNodes.has(node.id)); context.globalAlpha = dimmed ? 0.14 : 1; context.beginPath(); context.fillStyle = node.id === selected?.id || node.id === currentReadingId || pathNodes.has(node.id) ? cssToken('--dsw-alias-bg-brand', element) : cssToken('--dsw-alias-bg-elevated', element); context.strokeStyle = cssToken('--dsw-alias-border-primary', element); context.lineWidth = pathNodes.has(node.id) ? 3 : 1; context.arc(node.x, node.y, node.size, 0, Math.PI * 2); context.fill(); context.stroke(); if (transform.current.scale >= 1.15) { context.fillStyle = cssToken('--dsw-alias-label-primary', element); context.font = '11px system-ui'; context.fillText(node.label.slice(0, 32), node.x + node.size + 4, node.y + 4) } }
    context.restore()
  }, [links, selected, path, currentReadingId])
  useEffect(() => { draw(); const observer = new ResizeObserver(draw); if (canvas.current) observer.observe(canvas.current); return () => observer.disconnect() }, [draw])
  function point(event) { const rect = event.currentTarget.getBoundingClientRect(); return { rect, x: (event.clientX - rect.left - transform.current.x) / (rect.width / 900 * transform.current.scale), y: (event.clientY - rect.top - transform.current.y) / (rect.height / 620 * transform.current.scale) } }
  return <canvas ref={canvas} className="bl-graph bl-canvas-graph" aria-label="大型互动图谱" onWheel={(event) => { transform.current.scale = Math.max(0.4, Math.min(2.5, transform.current.scale * (event.deltaY > 0 ? 0.9 : 1.1))); draw() }} onPointerDown={(event) => { const location = point(event); const node = positions.current.find((item) => Math.hypot(item.x - location.x, item.y - location.y) <= item.size + 5); event.currentTarget.setPointerCapture(event.pointerId); interaction.current = node ? { type: 'node', node, x: location.x, y: location.y, ox: node.x, oy: node.y, moved: false } : { type: 'pan', x: event.clientX, y: event.clientY, tx: transform.current.x, ty: transform.current.y } }} onPointerMove={(event) => { const location = point(event); if (!interaction.current) { hovered.current = positions.current.find((item) => Math.hypot(item.x - location.x, item.y - location.y) <= item.size + 5)?.id || ''; draw(); return } if (interaction.current.type === 'pan') { transform.current.x = interaction.current.tx + event.clientX - interaction.current.x; transform.current.y = interaction.current.ty + event.clientY - interaction.current.y } else { const dx = location.x - interaction.current.x; const dy = location.y - interaction.current.y; interaction.current.node.x = interaction.current.ox + dx; interaction.current.node.y = interaction.current.oy + dy; interaction.current.moved ||= Math.abs(dx) + Math.abs(dy) > 2 } draw() }} onPointerUp={() => { if (interaction.current?.type === 'node' && !interaction.current.moved) onSelect(interaction.current.node); interaction.current = null }} onPointerLeave={() => { hovered.current = ''; draw() }} />
}

function RadialView({ book, chapters, selected, path, currentReadingId, onSelect }) {
  const [mode, setMode] = useState('order')
  const radius = 220; const center = 310
  const pathNodes = new Set(path?.nodeIds || [])
  return <div className="bl-radial-wrap"><div className="bl-radial-modes" role="tablist">{[['order', '阅读顺序'], ['theme', '主题弧线'], ['concept', '概念密度']].map(([key, label]) => <button key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{label}</button>)}</div><svg className="bl-radial" viewBox="0 0 620 620" aria-label="径向脉络图"><circle className="bl-radial-track" cx={center} cy={center} r={radius} />{chapters.map((chapter, index) => {
    const angle = (Math.PI * 2 * index / Math.max(1, chapters.length)) - Math.PI / 2; const conceptCount = book.concepts.filter((concept) => concept.occurrences.some((item) => item.chapterId === chapter.id)).length; const themeStrength = (chapter.keywords || []).slice(0, 8).reduce((total, item) => total + item.weight, 0); const offset = mode === 'theme' ? Math.min(55, themeStrength * 2) : mode === 'concept' ? Math.min(55, conceptCount * 3) : 0; const nodeRadius = radius - offset; const x = center + Math.cos(angle) * nodeRadius; const y = center + Math.sin(angle) * nodeRadius; const dimmed = pathNodes.size > 0 && !pathNodes.has(chapter.id)
    return <g key={chapter.id} className={`bl-node ${selected?.id === chapter.id ? 'selected' : ''} ${currentReadingId === chapter.id ? 'reading' : ''} ${pathNodes.has(chapter.id) ? 'path' : ''} ${dimmed ? 'dimmed' : ''}`} transform={`translate(${x} ${y})`} role="button" tabIndex="0" onClick={() => onSelect({ kind: 'chapter', id: chapter.id })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect({ kind: 'chapter', id: chapter.id }) }}><circle r={mode === 'concept' ? 8 + Math.min(16, conceptCount) : 9 + Math.min(12, (chapter.keywords?.length || 0) / 2)} /><text textAnchor={x < center ? 'end' : 'start'} x={x < center ? -16 : 16} y="4">{chapter.title}</text></g>
  })}<text className="bl-radial-center" x={center} y={center - 6} textAnchor="middle">{book.title}</text><text className="bl-radial-sub" x={center} y={center + 18} textAnchor="middle">{chapters.length} 个可见章节</text></svg></div>
}

function WordCloud({ book, selected, onSelect }) {
  const [chapterIds, setChapterIds] = useState(() => selected?.kind === 'chapter' ? [selected.id] : [])
  useEffect(() => { if (selected?.kind === 'chapter') setChapterIds((current) => current.includes(selected.id) ? current : [...current.slice(-2), selected.id]) }, [selected?.kind, selected?.id])
  const { selected: compared, shared } = compareKeywordSets(book.chapters, chapterIds)
  const groups = compared.length > 0 ? compared.map((chapter) => ({ id: chapter.id, title: chapter.title, words: chapter.keywords || [] })) : [{ id: 'all', title: '全书', words: aggregateKeywords(book.chapters) }]
  function toggle(id) { setChapterIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : [...current.slice(1), id]) }
  return <div className="bl-word-workspace"><div className="bl-word-select">{book.chapters.map((chapter) => <label key={chapter.id} className={chapterIds.includes(chapter.id) ? 'active' : ''}><input type="checkbox" checked={chapterIds.includes(chapter.id)} onChange={() => toggle(chapter.id)} /><span>{chapter.title}</span></label>)}</div><div className={`bl-word-columns columns-${groups.length}`}>{groups.map((group) => <section key={group.id}><h2>{group.title}</h2><div className="bl-word-cloud" aria-label={`${group.title}关键词云`}>{group.words.slice(0, 70).map((word, index) => <button key={word.term} className={shared.has(word.term) ? 'shared' : ''} style={{ '--bl-weight': Math.min(2.1, 0.82 + word.weight / Math.max(group.words[0]?.weight || 1, 1) * 1.28), '--bl-row': index % 6 }} onClick={() => { const concept = book.concepts.find((item) => item.label === word.term); if (concept) onSelect({ kind: 'concept', id: concept.id }) }}>{word.term}</button>)}</div></section>)}</div></div>
}

function RelationLegend({ filters, setFilters }) {
  return <div className="bl-legend">{Object.entries(RELATION_LABELS).map(([key, label]) => <button key={key} className={`${key} ${filters.has(key) ? 'active' : ''}`} onClick={() => setFilters((current) => { const next = new Set(current); next.has(key) ? next.delete(key) : next.add(key); return next })}><i />{label}</button>)}</div>
}

function DetailPanel({ book, selection, onSelect }) {
  if (!selection) return <aside className="bl-detail"><h2>本书概览</h2><div className="bl-stats"><strong>{book.chapters.length}<span>章节</span></strong><strong>{book.concepts.length}<span>概念</span></strong><strong>{book.relations.length}<span>关系</span></strong></div><p className="bl-muted">选择一个章节、概念或关系，查看它在原文中的依据。</p></aside>
  if (selection.kind === 'chapter') return <aside className="bl-detail"><span className="bl-eyebrow">第 {selection.value.index + 1} 章</span><h2>{selection.value.title}</h2><p>{selection.value.summary || '本章暂无可用的抽取式摘要。'}</p><h3>关键词</h3><div className="bl-chips">{selection.value.keywords.slice(0, 10).map((word) => <span key={word.term}>{word.term}</span>)}</div><h3>关联章节</h3><div className="bl-relations">{book.relations.filter((item) => item.source === selection.value.id || item.target === selection.value.id).slice(0, 12).map((item) => { const otherId = item.source === selection.value.id ? item.target : item.source; const other = book.chapters.find((chapter) => chapter.id === otherId); return <button key={item.id} onClick={() => onSelect({ kind: 'relation', id: item.id })}><i className={item.type} /><span>{other?.title}</span><small>{RELATION_LABELS[item.type]}{item.inferred ? ' · 推断' : ''}</small></button> })}</div><button className="bl-primary" onClick={() => onSelect({ kind: 'chapter', id: selection.value.id })}><BookOpen size={16} />回到原文</button></aside>
  if (selection.kind === 'concept') return <aside className="bl-detail"><span className="bl-eyebrow">概念</span><h2>{selection.value.label}</h2><div className="bl-stats"><strong>{selection.value.frequency}<span>出现</span></strong><strong>{selection.value.chapterCount}<span>章节</span></strong></div><h3>出现索引</h3><div className="bl-occurrences">{selection.value.occurrences.slice(0, 20).map((item, index) => <button key={`${item.paragraphId}-${index}`} onClick={() => onSelect({ kind: 'occurrence', id: selection.value.id, occurrence: item })}><span>{book.chapters.find((chapter) => chapter.id === item.chapterId)?.title}</span><small>{item.excerpt}</small></button>)}</div></aside>
  const relation = selection.value
  const source = book.chapters.find((item) => item.id === relation.source); const target = book.chapters.find((item) => item.id === relation.target)
  return <aside className="bl-detail"><span className="bl-eyebrow">{RELATION_LABELS[relation.type]}{relation.inferred ? ' · 推断关系' : ''}</span><h2>{source?.title} → {target?.title}</h2><h3>关系依据</h3><div className="bl-chips">{relation.evidence.map((item) => <span key={item}>{item}</span>)}</div><p className="bl-muted">强度 {Math.round(relation.weight * 100)}%</p><button className="bl-primary" onClick={() => onSelect({ kind: 'comparison', id: relation.id })}><Columns3 size={16} />并排对比原文</button></aside>
}

function Reader({ book, selection, open, onOpen, onBook, onSelect, onVisibleChapter, annotationColors }) {
  const chapterIds = selectionChapterIds(selection)
  const chapters = chapterIds.map((id) => book.chapters.find((item) => item.id === id)).filter(Boolean)
  const shown = chapters.length ? chapters : [book.chapters[0]].filter(Boolean)
  const [selectionRange, setSelectionRange] = useState(null)
  useEffect(() => { setSelectionRange(null) }, [selection?.kind, selection?.id])
  useEffect(() => { if (open && shown[0]) onVisibleChapter(shown[0].id) }, [open, shown[0]?.id])
  async function annotate(kind) {
    if (!selectionRange) return
    try {
      const annotation = await api(`/books/${book.id}/annotations`, { method: 'POST', body: { ...selectionRange, kind, color: annotationColors[kind], note: kind === 'comment' ? window.prompt('批注内容') || '' : '' } })
      onBook((current) => ({ ...current, annotations: [...(current.annotations || []), annotation], concepts: kind === 'concept' ? [...current.concepts, userConceptFromAnnotation(annotation)] : current.concepts }))
      window.getSelection()?.removeAllRanges(); setSelectionRange(null)
    } catch (reason) { window.alert(messageOf(reason)) }
  }
  return <section className={`bl-reader ${open ? 'open' : ''}`}>
    <button className="bl-reader-handle" onClick={() => onOpen(!open)}><PanelBottomOpen size={17} /><span>{shown[0]?.title || '原文阅读器'}</span><small>{open ? '收起' : '展开'}</small></button>
    {open && <><div className="bl-reader-tools"><strong>原文阅读器</strong>{selectionRange && <div className="bl-selection-tools"><button onClick={() => annotate('highlight')} title="高亮"><Highlighter size={16} /></button><button onClick={() => annotate('underline')} title="划线"><Underline size={16} /></button><button onClick={() => annotate('comment')} title="批注"><AlignLeft size={16} /></button><button onClick={() => annotate('concept')} title="标记为概念"><Sparkles size={16} /></button></div>}<button onClick={() => onOpen(false)} title="关闭"><X size={16} /></button></div><div className={`bl-reader-content ${shown.length > 1 ? 'compare' : ''}`} onScroll={(event) => { const containerTop = event.currentTarget.getBoundingClientRect().top; const articles = [...event.currentTarget.querySelectorAll('article[data-chapter-id]')]; const nearest = articles.sort((left, right) => Math.abs(left.getBoundingClientRect().top - containerTop) - Math.abs(right.getBoundingClientRect().top - containerTop))[0]; if (nearest) onVisibleChapter(nearest.dataset.chapterId) }}>{shown.map((chapter) => <article key={chapter.id} data-chapter-id={chapter.id}><h2>{chapter.title}</h2>{chapter.paragraphs.map((paragraph) => <Paragraph key={paragraph.id} paragraph={paragraph} chapter={chapter} concepts={book.concepts} annotations={book.annotations || []} focus={focusParagraph(selection) === paragraph.id} onRange={setSelectionRange} onConcept={(id) => onSelect({ kind: 'concept', id })} />)}</article>)}</div></>}
  </section>
}

function Paragraph({ paragraph, chapter, concepts, annotations, focus, onRange, onConcept }) {
  const ref = useRef(null)
  const conceptMatches = concepts.flatMap((concept) => concept.occurrences.filter((item) => item.paragraphId === paragraph.id).map((item) => ({ ...item, conceptId: concept.id }))).sort((a, b) => a.offset - b.offset)
  const paragraphAnnotations = annotations.filter((item) => item.paragraphId === paragraph.id)
  const boundaries = new Set([0, paragraph.text.length])
  for (const item of conceptMatches) { boundaries.add(item.offset); boundaries.add(Math.min(paragraph.text.length, item.offset + item.length)) }
  for (const item of paragraphAnnotations) { boundaries.add(item.start); boundaries.add(Math.min(paragraph.text.length, item.end)) }
  const points = [...boundaries].filter((value) => value >= 0 && value <= paragraph.text.length).sort((a, b) => a - b)
  const parts = []
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index]; const end = points[index + 1]; if (end <= start) continue
    const text = paragraph.text.slice(start, end)
    const concept = conceptMatches.find((item) => item.offset <= start && item.offset + item.length >= end)
    const annotation = paragraphAnnotations.find((item) => item.start <= start && item.end >= end)
    const annotationProps = annotation ? { className: `bl-annotation ${annotation.kind}`, 'data-color': annotation.color || 'brand', title: annotation.note || annotation.kind } : {}
    if (concept) parts.push(<button {...annotationProps} className={`bl-concept-anchor ${annotationProps.className || ''}`} key={`${start}-${end}`} aria-label={`概念：${text}`} onClick={() => onConcept(concept.conceptId)}>{text}</button>)
    else if (annotation) parts.push(<mark {...annotationProps} key={`${start}-${end}`}>{text}</mark>)
    else parts.push(text)
  }
  return <p ref={ref} id={paragraph.id} className={focus ? 'focus' : ''} onMouseUp={() => {
    const selection = window.getSelection(); if (!selection || selection.isCollapsed || !ref.current?.contains(selection.anchorNode) || !ref.current.contains(selection.focusNode)) return
    const range = selection.getRangeAt(0); const before = document.createRange(); before.selectNodeContents(ref.current); before.setEnd(range.startContainer, range.startOffset); const start = before.toString().length; const length = range.toString().length
    if (length > 0) onRange({ chapterId: chapter.id, paragraphId: paragraph.id, start, end: start + length })
  }}>{parts}{paragraphAnnotations.length > 0 && <span className="bl-annotation-count">{paragraphAnnotations.length}</span>}</p>
}

function SearchResults({ results, onSelect }) {
  return <div className="bl-search-results">{results.length ? results.slice(0, 18).map((item) => <button key={`${item.kind}-${item.id}-${item.paragraphId || ''}`} onClick={() => onSelect(item)}><span>{item.kind === 'chapter' ? '章节' : item.kind === 'concept' ? '概念' : '原文'}</span><strong>{item.label}</strong><small>{item.excerpt}</small></button>) : <p>没有匹配结果</p>}</div>
}

function visibleChapters(book) {
  if (book.userState?.progressiveReveal === false) return book.chapters
  const count = Math.max(1, Math.ceil(book.chapters.length * (book.userState?.progress || 0)))
  return book.chapters.slice(0, count)
}

function resolveSelection(book, selected) {
  if (!selected) return null
  if (selected.kind === 'chapter') return { kind: 'chapter', value: book.chapters.find((item) => item.id === selected.id) }
  if (selected.kind === 'concept' || selected.kind === 'occurrence') return { kind: 'concept', value: book.concepts.find((item) => item.id === selected.id), occurrence: selected.occurrence }
  if (selected.kind === 'relation' || selected.kind === 'comparison') return { kind: 'relation', value: book.relations.find((item) => item.id === selected.id), comparison: selected.kind === 'comparison' }
  if (selected.kind === 'text') return { kind: 'chapter', value: book.chapters.find((item) => item.id === selected.chapterId), paragraphId: selected.paragraphId }
  return null
}

function selectionChapterIds(selection) {
  if (!selection?.value) return []
  if (selection.kind === 'chapter') return [selection.value.id]
  if (selection.kind === 'concept') return [selection.occurrence?.chapterId || selection.value.firstChapterId]
  return selection.comparison ? [selection.value.source, selection.value.target] : [selection.value.source]
}
function focusParagraph(selection) { return selection?.occurrence?.paragraphId || selection?.paragraphId || selection?.value?.anchors?.[0]?.paragraphId }

function searchBook(book, query) {
  const needle = query.trim().toLowerCase(); if (!needle) return []
  const results = []
  for (const chapter of book.chapters) {
    if (chapter.title.toLowerCase().includes(needle)) results.push({ kind: 'chapter', id: chapter.id, label: chapter.title, excerpt: chapter.summary })
    for (const paragraph of chapter.paragraphs) { const index = paragraph.text.toLowerCase().indexOf(needle); if (index >= 0) results.push({ kind: 'text', id: paragraph.id, chapterId: chapter.id, paragraphId: paragraph.id, label: chapter.title, excerpt: paragraph.text.slice(Math.max(0, index - 36), index + needle.length + 60) }) }
  }
  for (const concept of book.concepts) if (concept.label.toLowerCase().includes(needle)) results.unshift({ kind: 'concept', id: concept.id, label: concept.label, excerpt: `${concept.frequency} 次出现` })
  return results
}

function aggregateKeywords(chapters) {
  const map = new Map(); for (const chapter of chapters) for (const item of chapter.keywords || []) map.set(item.term, (map.get(item.term) || 0) + item.weight)
  return [...map].map(([term, weight]) => ({ term, weight })).sort((a, b) => b.weight - a.weight)
}
function connectedNodeIds(links, nodeId) {
  const result = new Set()
  if (!nodeId) return result
  for (const link of links) {
    const source = typeof link.source === 'object' ? link.source.id : link.source
    const target = typeof link.target === 'object' ? link.target.id : link.target
    if (source === nodeId) result.add(target)
    if (target === nodeId) result.add(source)
  }
  return result
}
function confidenceLabel(value) { return value === 'high' || value === 'user-confirmed' ? '高置信' : value === 'medium' ? '中置信' : '待校正' }
function userConceptFromAnnotation(annotation) { return { id: `concept-user-${annotation.id}`, label: annotation.text, frequency: 1, chapterCount: 1, firstChapterId: annotation.chapterId, source: 'user', occurrences: [{ chapterId: annotation.chapterId, paragraphId: annotation.paragraphId, offset: annotation.start, length: annotation.end - annotation.start, excerpt: annotation.text }] } }
function viewIcon(key) { return key === 'chapters' ? <Network size={17} /> : key === 'radial' ? <Waypoints size={17} /> : key === 'concepts' ? <GitFork size={17} /> : <Cloud size={17} /> }
function cssToken(name, element = document.documentElement) { const style = getComputedStyle(element); return style.getPropertyValue(name).trim() || style.color }
function messageOf(reason) { return reason?.message || String(reason || '未知错误') }

async function api(path, options = {}) {
  const init = { method: options.method || 'GET', headers: {} }
  if (options.raw) { init.body = options.raw; init.headers['content-type'] = options.contentType || 'application/octet-stream' }
  else if (options.body !== undefined) { init.body = JSON.stringify(options.body); init.headers['content-type'] = 'application/json' }
  const response = await fetch(`${API}${path}`, init)
  const payload = await response.json().catch(() => ({ success: false, code: 'INVALID_RESPONSE', message: `HTTP ${response.status}` }))
  if (!response.ok || !payload.success) { const error = new Error(payload.message || `HTTP ${response.status}`); error.code = payload.code; error.data = payload.data; throw error }
  return payload.data
}

function installStyles(ctx) {
  const style = document.createElement('style'); style.dataset.bookLoom = 'true'; style.textContent = STYLES; document.head.append(style)
  ctx.effect(() => () => style.remove(), 'dsh-book-loom: styles')
}
