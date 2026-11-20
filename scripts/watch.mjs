import { context } from 'esbuild'
import { buildOptions } from './esbuild-config.mjs'

const buildContext = await context(buildOptions)
await buildContext.watch()
console.log('book-loom client watcher ready')

for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {
  await buildContext.dispose()
  process.exit(0)
})
