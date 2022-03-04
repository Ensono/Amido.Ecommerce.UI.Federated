const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const paths = require('../../paths')
const {getRemotes} = require('../util')
const typescriptCheck = require('../util/typescriptCheck')
// eslint-disable-next-line import/no-dynamic-require
const {version} = require(paths.appPackageJson)
// eslint-disable-next-line import/no-dynamic-require
const {getFederationConfig} = require(`${paths.federationConfigPath}/server`)

const serverPlugins = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  const remotes = getRemotes()
  const federationConfig = getFederationConfig(remotes)

  return [
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `static/css/[name].${version}.css`,
        chunkFilename: `static/css/[name].${version}.chunk.css`,
      }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    typescriptCheck(webpackEnv),
    new webpack.container.ModuleFederationPlugin(federationConfig),
  ]
}

module.exports = {serverPlugins}
