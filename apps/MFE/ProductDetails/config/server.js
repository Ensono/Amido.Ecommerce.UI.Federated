const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_product_details',
  filename: 'remote-entry.cjs',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './product-details': './src/ProductDetails.tsx',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
      shareScope: 'default',
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-router-dom'],
      shareScope: 'default',
    },
  },
})

module.exports = {getFederationConfig}
