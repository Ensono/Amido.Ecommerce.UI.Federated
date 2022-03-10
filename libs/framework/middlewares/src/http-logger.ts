import {Logger} from '@next/core-logger'
import morgan from 'morgan'

const morganInstance = (options?: object) => {
  const loggingStyle = process.env.NODE_ENV === 'development' || process.env.VSCODE_GIT_ASKPASS_NODE ? 'dev' : 'short'
  return morgan(loggingStyle, {stream: Logger.stream, ...options})
}

export const httpLogger = isDev =>
  isDev
    ? morganInstance({
        skip(_req: any, res: any) {
          return res.statusCode < 400
        },
      })
    : morganInstance()
