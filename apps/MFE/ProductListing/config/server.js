const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_product_listing',
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
    'react-router-dom': {},
  },
})

module.exports = {getFederationConfig}
