/* eslint-disable import/no-extraneous-dependencies */
/* istanbul ignore file */
/* eslint-disable no-console */
const {LOG_LEVEL = 'warn', NODE_ENV, VSCODE_GIT_ASKPASS_NODE} = process.env

const logLevels: any = Object.freeze({
  info: 1,
  debug: 2,
  warn: 3,
  error: 4,
})

const isDev = NODE_ENV === 'development' || VSCODE_GIT_ASKPASS_NODE

const logger = {
  info: (message: string | object, correlationId: any) => {
    if (isDev || logLevels[LOG_LEVEL] === 1) {
      console.log(correlationId, message)
    }
  },
  debug: (message: string | object, correlationId: any) => {
    if (isDev || logLevels[LOG_LEVEL] <= 2) {
      console.debug(correlationId, message)
    }
  },
  warn: (message: string | object, correlationId: any) => {
    if (isDev || logLevels[LOG_LEVEL] <= 3) {
      console.warn(correlationId, message)
    }
    if (typeof window !== 'undefined' && (window as any).appInsights) {
      ;(window as any).appInsights.trackTrace({message, severityLevel: 2})
    }
  },
  error: (message: string | object, correlationId: any) => {
    if (isDev || logLevels[LOG_LEVEL] <= 4) {
      console.error(correlationId, message)
    }
    if (typeof window !== 'undefined' && (window as any)?.appInsights) {
      ;(window as any).appInsights.trackException({error: new Error(message as string), severityLevel: 3})
    }
  },
}

export const Logger = {
  info(message: string | object, correlationId = 'root') {
    logger.info(message, correlationId)
  },
  debug(message: string | object, correlationId = 'root') {
    logger.debug(message, correlationId)
  },
  warn(message: string | object, correlationId = 'root') {
    logger.warn(message, correlationId)
  },
  error(message: string | object, correlationId = 'root') {
    logger.error(message, correlationId)
  },
  stream: {
    write(message: string) {
      logger.debug(message, 'root')
    },
  },
}
