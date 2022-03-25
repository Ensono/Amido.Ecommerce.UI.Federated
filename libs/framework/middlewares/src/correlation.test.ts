import {correlationMiddleware} from './correlation'

jest.mock('uuid/v1', () => () => 'test')

describe('correlationMiddleware', () => {
  it('Should return a function', () => {
    expect(correlationMiddleware).toBeInstanceOf(Function)
  })

  it('Should add a correlation header if not present', () => {
    const res = {
      req: {
        headers: {},
      },
    }
    const req = {
      headers: {},
    }
    const next = jest.fn()
    correlationMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toBeCalledWith()
    expect(req.headers['x-next-correlation-id']).toEqual('test')
  })
})
