import logger from '@next/core-logger'
import morgan from 'morgan'

const morganInstance = (options?: object) => morgan('combined', {stream: logger.stream, ...options})

export const httpLogger = isDev =>
  isDev
    ? morganInstance({
        skip(_req: any, res: any) {
          return res.statusCode < 400
        },
      })
    : morganInstance()
