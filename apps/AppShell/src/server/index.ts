import dotenv from 'dotenv'
import express from 'express'

import { renderMiddleware } from './middleware/render'

interface Configuration {
  PORT: string
  REMOTE_URLS: { [key: string]: string }
}

const config = dotenv.config() as Configuration
const app = express()

const PORT = config.PORT || '3002'

app.use('/', express.static('./public'))

app.use('/', renderMiddleware)

app.listen(PORT, () =>
  console.log(`webpack host: started at http://localhost:${PORT}`)
)
