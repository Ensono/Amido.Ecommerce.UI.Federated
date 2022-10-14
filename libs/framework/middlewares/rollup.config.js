const exp = require('../../../tools/config/rollup.package.config')
const pkg = require('./package.json')

module.exports = {...exp(pkg)}
