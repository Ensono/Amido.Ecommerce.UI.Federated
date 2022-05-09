// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_product_listing',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './product-listing': './src/ProductListing.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})

module.exports = {getFederationConfig}
