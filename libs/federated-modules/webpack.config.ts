import path from 'path'
import { Configuration } from 'webpack'

const config: Configuration = {
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

export default config
