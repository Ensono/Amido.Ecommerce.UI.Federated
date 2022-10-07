const path = require('path')

module.exports = {
  extends: ['../../../.eslintrc.json'],
  ignorePatterns: ['!**/*', 'build', '.cache', 'node_modules', 'coverage'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {packageDir: [path.join(__dirname, '..', '..', '..'), __dirname]},
        ],
      },
    },
  ],
}
