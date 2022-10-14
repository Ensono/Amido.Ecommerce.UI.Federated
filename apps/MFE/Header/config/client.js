const {dependencies: rootDependencies} = require('../../../../package.json')
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
    ...rootDependencies,
    ...dependencies,
    react: {singleton: true},
    'react-dom': {singleton: true},
    'react-router-dom': {singleton: true},
    'react-redux': {singleton: true},
  },
})

module.exports = {getFederationConfig}
