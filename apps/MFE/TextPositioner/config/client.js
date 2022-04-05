// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_text_positioner',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './text-positioner': './src/TextPositioner.tsx',
  },
  shared: ['react', 'react-dom'],
})

module.exports = {getFederationConfig}
