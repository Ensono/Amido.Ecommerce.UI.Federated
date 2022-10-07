const {dependencies: rootDependencies} = require('../../../../package.json')
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
    ...rootDependencies,
    ...dependencies,
    react: {singleton: true},
    'react-dom': {singleton: true},
    'react-router-dom': {},
    'redux-react': {singleton: true},
  },
})

module.exports = {getFederationConfig}
