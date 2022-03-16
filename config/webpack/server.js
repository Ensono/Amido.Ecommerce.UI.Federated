const nodeExternals = require('webpack-node-externals')

const modules = require('../modules')
const paths = require('../paths')
const {serverLoaders} = require('./loaders/serverLoaders')
const {serverPlugins} = require('./plugins/serverPlugins')

module.exports = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const serverConfig = {
    target: 'node',
    entry: paths.appServerIndexTs,
    output: {
      globalObject: 'this',
      path: isEnvDevelopment ? paths.appDist : paths.appBuild,
      filename: 'server.js',
      library: {type: 'commonjs'},
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        '@next/core-logger': '@next/core-logger/lib/server',
      },
    },
    externals: [nodeExternals()],
    externalsPresets: {node: true},
    module: {
      rules: [
        {
          oneOf: [...serverLoaders(webpackEnv)].filter(Boolean),
        },
      ],
    },
    plugins: [...serverPlugins(webpackEnv)].filter(Boolean),
  }

  return serverConfig
}
