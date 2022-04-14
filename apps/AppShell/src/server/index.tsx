import path from 'path'

import {Provider as ReduxProvider} from 'react-redux'

import {helmetGuard, htmlMiddleware, httpLogger, renderMiddleware} from '@batman/middlewares'
import compression from 'compression'
import express, {NextFunction} from 'express'

import ReactApp from '../App'
import {counterActions, store} from '../store'
// import {set} from '../ducks/counter'

const {set} = counterActions

const publicPath = path.join(__dirname, '/public')

const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

const fakeApiCall = () => Promise.resolve(Math.floor(Math.random() * 100))

// TODO: rename this (and extract to package?)
// async to support getting data from API endpoint or similar
const renderOptionsMiddleware = async (req: any, res: any, next: NextFunction) => {
  // set some initial values in the store
  const initialCount = await fakeApiCall()
  store.dispatch(set(initialCount))

  const initialState = store.getState()

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
  req.renderOptions = renderOptions

  next()
}

app.use('/app', htmlMiddleware, renderOptionsMiddleware, renderMiddleware({errorStatusCode: 206}))
// TODO: this works in production mode but not dev
app.use('/', express.static(publicPath))

export default app
