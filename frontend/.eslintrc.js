module.exports = {
  root          : true,
  parser        : 'vue-eslint-parser',
  parserOptions : {
    ecmaVersion : 8,
    sourceType  : 'module',
    parser      : '@typescript-eslint/parser',
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '../common/.eslintrc.js',
  ],
  ignorePatterns: [
    'src/components/Charts/TradingVue/*'
  ],
  plugins: [
    'vue',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any' : 'off',
    'vue/html-quotes'                    : [
      'error',
      'double',
    ],
  },
}
