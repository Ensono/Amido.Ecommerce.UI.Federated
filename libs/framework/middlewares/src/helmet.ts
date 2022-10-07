import helmet from 'helmet'

export const helmetGuard = helmet({
  frameguard: false,
  xssFilter: true,
  hidePoweredBy: true,
  hsts: false,
  crossOriginResourcePolicy: {policy: 'cross-origin'},
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'", 'http://localhost:*'],
      'script-src': ["'self'", "'nonce-DFZGvfU515'", 'http://localhost:*'],
      'style-src': ["'self'", "'unsafe-inline'", 'http://localhost:*'],
      'img-src': ["'self'", 'http://localhost:*', 'https://*'],
    },
  },
})
