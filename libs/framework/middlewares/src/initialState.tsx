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
    return async (req: any, res: any, next: NextFunction) => {
      res.initialState = store.getState()
      res.provider = provider
      res.initialStore = store
      next()
    }
}