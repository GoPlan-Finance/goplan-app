module.exports = {
  extends:         [
    '../common/.eslintrc.js',
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules:           {
     'vue/html-quotes':                  [
      'error',
      'double',
    ],
  },
}
