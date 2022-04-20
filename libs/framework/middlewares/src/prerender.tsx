import React, {createContext, useContext} from 'react'
import type {RouteMatch, RouteObject} from 'react-router'
import * as ReactRouterDom from 'react-router-dom'

import {constants} from '@batman/constants'
import {Logger} from '@batman/core-logger'
import {getRemoteUrls} from '@batman/remote-urls'
import {NextFunction} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'

export type RouteObjectWithKey = RouteObject & {
  key: number
  children?: RouteObjectWithKey[]
  props?: Record<string, unknown>
  metadata?: unknown
  preloadedData?: unknown
}

export type RouteMatchWithKey = RouteMatch & {route: RouteObjectWithKey}

export interface RootContext {
  version: string | null
  routes: RouteObjectWithKey[]
  matchedRoutes: RouteMatchWithKey[]
  matchedRoutesAssets: string[]
  mainAssets: string[]
  devServerPort?: number
}

const ctx = React.createContext<RootContext | null>(null)

export const useRootContext = () => {
  const value = useContext(ctx)

  if (value == null) {
    throw new Error('You must wrap your app in either <RootServer /> or <RootBrowser />')
  }

  return value
}

export const RootContextProvider: React.FC<{value: RootContext}> = ({value, children}) => {
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

const pendingContext = createContext<boolean | undefined>(undefined)

export const useIsRoutePending = () => {
  const contextValue = useContext(pendingContext)

  if (contextValue == null) {
    throw new Error('You must use useIsRoutePending in a descendant of either <RootBrowser /> or <RootServer />')
  }

  return contextValue
}

export const RoutePendingContextProvider: React.FC<{value: boolean}> = ({value, children}) => {
  return <pendingContext.Provider value={value}>{children}</pendingContext.Provider>
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
      [React.version]: {
        get: () => () => React,
      },
    },
    'react-router-dom': {
      '6.3.0': {
        get: () => () => ReactRouterDom,
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

      // RootContextProvider . Do we need it? What to supply as context?
      // RoutePendingContextPorivder . Do we need it?
      // StaticRouter . Do we need it? Supply the correct location through the request somehow
      const el = (
        <RootContextProvider value={{} as RootContext}>
          <RoutePendingContextProvider value={false}>
            <StaticRouter location="/">
              <Component {...props}>{`\u200Cchildren\u200C`}/</Component>
            </StaticRouter>
          </RoutePendingContextProvider>
        </RootContextProvider>
      )

      const {pipe} = renderToPipeableStream(el, {
        onAllReady() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 206 : 200
          res.contentType('text/plain')
          res.write(stringifiedChunks)
          res.write(constants.SERIALISED_RESPONSE_SEPARATOR)
          pipe(res)
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
