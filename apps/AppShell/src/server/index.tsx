import path from 'path'

import {Provider as ReduxProvider} from 'react-redux'

import {helmetGuard, htmlMiddleware, httpLogger, renderMiddleware} from '@batman/middlewares'
import compression from 'compression'
import express from 'express'

import ReactApp from '../App'
import {set} from '../ducks/counter'
import {store} from '../store'

// set some initial values in the store
// TODO: this needs to be per-request not per-build
store.dispatch(set(Math.floor(Math.random() * 100)))

const initialState = store.getState()

const publicPath = path.join(__dirname, '/public')
const renderOptions = {
  app: (
    <ReduxProvider store={store}>
      <ReactApp />
    </ReduxProvider>
  ),
  errorStatusCode: 206,
  htmlReplacements: {
    INITIAL_STATE: JSON.stringify(initialState),
  },
}

const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware(renderOptions))
// TODO: this works in production mode but not dev
app.use('/', express.static(publicPath))

export default app
