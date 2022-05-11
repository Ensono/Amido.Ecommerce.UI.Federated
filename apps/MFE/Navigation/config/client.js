// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_navigation',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './navigation': './src/Navigation.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})

module.exports = {getFederationConfig}
