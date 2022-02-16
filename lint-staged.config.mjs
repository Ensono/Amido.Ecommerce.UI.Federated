export default {
  'apps/AppShell/**/*.*': () => ['npm run app-shell:lint', 'npm run app-shell:test', 'npm run app-shell:ratchet'],
  'apps/MFE/Header/**/*.*': () => ['npm run header:lint', 'npm run header:test', 'npm run header:ratchet'],
  'libs/framework/federated-modules/**/*.*': () => ['npm run federated-modules:lint'],
  'libs/ui-components/text/**/*.*': () => [
    'npm run next-ui-components/text:lint',
    'npm run next-ui-components/text:test',
    'npm run next-ui-components/text:ratchet',
  ],
}
