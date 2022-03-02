const fs = require('fs')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
// const resolve = require('resolve')
const webpack = require('webpack')
const FederatedStatsPlugin = require('webpack-federated-stats-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const {StatsWriterPlugin} = require('webpack-stats-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

// const ForkTsCheckerWebpackPlugin =
//   process.env.TSC_COMPILE_ON_ERROR === 'true'
//     ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
//     : require('react-dev-utils/ForkTsCheckerWebpackPlugin')

const getClientEnvironment = require('../env')
const paths = require('../paths')
const {version} = require(paths.appPackageJson)
// eslint-disable-next-line import/no-dynamic-require
const {getFederationConfig} = require(`${paths.federationConfigPath}/client`)

// Get the path to the uncompiled service worker (if it exists).
const swSrc = paths.swSrc

// Check if TypeScript is setup
// const useTypeScript = fs.existsSync(paths.appTsConfig)

const clientPlugins = webpackEnv => {
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
    // Generate an asset manifest file with the following content:
    // - "files" key: Mapping of all asset filenames to their corresponding
    //   output file so that tools can pick it up without having to parse
    //   `index.html`
    // - "entrypoints" key: Array of files which are included in `index.html`,
    //   can be used to reconstruct the HTML if necessary
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: paths.publicUrlOrPath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path
          return manifest
        }, seed)
        const entrypointFiles = entrypoints.main.filter(fileName => !fileName.endsWith('.map'))

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        }
      },
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
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the webpack build.
    isEnvProduction &&
      fs.existsSync(swSrc) &&
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc,
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        // Bump up the default maximum size (2mb) that's precached,
        // to make lazy-loading failure scenarios less likely.
        // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
    // // TypeScript type checking
    // useTypeScript &&
    //   new ForkTsCheckerWebpackPlugin({
    //     async: isEnvDevelopment,
    //     typescript: {
    //       typescriptPath: resolve.sync('typescript', {
    //         basedir: paths.appNodeModules,
    //       }),
    //       configOverwrite: {
    //         compilerOptions: {
    //           sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //           skipLibCheck: true,
    //           inlineSourceMap: false,
    //           declarationMap: false,
    //           noEmit: true,
    //           incremental: true,
    //           tsBuildInfoFile: paths.appTsBuildInfoFile,
    //         },
    //       },
    //       context: paths.appPath,
    //       diagnosticOptions: {
    //         syntactic: true,
    //       },
    //       mode: 'write-references',
    //       // profile: true,
    //     },
    //     issue: {
    //       // This one is specifically to match during CI tests,
    //       // as micromatch doesn't match
    //       // '../cra-template-typescript/template/src/App.tsx'
    //       // otherwise.
    //       include: [{file: '../**/src/**/*.{ts,tsx}'}, {file: '**/src/**/*.{ts,tsx}'}],
    //       exclude: [
    //         {file: '**/src/**/__tests__/**'},
    //         {file: '**/src/**/?(*.){spec|test}.*'},
    //         {file: '**/src/setupProxy.*'},
    //         {file: '**/src/setupTests.*'},
    //       ],
    //     },
    //     logger: {
    //       infrastructure: 'silent',
    //     },
    //   }),
    new webpack.EnvironmentPlugin({
      REMOTE_URLS,
    }),
    federationConfig.exposes &&
      new StatsWriterPlugin({
        filename: 'stats.json',
        stats: {all: true},
      }),
    federationConfig.exposes &&
      new FederatedStatsPlugin({
        filename: 'federation-stats.json',
      }),
    new webpack.container.ModuleFederationPlugin(federationConfig),
  ].filter(Boolean)
}

module.exports = {clientPlugins}
