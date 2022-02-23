// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')
const {exec} = require('child_process')
const path = require('path')

// const bfj = require('bfj')
const fs = require('fs-extra')
const {checkBrowsers} = require('react-dev-utils/browsersHelper')
const chalk = require('react-dev-utils/chalk')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printBuildError = require('react-dev-utils/printBuildError')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const webpack = require('webpack')

const paths = require('../config/paths')
const configFactory = require('../config/webpack')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const useYarn = fs.existsSync(paths.yarnLockFile)

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const isInteractive = process.stdout.isTTY

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs, paths.appTsx])) {
  process.exit(1)
}

// Generate configuration
const [clientConfig, serverConfig] = configFactory('development')

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild)
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild)
    // Merge with the public folder
    copyPublicFolder()
    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    ({stats, previousFileSizes, warnings}) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
        console.log(`\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`)
        console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`)
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }

      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
      )

      const appPackage = require(paths.appPackageJson)
      const publicUrl = paths.publicUrlOrPath
      const publicPath = clientConfig.output.publicPath
      console.log('publicPath', publicPath)
      const buildFolder = path.relative(process.cwd(), paths.appBuild)
      printHostingInstructions(appPackage, publicUrl, publicPath, buildFolder, useYarn)

      exec(`node ${paths.appBuild}/server.js`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
      })
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n',
          ),
        )
        printBuildError(err)
      } else {
        console.log(chalk.red('Failed to compile.\n'))
        printBuildError(err)
        process.exit(1)
      }
    },
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Running the DEVELOPMENT build of the application.')

  const clientCompiler = webpack(clientConfig)
  const serverCompiler = webpack(serverConfig)

  return new Promise((resolve, reject) => {
    console.log('Compiling client...')
    clientCompiler.run((err, clientStats) => {
      let clientMessages
      if (err) {
        if (!err.message) {
          return reject(err)
        }

        let errMessage = err.message

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`
        }

        clientMessages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        })
      } else {
        clientMessages = formatWebpackMessages(clientStats.toJson({all: false, warnings: true, errors: true}))
      }
      if (clientMessages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (clientMessages.errors.length > 1) {
          clientMessages.errors.length = 1
        }
        return reject(new Error(clientMessages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        clientMessages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = clientMessages.warnings.filter(w => !/Failed to parse source map/.test(w))
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n',
            ),
          )
          return reject(new Error(filteredWarnings.join('\n\n')))
        }
      }

      serverCompiler.run((err, serverStats) => {
        console.log('Compiling server...')
        let serverMessages
        if (err) {
          if (!err.message) {
            return reject(err)
          }

          let errMessage = err.message

          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
            errMessage += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`
          }

          serverMessages = formatWebpackMessages({
            errors: [errMessage],
            warnings: [],
          })
        } else {
          serverMessages = formatWebpackMessages(serverStats.toJson({all: false, warnings: true, errors: true}))
        }
        if (serverMessages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (serverMessages.errors.length > 1) {
            serverMessages.errors.length = 1
          }
          return reject(new Error(serverMessages.errors.join('\n\n')))
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
          serverMessages.warnings.length
        ) {
          // Ignore sourcemap warnings in CI builds. See #8227 for more info.
          const filteredWarnings = serverMessages.warnings.filter(w => !/Failed to parse source map/.test(w))
          if (filteredWarnings.length) {
            console.log(
              chalk.yellow(
                '\nTreating warnings as errors because process.env.CI = true.\n' +
                  'Most CI servers set it automatically.\n',
              ),
            )
            return reject(new Error(filteredWarnings.join('\n\n')))
          }
        }

        return resolve({
          stats: clientStats,
          previousFileSizes,
          warnings: Object.assign({}, clientMessages.warnings, serverMessages.warnings),
        })
      })
    })
  })
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
}
