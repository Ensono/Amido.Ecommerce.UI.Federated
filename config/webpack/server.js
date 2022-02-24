const {merge} = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const paths = require('../paths')
const getBaseConfig = require('./base')
const {serverLoaders} = require('./serverLoaders')

module.exports = webpackEnv => {
  const baseConfig = getBaseConfig(webpackEnv, 'server')

  const isEnvDevelopment = webpackEnv === 'development'
  const serverConfig = {
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
    module: {
      rules: [
        {
          oneOf: [...serverLoaders(webpackEnv)].filter(Boolean),
        },
      ],
    },
  }

  return merge(baseConfig, serverConfig)
}
