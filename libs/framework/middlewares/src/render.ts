import {Logger} from '@batman/core-logger'
import {getRemoteUrls} from '@batman/remote-urls'
import {Handler} from 'express'
// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import {AbortRenderToPipe, RenderMiddlewareOptions, StringMap} from '../types'

const defaultHtmlReplacements: StringMap = {
  INITIAL_STATE: JSON.stringify({}),
  DIRECTION: 'ltr',
  lang: 'lang=en',
  FAV_ICON_PATH: 'favicon.ico',
  REMOTE_ENTRIES_JS: Object.entries(getRemoteUrls())
    .map(([, entry]) => `<script defer src="${entry}/remote-entry.js"></script>`)
    .join(''),
}
// TODO: remove these params and do it all through the req
export const renderMiddleware = ({app, errorStatusCode, htmlReplacements}: RenderMiddlewareOptions = {}) => {
  errorStatusCode = errorStatusCode ?? 500

  const handler: Handler = (req, res, next) => {
    let timeout
    let didError = false
    // TODO: type this properly
    const unsafeReq = req as any
    let html = unsafeReq.html

    app = app ?? unsafeReq?.renderOptions?.app(req.originalUrl)

    const mergedHtmlReplacements = {
      ...defaultHtmlReplacements,
      ...(htmlReplacements && {
        ...htmlReplacements,
      }),
      ...(unsafeReq?.renderOptions?.htmlReplacements && {
        ...unsafeReq.renderOptions.htmlReplacements,
      }),
    }

    Object.keys(mergedHtmlReplacements).forEach(key => {
      const value = mergedHtmlReplacements[key]
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
        clearTimeout(timeout)
        next()
      },
      onError(x: Error) {
        Logger.error(x.message)
        clearTimeout(timeout)
        didError = true
      },
    })
    // Abandon and switch to client rendering if enough time passes.
    // Try lowering this to see the client recover.
    timeout = setTimeout(abort as AbortRenderToPipe, 5000)
  }
  return handler
}
