import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'

export default [
  // 1. Thay cho globalIgnores
  { ignores: ['dist', 'node_modules'] },

  // 2. Gom nhóm các cấu hình mặc định
  js.configs.recommended,
  react.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'off', // Tắt hoàn toàn cảnh báo biến không sử dụng
      'no-undef': 'error',
      'react/jsx-uses-vars': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-unresolved': 'off',
      'react/prop-types': 'off',
      'no-use-before-define': 'off',
      'react-hooks/set-state-in-effect': 'off', // 👈 Thêm dòng này
      "react/no-unescaped-entities": "off"
    },
  },
]