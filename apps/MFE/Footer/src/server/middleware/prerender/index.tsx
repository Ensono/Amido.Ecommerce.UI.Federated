// @ts-ignore
// import path from 'path'

import React from 'react'

import axios from 'axios'
import {NextFunction} from 'express'
import {renderToStaticMarkup} from 'react-dom/server'

import {ExposedModule} from './models'

let remoteEntry
let remoteInitPromise

export const prerenderMiddleware = async (req: any, res: any, next: NextFunction) => {
  if (!remoteEntry) {
    remoteEntry = await import('../../../../dist/public/remote/remote-entry')
  }

  const federationStats = (
    await axios({
      method: 'GET',
      url: '/remote/federation-stats.json',
      baseURL: 'http://localhost:3003',
    })
  ).data
  const exposes = federationStats.federatedModules.find(m => m.remote === 'mfe_footer')!.exposes

  const getChunksForExposed = (exposed: string) => {
    return exposes[exposed].reduce((p: Array<any>, c: ExposedModule) => {
      p.push(...c.chunks)
      return p
    }, [])
  }

  if (!remoteInitPromise) {
    remoteInitPromise = (remoteEntry as any).init({
      react: {
        [React.version]: {
          get: () => () => React,
        },
      },
    })
  }

  console.log(__dirname)

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
