module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['prettier', 'react', 'tailwind'],
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:tailwind/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-fragments': 'off',
    'no-nested-ternary': 'off',
    'import/prefer-default-export': 'off',
    'tailwind/class-order': 'off',
    'import/extensions': 'off',
  },
  settings: {
    react: {
      version: 'detetect',
    },
  },
};
