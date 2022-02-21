const typescript = require('rollup-plugin-typescript2')
const localtypescript = require('typescript')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const externals = require('rollup-plugin-node-externals')
const del = require('rollup-plugin-delete')

module.exports = pkg => ({
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    del({targets: 'lib/*'}),
    externals({
      deps: true,
      peerDeps: true,
    }),
    typescript({
      clean: true,
      typescript: localtypescript,
      tsconfig: './tsconfig.json',
    }),
    nodeResolve(),
    commonjs(),
  ],
})
