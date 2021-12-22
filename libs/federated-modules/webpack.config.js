const path = require('path');

module.exports = {
  entry: './src/federated-component.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'federated-modules.bundle.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'federatedModules',
    libraryTarget: 'umd',
  },
}

