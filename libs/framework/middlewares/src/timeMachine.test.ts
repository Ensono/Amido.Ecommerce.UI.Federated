import {getTimeMachineCookieValue, timeMachineMiddleware} from './timeMachine'

describe('timeMachineMiddleware function', () => {
  const res = {
    req: {
      headers: {},
    },
  }
  it('Should add a time machine header', () => {
    const req = {
      headers: {
        cookie: 'time-machine-date=01-01-2000',
      },
    }
    const next = jest.fn()
    timeMachineMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toBeCalledWith()
    expect(req.headers['x-next-time-machine-date']).toEqual('01-01-2000')
  })

  it("should not add a time machine header if there isn't a time machine cookie", () => {
    const req = {
      headers: {},
    }
    const next = jest.fn()
    timeMachineMiddleware(req, res, next)
    expect(req.headers).toEqual({})
  })
})

describe('getTimeMachineCookieValue function', () => {
  it('should return matched cookie value', () => {
    expect(getTimeMachineCookieValue('time-machine-date=test-cookie')).toEqual('test-cookie')
  })
})
