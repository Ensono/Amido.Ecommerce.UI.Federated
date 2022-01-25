const clientConfig = require('./client')
const serverConfig = require('./server')

module.exports = (webpackEnv = 'production') => {
  return [clientConfig(webpackEnv), serverConfig(webpackEnv)]
}
