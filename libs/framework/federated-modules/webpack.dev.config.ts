import path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration, HotModuleReplacementPlugin } from 'webpack'

const config: Configuration = {
  target: 'node',
  mode: 'development',
  output: {
    publicPath: '/',
    filename: 'federated-modules.bundle.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'nextFederatedModules',
    libraryTarget: 'umd',
  },
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [new HotModuleReplacementPlugin()],
  devtool: 'inline-source-map',
}

export default config
