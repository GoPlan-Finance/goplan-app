module.exports = {
  root    : true,
  parser  : '@typescript-eslint/parser',
  extends : [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '../common/.eslintrc.js',
  ],
  plugins: [
    '@typescript-eslint',
    'varspacing',
  ],
  ignorePatterns: [
    'dist/*'
  ],
  rules: {
  },

}
