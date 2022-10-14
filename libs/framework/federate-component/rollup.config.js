const exp = require('../../../tools/config/rollup.federated.config')
const pkg = require('./package.json')

module.exports = {...exp(pkg)}
