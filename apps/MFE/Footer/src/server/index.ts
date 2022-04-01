import path from 'path'

import {helmetGuard, htmlMiddleware, httpLogger, prerenderMiddleware} from '@batman/middlewares'
import {json} from 'body-parser'
import compression from 'compression'
import express from 'express'

import remoteEntry from '../remote-entry/remote-entry.cjs'
import {renderMiddleware} from './middleware/render'

const publicPath = path.join(__dirname, '/public')
const app = express()
app.use(compression())

// app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(httpLogger(false))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware)
app.use('/prerender', json(), prerenderMiddleware('mfe_footer', remoteEntry))
// TODO: this works in production mode but not dev
app.use('/', express.static(publicPath))

export default app
