const path = require('path')

process.env.NODE_ENV = 'production'

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false
  }

  try {
    require.resolve('react/jsx-runtime')
    return true
  } catch (e) {
    return false
  }
})()

module.exports = {
  entry: {
    index: {import: './src/index.js'},
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              require.resolve('babel-preset-react-app'),
              {
                runtime: hasJsxRuntime ? 'automatic' : 'classic',
              },
            ],
          ],
        },
      },
    ],
  },
  output: {
    filename: 'ui-components.bundle.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'nextUiComponents',
    libraryTarget: 'umd',
  },
}
