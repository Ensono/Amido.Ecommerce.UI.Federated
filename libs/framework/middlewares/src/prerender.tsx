import {Writable} from 'stream'

import React from 'react'
import * as ReactRedux from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

import {constants} from '@batman/constants'
import {Logger} from '@batman/core-logger'
import {getRemoteUrls} from '@batman/remote-urls'
import {NextFunction} from 'express'
import {renderToPipeableStream} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'

class HtmlWritable extends Writable {
  chunks = []

  html = ''

  _write(chunk, _, next) {
    this.chunks.push(chunk)
    this.html = encodeURIComponent(Buffer.concat(this.chunks).toString())
    next()
  }
}

/**
 * Generates payload of downstream client remote entry files and renders the react module exposed
 * in remote-entry.cjs of each application
 *
 * @param remoteEntry - built remote-entry.cjs, generated in config/webpack/remote.js
 */
export const prerenderMiddleware = remoteEntry => {
  const remoteInitPromise = (remoteEntry as any).init({
    react: {
      '18.2.0': {
        get: () => () => React,
      },
    },
    'react-router-dom': {
      '6.4.1': {
        get: () => () => ReactRouterDom,
      },
    },
    // TODO: can this be automated?
    'react-redux': {
      '8.0.4': {
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
    const {pathname, pattern} = props._ctx ?? {}

    try {
      const remoteUrls = getRemoteUrls()
      const REMOTE_ENTRIES = Object.entries(remoteUrls).map(([, entry]) => `${entry}/remote-entry.js`)

      await remoteInitPromise
      const factory = await (remoteEntry as any).get(module)
      let Component = factory()
      Component = (Component && Component.default) || Component

      let didError = false

      let timeout

      const initialState = req.initialState || 'NO STATE'
      const InitialStateProvider = req.provider

      const el =
        initialState !== 'NO STATE' ? (
          <InitialStateProvider store={req.initialStore}>
            <StaticRouter location={pathname || '/'}>
              <ReactRouterDom.Routes>
                <ReactRouterDom.Route
                  path={pattern || '*'}
                  element={<Component {...props}>{`\u200Cchildren\u200C`}</Component>}
                />
              </ReactRouterDom.Routes>
            </StaticRouter>
          </InitialStateProvider>
        ) : (
          <StaticRouter location={pathname || '/'}>
            <ReactRouterDom.Routes>
              <ReactRouterDom.Route
                path={pattern || '*'}
                element={<Component {...props}>{`\u200Cchildren\u200C`}</Component>}
              />
            </ReactRouterDom.Routes>
          </StaticRouter>
        )

      const stream = renderToPipeableStream(el, {
        onAllReady() {
          const assembledJSON = JSON.stringify({
            chunks: [...REMOTE_ENTRIES],
            html: constants.SERIALISED_RESPONSE_SEPARATOR,
            state: initialState,
          })
          const writable = new HtmlWritable()
          // string split to stream html data 'into' object
          const splitJSON = assembledJSON.split(constants.SERIALISED_RESPONSE_SEPARATOR)

          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 206 : 200
          res.contentType('application/json')

          // Reassemble JSON object with encoded HTML inside
          res.write(splitJSON[0])
          stream.pipe(writable)
          res.write(writable.html)
          res.write(splitJSON[1])
          clearTimeout(timeout)
          res.end()
        },
        onError(x: Error) {
          console.log('ERRORED')
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
