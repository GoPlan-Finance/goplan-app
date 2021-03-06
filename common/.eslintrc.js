module.exports = {
  root : true,
  env  : {
    node : true,
    es6  : true
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [
    'varspacing'
  ],
  rules: {
    'max-len'                : 'off',
    'no-multi-spaces'        : 'off',
    'varspacing/var-spacing' : 2,

    'no-console'  : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger' : process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'eqeqeq'                : 'error',
    'no-invalid-this'       : 'error',
    'no-return-assign'      : 'error',
    'no-unused-expressions' : [
      'error',
      {
        allowTernary: true,
      },
    ],
    'no-unused-vars': [
      'error', {
        'args': 'after-used'
      }
    ],
    'no-useless-concat'     : 'error',
    'no-useless-return'     : 'error',
    'init-declarations'     : 'error',
    'no-use-before-define'  : 'error',
    'array-bracket-newline' : [
      'error',
      {
        multiline : true,
        minItems  : 1,
      },
    ],
    'array-bracket-spacing' : 'error',
    'brace-style'           : [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    'block-spacing'             : 'error',
    'comma-spacing'             : 'error',
    'comma-style'               : 'error',
    'computed-property-spacing' : 'error',
    'func-call-spacing'         : 'error',
    'implicit-arrow-linebreak'  : [
      'error',
      'beside',
    ],
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ],
    'key-spacing': [
      'error', {
        'multiLine': {
          'beforeColon' : false,
          'afterColon'  : true
        },
        'align': {
          'beforeColon' : true,
          'afterColon'  : true,
          'on'          : 'colon',
        },
      },
    ],
    'keyword-spacing'   : 'error',
    'multiline-ternary' : [
      'error',
      'never',
    ],
    'no-lonely-if'            : 'error',
    'no-mixed-operators'      : 'error',
    'no-multiple-empty-lines' : [
      'error',
      {
        max    : 2,
        maxEOF : 2,
      },
    ],
    'no-tabs'                          : 'error',
    'no-unneeded-ternary'              : 'error',
    'no-whitespace-before-property'    : 'error',
    'nonblock-statement-body-position' : 'error',
    'object-property-newline'          : [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    'quote-props': [
      'error',
      'consistent',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'padded-blocks': [
      'error', { 'classes': 'always' }
    ],
    'semi-spacing'                : 'error',
    'space-before-blocks'         : 'error',
    'space-before-function-paren' : [
      'error', 'always'
    ],
    'space-in-parens'      : 'error',
    'space-infix-ops'      : 'error',
    'space-unary-ops'      : 'error',
    'arrow-spacing'        : 'error',
    'no-confusing-arrow'   : 'error',
    'no-duplicate-imports' : 'error',
    'no-var'               : 'error',
    'object-shorthand'     : 'error',
    'prefer-const'         : 'error',
    'prefer-template'      : 'error',
  },
  parserOptions: {
    ecmaVersion : 8,
    sourceType  : 'module',
  },
  globals: {
    'Parse': true
  }
}
