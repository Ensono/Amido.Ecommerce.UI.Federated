const HtmlWebpackPlugin = require('html-webpack-plugin')

const getClientEnvironment = require('../../env')
const paths = require('../../paths')

const getRemotes = () => {
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const REMOTE_URLS = JSON.parse(env.raw.REMOTE_URLS)

  const REMOTES = Object.entries(REMOTE_URLS)
    .map(([name, entry]) => ({
      [name]: `${entry}/remote-entry.js`,
    }))
    .reduce((acc, n) => ({...acc, ...n}), {})

  return REMOTES
}

// Generates an `index.html` file with the <script> injected.
const getHtmlPlugin = isEnvProduction => {
  return new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: paths.appHtml,
        filename: 'app.html',
      },
      isEnvProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : undefined,
    ),
  )
}

module.exports = {
  getRemotes,
  getHtmlPlugin,
}
