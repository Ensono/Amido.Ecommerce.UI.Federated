module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "./base",
    "airbnb",
    "airbnb-typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-hooks", "testing-library"],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: true,
      }
    ],
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "off",
    "react/require-default-props": "off",
    "react/sort-prop-types": "error",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "error",
    "react/forbid-prop-types": "off",
    "react/no-danger": "off",
    "react/button-has-type": "off",
    "react/no-unescaped-entities": "off",
    "react/state-in-constructor": "off",
    "react/destructuring-assignment": "off",
    "react/no-children-prop": "off",
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        aspects: ["invalidHref"],
      },
    ],
    "jsx-a11y/label-has-associated-control": "off"
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.tsx", "**/?(*.)+(spec|test).tsx"],
      extends: ["plugin:testing-library/react"],
    },
    {
      files: ["*"],
      extends: "./all",
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
