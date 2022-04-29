import { Logger } from "@batman/core-logger"
import { NextFunction } from "express"
import React from "react"
import { Provider as ReduxProvider } from "react-redux"
import { Store, AnyAction } from "redux"

export const stateMiddleware = (store: Store<any, AnyAction>) => {
    
    const provider = ({store, children}) => {
      return (
        <ReduxProvider store={store}>{children}</ReduxProvider>
      )
    }

    try {
      return async (req: any, res: any, next: NextFunction) => {
        req.initialState = store.getState()
        req.provider = provider
        req.initialStore = store
        next()
      }
    } catch (error) {
        Logger.error(error)
    }
    
}