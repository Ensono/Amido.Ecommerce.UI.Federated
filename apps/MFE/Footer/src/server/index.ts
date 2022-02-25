import 'node-self'
import path from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import {htmlMiddleware} from '@next/middlewares'
import {json} from 'body-parser'
import express from 'express'

import {prerenderMiddleware} from './middleware/prerender'
import {renderMiddleware} from './middleware/render'

const publicPath = path.join(__dirname, '/public')
const app = express()

app.use('/app', htmlMiddleware, renderMiddleware)
app.use('/prerender', json(), prerenderMiddleware)
app.use('/', express.static(publicPath))

export default app
