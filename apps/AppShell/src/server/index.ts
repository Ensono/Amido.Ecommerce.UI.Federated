import 'node-self'
import express from 'express'

import {renderMiddleware} from './middleware/render'

const app = express()

app.use('/', express.static('./build'))

app.use('/app', renderMiddleware)

export default app
