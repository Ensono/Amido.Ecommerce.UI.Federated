import React from 'react'

import dotenv from 'dotenv'
import express from 'express'
// @ts-ignore
import { renderToPipeableStream } from 'react-dom/server'

import App from './dist/app'

interface Configuration {
  PORT: string
  REMOTE_URLS: { [key: string]: string }
}

type AbortRenderToPipe = () => void

const config = dotenv.config() as Configuration
const app = express()

const PORT = config.PORT || '3002'

app.use('/', express.static('./public'))

app.use('/', (req, res) => {
  if (req.path !== '/') {
    res.status(404)
    res.send()
    return
  }

  let didError = false
  const ctx = {}
  const { pipe, abort } = renderToPipeableStream(
    React.createElement(
      App.context.Provider,
      { value: ctx },
      React.createElement(App.default)
    ),
    {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200
        res.contentType('html')
        res.write('<!DOCTYPE html>')
        pipe(res)
      },
      onError(x: string) {
        didError = true
        console.error(x)
      },
    }
  )

  setTimeout(abort as AbortRenderToPipe, 5000)
})

app.listen(PORT, () =>
  console.log(`webpack host: started at http://localhost:${PORT}`)
)
