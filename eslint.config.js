import eslint from '@eslint/js';
import angular from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typeScriptRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/ban-ts-comment': 'error',
  '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
  '@typescript-eslint/no-unused-vars': [
    'error',
    { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
  ],
  'unused-imports/no-unused-imports': 'error',
  '@typescript-eslint/typedef': ['error', { memberVariableDeclaration: true, propertyDeclaration: true }],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    { accessibility: 'explicit', overrides: { constructors: 'no-public' } },
  ],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    { allowExpressions: false, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
  ],
  'no-console': ['error', { allow: ['warn', 'error'] }],
  '@angular-eslint/prefer-on-push-component-change-detection': 'error',
  '@angular-eslint/prefer-signals': 'error',
  '@angular-eslint/prefer-output-emitter-ref': 'error',
  '@angular-eslint/prefer-output-readonly': 'error',
  '@angular-eslint/no-uncalled-signals': 'error',
  '@angular-eslint/use-injectable-provided-in': 'error',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
};

function angularProject(root, prefix, tsconfigs) {
  return {
    files: [`${root}/**/*.ts`],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...angular.configs.tsRecommended],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { project: tsconfigs, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'unused-imports': unusedImports, 'simple-import-sort': simpleImportSort },
    rules: {
      ...typeScriptRules,
      '@angular-eslint/component-selector': ['error', { type: ['element', 'attribute'], prefix, style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix, style: 'camelCase' }],
    },
  };
}

export default tseslint.config(
  { ignores: ['dist', '.angular', 'node_modules', 'coverage', 'out-tsc'] },
  angularProject('projects/expressive-angular', 'exp', [
    './projects/expressive-angular/tsconfig.lib.json',
    './projects/expressive-angular/tsconfig.spec.json',
  ]),
  angularProject('projects/showcase', 'app', ['./projects/showcase/tsconfig.app.json']),
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/typedef': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
  prettierConfig
);
