const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_text_positioner',
  filename: 'remote-entry.cjs',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './text-positioner': './src/TextPositioner.tsx',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
      shareScope: 'default',
    },
  },
})

module.exports = {getFederationConfig}
