const fs = require('fs')

const resolve = require('resolve')

const paths = require('../../paths')

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig)

const ForkTsCheckerWebpackPlugin =
  process.env.TSC_COMPILE_ON_ERROR === 'true'
    ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
    : require('react-dev-utils/ForkTsCheckerWebpackPlugin')

module.exports = (webpackEnv, isClientBuild = true) => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  return (
    useTypeScript &&
    new ForkTsCheckerWebpackPlugin({
      async: isEnvDevelopment,
      typescript: {
        typescriptPath: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        configOverwrite: {
          compilerOptions: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            skipLibCheck: true,
            inlineSourceMap: false,
            declarationMap: false,
            noEmit: true,
            incremental: true,
            tsBuildInfoFile: paths.appTsBuildInfoFile,
          },
          exclude: [isClientBuild ? './server' : ''],
        },
        context: paths.appPath,
        diagnosticOptions: {
          syntactic: true,
        },
        mode: 'write-references',
        // profile: true,
      },
      issue: {
        // This one is specifically to match during CI tests,
        // as micromatch doesn't match
        // '../cra-template-typescript/template/src/App.tsx'
        // otherwise.
        include: [{file: '../**/src/**/*.{ts,tsx}'}, {file: '**/src/**/*.{ts,tsx}'}],
        exclude: [
          {file: '**/src/**/__tests__/**'},
          {file: '**/src/**/?(*.){spec|test}.*'},
          {file: '**/src/setupProxy.*'},
          {file: '**/src/setupTests.*'},
        ],
      },
      logger: {
        infrastructure: 'silent',
      },
    })
  )
}
