// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const path = require('path')

const fs = require('fs-extra')
const {checkBrowsers} = require('react-dev-utils/browsersHelper')
const chalk = require('react-dev-utils/chalk')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const paths = require('../config/paths')
const configFactory = require('../config/webpack')
const compileStage = require('./utils/compileStage')
const copyPublicFolder = require('./utils/copyPublicFolder')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const isInteractive = process.stdout.isTTY

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appClientIndexTsx, paths.appTsx])) {
  process.exit(1)
}

// Generate configuration
const [clientConfig, remoteConfig, serverConfig] = configFactory('production')

// Create the production build and print the deployment instructions.
const build = async previousFileSizes => {
  console.log(`Running a ${chalk.green('PRODUCTION')} build of the application`)
  console.log('Building remote...')
  const remoteBuildResult = await compileStage(remoteConfig)
  console.log('Building client...')
  const clientBuildResult = await compileStage(clientConfig)
  console.log('Building server...')
  const serverBuildResult = await compileStage(serverConfig, () => {
    // remove the remote-entry generated static files that we don't need anymore
    const remoteEntryFolder = `${paths.appSrc}/remote-entry`
    fs.rmSync(`${remoteEntryFolder}/static`, {recursive: true, force: true})

    // remove remote-entry if the folder is empty
    const files = fs.readdirSync(remoteEntryFolder)
    if (files.length === 0) {
      fs.rmdirSync(remoteEntryFolder)
    }
  })

  return {
    stats: clientBuildResult.stats,
    previousFileSizes,
    warnings: Object.assign({}, remoteBuildResult.warnings, clientBuildResult.warnings, serverBuildResult.warnings),
  }
}
// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuildPublic)
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuildPublic)
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
        paths.appBuildPublic,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
      )

      const buildFolder = path.relative(process.cwd(), paths.appBuildPublic)
      console.log(`Files for ${chalk.green('PRODUCTION')} instance output to /${chalk.green(buildFolder)}`)
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
