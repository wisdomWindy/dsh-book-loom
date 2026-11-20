const DEFAULTS = Object.freeze({
  enabled: true,
  dataDirectory: '.dsh_book_loom',
  maxBookBytes: 100 * 1024 * 1024,
  maxRequestBytes: 105 * 1024 * 1024,
  defaultProgressiveReveal: true,
  retainOriginalFile: false,
  analysisConcurrency: 2,
  similarityThreshold: 0.22,
  maxGraphNodes: 500,
})

export function resolveConfig(raw = {}) {
  const warnings = []
  const boolean = (key) => typeof raw[key] === 'boolean' ? raw[key] : DEFAULTS[key]
  const number = (key, min, max) => {
    const value = Number(raw[key])
    if (!Number.isFinite(value)) return DEFAULTS[key]
    const clamped = Math.min(max, Math.max(min, value))
    if (clamped !== value) warnings.push(`${key} was clamped to ${clamped}`)
    return clamped
  }
  const dataDirectory = typeof raw.dataDirectory === 'string' && raw.dataDirectory.trim()
    ? raw.dataDirectory.trim()
    : DEFAULTS.dataDirectory
  if (dataDirectory !== DEFAULTS.dataDirectory && /(^|[\\/])\.\.([\\/]|$)/.test(dataDirectory)) {
    warnings.push('dataDirectory traversal was rejected')
  }
  return {
    config: {
      enabled: boolean('enabled'),
      dataDirectory: /(^|[\\/])\.\.([\\/]|$)/.test(dataDirectory) ? DEFAULTS.dataDirectory : dataDirectory,
      maxBookBytes: Math.floor(number('maxBookBytes', 1024, 512 * 1024 * 1024)),
      maxRequestBytes: Math.floor(number('maxRequestBytes', 1024, 520 * 1024 * 1024)),
      defaultProgressiveReveal: boolean('defaultProgressiveReveal'),
      retainOriginalFile: boolean('retainOriginalFile'),
      analysisConcurrency: Math.floor(number('analysisConcurrency', 1, 8)),
      similarityThreshold: number('similarityThreshold', 0.05, 0.95),
      maxGraphNodes: Math.floor(number('maxGraphNodes', 20, 5000)),
    },
    warnings,
  }
}

export { DEFAULTS }
