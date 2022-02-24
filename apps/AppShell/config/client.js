const webpack = require('webpack')

const REMOTE_URLS = JSON.parse(env.raw.REMOTE_URLS)

export const clientConfig = new webpack.container.ModuleFederationPlugin({
  name: 'webpackHost',
  filename: 'remote-entry.js',
  remotes: REMOTES,
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: packageJsonDeps.react,
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: packageJsonDeps['react-dom'],
    },
  },
})
