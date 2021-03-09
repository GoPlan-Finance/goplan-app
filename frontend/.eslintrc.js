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
