module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['contexts', './src/contexts'],
          ['store', './src/store']
        ]
      }
    }
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-unused-vars': 1,
    'import/extensions': 0,
    // ['error', { ignorePackages: true, pattern: { jsx: 'always' } }],
    'import/no-extraneous-dependencies': 0,
    'comma-dangle': ['error', 'never'],
    'arrow-body-style': ['error', 'always'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-param-reassign': ['error', { props: false }],
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 0
  }
};
