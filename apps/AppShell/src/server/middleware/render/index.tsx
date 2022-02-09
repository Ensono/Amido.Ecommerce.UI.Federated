import {Handler} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import App, {ReduxProvider, ThemeProvider} from '../../../App'

type AbortRenderToPipe = () => void

const AppTyped = App as any

export const renderMiddleware: Handler = (req, res) => {
  if (req.path !== '/') {
    res.status(404)
    res.send()
    return
  }

  let didError = false
  const theme = {}
  const data = {}
  const {pipe, abort} = renderToPipeableStream(
    <ReduxProvider value={theme}>
      <ThemeProvider value={data}>
        <AppTyped />
      </ThemeProvider>
    </ReduxProvider>,
    {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200
        res.contentType('html')
        res.write('<!DOCTYPE html>')
        pipe(res)
      },
      onError(x: Error) {
        didError = true
        console.error(x)
      },
    },
  )

  setTimeout(abort as AbortRenderToPipe, 5000)
}
