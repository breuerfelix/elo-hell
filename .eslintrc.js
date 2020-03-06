module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'svelte3',
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/',
    'src/node_modules',
    'src/service-worker.js'
  ],
  rules: {
    'indent': ['error', 4],
    'no-shadow': 0,
    'no-tabs': 0,
    'no-console': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'no-restricted-globals': 0,
    'no-await-in-loop': 0,
    'radix': 0,
    'camelcase': 0,
    'arrow-parens': 0,
    'eqeqeq': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
  },
};
