import 'node-self'
import express from 'express'

import {renderMiddleware} from './middleware/render'

const app = express()

app.use('/', express.static('./public'))

app.use('/', renderMiddleware)

export default app
