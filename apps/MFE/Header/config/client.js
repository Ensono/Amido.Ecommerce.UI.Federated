// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_header',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './header': './src/Header.tsx',
  },
  shared: ['react', 'react-dom'],
})

module.exports = {getFederationConfig}
