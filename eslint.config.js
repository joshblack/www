/* eslint-disable */

import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  globalIgnores(['.next', 'out', 'packages/*']),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // TypeError: context.getAncestors is not a function
      '@next/next/no-duplicate-head': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': 'error',
    },
  }
);
