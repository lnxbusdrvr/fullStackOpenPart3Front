import globals from "globals";
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import pluginReact from "eslint-plugin-react";


export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'always'
      ],
      'eqeqeq': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 'off',
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "mongodb.js",
      "eslint.config.js",
      "vite.config.js"
    ]
  }
]
  

