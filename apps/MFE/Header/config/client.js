const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_header',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './header': './src/Header.tsx',
    './store': './src/store.ts',
  },
  shared: {
    ...dependencies,
  },
})

module.exports = {getFederationConfig}
