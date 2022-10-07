const {dependencies: rootDependencies} = require('../../../package.json')
const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'app-shell',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  shared: {
    ...rootDependencies,
    ...dependencies,
    react: {
      singleton: true,
      eager: true,
    },
    'react-dom': {
      singleton: true,
      eager: true,
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
    },
    'react-redux': {
      singleton: true,
      eager: true,
    },
  },
})

module.exports = {getFederationConfig}
