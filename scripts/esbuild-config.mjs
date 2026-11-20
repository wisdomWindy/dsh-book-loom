import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const reactShim = path.join(root, 'src/react-shim.cjs')

export const buildOptions = {
  entryPoints: [path.join(root, 'src/client-entry.js')],
  outfile: path.join(root, 'client.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome120'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  legalComments: 'none',
  plugins: [{
    name: 'host-react',
    setup(builder) {
      builder.onResolve({ filter: /^react$/ }, () => ({ path: reactShim }))
    },
  }],
  logLevel: 'info',
}
