import os from 'node:os'
import path from 'node:path'
import { resolveConfig } from './lib/config.js'
import { LOADER_ID, PACKAGE_NAME } from './lib/constants.js'
import { registerPanelRoutes } from './lib/panel-api.js'
import { BookLoomRuntime } from './lib/runtime.js'
import { BookStore } from './lib/store.js'
import { buildTools } from './lib/tools.js'

export const name = 'book-loom'
export const inject = ['tools']

export function apply(ctx, rawConfig) {
  const { config, warnings } = resolveConfig(rawConfig || {})
  for (const warning of warnings) ctx.logger.warn(`${LOADER_ID}: ${warning}`)
  if (!config.enabled) {
    ctx.logger.info(`${LOADER_ID}: disabled by configuration`)
    return
  }
  const dshHome = process.env.DSH_HOME?.trim() || path.join(os.homedir(), '.dsh')
  const dataRoot = path.resolve(dshHome, config.dataDirectory)
  const store = new BookStore(dataRoot, ctx.logger)
  const runtime = new BookLoomRuntime(store, config, ctx.logger)

  ctx.effect(() => () => runtime.close(), `${LOADER_ID}: runtime`)
  for (const tool of buildTools(runtime)) {
    ctx.effect(() => ctx.tools.register(tool), `${LOADER_ID}: tool ${tool.name}`)
  }
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => registerPanelRoutes(webCtx, runtime), `${LOADER_ID}: panel API`)
  })
  ctx.logger.info(`${PACKAGE_NAME} activated with ${buildTools(runtime).length} tool`)
}
