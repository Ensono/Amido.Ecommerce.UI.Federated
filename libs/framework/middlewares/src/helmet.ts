import helmet from 'helmet'

export const helmetGuard = helmet({
  frameguard: false,
  xssFilter: true,
  hidePoweredBy: true,
  hsts: false,
})
