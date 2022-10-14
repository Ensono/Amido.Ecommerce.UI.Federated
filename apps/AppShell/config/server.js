const {dependencies: rootDependencies} = require('../../../package.json')
const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'app-shell',
  filename: 'remote-entry.js',
  library: {type: 'commonjs'},
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
    },
  },
})

module.exports = {getFederationConfig}
