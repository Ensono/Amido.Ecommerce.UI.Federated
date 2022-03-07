import 'node-self'
import path from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import {helmetGuard, htmlMiddleware, httpLogger, prerenderMiddleware} from '@next/middlewares'
import {json} from 'body-parser'
import compression from 'compression'
import express from 'express'

import federationStats from '../remote-entry/federation-stats.json'
import remoteEntry from '../remote-entry/remote-entry'
import {renderMiddleware} from './middleware/render'

const publicPath = path.join(__dirname, '/public')
const app = express()
app.use(compression())

// app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(httpLogger(false))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware)
app.use('/prerender', json(), prerenderMiddleware('mfe_header', federationStats, remoteEntry))
app.use('/', express.static(publicPath))

export default app
