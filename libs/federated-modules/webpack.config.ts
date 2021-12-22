import path from 'path'

import { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'

const config: Configuration = {
  entry: './src/index.tsx',
  target: 'node',
  externals: [nodeExternals()],
  externalsPresets: {
    node: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
}

export default config
