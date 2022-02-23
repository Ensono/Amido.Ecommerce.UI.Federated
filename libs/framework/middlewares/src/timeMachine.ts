/* eslint-disable no-param-reassign */

export const getTimeMachineCookieValue = cookieList => {
  const b = cookieList?.match(`\\btime-machine-date=([^;]*)\\b`)
  return b ? b.pop() : ''
}

export const timeMachineMiddleware = (req: any, _res: any, next: any) => {
  const cookie = getTimeMachineCookieValue(req.headers?.cookie)

  if (cookie) {
    req.headers['x-next-time-machine-date'] = cookie
  }

  next()
}
