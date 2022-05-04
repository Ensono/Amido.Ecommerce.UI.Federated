/* istanbul ignore file */
import {Provider as ReduxProvider} from 'react-redux'

import {configureStore} from '@reduxjs/toolkit'
import {hydrateRoot} from 'react-dom/client'

import headerCounterSlice from '../ducks/headerCounter'
import App from './client_app'

const links: any = document.body.getElementsByTagName('link')
for (const link of links) {
  document.head.appendChild(link)
}
const root = document.getElementById('federated_modules_root_id')

const headerStore = configureStore({
  reducer: {headerCounter: headerCounterSlice},
  preloadedState: (window as any).initialState,
})
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
hydrateRoot(
  root!,
  <ReduxProvider store={headerStore}>
    <App />
  </ReduxProvider>,
)
