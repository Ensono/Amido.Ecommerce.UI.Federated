/* istanbul ignore file */
import path from 'path'

import {Route, Routes} from 'react-router-dom'

import {helmetGuard, htmlMiddleware, httpLogger, prerenderMiddleware, renderMiddleware} from '@batman/middlewares'
import {json} from 'body-parser'
import compression from 'compression'
import express from 'express'
import {StaticRouter} from 'react-router-dom/server'

import ReactApp, {ReduxProvider} from '../App'
//@ts-ignore
import remoteEntry from '../remote-entry/remote-entry.cjs'

const publicPath = path.join(__dirname, '/public')
const theme = {}
const renderOptions = {
  app: ({location}: {location: string}) => (
    <ReduxProvider value={theme}>
      <StaticRouter location={location}>
        <Routes>
          <Route path="/app/productDetails/:id" element={<ReactApp />} />
        </Routes>
      </StaticRouter>
    </ReduxProvider>
  ),
  errorStatusCode: 206,
}
const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware(renderOptions))
app.use('/prerender', json(), prerenderMiddleware(remoteEntry))
app.use('/', express.static(publicPath))

export default app
