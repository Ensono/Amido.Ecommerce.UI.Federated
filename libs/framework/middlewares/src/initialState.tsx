import { NextFunction } from "express"

export const stateMiddleware = (state) => {
    const middlewareState = state
  
    // do we need to return an async func here?
    return async (req: any, res: any, next: NextFunction) => {
      
      res.initialState = middlewareState
  
      next()
    }
}