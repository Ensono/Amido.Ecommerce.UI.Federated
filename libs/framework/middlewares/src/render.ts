import {getRemoteUrls} from '@batman/remote-urls'
import {Handler} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import {AbortRenderToPipe, RenderMiddlewareOptions, StringMap} from '../types'

export const renderMiddleware = ({app, errorStatusCode}: RenderMiddlewareOptions) => {
  errorStatusCode = errorStatusCode ?? 500
  const handler: Handler = (req, res) => {
    let didError = false
    // TODO: why is this type not getting picked up correctly?
    let html = (req as any).html
    // TODO: do we want this to be configurable
    const htmlReplacements: StringMap = {
      INITIAL_STATE: JSON.stringify({}),
      APP_PROPS: JSON.stringify({}),
      DIRECTION: 'ltr',
      lang: 'lang=en',
      // TODO: not sure this is right - Next-specific
      FAV_ICON_PATH: (process.env.ASSETS_PATH || '/static-content', 'next'),
      REMOTE_ENTRIES_JS: Object.entries(getRemoteUrls())
        .map(([, entry]) => `<script defer src="${entry}/remote-entry.js"></script>`)
        .join(''),
    }
    Object.keys(htmlReplacements).forEach(key => {
      const value = htmlReplacements[key]
      html = html.replace(new RegExp(`__${key}__`, 'g'), value)
    })
    const [first, last] = html.split('__HTML__')
    const {pipe, abort} = renderToPipeableStream(app, {
      onAllReady() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? errorStatusCode : 200
        res.contentType('html')
        res.write(first)
        pipe(res)
        res.write(last)
      },
      onError(x: Error) {
        didError = true
        console.error(x)
      },
    })
    // Abandon and switch to client rendering if enough time passes.
    // Try lowering this to see the client recover.
    setTimeout(abort as AbortRenderToPipe, 5000)
  }
  return handler
}
