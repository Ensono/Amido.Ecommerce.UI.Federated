import dotenv from 'dotenv'

import app from './server'

interface Configuration {
  PORT: string
  REMOTE_URLS: {[key: string]: string}
}
const config = dotenv.config() as Configuration
const PORT = config.PORT || '3002'
app.listen(PORT, () => console.log(`webpack host: started at http://localhost:${PORT}`))
