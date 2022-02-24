import dotenv from 'dotenv'

import server from './server'
import {Configuration} from './server/models'

const config = dotenv.config({path: `./.env.${process.env.NODE_ENV}`}) as Configuration
const PORT = config.PORT || '3001'
server.listen(PORT, () => console.log(`webpack host: started at http://localhost:${PORT}`))
