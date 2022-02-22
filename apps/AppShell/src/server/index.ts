import 'node-self'
// eslint-disable-next-line import/no-extraneous-dependencies
import {htmlMiddleware} from '@next/middlewares'
import express from 'express'

import {renderMiddleware} from './middleware/render'

const app = express()

app.use('/app', htmlMiddleware, renderMiddleware)
app.use('/', express.static('./build/public'))

export default app
