const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_header',
  filename: 'remote-entry.cjs',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './product-listing': './src/ProductListing.tsx',
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
