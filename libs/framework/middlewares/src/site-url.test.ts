import {siteurlMiddleware} from './site-url'

const mockResponse = {status: jest.fn(() => ({send: jest.fn()}))}
const mockNext = jest.fn()
describe('Given a siteurlMiddleware', () => {
  describe('When running with headers', () => {
    const mockRequest = {siteUrl: {url: null, token: null}, headers: {'x-next-siteurl': 'http://iambaseurl'}}
    beforeEach(() => {
      siteurlMiddleware('superman')(mockRequest as any, mockResponse as any, mockNext)
    })

    it('should have set the siteurl token to superman', () => {
      expect(mockRequest.siteUrl.token).toEqual('superman')
    })

    it('should have set the siteurl url to http://iambaseurl', () => {
      expect(mockRequest.siteUrl.url).toEqual('http://iambaseurl')
    })

    it('should call next', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('When running with headers and url has a trailing slash', () => {
    const mockRequest = {siteUrl: {url: null, token: null}, headers: {'x-next-siteurl': 'http://iambaseurl/'}}
    beforeEach(() => {
      siteurlMiddleware('superman')(mockRequest as any, mockResponse as any, mockNext)
    })

    it('should have set the siteurl token to superman', () => {
      expect(mockRequest.siteUrl.token).toEqual('superman')
    })

    it('should have set the siteurl url to http://iambaseurl', () => {
      expect(mockRequest.siteUrl.url).toEqual('http://iambaseurl')
    })

    it('should call next', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('When running with no headers and no default', () => {
    const mockRequest = {siteUrl: {url: null, token: null}, headers: {}}
    beforeEach(() => {
      siteurlMiddleware('superman')(mockRequest as any, mockResponse as any, mockNext)
    })

    it('should have set the siteurl token to null', () => {
      expect(mockRequest.siteUrl.token).toEqual(null)
    })

    it('should have set the siteurl url to null', () => {
      expect(mockRequest.siteUrl.url).toEqual(null)
    })

    it('should call next', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('When running with no headers but a default url entry', () => {
    const mockRequest = {siteUrl: {url: null, token: null}, headers: {}}
    beforeEach(() => {
      siteurlMiddleware('superman', 'a-default-url')(mockRequest as any, mockResponse as any, mockNext)
    })

    it('should have set the siteurl token to null', () => {
      expect(mockRequest.siteUrl.token).toEqual('superman')
    })

    it('should have set the siteurl url to null', () => {
      expect(mockRequest.siteUrl.url).toEqual('a-default-url')
    })

    it('should call next', () => {
      expect(mockNext).toHaveBeenCalled()
    })
  })
})
