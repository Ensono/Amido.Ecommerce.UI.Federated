const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'app-shell',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-router-dom'],
    },
    'react-redux': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-redux'],
    },
  },
})

module.exports = {getFederationConfig}
