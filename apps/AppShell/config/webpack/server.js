const nodeExternals = require('webpack-node-externals')

const modules = require('../modules')
const paths = require('../paths')
const {baseLoaders, serverLoaders} = require('./serverLoaders')

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development'
  return {
    target: 'node',
    entry: paths.appServerIndexTs,
    output: {
      globalObject: 'this',
      path: isEnvDevelopment ? paths.appDist : paths.appBuild,
      filename: 'server.js',
      // library: {type: 'commonjs2'},
    },
    externals: [
      nodeExternals({
        allowlist: [
          isEnvDevelopment && 'webpack/hot/poll?100',
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(Boolean),
      }),
    ],
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    },
    module: {
      rules: [
        {
          oneOf: [...baseLoaders(webpackEnv), ...serverLoaders(webpackEnv)],
        },
      ],
    },
  }
}
