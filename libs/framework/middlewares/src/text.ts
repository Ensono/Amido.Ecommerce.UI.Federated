import fs from 'fs'

const getText = async (textUrl: string): Promise<any> => {
  try {
    const text = await fs.promises.readFile(textUrl)
    return JSON.parse(text.toString())
  } catch (error) {
    throw new Error(error)
  }
}

export const textMiddleware =
  (publicPath: string, configurationKeys: any, cache: any, logger: any) => async (req, _res: any, nextOp) => {
    try {
      const ttl = _res.locals.configuration ? _res.locals.configuration[configurationKeys.appCache]?.Value : 0
      const textData = _res.locals.configuration
        ? _res.locals.configuration[configurationKeys.textData]?.Value
        : 'default-text'

      const textUrl = `${publicPath}/text/${textData || 'default-text'}.json`
      let text = cache.get(textUrl)
      if (!text) {
        try {
          text = await getText(textUrl)
          cache.set(textUrl, text, ttl ?? 0)
        } catch (err) {
          logger.warn('Error getting text object')
        }
      }
      req.text = text
      nextOp()
    } catch (err) {
      logger.error(err)
    }
  }
