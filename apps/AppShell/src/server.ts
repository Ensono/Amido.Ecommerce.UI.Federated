

import dotenv from 'dotenv'
import express from 'express'
// @ts-ignore


import App from './src/App'

interface Configuration {
  PORT: string
  REMOTE_URLS: { [key: string]: string }
}

type AbortRenderToPipe = () => void

const config = dotenv.config() as Configuration
const app = express()

const PORT = config.PORT || '3002'

app.use('/', express.static('./public'))

app.use('/')

app.listen(PORT, () =>
  console.log(`webpack host: started at http://localhost:${PORT}`)
)
