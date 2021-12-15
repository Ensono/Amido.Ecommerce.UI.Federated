# `@hackney/eslint-config`

Eslint config for TS and React projects.

## Installation

```bash
npm install @hackney/eslint-config -D
yarn add @hackney/eslint-config -D
```

Add the library dependencies

```bash
yarn add @typescript-eslint/eslint-plugin eslint eslinit-config-airbnb eslint-config-airbnb-typescript eslint-config-prettier eslint-config-react eslint-plugin-import eslint-plugin-jest eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-testing-library prettier -D
```

## Usage

For React based projects configure a `.eslintrc` file:

```json
{
  "extends": "@hackney/eslint-config"
}
```

For non React based TS projects:

```json
{
  "extends": "@hackney/eslint-config/base"
}
```
