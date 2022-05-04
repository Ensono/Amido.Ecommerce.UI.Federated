/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'

import Logger from '@batman/core-logger/lib/server'

import {textMiddleware} from '.'

const mockText = {
  arrowIconUrlAltText: 'Menu expand icon',
  bannerAltText: 'Banner image',
  chevronIconAltText: 'Chevron icon',
  drawerIconAltText: 'Drawer close icon',
}

enum ConfigurationKeys {
  appCache = 'appCacheTTL',
  textData = 'textData',
}

jest.mock('@batman/core-logger/lib/server', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}))

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(async (_path): Promise<Buffer> => {
      return Promise.resolve(
        Buffer.from(
          JSON.stringify({
            arrowIconUrlAltText: 'Menu expand icon',
            bannerAltText: 'Banner image',
            chevronIconAltText: 'Chevron icon',
            drawerIconAltText: 'Drawer close icon',
          }),
          'utf-8',
        ),
      )
    }),
  },
}))

jest.mock('@batman/remote-urls', () => ({
  getRemoteUrls: () => ({mfe_footer: 'http://localhost:3003'}),
}))

describe('textMiddleware', () => {
  describe('Working scenario with text available from cache', () => {
    const cache = {
      get: jest.fn(() => ({
        test: 'yeah',
      })),
      set: jest.fn(),
    }
    const mockRequest = {headers: {realm: 'next'}}

    const mockResponse = {
      locals: {
        configuration: {
          appCacheTTL: {Value: 22},
          textData: {Value: 'default-text'},
        },
      },
    }

    const mockNext = jest.fn()

    beforeEach(async () => {
      jest.spyOn(fs.promises, 'readFile').mockImplementationOnce(async (_path): Promise<Buffer> => {
        return Promise.resolve(Buffer.from(JSON.stringify(mockText), 'utf-8'))
      })

      await textMiddleware('publicPath', ConfigurationKeys, cache)(mockRequest, mockResponse, mockNext)
    })

    it('Should return a function when not curried', () => {
      expect(textMiddleware('publicPath', ConfigurationKeys, cache)).toBeInstanceOf(Function)
    })
    it('Should call cache.get', () => {
      const textUrl = 'publicPath/text/default-text.json'
      expect(cache.get).toHaveBeenCalled()
      expect(cache.get).toHaveBeenCalledWith(textUrl)
      expect(cache.get).toHaveReturnedWith({
        test: 'yeah',
      })
    })
    it('Should not call readFile', () => {
      expect(fs.promises.readFile).not.toHaveBeenCalled()
    })
    it('Should call mockNext', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('Working scenario with no text available from cache', () => {
    const cache = {get: jest.fn(() => null), set: jest.fn()}
    const mockRequest = {headers: {}}

    const mockResponse = {
      locals: {
        configuration: {
          appCacheTTL: {Value: 22},
          textData: {Value: 'default-text'},
        },
      },
    }

    const mockNext = jest.fn()

    jest.spyOn(fs.promises, 'readFile').mockImplementationOnce(async (_path): Promise<Buffer> => {
      return Promise.resolve(Buffer.from(JSON.stringify(mockText), 'utf-8'))
    })

    beforeEach(async () => {
      await textMiddleware('publicPath', ConfigurationKeys, cache)(mockRequest, mockResponse, mockNext)
    })

    it('Should cache.get', () => {
      const textUrl = 'publicPath/text/default-text.json'
      expect(cache.get).toHaveBeenCalled()
      expect(cache.get).toHaveBeenCalledWith(textUrl)
      expect(cache.get).toReturnWith(null)
    })

    it('Should call readFile', async () => {
      expect(await fs.promises.readFile).toHaveBeenCalled()

      expect(fs.promises.readFile).toHaveBeenCalledWith('publicPath/text/default-text.json')
    })

    it('Should cache.set', () => {
      expect(cache.set).toHaveBeenCalled()
      expect(cache.set).toHaveBeenCalledWith(
        'publicPath/text/default-text.json',
        JSON.parse(JSON.stringify(mockText)),
        22,
      )
    })

    it('Should call mockNext', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('default version of text without configuration object inside locals object', () => {
    const cache = {
      get: jest.fn(() => null),
      set: jest.fn(),
    }
    const mockResponse = {
      locals: {},
    }
    const mockRequest = {headers: {realm: 'next'}}

    const mockNext = jest.fn()

    beforeEach(async () => {
      await textMiddleware('publicPath', ConfigurationKeys, cache)(mockRequest, mockResponse, mockNext)
    })
    it('should fall back v1 version of text', () => {
      expect(fs.promises.readFile).toHaveBeenCalled()

      expect(fs.promises.readFile).toHaveBeenCalledWith('publicPath/text/default-text.json')
    })
    it('Should call mockNext', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('Unable to call readFile, default to next', () => {
    const cache = {
      get: jest.fn(() => ({
        test: 'yeah',
      })),
      set: jest.fn(),
    }

    const mockResponse = {
      locals: {},
    }

    const mockNext = jest.fn()

    const mockRequest = {headers: {realm: 'next'}}

    jest.spyOn(fs.promises, 'readFile').mockImplementationOnce(async (_path): Promise<Buffer> => {
      return Promise.reject(new Error('not found'))
    })
    beforeEach(async () => {
      await textMiddleware('publicPath', ConfigurationKeys, cache)(mockRequest, mockResponse, mockNext)
    })
    it('should call BFF logger', () => {
      expect(Logger.warn).toHaveBeenCalled()

      expect(Logger.warn).toHaveBeenCalledWith('Error getting text object')
    })

    it('Should call mockNext', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
})
