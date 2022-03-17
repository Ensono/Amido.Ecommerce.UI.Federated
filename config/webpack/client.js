const path = require('path')

const {merge} = require('webpack-merge')

const paths = require('../paths')
const baseClientConfig = require('./client.base')
const {clientLoaders} = require('./loaders/clientLoaders')
const {clientPlugins} = require('./plugins/clientPlugins')

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const clientConfig = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  const config = {
    target: 'web',
    // eslint-disable-next-line no-nested-ternary
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    output: {
      // The build folder.
      path: isEnvDevelopment ? paths.appDistPublic : paths.appBuildPublic,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    optimization: {
      minimize: isEnvProduction,
      splitChunks: isEnvProduction && {
        chunks: 'all',
        name: false,
        // maxSize: 90000,
      },
    },
    plugins: [...clientPlugins(webpackEnv)].filter(Boolean),
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap
          ? {
              enforce: 'pre',
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              test: /\.(js|mjs|jsx|ts|tsx|css)$/,
              loader: require.resolve('source-map-loader'),
            }
          : {},
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [...clientLoaders(webpackEnv)].filter(Boolean),
        },
      ],
    },
  }

  const baseConfig = baseClientConfig(webpackEnv)

  return merge(baseConfig, config)
}

module.exports = clientConfig
