const chalk = require('react-dev-utils/chalk')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const webpack = require('webpack')

const handleCompileError = (error, stats) => {
  let messages
  if (error) {
    if (!error.message) {
      throw error
    }

    let errMessage = error.message

    // Add additional information for postcss errors
    if (Object.prototype.hasOwnProperty.call(error, 'postcssNode')) {
      errMessage += `\nCompileError: Begins at CSS selector ${error.postcssNode.selector}`
    }

    messages = formatWebpackMessages({
      errors: [errMessage],
      warnings: [],
    })
  } else {
    messages = formatWebpackMessages(stats.toJson({all: false, warnings: true, errors: true}))
  }

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1
    }
    throw new Error(messages.errors.join('\n\n'))
  }

  if (
    process.env.CI &&
    (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
    messages.warnings.length
  ) {
    // Ignore sourcemap warnings in CI builds. See #8227 for more info.
    const filteredWarnings = messages.warnings.filter(w => !/Failed to parse source map/.test(w))
    if (filteredWarnings.length) {
      console.log(
        chalk.yellow(
          '\nTreating warnings as errors because process.env.CI = true.\n Most CI servers set it automatically.\n',
        ),
      )
      throw new Error(filteredWarnings.join('\n\n'))
    }
  }

  return messages
}

function compileStage(config, callback = null) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.run((error, stats) => {
      let messages
      try {
        messages = handleCompileError(error, stats)
      } catch (e) {
        return reject(e)
      }

      if (callback) {
        callback()
      }

      return resolve({
        stats,
        warnings: Object.assign({}, messages.warnings),
      })
    })
  })
}

module.exports = compileStage
