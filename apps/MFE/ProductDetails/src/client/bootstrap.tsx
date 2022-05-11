/* istanbul ignore file */
import {hydrateRoot} from 'react-dom/client'

import App from './client_app'

const links: any = document.body.getElementsByTagName('link')
for (const link of links) {
  document.head.appendChild(link)
}
const root = document.getElementById('federated_modules_root_id')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
hydrateRoot(root!, <App />)
