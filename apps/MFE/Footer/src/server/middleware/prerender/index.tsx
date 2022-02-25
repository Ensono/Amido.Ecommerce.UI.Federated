// @ts-ignore
import React from 'react'

import {NextFunction} from 'express'
import {renderToStaticMarkup} from 'react-dom/server'

import federationStats from '../../../../dist/public/federation-stats.json'
import remoteEntry from '../../../../dist/public/remote-entry'
import {ExposedModule} from './models'

const exposes = federationStats.federatedModules.find(m => m.remote === 'mfe_footer')!.exposes

function getChunksForExposed(exposed: string) {
  return exposes[exposed].reduce((p: Array<any>, c: ExposedModule) => {
    p.push(...c.chunks)
    return p
  }, [])
}

const remoteInitPromise = (remoteEntry as any).init({
  react: {
    [React.version]: {
      get: () => () => React,
    },
  },
})

export const prerenderMiddleware = async (req: any, res: any, next: NextFunction) => {
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
