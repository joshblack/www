'use strict';

module.exports = {
  plugins: ['prettier-plugin-astro'],
  bracketSameLine: true,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  proseWrap: 'always',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
