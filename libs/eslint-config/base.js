module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['*.config.js'],
  parserOptions: {
    ecmaVersion: 10,
    extraFileExtensions: ['.mjs'],
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  rules: {
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'tsdoc/syntax': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.(test|spec).ts?(x)'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {files: ['*'], extends: './all'},
  ],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.mjs', '.js', '.ts'],
      },
    },
    jest: {
      version: 26,
    },
  },
}
