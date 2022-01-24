import React from 'react'

import { json } from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server'

import App from './dist/app'
import remoteEntry from './dist/remote-entry'
import federationStats from './public/build/federation-stats.json'
import stats from './public/build/stats.json'

interface Configuration {
  PORT: string
  REMOTE_URLS: { [key: string]: string }
}

interface FederatedModuleAssets {
  files: string[]
  runtime: string
}

interface ExposedDataFromModule {
  chunks: string[]
}

interface FederatedModule {
  remote: string
  exposes: { [key: string]: ExposedDataFromModule[] }
}

type AbortRenderToPipe = () => void

const config = dotenv.config() as Configuration

const PORT = config.PORT || '3001'

const remoteModule = (
  federationStats.federatedModules as FederatedModule[]
).find((m) => m.remote === 'webpackRemote')

const exposes = remoteModule ? remoteModule.exposes : {}

function getChunksForExposed(exposed: string) {
  return exposes[exposed].reduce((p, c) => {
    p.push(...c.chunks)
    return p
  }, [] as string[])
}

const remoteInitPromise = remoteEntry.init({
  react: {
    [React.version]: {
      get: () => () => React,
    },
  },
})

const app = express()
const corstMiddleware = cors()
const publicStaticMiddleware = express.static('./public')

app.use('/', corstMiddleware, publicStaticMiddleware)

app.use('/prerender', json(), async (req, res, next) => {
  if (!req.body.module) {
    next()
    return
  }

  try {
    const chunks = getChunksForExposed(req.body.module)

    await remoteInitPromise

    const factory = await remoteEntry.get(req.body.module)
    let Component = factory()
    Component = (Component && Component.default) || Component

    const html = renderToStaticMarkup(
      React.createElement(
        Component,
        req.body.props || {},
        `\u200Cchildren\u200C`
      )
    )

    res.json({
      chunks,
      html,
    })
  } catch (err) {
    console.log('err', err)
    next(err)
  }
})

app.use('/', (req, res) => {
  if (req.path !== '/') {
    res.status(404)
    res.send()
    return
  }

  const chunksAppAndBootstrap = stats.assetsByChunkName.app.concat(
    stats.assetsByChunkName.bootstrap
  )
  const chunks = chunksAppAndBootstrap.concat(
    (stats.chunks as FederatedModuleAssets[]).reduce((r, chunk) => {
      if (chunk.runtime.includes('app')) {
        r.push(...chunk.files.filter((f) => !chunksAppAndBootstrap.includes(f)))
      }

      return r
    }, [] as string[])
  )

  let didError = false
  const { pipe, abort } = renderToPipeableStream(
    React.createElement(App, { chunks }),
    {
      onCompleteShell() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200
        res.contentType('html')
        res.write('<!DOCTYPE html>')
        pipe(res)
      },
      onError(x: Error) {
        didError = true
        console.error(x)
      },
    }
  )

  setTimeout(abort as AbortRenderToPipe, 5000)
})

app.listen(PORT, () =>
  console.log(`webpack remote: started at http://localhost:${PORT}`)
)
