import 'node-self'
import express from 'express'

import {renderMiddleware} from './middleware/render'

const app = express()

app.use('/app', renderMiddleware)
app.use('/', express.static('./build/public'))

export default app
