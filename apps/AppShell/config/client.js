const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'app-shell',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  shared: {
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
  },
})

module.exports = {getFederationConfig}
