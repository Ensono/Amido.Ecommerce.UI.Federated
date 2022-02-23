import {NextFunction, Response} from 'express'

export const siteurlMiddleware =
  (token: string, defaultURL?: string) => (req: any, _res: Response, next: NextFunction) => {
    const siteUrl = (req.headers['x-next-siteurl'] as string) || defaultURL
    if (siteUrl) {
      // eslint-disable-next-line no-param-reassign
      req.siteUrl = {
        url: siteUrl.replace(/\/$/, ''),
        token,
      }
    }
    req.appScope = token.substring(1) // removing the forward-slash
    next()
  }
