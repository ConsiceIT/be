// eslint.config.js
import eslintRecommended from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'
import { URL } from 'url'

export default [
	{
		ignores: ['node_modules/', 'dist/', 'jest.config.ts']
	},

	eslintRecommended.configs.recommended,
	...tseslint.configs.recommended,

	// Type-checked rules
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: new URL('./backend', import.meta.url)
			}
		},
		rules: {
			...tseslint.configs.recommendedTypeChecked[0].rules
		}
	},

	// Additional rules and plugins
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: new URL('./backend', import.meta.url) 
			}
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			import: importPlugin,
			prettier: prettierPlugin
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					semi: false,
					singleQuote: true
				}
			],
			camelcase: 'error',
			'spaced-comment': 'error',
			quotes: ['error', 'single'],
			'no-duplicate-imports': 'error',
			'no-unused-vars': 'off',
			'no-magic-numbers': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-magic-numbers': 'error'
		}
	},

	eslintConfigPrettier
]
