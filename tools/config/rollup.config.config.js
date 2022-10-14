const {externals} = require('rollup-plugin-node-externals')
const del = require('rollup-plugin-delete')

module.exports = pkg => ({
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [
    del({targets: 'lib/*'}),
    externals({
      deps: true,
      peerDeps: true,
    }),
  ],
})
