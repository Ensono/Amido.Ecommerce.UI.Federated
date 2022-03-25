import {Logger} from '@next/core-logger'
import {hydrateRoot} from 'react-dom/client'

import reportWebVitals from '../reportWebVitals'
import App from './client_app'

const links: any = document.body.getElementsByTagName('link')
for (const link of links) {
  document.head.appendChild(link)
}
const root = document.getElementById('platform_modernisation_root_id')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
hydrateRoot(root!, <App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(Logger.info)
