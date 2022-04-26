import path from 'path'

import {Provider as ReduxProvider} from 'react-redux'

import {
  helmetGuard,
  htmlMiddleware,
  httpLogger,
  prerenderMiddleware,
  renderMiddleware,
  stateMiddleware,
} from '@batman/middlewares'
import {json} from 'body-parser'
import compression from 'compression'
import express from 'express'

import ReactApp from '../App'
import remoteEntry from '../remote-entry/remote-entry.cjs'
import {headerStore} from '../store'

const publicPath = path.join(__dirname, '/public')

// TODO: should redux be in here? /app and /prerender need to have per-request stores
const renderOptions = {
  app: (
    <ReduxProvider store={headerStore}>
      <ReactApp />
    </ReduxProvider>
  ),
  errorStatusCode: 206,
}
const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware(renderOptions))
app.use('/prerender', json(), stateMiddleware(headerStore.getState()), prerenderMiddleware(remoteEntry))
app.use('/', express.static(publicPath))

export default app
