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
      {'SwitchCase': 1}
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
    'keyword-spacing': ['error', { 'before': true, 'after': true }]
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
