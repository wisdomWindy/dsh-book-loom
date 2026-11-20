import { build } from 'esbuild'
import { buildOptions } from './esbuild-config.mjs'

await build(buildOptions)
