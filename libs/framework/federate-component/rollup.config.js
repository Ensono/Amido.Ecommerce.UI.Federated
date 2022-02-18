const exp = require("../../../tools/config/rollup.component.config")
const pkg = require("./package.json")

module.exports = {...exp(pkg, true)}
