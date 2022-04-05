import escapeStringRegexp from 'escape-string-regexp'
import {Handler} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import App, {ReduxProvider} from '../../../App'
import {getViewportMetaTag, getViewportMetaTagScript} from '../../../utils/getForceDesktopLayout'

type AbortRenderToPipe = () => void
const AppTyped = App as any

export const FAV_ICON_PATH = (cdnBaseUrl: string, realm: string) => `${cdnBaseUrl}/icons/favicon/${realm}.ico`

export const renderMiddleware: Handler = (_req, res) => {
  let didError = false
  const theme = {}
  let html = _req.html

  const htmlReplacements: StringMap = {
    INITIAL_STATE: JSON.stringify({}),
    APP_PROPS: JSON.stringify({}),
    DIRECTION: 'ltr',
    FAV_ICON_PATH: FAV_ICON_PATH(process.env.ASSETS_PATH || '/static-content', 'next'),
    lang: 'lang=en',
    VIEWPORT: getViewportMetaTag(res.locals.configuration),
    VIEWPORT_FORCE_DESKTOP: getViewportMetaTagScript(res.locals.configuration),
  }

  Object.keys(htmlReplacements).forEach(key => {
    const value = htmlReplacements[key]
    html = html.replace(new RegExp(`__${escapeStringRegexp(key)}__`, 'g'), value)
  })
  const [first, last] = html.split('__HTML__')

  const {pipe, abort} = renderToPipeableStream(
    <ReduxProvider value={theme}>
      <AppTyped />
    </ReduxProvider>,
    {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200
        res.contentType('html')
        res.write(first)
        pipe(res)
        res.write(last)
      },
      onError(x: Error) {
        didError = true
        console.error(x)
      },
    },
  )
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(abort as AbortRenderToPipe, 5000)
}
