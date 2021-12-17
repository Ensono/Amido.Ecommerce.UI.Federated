const path = require("path");

module.exports = {
  entry: {
    index: { import: "./src/federated-component.jsx" }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  output: {
    filename: "federated-modules.bundle.min.js",
    path: path.resolve(__dirname, "build"),
    library: 'federatedModules',
    libraryTarget: 'umd'
  },
};