module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_'
    }],
    'indent': [
      2,
      2,
      { 'SwitchCase': 1 }
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'eqeqeq': 'error',
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-trailing-spaces': 'error',
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'key-spacing': ['error', {  'afterColon': true, 'beforeColon': false }],
    'space-before-blocks': 'error',
    'keyword-spacing': ['error', { 'before': true, 'after': true }],


    'no-var': 'error',
    'prefer-const': ['error', {
      'destructuring': 'any',
      'ignoreReadBeforeAssign': false
    }],
    'no-use-before-define': 'error',
    'no-await-in-loop': 'error',

    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-parens': ['error', 'always'],
    'brace-style': 'error',
    'camelcase': 'error',
    'comma-style': ['error', 'last'],
    'semi-spacing': 'error',
    'switch-colon-spacing': ['error', { 'after': true, 'before': false }],
    'array-callback-return': ['error', { 'allowImplicit': true }],
    'curly': 'error',
    'dot-notation': 'error',
    'space-before-function-paren': [
      'error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }
    ],
    'no-constant-condition': 'error',
    'no-extra-semi': 'error',
    'no-useless-return': 'error',
    'require-await': 'error',
    'no-confusing-arrow': 'error',
    'object-shorthand': ['error', 'always']
  },

  overrides: [{
    files: [
      '**/__tests__/*.{j,t}s?(x)',
      '**/tests/unit/**/*.spec.{j,t}s?(x)'
    ],
    env: {
      jest: true
    }
  }]
};
