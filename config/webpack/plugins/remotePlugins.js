const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const webpack = require('webpack')

const getClientEnvironment = require('../../env')
const paths = require('../../paths')
const {getRemotes} = require('../util')
// eslint-disable-next-line import/no-dynamic-require
const {getFederationConfig} = require(`${paths.federationConfigPath}/server`)

const remotePlugins = () => {
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const remotes = getRemotes()
  const federationConfig = getFederationConfig(remotes)

  return [
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    new webpack.container.ModuleFederationPlugin(federationConfig),
  ].filter(Boolean)
}

module.exports = {remotePlugins}
