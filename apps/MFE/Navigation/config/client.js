const {dependencies: rootDependencies} = require('../../../../package.json')
const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_navigation',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './navigation': './src/Navigation.tsx',
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
