const fs = require('fs')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const resolve = require('resolve')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin =
  process.env.TSC_COMPILE_ON_ERROR === 'true'
    ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
    : require('react-dev-utils/ForkTsCheckerWebpackPlugin')

const getClientEnvironment = require('../env')
const paths = require('../paths')
// eslint-disable-next-line import/no-dynamic-require
const {version} = require(paths.appPackageJson)
// eslint-disable-next-line import/no-dynamic-require
// const {getFederationConfig} = require(`${paths.federationConfigPath}/server`)

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig)

const serverPlugins = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const REMOTE_URLS = JSON.parse(env.raw.REMOTE_URLS)

  // const REMOTES = Object.entries(REMOTE_URLS)
  //   .map(([name, entry]) => ({
  //     [name]: `${entry}/remote-entry.js`,
  //   }))
  //   .reduce((acc, n) => ({...acc, ...n}), {})

  // const federationConfig = getFederationConfig(REMOTES)
  // console.log({federationConfig})

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

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
    // TypeScript type checking
    useTypeScript &&
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
        typescript: {
          typescriptPath: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          configOverwrite: {
            compilerOptions: {
              sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
              skipLibCheck: true,
              inlineSourceMap: false,
              declarationMap: false,
              noEmit: true,
              incremental: true,
              tsBuildInfoFile: paths.appTsBuildInfoFile,
            },
          },
          context: paths.appPath,
          diagnosticOptions: {
            syntactic: true,
          },
          mode: 'write-references',
          // profile: true,
        },
        issue: {
          // This one is specifically to match during CI tests,
          // as micromatch doesn't match
          // '../cra-template-typescript/template/src/App.tsx'
          // otherwise.
          include: [{file: '../**/src/**/*.{ts,tsx}'}, {file: '**/src/**/*.{ts,tsx}'}],
          exclude: [
            {file: '**/src/**/__tests__/**'},
            {file: '**/src/**/?(*.){spec|test}.*'},
            {file: '**/src/setupProxy.*'},
            {file: '**/src/setupTests.*'},
          ],
        },
        logger: {
          infrastructure: 'silent',
        },
      }),
    new webpack.EnvironmentPlugin({
      REMOTE_URLS,
    }),
    // new webpack.container.ModuleFederationPlugin(federationConfig),
  ]
}

module.exports = {serverPlugins}
