export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'chore', 'revert', 'perf', 'style', 'test', 'docs']],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'body-max-line-length': [0],
  },
};
