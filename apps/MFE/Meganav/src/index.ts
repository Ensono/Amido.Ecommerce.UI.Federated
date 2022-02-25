import {env} from 'process'

import server from './server'

const PORT = env.PORT || '3002'
server.listen(PORT, () => console.log(`webpack host: started at http://localhost:${PORT}`))
