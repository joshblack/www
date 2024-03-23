/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  plugins: [],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-console': 'error',
      },
    },
  ],
};

module.exports = config;
