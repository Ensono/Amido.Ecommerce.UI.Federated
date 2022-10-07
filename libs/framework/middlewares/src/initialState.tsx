import React from 'react'
import {Provider as ReduxProvider} from 'react-redux'

import {Logger} from '@batman/core-logger'
import {NextFunction} from 'express'
import {AnyAction, Store} from 'redux'

export const stateMiddleware = (middlewareStore: Store<any, AnyAction>) => {
  const provider = ({children}) => {
    return <ReduxProvider store={middlewareStore}>{children}</ReduxProvider>
  }

  try {
    return async (req: any, res: any, next: NextFunction) => {
      req.initialState = middlewareStore.getState()
      req.provider = provider
      req.initialStore = middlewareStore
      next()
    }
  } catch (error) {
    Logger.error(error)
  }
}
