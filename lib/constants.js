export const PACKAGE_NAME = '@local/dsh-book-loom'
export const LOADER_ID = 'dsh-book-loom'
export const TOOL_PREFIX = 'bookloom_'
export const API_PREFIX = '/api/dsh-book-loom'
export const STORAGE_SCHEMA_VERSION = 1

export const SUPPORTED_FORMATS = Object.freeze({
  epub: ['application/epub+zip'],
  markdown: ['text/markdown', 'text/x-markdown'],
  txt: ['text/plain'],
  pdf: ['application/pdf'],
})
