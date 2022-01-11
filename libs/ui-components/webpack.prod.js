const path = require('path')

module.exports = {
  entry: {
    index: { import: './src/index.js' },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
