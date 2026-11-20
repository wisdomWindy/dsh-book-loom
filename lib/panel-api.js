import { URL } from 'node:url'
import { API_PREFIX } from './constants.js'
import { codedError, publicError } from './util.js'

export function registerPanelRoutes(ctx, runtime) {
  const webServer = ctx.get('webServer')
  if (!webServer || typeof webServer.register !== 'function') {
    ctx.logger.warn('dsh-book-loom: webServer unavailable; panel API not registered')
    return () => {}
  }
  return webServer.register({
    kind: 'prefix',
    path: API_PREFIX,
    handler: (request, response) => handleRequest(runtime, request, response),
  })
}

export async function handleRequest(runtime, request, response) {
  try {
    assertLocalRequest(request)
    const url = new URL(request.url || API_PREFIX, `http://${request.headers.host || '127.0.0.1'}`)
    const route = url.pathname.slice(API_PREFIX.length) || '/'

    if (request.method === 'GET' && route === '/health') {
      const state = await runtime.state()
      return sendJson(response, 200, { success: true, data: { ok: true, bookCount: state.books.length } })
    }
    if (request.method === 'GET' && route === '/state') {
      return sendJson(response, 200, { success: true, data: await runtime.state() })
    }
    if (request.method === 'POST' && route === '/import') {
      const filename = requiredQuery(url, 'filename')
      const mime = request.headers['content-type'] || ''
      const buffer = await readBinary(request, runtime.config.maxRequestBytes)
      const job = runtime.importBook(buffer, { filename, mime, encoding: url.searchParams.get('encoding') || undefined })
      return sendJson(response, 202, { success: true, data: job })
    }
    if (request.method === 'POST' && route === '/previews') {
      const filename = requiredQuery(url, 'filename')
      const mime = request.headers['content-type'] || ''
      const buffer = await readBinary(request, runtime.config.maxRequestBytes)
      const preview = await runtime.createPreview(buffer, { filename, mime, encoding: url.searchParams.get('encoding') || undefined })
      return sendJson(response, 201, { success: true, data: preview })
    }
    if (request.method === 'GET' && /^\/previews\/[^/]+$/.test(route)) {
      return sendJson(response, 200, { success: true, data: runtime.preview(segment(route, 2)) })
    }
    if (request.method === 'POST' && route.endsWith('/edit')) {
      const body = await readJson(request, runtime.config.maxRequestBytes)
      return sendJson(response, 200, { success: true, data: runtime.editPreview(segment(route, 2), body) })
    }
    if (request.method === 'POST' && route.endsWith('/confirm')) {
      return sendJson(response, 202, { success: true, data: await runtime.confirmPreview(segment(route, 2)) })
    }
    if (request.method === 'DELETE' && /^\/previews\/[^/]+$/.test(route)) {
      return sendJson(response, 200, { success: true, data: runtime.cancelPreview(segment(route, 2)) })
    }
    if (request.method === 'DELETE' && route.startsWith('/jobs/')) {
      return sendJson(response, 200, { success: true, data: runtime.cancel(segment(route, 2)) })
    }
    if (request.method === 'GET' && route.startsWith('/books/')) {
      return sendJson(response, 200, { success: true, data: await runtime.book(segment(route, 2)) })
    }
    if (request.method === 'POST' && route.endsWith('/progress')) {
      const body = await readJson(request, runtime.config.maxRequestBytes)
      const book = await runtime.updateProgress(segment(route, 2), body.progress, body.progressiveReveal)
      return sendJson(response, 200, { success: true, data: book.userState })
    }
    if (request.method === 'POST' && route.endsWith('/settings')) {
      const body = await readJson(request, runtime.config.maxRequestBytes)
      const book = await runtime.updateSettings(segment(route, 2), body)
      return sendJson(response, 200, { success: true, data: book.userState })
    }
    if (request.method === 'POST' && route.endsWith('/annotations')) {
      const body = await readJson(request, runtime.config.maxRequestBytes)
      return sendJson(response, 201, { success: true, data: await runtime.annotate(segment(route, 2), body) })
    }
    if (request.method === 'DELETE' && route.includes('/annotations/')) {
      const parts = route.split('/').filter(Boolean)
      return sendJson(response, 200, { success: true, data: await runtime.removeAnnotation(parts[1], parts[3]) })
    }
    if (request.method === 'DELETE' && /^\/books\/[^/]+$/.test(route)) {
      const bookId = segment(route, 2)
      const body = await readJson(request, runtime.config.maxRequestBytes)
      if (body.confirm !== bookId) throw codedError('CONFIRMATION_REQUIRED', 'Book deletion requires its id as confirmation', 409)
      return sendJson(response, 200, { success: true, data: await runtime.removeBook(bookId) })
    }
    if (request.method === 'DELETE' && route === '/books') {
      const body = await readJson(request, runtime.config.maxRequestBytes)
      if (body.confirm !== 'DELETE_ALL_BOOKLOOM_DATA') throw codedError('CONFIRMATION_REQUIRED', 'Full cleanup requires the explicit confirmation phrase', 409)
      return sendJson(response, 200, { success: true, data: await runtime.clearAll() })
    }
    throw codedError('NOT_FOUND', 'BookLoom API route not found', 404)
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500
    return sendJson(response, status, { success: false, ...publicError(error) })
  }
}

function assertLocalRequest(request) {
  const remote = request.socket?.remoteAddress || ''
  const loopback = remote === '' || remote === '127.0.0.1' || remote === '::1' || remote.startsWith('::ffff:127.')
  if (!loopback) throw codedError('FORBIDDEN', 'BookLoom API accepts loopback requests only', 403)
  const origin = request.headers.origin
  if (!origin || origin === 'null' || origin.startsWith('file://')) return
  try {
    if (new URL(origin).host !== request.headers.host) throw new Error('origin mismatch')
  } catch {
    throw codedError('FORBIDDEN', 'Cross-origin BookLoom request rejected', 403)
  }
}

function segment(route, index) {
  const value = route.split('/').filter(Boolean)[index - 1]
  if (!value) throw codedError('INVALID_ARGUMENT', 'Missing route identifier')
  return decodeURIComponent(value)
}

function requiredQuery(url, key) {
  const value = url.searchParams.get(key)
  if (!value) throw codedError('INVALID_ARGUMENT', `Missing query parameter: ${key}`)
  return value
}

async function readJson(request, maxBytes) {
  const buffer = await readBinary(request, maxBytes)
  if (buffer.byteLength === 0) return {}
  try { return JSON.parse(buffer.toString('utf8')) } catch { throw codedError('INVALID_JSON', 'Request body must be valid JSON') }
}

function readBinary(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    request.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > maxBytes) {
        settled = true
        reject(codedError('BODY_TOO_LARGE', `Request body exceeds ${maxBytes} bytes`, 413))
        request.destroy()
      } else chunks.push(chunk)
    })
    request.on('end', () => { if (!settled) resolve(Buffer.concat(chunks)) })
    request.on('error', (error) => { if (!settled) reject(error) })
  })
}

function sendJson(response, status, value) {
  if (response.writableEnded) return
  const body = JSON.stringify(value)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  response.end(body)
}
