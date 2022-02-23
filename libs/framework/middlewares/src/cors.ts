// CORSMiddleware package must be kept in sync with the repos that are using them

export const CORSMiddleware = (_req, res: any, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers':
      'accept, x-next-territory, x-next-realm, x-next-language, x-next-correlation-id, x-next-session-id, x-next-time-machine-date, x-next-viewport-size, x-next-persona',
  })
  next()
}

export default CORSMiddleware
