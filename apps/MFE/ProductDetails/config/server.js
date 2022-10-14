const {dependencies: rootDependencies} = require('../../../../package.json')
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
    ...rootDependencies,
    ...dependencies,
    react: {singleton: true},
    'react-dom': {singleton: true},
    'react-router-dom': {singleton: true},
    'react-redux': {singleton: true},
  },
})

module.exports = {getFederationConfig}
