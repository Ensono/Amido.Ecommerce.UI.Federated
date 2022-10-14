import React from 'react'
import * as ReactRedux from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

// @ts-ignore
import {renderToPipeableStream} from 'react-dom/server'

import {prerenderMiddleware} from './prerender'

jest.mock('react-dom/server', () => ({
  renderToPipeableStream: jest.fn(),
}))

afterEach(() => {
  jest.resetAllMocks()
})

describe('prerender middleware', () => {
  it('takes in a remoteEntry object, calls the init() method with the current React object and returns an async function', () => {
    const mockInit = jest.fn()
    const middlewareFunc = prerenderMiddleware({
      init: mockInit,
    })

    const stringifiedResult = JSON.stringify({
      react: {
        '18.2.0': {
          get: () => () => React,
        },
      },
      'react-router-dom': {
        '6.4.1': {
          get: () => () => ReactRouterDom,
        },
      },
      'react-redux': {
        '8.0.4': {
          get: () => () => ReactRedux,
        },
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function, func-names
    const asyncConstructor = Object.getPrototypeOf(async function () {}).constructor

    expect(mockInit).toHaveBeenCalled()
    //doing it this way to get rid of JS methods
    expect(JSON.stringify(mockInit.mock.calls[0][0])).toStrictEqual(stringifiedResult)
    expect(middlewareFunc).toBeInstanceOf(asyncConstructor)
  })

  describe('returned middleware function', () => {
    it('calls next() if there is no module', () => {
      const mockInit = jest.fn()
      const middlewareFunc = prerenderMiddleware({
        init: mockInit,
      })

      const mockNext = jest.fn()

      middlewareFunc({body: {}}, {}, mockNext)
      expect(mockNext).toHaveBeenCalled()
    })

    it('calls next() if the function throws', async () => {
      const mockInit = jest.fn()
      const mockGet = jest.fn()
      const middlewareFunc = prerenderMiddleware({
        init: mockInit,
        get: mockGet,
      })

      const mockNext = jest.fn()

      await middlewareFunc(
        {
          body: {
            module: 'foo',
            props: {},
          },
        },
        {},
        mockNext,
      )
      expect(mockNext).toHaveBeenCalledTimes(1)
    })

    it('calls renderToPipeableStream()', async () => {
      process.env.REMOTE_URLS = '{"mfe_footer": "http://localhost:3003"}'
      const configObjectCache = {
        obj: null,
      }

      const mockPipe = jest.fn()

      ;(renderToPipeableStream as jest.Mock).mockImplementation((el, obj) => {
        configObjectCache.obj = obj
        return {
          pipe: mockPipe,
        }
      })

      const mockInit = jest.fn()
      const middlewareFunc = prerenderMiddleware({
        init: mockInit,
        get: () => () => 'div',
      })

      const mockNext = jest.fn()
      const mockContentType = jest.fn()
      const mockWrite = jest.fn()

      await middlewareFunc(
        {
          body: {
            module: 'foo',
            props: mockWrite,
          },
        },
        {
          contentType: mockContentType,
          write: mockWrite,
        },
        mockNext,
      )
      const {onAllReady} = configObjectCache.obj

      expect(mockInit).toHaveBeenCalled()
      expect(renderToPipeableStream).toHaveBeenCalled()

      onAllReady()

      expect(mockContentType).toHaveBeenCalled()
      expect(mockWrite).toHaveBeenCalled()
      expect(mockPipe).toHaveBeenCalled()
    })
  })
})
