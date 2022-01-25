const webpack = require('webpack')

const paths = require('../paths')
const getBaseConfig = require('./base')

const nodeExternals = require('webpack-node-externals')

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
    target: 'node',
    entry: paths.appTsx,
    output: {
      ...baseConfig.output,
      path: paths.appDist,
      filename: 'app.js',
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals()],
    externalsPresets: { node: true },
    plugins: baseConfig.plugins.concat([
      new webpack.container.ModuleFederationPlugin({
        name: 'appShell',
        filename: 'remote-entry.js',
        remotes: REMOTES,
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: packageJsonDeps.react,
          },
        },
      }),
    ]),
  }
}
