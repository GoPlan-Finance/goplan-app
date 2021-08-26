module.exports = {
  root: true,
  env: {
    // node : true,
    browser: true,
    es6: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    '@vue/typescript/recommended',
  ],
  plugins: [],
  ignorePatterns: ["src/@core/*"],
  rules: {
    // Stuff to re-evaluate later
    // '@typescript-eslint/require-ts-comment-description' : 'error',
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
    "vue/no-unused-vars": "off",
    // "no-unused-components": "warn",
    // "vue/no-mutating-props": "warn",

    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",

    eqeqeq: "error",
    "no-invalid-this": "error",
    "no-return-assign": "error",
    "no-unused-expressions": [
      "error",
      {
        allowTernary: true,
      },
    ],
    // 'no-unused-vars': [
    //   'error', {
    //     'args': 'after-used'
    //   }
    // ],
    "curly" : ["error", "all"],
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "init-declarations": "error",
    "no-use-before-define": "error",
    "no-lonely-if": "error",
    "no-unneeded-ternary": "error",
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": "error",
    "no-confusing-arrow": "error",
    "no-duplicate-imports": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-template": "error",
  },
  globals: {
    Parse: true,
  },
};
