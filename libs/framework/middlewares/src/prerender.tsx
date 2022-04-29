import React from 'react'
import * as ReactRedux from 'react-redux'

import {constants} from '@batman/constants'
import {Logger} from '@batman/core-logger'
import {getRemoteUrls} from '@batman/remote-urls'
import {NextFunction} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

/**
 * Generates payload of downstream client remote entry files and renders the react module exposed
 * in remote-entry.cjs of each application
 *
 * @param remoteEntry - built remote-entry.cjs, generated in config/webpack/remote.js
 */
export const prerenderMiddleware = remoteEntry => {
  const remoteInitPromise = (remoteEntry as any).init({
    react: {
      [React.version]: {
        get: () => () => React,
      },
    },
    // TODO: can this be automated?
    'react-redux': {
      '7.2.8': {
        get: () => () => ReactRedux,
      },
    },
  })

  return async (req: any, res: any, next: NextFunction) => {
    const {module, props} = req?.body as any
    if (!module) {
      next()
      return
    }

    try {
      const remoteUrls = getRemoteUrls()
      const REMOTE_ENTRIES = Object.entries(remoteUrls).map(([, entry]) => `${entry}/remote-entry.js`)

      await remoteInitPromise
      const factory = await (remoteEntry as any).get(module)
      let Component = factory()
      Component = (Component && Component.default) || Component

      const stringifiedChunks = `${JSON.stringify([...REMOTE_ENTRIES])}`
      let didError = false

      let timeout

      const initialState = req.initialState ? JSON.stringify(req.initialState) : 'NO STATE'
      const InitialStateProvider = req.provider

      const el = (
        initialState !== 'NO STATE'
          ? <InitialStateProvider store={req.initialStore}><Component {...props}>{`\u200Cchildren\u200C`}</Component></InitialStateProvider>
          : <Component {...props}>{`\u200Cchildren\u200C`}</Component>
      )

      const {pipe} = renderToPipeableStream(el, {
        onAllReady() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 206 : 200
          res.contentType('text/plain')
          res.write(stringifiedChunks)
          res.write(constants.SERIALISED_RESPONSE_SEPARATOR)
          pipe(res)
          res.write(constants.SERIALISED_RESPONSE_SEPARATOR)
          res.write(initialState)
          clearTimeout(timeout)
        },
        onError(x: Error) {
          Logger.error(x.message)
          didError = true
          clearTimeout(timeout)
        },
      })

      // after 5 seconds we should close the connection
      timeout = setTimeout(() => {
        res.statusCode = 503
        res.end()
      }, 5000)
    } catch (err) {
      next(err)
    }
  }
}
