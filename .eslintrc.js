module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "@stylistic",
    "react-hooks",
  ],
  extends: [
    "plugin:react-hooks/recommended",
  ],
  env: {
    browser: true,
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "import/order": ["error", {
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
      groups: [
        ["builtin", "external"],
      ],
      "newlines-between": "always",
    }],
    "no-var": "error",
    "prefer-const": "error",
    "@stylistic/jsx-quotes": ["error", "prefer-double"],
    "@stylistic/key-spacing": "error",
    "@stylistic/keyword-spacing": "error",
    "@stylistic/indent": ["error", 2],
    "@stylistic/no-extra-semi": "error",
    "@stylistic/no-multi-spaces": "error",
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
    "@stylistic/padded-blocks": ["error", "never", {
      allowSingleLineBlocks: true,
    }],
    "@stylistic/quote-props": ["error", "as-needed"],
    "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
    "@stylistic/semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],
  },
  ignorePatterns: [
    "node_modules",
    "src/js/constants/Combos.ts",
    "src/js/constants/framedata/*.json",
  ],
};
