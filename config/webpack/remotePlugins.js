const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
// const resolve = require('resolve')
const webpack = require('webpack')
const FederatedStatsPlugin = require('webpack-federated-stats-plugin')

const getClientEnvironment = require('../env')
const paths = require('../paths')
// eslint-disable-next-line import/no-dynamic-require
const {version} = require(paths.appPackageJson)
// eslint-disable-next-line import/no-dynamic-require
const {getFederationConfig} = require(`${paths.federationConfigPath}/server`)

// Check if TypeScript is setup
// const useTypeScript = fs.existsSync(paths.appTsConfig)

const remotePlugins = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const REMOTE_URLS = JSON.parse(env.raw.REMOTE_URLS)

  const REMOTES = Object.entries(REMOTE_URLS)
    .map(([name, entry]) => ({
      [name]: `${entry}/remote-entry.js`,
    }))
    .reduce((acc, n) => ({...acc, ...n}), {})

  const federationConfig = getFederationConfig(REMOTES)
  console.log({federationConfig})
  // Some apps do not need the benefits of saving a web request, so not inlining the chunk
  // makes for a smoother build process.
  const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false'

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  // const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  return [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
          filename: 'app.html',
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined,
      ),
    ),
    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    // https://github.com/facebook/create-react-app/issues/5358
    isEnvProduction && shouldInlineRuntimeChunk && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // It will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
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
    new webpack.EnvironmentPlugin({
      REMOTE_URLS,
    }),
    federationConfig.exposes &&
      new FederatedStatsPlugin({
        filename: 'federation-stats.json',
      }),
    new webpack.container.ModuleFederationPlugin(federationConfig),
  ].filter(Boolean)
}

module.exports = {remotePlugins}
