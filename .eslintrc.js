module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', "unicorn", "eslint-plugin-import"],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      "import/order": [
        2,
        {
          "newlines-between": "never"
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ],
      "import/first": 2,
      "unicorn/filename-case": [
        2,
        {
          "case": "kebabCase"
        }
      ],
    },
    overrides: [
      {
        files: ['tools/**/*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        }
      }
    ]
  };
