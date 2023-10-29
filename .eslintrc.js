module.exports = {
  root: true,
  plugins: ['import'],
  extends: ['@react-native-community', 'plugin:import/recommended'],
  rules: {
    'no-shadow': 'off',
    'prefer-const': 'error',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  env: {
    jest: true,
  },
};
