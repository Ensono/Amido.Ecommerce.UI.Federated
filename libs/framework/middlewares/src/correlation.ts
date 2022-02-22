/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
export const correlationMiddleware = (req: any, res: any, next: any) => {
  const uuidv1 = require('uuid/v1')
  if (!res.req.headers['x-next-correlation-id']) {
    req.headers['x-next-correlation-id'] = uuidv1()
  }
  next()
}
