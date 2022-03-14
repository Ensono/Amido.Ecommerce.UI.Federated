const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const getClientEnvironment = require('../../env')
const paths = require('../../paths')
const typescriptCheck = require('../util/typescriptCheck')
// eslint-disable-next-line import/no-dynamic-require
const {version} = require(paths.appPackageJson)

const serverPlugins = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

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
    typescriptCheck(webpackEnv, false),
    new webpack.EnvironmentPlugin({
      REMOTE_URLS: JSON.parse(env.raw.REMOTE_URLS),
      PORT: env.raw.PORT,
    }),
  ]
}

module.exports = {serverPlugins}
