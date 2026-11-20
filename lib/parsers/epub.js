import path from 'node:path'
import { unzipSync, strFromU8 } from 'fflate'
import { DOMParser } from 'linkedom'
import { codedError, cleanWhitespace } from '../util.js'
import { finalizeBook, makeChapter } from './common.js'

const posix = path.posix

export function parseEpub(buffer, options = {}) {
  let archive
  try {
    archive = unzipSync(new Uint8Array(buffer))
  } catch {
    throw codedError('INVALID_EPUB', 'The EPUB archive is damaged or unreadable', 422)
  }
  const container = readXml(archive, 'META-INF/container.xml')
  const rootfile = container.querySelector('rootfile')?.getAttribute('full-path')
  if (!rootfile) throw codedError('INVALID_EPUB', 'EPUB package document was not found', 422)
  const opf = readXml(archive, rootfile)
  const opfDir = posix.dirname(rootfile)
  const manifest = new Map([...opf.querySelectorAll('manifest > item')].map((item) => [
    item.getAttribute('id'),
    {
      href: resolveArchivePath(opfDir, item.getAttribute('href')),
      mediaType: item.getAttribute('media-type'),
      properties: item.getAttribute('properties') || '',
    },
  ]))
  const spine = [...opf.querySelectorAll('spine > itemref')]
    .map((item) => manifest.get(item.getAttribute('idref')))
    .filter(Boolean)
  const navigation = readNavigation(archive, opfDir, manifest)
  const title = opf.getElementsByTagName('dc:title')[0]?.textContent?.trim()
    || opf.getElementsByTagName('title')[0]?.textContent?.trim()
    || findTextByLocalName(opf, 'title')
    || options.title
    || stripExtension(options.filename)
  const chapters = []
  for (const entry of spine) {
    const raw = archive[entry.href]
    if (!raw) continue
    const document = parseDocument(strFromU8(raw), 'text/html')
    document.querySelectorAll('script,style,nav[epub\\:type="landmarks"]').forEach((node) => node.remove())
    const text = htmlToText(document.body || document.documentElement)
    if (!text) continue
    const nav = navigation.get(stripFragment(entry.href))
    const heading = document.querySelector('h1,h2,h3')?.textContent
    chapters.push(makeChapter({
      title: cleanWhitespace(nav?.title || heading || `Chapter ${chapters.length + 1}`),
      level: nav?.level || 1,
      index: chapters.length,
      text,
      sourceAnchor: { href: entry.href, confidence: nav ? 'high' : 'medium' },
    }))
  }
  if (chapters.length === 0) throw codedError('EMPTY_BOOK', 'EPUB contains no readable spine documents', 422)
  return finalizeBook(title, 'epub', chapters, { navigation: navigation.size > 0 ? 'nav' : 'spine' })
}

function readNavigation(archive, opfDir, manifest) {
  const map = new Map()
  const navItem = [...manifest.values()].find((item) => item.properties.split(/\s+/).includes('nav'))
  if (navItem && archive[navItem.href]) {
    const document = parseDocument(strFromU8(archive[navItem.href]), 'text/html')
    const nav = [...document.querySelectorAll('nav')].find((node) => (node.getAttribute('epub:type') || node.getAttribute('type')) === 'toc') || document.querySelector('nav')
    if (nav) collectNavLinks(nav, posix.dirname(navItem.href), map)
  }
  if (map.size > 0) return map
  const ncxItem = [...manifest.values()].find((item) => item.mediaType === 'application/x-dtbncx+xml')
  if (ncxItem && archive[ncxItem.href]) {
    const ncx = parseDocument(strFromU8(archive[ncxItem.href]), 'application/xml')
    for (const point of ncx.querySelectorAll('navPoint')) {
      const href = point.querySelector('content')?.getAttribute('src')
      const title = point.querySelector('navLabel > text')?.textContent
      if (href && title) map.set(stripFragment(resolveArchivePath(posix.dirname(ncxItem.href), href)), { title: cleanWhitespace(title), level: navDepth(point) })
    }
  }
  return map
}

function collectNavLinks(root, base, map) {
  for (const anchor of root.querySelectorAll('a[href]')) {
    const href = stripFragment(resolveArchivePath(base, anchor.getAttribute('href')))
    map.set(href, { title: cleanWhitespace(anchor.textContent), level: navDepth(anchor.closest('li')) })
  }
}

function navDepth(node) {
  let depth = 1
  let current = node?.parentElement
  while (current) {
    if (current.localName === 'li' || current.localName === 'navpoint') depth += 1
    current = current.parentElement
  }
  return Math.min(3, depth)
}

function htmlToText(root) {
  if (!root) return ''
  root.querySelectorAll('p,div,section,article,blockquote,li,h1,h2,h3,h4,h5,h6,br').forEach((node) => {
    node.append('\n\n')
  })
  return cleanWhitespace(root.textContent)
}

function readXml(archive, name) {
  const raw = archive[name]
  if (!raw) throw codedError('INVALID_EPUB', `EPUB entry is missing: ${name}`, 422)
  return parseDocument(strFromU8(raw), 'application/xml')
}

function parseDocument(source, mime) {
  return new DOMParser().parseFromString(source, mime)
}

function resolveArchivePath(base, href = '') {
  return posix.normalize(posix.join(base === '.' ? '' : base, decodeURIComponent(href).split('#')[0]))
}

function stripFragment(value) { return value.split('#')[0] }
function stripExtension(value = '') { return value.replace(/\.epub$/i, '') || 'EPUB book' }
function findTextByLocalName(document, name) {
  return [...document.getElementsByTagName('*')].find((node) => {
    const local = node.localName?.toLowerCase() || ''
    const tag = node.tagName?.toLowerCase() || ''
    return local === name || tag === name || tag.endsWith(`:${name}`)
  })?.textContent?.trim() || ''
}
