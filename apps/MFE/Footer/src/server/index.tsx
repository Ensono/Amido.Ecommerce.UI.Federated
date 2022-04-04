import path from 'path'

import {helmetGuard, htmlMiddleware, httpLogger, prerenderMiddleware, renderMiddleware} from '@batman/middlewares'
import {json} from 'body-parser'
import compression from 'compression'
import express from 'express'

import ReactApp, {ReduxProvider} from '../App'
//@ts-ignore
import remoteEntry from '../remote-entry/remote-entry.cjs'

const publicPath = path.join(__dirname, '/public')
const theme = {}
const renderOptions = {
  app: (
    <ReduxProvider value={theme}>
      <ReactApp />
    </ReduxProvider>
  ),
}

const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware(renderOptions))
app.use('/prerender', json(), prerenderMiddleware('mfe_footer', remoteEntry))
// TODO: this works in production mode but not dev
app.use('/', express.static(publicPath))

export default app
