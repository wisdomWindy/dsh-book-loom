import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { Context, Service } from '@deepseek-ai/cordis'
import * as plugin from '../index.js'
import { API_PREFIX, TOOL_PREFIX } from '../lib/constants.js'

class ToolsService extends Service {
  constructor(ctx, ledger) { super(ctx, 'tools'); this.ledger = ledger }
  register(tool) {
    if (this.ledger.has(tool.name)) throw new Error(`duplicate tool: ${tool.name}`)
    this.ledger.set(tool.name, tool)
    return () => this.ledger.delete(tool.name)
  }
}

class WebServerService extends Service {
  constructor(ctx, ledger) { super(ctx, 'webServer'); this.ledger = ledger }
  register(route) {
    if (this.ledger.has(route.path)) throw new Error(`duplicate route: ${route.path}`)
    this.ledger.set(route.path, route)
    return () => this.ledger.delete(route.path)
  }
}

test('real Cordis fiber mounts, disposes, and remounts without residue', async (t) => {
  const dshHome = await fs.mkdtemp(path.join(os.tmpdir(), 'book-loom-cordis-'))
  t.after(() => fs.rm(dshHome, { recursive: true, force: true }))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = dshHome
  t.after(() => { if (previousHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previousHome })

  const ledgers = { tools: new Map(), routes: new Map() }
  const root = new Context()
  const services = root.plugin(function servicesPlugin(ctx) {
    new ToolsService(ctx, ledgers.tools)
    new WebServerService(ctx, ledgers.routes)
  })
  await services
  const config = { dataDirectory: 'book-loom-verify' }

  for (let cycle = 1; cycle <= 2; cycle += 1) {
    const fiber = root.plugin(plugin, config)
    await fiber
    assert.equal(ledgers.tools.size, 1, `mount ${cycle}: one tool`)
    assert.equal(ledgers.routes.size, 1, `mount ${cycle}: one route`)
    assert.ok(ledgers.tools.has(`${TOOL_PREFIX}status`))
    assert.ok(ledgers.routes.has(API_PREFIX))
    const output = await ledgers.tools.get(`${TOOL_PREFIX}status`).execute({}, { signal: AbortSignal.timeout(1000) })
    assert.deepEqual(output, { ok: true, bookCount: 0, activeJobCount: 0, formats: ['epub', 'markdown', 'txt', 'pdf'] })
    await fiber.dispose()
    assert.equal(ledgers.tools.size, 0, `dispose ${cycle}: no tools`)
    assert.equal(ledgers.routes.size, 0, `dispose ${cycle}: no routes`)
  }
  await services.dispose()
})
