const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'app-shell',
  filename: 'remote-entry.js',
  library: {type: 'commonjs'},
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
  },
})

module.exports = {getFederationConfig}
