import dotenv from 'dotenv'

import server from './server'

interface Configuration {
  PORT: string
  REMOTE_URLS: {[key: string]: string}
}
const config = dotenv.config() as Configuration
const PORT = config.PORT || '3002'
server.listen(PORT, () => console.log(`webpack host: started at http://localhost:${PORT}`))
