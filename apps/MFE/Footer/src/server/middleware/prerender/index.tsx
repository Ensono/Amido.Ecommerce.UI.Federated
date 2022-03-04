import React from 'react'

import {NextFunction} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import federationStats from '../../../remote-entry/federation-stats.json'
import remoteEntry from '../../../remote-entry/remote-entry'
import {ExposedModule} from './models'

const remoteInitPromise = (remoteEntry as any).init({
  react: {
    [React.version]: {
      get: () => () => React,
    },
  },
})

const exposes = federationStats.federatedModules.find(m => m.remote === 'mfe_footer')!.exposes

const getChunksForExposed = (exposed: string) => {
  return exposes[exposed].reduce((p: Array<any>, c: ExposedModule) => {
    p.push(...c.chunks)
    return p
  }, [])
}

export const prerenderMiddleware = async (req: any, res: any, next: NextFunction) => {
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

    const first = `{"chunks":${JSON.stringify([...chunks, ...REMOTE_ENTRIES])},"html":"`
    const last = '"}'
    let didError = false

    const {pipe} = renderToPipeableStream(React.createElement(Component, props || {}, `\u200Cchildren\u200C`), {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 206 : 200
        res.contentType('application/json')
        res.write(first)
        pipe(res)
        res.write(last)
      },
      onError(x: Error) {
        didError = true
        console.error(x)
      },
    })

    // res.json({
    //   chunks,
    //   html,
    // })
  } catch (err) {
    console.log('err', err)
    next(err)
  }
}
