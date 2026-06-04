// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // docs/ holds the design-gallery reference mockups (jsx/css/html), not app source.
    // supabase/functions/ is Deno code (npm: specifiers, Deno globals), linted at deploy.
    ignores: ['dist/**', 'node_modules/**', '.expo/**', 'assets/**', 'docs/**', 'supabase/functions/**'],
  },
]);
