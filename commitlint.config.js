module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      // core
      'core',

      // packages
      'api',
      'callback-data',
      'file-id',
      'flow',
      'inline-message-id',
      'markup',
      'media-cacher',
      'rate-limit',
      'rich',
      'scenes',
      'session',
      'storage',
      'stream',
      'test',
      'throttler',
      'utils',
      'widgets',

      // shared / cross-package
      'plugins',

      // cross-cutting
      'repo',
      'workspace',
      'examples',
      'docs',
      'scripts',

      // tooling
      'ci',
      'deps',
      'eslint',
      'commitlint',
      'husky'
    ]],
    'scope-case': [2, 'always', 'kebab-case']
  }
}
