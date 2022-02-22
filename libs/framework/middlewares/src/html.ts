import fs from 'fs'
import path from 'path'

import {NextFunction, Request, Response} from 'express'

export const htmlMiddleware = (htmlFileName?: string) => (req: Request & any, res: Response, next: NextFunction) => {
  const publicPath = path.join(__dirname, '/public')

  fs.readFile(`${publicPath}/${htmlFileName || 'app.html'}`, 'utf8', (err, html) => {
    if (!err) {
      req.html = html
      next()
    } else {
      res.status(500).send('Error parsing app.html')
    }
  })
}
