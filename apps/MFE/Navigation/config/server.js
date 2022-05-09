const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_navigation',
  filename: 'remote-entry.cjs',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './navigation': './src/Navigation.tsx',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
      shareScope: 'default',
    },
    'react-router-dom': {},
  },
})

module.exports = {getFederationConfig}
