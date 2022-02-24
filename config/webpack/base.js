const modules = require('../modules')
const paths = require('../paths')
const {baseLoaders} = require('./baseLoaders')

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = (webpackEnv, appEnv) => {
  return {
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    },
    module: {
      rules: [
        {
          oneOf: [...baseLoaders(webpackEnv, appEnv)].filter(Boolean),
        },
      ],
    },
  }
}
