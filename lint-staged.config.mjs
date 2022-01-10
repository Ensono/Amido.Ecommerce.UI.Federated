export default {
  'apps/AppShell/**/*.*': () => [
    'npm run app-shell:test',
    'npm run app-shell:ratchet',
    'npm run app-shell:eslint',
  ],
  'apps/MFE/Header/**/*.*': () => [
    'npm run header:test',
    'npm run header:ratchet',
    'npm run header:eslint',
  ],
  'libs/federated-modules/**/*.*': () => ['npm run federated-modules:eslint'],
}
