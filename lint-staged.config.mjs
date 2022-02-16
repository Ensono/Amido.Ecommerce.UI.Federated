export default {
  'apps/AppShell/**/*.*': () => ['npm run app-shell:eslint', 'npm run app-shell:test', 'npm run app-shell:ratchet'],
  'apps/MFE/Header/**/*.*': () => ['npm run header:eslint', 'npm run header:test', 'npm run header:ratchet'],
  'libs/federated-modules/**/*.*': () => ['npm run federated-modules:eslint'],
  'libs/ui-components/**/*.*': () => [
    'npm run ui-components:lint',
    'npm run ui-components:test',
    'npm run ui-components:ratchet',
  ],
}
