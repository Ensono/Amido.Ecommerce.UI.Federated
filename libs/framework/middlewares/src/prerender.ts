// @ts-ignore
import React from 'react'

import {NextFunction} from 'express'
import {renderToStaticMarkup} from 'react-dom/server'

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

      await remoteInitPromise

      const factory = await (remoteEntry as any).get(module)
      let Component = factory()
      Component = (Component && Component.default) || Component

      const html = renderToStaticMarkup(React.createElement(Component, props || {}, `\u200Cchildren\u200C`))

      res.json({
        chunks,
        html,
      })
    } catch (err) {
      console.log('err', err)
      next(err)
    }
  }
}
