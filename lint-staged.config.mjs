export default {
  'apps/AppShell/**/*.*': () => ['npm run app-shell:lint', 'npm run app-shell:test', 'npm run app-shell:ratchet'],
  'apps/MFE/Header/**/*.*': () => ['npm run header:lint', 'npm run header:test', 'npm run header:ratchet'],
  'libs/framework/federate-component/**/*.*': () => [
    'npm run federate-component:lint',
    'npm run federate-component:test',
    'npm run federate-component:ratchet',
  ],
  'libs/framework/logger/**/*.*': () => ['npm run logger:lint', 'npm run logger:test'],
  'libs/framework/middlewares/**/*.*': () => ['npm run middlewares:lint', 'npm run middlewares:test'],
  'libs/ui-components/text/**/*.*': () => [
    'npm run next-ui-components/text:lint',
    'npm run next-ui-components/text:test',
    'npm run next-ui-components/text:ratchet',
  ],
}
