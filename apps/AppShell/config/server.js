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
      shareScope: 'default',
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-router-dom'],
      shareScope: 'default',
    },
  },
})

module.exports = {getFederationConfig}
