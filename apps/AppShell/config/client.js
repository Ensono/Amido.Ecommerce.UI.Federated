const webpack = require('webpack')

const {dependencies} = require('../package.json')

export const getFederationConfig = REMOTES =>
  new webpack.container.ModuleFederationPlugin({
    name: 'app-shell',
    filename: 'remote-entry.js',
    remotes: REMOTES,
    shared: {
      react: {
        singleton: true,
        eager: true,
        requiredVersion: dependencies.react,
      },
      'react-dom': {
        singleton: true,
        eager: true,
        requiredVersion: dependencies['react-dom'],
      },
    },
  })
