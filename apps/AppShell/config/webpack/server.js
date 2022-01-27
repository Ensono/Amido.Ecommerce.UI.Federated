const nodeExternals = require('webpack-node-externals')

const paths = require('../paths')

module.exports = function (webpackEnv) {
  return {
    target: 'node',
    entry: paths.serverTs,
    output: {
      path: paths.appBuild,
      filename: 'server.js',
      library: { type: "commonjs2" },
    },
    externals: [nodeExternals()],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  }
}
