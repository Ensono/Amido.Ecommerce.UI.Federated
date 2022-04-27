import { NextFunction } from "express"

export const stateMiddleware = (state) => {
    const middlewareState = state
    
    return async (req: any, res: any, next: NextFunction) => {
      
      res.initialState = middlewareState
  
      next()
    }
}