// const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_product_details',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  exposes: {
    './product-details': './src/ProductDetails.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})

module.exports = {getFederationConfig}
