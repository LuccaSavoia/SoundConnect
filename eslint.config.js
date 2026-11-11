import js from '@eslint/js';
import globals from 'globals';

export default [{ ignores: ['dist/**'] }, { files: ['**/*.{js,jsx}'], languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { ...js.configs.recommended.rules, 'no-unused-vars': 'off', 'no-undef': 'off' } }];
