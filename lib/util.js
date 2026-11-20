import crypto from 'node:crypto'

export function codedError(code, message, status = 400, data) {
  const error = new Error(message)
  error.code = code
  error.status = status
  if (data !== undefined) error.data = data
  return error
}

export function publicError(error) {
  return {
    code: typeof error?.code === 'string' ? error.code : 'INTERNAL_ERROR',
    message: error?.status && error.status < 500 ? error.message : 'BookLoom could not complete the request',
    ...(error?.data === undefined ? {} : { data: error.data }),
  }
}

export function stableId(prefix, ...parts) {
  const hash = crypto.createHash('sha256').update(parts.join('\u0000')).digest('hex').slice(0, 16)
  return `${prefix}_${hash}`
}

export function normalizeText(value) {
  return String(value || '').replace(/\r\n?/g, '\n').replace(/[\t\f\v]+/g, ' ').replace(/\u00a0/g, ' ')
}

export function cleanWhitespace(value) {
  return normalizeText(value).replace(/[ ]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

export function safeFilename(value) {
  return String(value || 'book').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 180)
}
