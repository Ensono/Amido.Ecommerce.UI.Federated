const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_footer',
  filename: 'remote-entry.js',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './footer': './src/Footer.tsx',
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
