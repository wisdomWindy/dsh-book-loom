import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const roots = ['index.js', 'client.js', 'lib', 'scripts', 'test']
const files = roots.flatMap((root) => collect(root)).filter((file) => /\.(?:js|mjs)$/.test(file))
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout)
    process.exit(result.status || 1)
  }
}
console.log(`syntax ok: ${files.length} files`)

function collect(target) {
  if (!fs.existsSync(target)) return []
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => collect(path.join(target, entry.name)))
}
