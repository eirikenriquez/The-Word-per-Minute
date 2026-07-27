import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const featureNames = [
  'auth',
  'bible-reader',
  'featured-passages',
  'practice',
  'saved-passages',
];

const featureBoundaryConfigs = featureNames.map((featureName) => {
  const otherFeatureNames = featureNames
    .filter((otherFeatureName) => otherFeatureName !== featureName)
    .join('|');

  return {
    files: [`src/features/${featureName}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?:@/|(?:\\.\\./)+)app(?:/|$)',
              message:
                'Features cannot import app. Compose features in the application layer.',
            },
            {
              regex: `^(?:@/features/|(?:\\.\\./)+(?:features/)?)(?:${otherFeatureNames})(?:/|$)`,
              message:
                'Features cannot import other features. Compose them in the application layer.',
            },
          ],
        },
      ],
    },
  };
});

export default defineConfig([
  globalIgnores(['.vite', 'dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  ...featureBoundaryConfigs,
  {
    files: ['src/{components,lib,types,utils}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?:@/|(?:\\.\\./)+)(?:app|features)(?:/|$)',
              message:
                'Shared modules cannot import higher application layers.',
            },
          ],
        },
      ],
    },
  },
]);
