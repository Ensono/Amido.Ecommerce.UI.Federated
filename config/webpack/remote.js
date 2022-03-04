const {merge} = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const paths = require('../paths')
// eslint-disable-next-line import/no-dynamic-require
const {baseClientConfig} = require('./client.base')
const {remotePlugins} = require('./plugins/remotePlugins')

module.exports = webpackEnv => {
  const baseConfig = baseClientConfig(webpackEnv)
  const remoteConfig = {
    target: 'node',
    externals: [nodeExternals()],
    externalsPresets: {node: true},
    output: {
      library: {type: 'commonjs'},
      // The build folder.
      path: `${paths.appSrc}/remote-entry`,
    },
    optimization: {
      // TODO needs further investigation as if set to true it breaks remote-entry
      minimize: false,
      splitChunks: false,
    },
    plugins: [...remotePlugins(webpackEnv)].filter(Boolean),
  }

  return merge(baseConfig, remoteConfig)
}
