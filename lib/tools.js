import { TOOL_PREFIX } from './constants.js'

const JSON_OUTPUT = {
  schema: { type: 'object', additionalProperties: true },
  render(_args, value) { return [{ type: 'text', text: JSON.stringify(value, null, 2) }] },
}

export function buildTools(runtime) {
  return [{
    name: `${TOOL_PREFIX}status`,
    description: 'Return deterministic BookLoom health, imported-book counts, and supported formats.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    output: JSON_OUTPUT,
    timeoutMs: 10_000,
    isConcurrencySafe: true,
    async execute() {
      try {
        const state = await runtime.state()
        return { ok: true, bookCount: state.books.length, activeJobCount: state.jobs.filter((job) => job.status === 'running').length, formats: state.capabilities.formats }
      } catch (error) {
        return { ok: false, code: error.code || 'STATUS_FAILED', message: error.message }
      }
    },
  }]
}
