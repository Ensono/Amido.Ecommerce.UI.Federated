import {CORSMiddleware} from './cors'

const expectedHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers':
    'accept, x-next-territory, x-next-realm, x-next-language, x-next-correlation-id, x-next-session-id, x-next-time-machine-date, x-next-viewport-size, x-next-persona',
}

const mockHeader = jest.fn()

describe('CORSMiddleware', () => {
  it('Should return a function', () => {
    expect(CORSMiddleware).toBeInstanceOf(Function)
  })

  it('Should add cors headers to the response', () => {
    const res = {
      header: mockHeader,
    }
    const req = {}
    const next = jest.fn()
    CORSMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toBeCalledWith()
    expect(mockHeader).toHaveBeenCalledWith(expectedHeaders)
  })
})
