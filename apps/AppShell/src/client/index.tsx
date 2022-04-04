// import ReactDOM from 'react-dom'
import {Logger} from '@batman/core-logger'
import {hydrateRoot} from 'react-dom/client'

import reportWebVitals from '../reportWebVitals'
import {spliceAllToHead} from '../utils/spliceAllToHead'
import App from './client_app'

const links = document.body.getElementsByTagName('link')
const scripts = document.body.getElementsByTagName('script')

spliceAllToHead(links)
spliceAllToHead(scripts)

const root = document.getElementById('federated_modules_root_id')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
hydrateRoot(root!, <App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(Logger.info)
