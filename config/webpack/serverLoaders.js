const flexbugsPlugin = require('postcss-flexbugs-fixes')
const postCssPresetEnv = require('postcss-preset-env')
// eslint-disable-next-line import/no-extraneous-dependencies
const getCSSModuleLocalIdent = require('react-ssr-dev-utils/getCSSModuleLocalIdent')

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const imageInlineSizeLimit = 10000

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const serverLoaders = webpackEnv => {
  const isEnvProduction = webpackEnv === 'production'

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: () => [
              flexbugsPlugin,
              postCssPresetEnv({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
          },
        },
      },
    ].filter(Boolean)
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        },
      )
    }
    return loaders
  }

  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: imageInlineSizeLimit,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      loader: require.resolve('css-loader'),
    },
    {
      test: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        modules: {
          mode: 'local',
          getLocalIdent: getCSSModuleLocalIdent,
        },
      }),
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
        },
        'sass-loader',
      ),
      sideEffects: true,
    },
    {
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        'sass-loader',
      ),
    },
    {
      loader: require.resolve('file-loader'),
      exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ]
}

module.exports = {serverLoaders}
