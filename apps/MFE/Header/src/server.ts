import {Logger} from '@next/core-logger'

import server from './server/'

const PORT = process.env.PORT || '3001'
server.listen(PORT, () => Logger.info(`webpack host: started at http://localhost:${PORT}`))
