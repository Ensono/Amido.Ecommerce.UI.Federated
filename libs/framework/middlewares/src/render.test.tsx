/* eslint-disable testing-library/render-result-naming-convention */
import React from 'react'

//@ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import {renderMiddleware} from './render'

const configObjectCache = {
  obj: null,
}

const mockApp = () => <div>foo</div>
const mockHtml = `
<!DOCTYPE html>
<html __lang__ dir="__DIRECTION__">
  <head>
  __REMOTE_ENTRIES_JS__
  __CUSTOM__
  </head>
  <body>
    <main>__HTML__</main>
  </body>
</html>
`

const mockPipe = jest.fn()
const mockAbort = jest.fn()
const mockWrite = jest.fn()
const mockNext = jest.fn()

const mockRequest: any = {
  html: mockHtml,
}

const mockResponse: any = {
  write: mockWrite,
  contentType: jest.fn(),
}

jest.mock('@batman/remote-urls', () => ({
  getRemoteUrls: () => ({mfe_footer: 'http://localhost:3003'}),
}))

jest.mock('react-dom/server')
jest.mock('@batman/core-logger')

jest.useFakeTimers()

describe('render middleware', () => {
  beforeEach(() => {
    renderToPipeableStream.mockImplementation((el, obj) => {
      configObjectCache.obj = obj
      return {
        pipe: mockPipe,
        abort: mockAbort,
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("replaces the supplied keys in the request's html", () => {
    it('using defaults', () => {
      const handler = renderMiddleware({app: mockApp})
      handler(mockRequest, mockResponse, mockNext)
      const {onAllReady} = configObjectCache.obj
      onAllReady()
      expect(mockWrite).toHaveBeenCalledWith(`
<!DOCTYPE html>
<html lang=en dir="ltr">
  <head>
  <script defer src="http://localhost:3003/remote-entry.js"></script>
  __CUSTOM__
  </head>
  <body>
    <main>`)
      expect(mockPipe).toHaveBeenCalledWith(mockResponse)
      expect(mockWrite).toHaveBeenCalledWith(`</main>
  </body>
</html>
`)
    })

    it('merges with supplied replacements', () => {
      const handler = renderMiddleware({
        app: mockApp,
        htmlReplacements: {DIRECTION: 'upside down!', lang: 'lang=foo-bar', CUSTOM: `<meta name="foo">`},
      })
      handler(mockRequest, mockResponse, mockNext)
      const {onAllReady} = configObjectCache.obj
      onAllReady()
      expect(mockWrite).toHaveBeenCalledWith(`
<!DOCTYPE html>
<html lang=foo-bar dir="upside down!">
  <head>
  <script defer src="http://localhost:3003/remote-entry.js"></script>
  <meta name="foo">
  </head>
  <body>
    <main>`)
      expect(mockPipe).toHaveBeenCalledWith(mockResponse)
      expect(mockWrite).toHaveBeenCalledWith(`</main>
  </body>
</html>
`)
    })
  })

  describe('returns an error response if rendering to pipeable stream fails', () => {
    it('with a 500 by default', () => {
      const handler = renderMiddleware({app: mockApp})
      handler(mockRequest, mockResponse, mockNext)
      const {onError, onAllReady} = configObjectCache.obj
      onError(new Error('oh no'))
      onAllReady()
      expect(mockResponse.statusCode).toBe(500)
    })

    it('with a different status code if supplied', () => {
      const handler = renderMiddleware({app: mockApp, errorStatusCode: 206})
      handler(mockRequest, mockResponse, mockNext)
      const {onError, onAllReady} = configObjectCache.obj
      onError(new Error('oh no'))
      onAllReady()
      expect(mockResponse.statusCode).toBe(206)
    })
  })

  describe('times out', () => {
    it('calls abort after 5 seconds', () => {
      const handler = renderMiddleware({app: mockApp})
      handler(mockRequest, mockResponse, mockNext)
      jest.runAllTimers()
      expect(mockAbort).toHaveBeenCalled()
    })
  })
})
