// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_footer',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './footer': './src/Footer.tsx',
  },
  shared: ['react', 'react-dom'],
})

module.exports = {getFederationConfig}
