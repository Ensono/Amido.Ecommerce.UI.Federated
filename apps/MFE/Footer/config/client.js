// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_footer',
  filename: 'remote-entry.js',
  library: {type: 'commonjs'},
  // library: { type: "var", name: "mfe_footer" },
  remotes: REMOTES,
  exposes: {
    './footer': './src/Footer.tsx',
  },
  shared: ['react', 'react-dom'],
})

module.exports = {getFederationConfig}
