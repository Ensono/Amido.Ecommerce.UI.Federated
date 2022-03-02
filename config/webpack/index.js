const clientConfig = require('./client')
const remoteConfig = require('./remote')
const serverConfig = require('./server')

module.exports = (webpackEnv = 'production') => {
  return [clientConfig(webpackEnv), remoteConfig(webpackEnv), serverConfig(webpackEnv)]
}
