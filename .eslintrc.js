module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "no-console":0,
    "no-unused-vars":0,
    "quotes": 0,
    "indent": 0,
    "no-unreachable": 0,
    "no-mixed-spaces-and-tabs": 0,
    "func-names": 0,
    "no-use-before-define": [2, "nofunc"],
    "prefer-arrow-callback": 0,
    "prefer-rest-params": 0,
    "import/no-unresolved": 0,
    "no-underscore-dangle": 0,
    "no-empty": 0,
    "no-case-declarations": 0
  },
  overrides: [
    // node files
    {
      files: [
        'index.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'app/**',
        'addon/**',
        'tests/dummy/app/**',
        'node_modules/**',
        'tmp/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }
  ]
};
