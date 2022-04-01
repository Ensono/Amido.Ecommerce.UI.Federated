import {Logger} from '@batman/core-logger'

import server from './server/'

const PORT = process.env.PORT
server.listen(PORT, () => Logger.info(`webpack host: started at http://localhost:${PORT}`))
