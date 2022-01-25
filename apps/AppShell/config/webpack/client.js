const webpack = require('webpack')

const paths = require('../paths')
const getBaseConfig = require('./base')

const getClientEnvironment = require('../env')
const packageJsonDeps = require('../../package.json').peerDependencies

module.exports = function (webpackEnv) {
  const baseConfig = getBaseConfig(webpackEnv)

  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const REMOTE_URLS = JSON.parse(env.raw.REACT_APP_REMOTE_URLS)

  const REMOTES = Object.entries(REMOTE_URLS)
    .map(([name, entry]) => ({
      [name]: `${entry}/static/container.js`,
    }))
    .reduce((acc, n) => ({ ...acc, ...n }), {})

  return {
    ...baseConfig,
    entry: paths.appIndexJs,
    plugins: baseConfig.plugins.concat([
      new webpack.container.ModuleFederationPlugin({
        name: 'webpackHost',
        filename: 'remote-entry.js',
        remotes: REMOTES,
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: packageJsonDeps.react,
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: packageJsonDeps['react-dom'],
          },
        },
      }),
    ]),
  }
}
