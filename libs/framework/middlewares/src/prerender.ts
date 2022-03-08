// @ts-ignore
import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import constants from '@next/constants'
import {NextFunction} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

interface ExposedModule {
  chunks: Array<string>
  sharedModules: Array<SharedModule>
}

interface SharedModule {
  chunks: Array<string>
  provides: Array<SharedDependency>
}

interface SharedDependency {
  shareScope: string
  shareKey: string
  requiredVersion: string
  strictVersion: boolean
  singleton: boolean
  eager: boolean
}

interface FederationStats {
  federatedModules: {
    remote: string
    exposes: {[key: string]: any[]}
  }[]
}

export const prerenderMiddleware = (mfeName: string, federationStats: FederationStats, remoteEntry) => {
  const remoteInitPromise = (remoteEntry as any).init({
    react: {
      [React.version]: {
        get: () => () => React,
      },
    },
  })

  const exposes = federationStats.federatedModules.find(m => m.remote === mfeName)!.exposes

  const getChunksForExposed = (exposed: string) => {
    return exposes[exposed].reduce((p: Array<any>, c: ExposedModule) => {
      p.push(...c.chunks)
      return p
    }, [])
  }

  return async (req: any, res: any, next: NextFunction) => {
    const {module, props} = req?.body as any
    if (!module) {
      next()
      return
    }

    try {
      const chunks = getChunksForExposed(module)

      const REMOTE_URLS = JSON.parse(process.env.REMOTE_URLS!)
      const REMOTE_ENTRIES = Object.entries(REMOTE_URLS).map(([, entry]) => `${entry}/remote-entry.js`)

      await remoteInitPromise

      const factory = await (remoteEntry as any).get(module)
      let Component = factory()
      Component = (Component && Component.default) || Component

      const stringifiedChunks = `${JSON.stringify([...chunks, ...REMOTE_ENTRIES])}`
      let didError = false

      const {pipe} = renderToPipeableStream(React.createElement(Component, props || {}, `\u200Cchildren\u200C`), {
        onCompleteAll() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 206 : 200
          res.contentType('text/plain')
          res.write(stringifiedChunks)
          res.write(constants.SERIALISED_RESPONSE_SEPARATOR)
          pipe(res)
        },
        onError(x: Error) {
          didError = true
          console.error(x)
        },
      })
    } catch (err) {
      console.log('err', err)
      next(err)
    }
  }
}
