export interface StringMap {
  [s: string]: string
}

export type AbortRenderToPipe = () => void

declare namespace Express {
  interface Request {
    siteUrl: {
      url: string
      token: string
    }
    themeVersion: string
    theme: Theme
    html: string
  }
  interface Response {
    html: string
  }
}

export type RenderMiddlewareOptions = {
  app?: any
  errorStatusCode?: number
  htmlReplacements?: StringMap
}
