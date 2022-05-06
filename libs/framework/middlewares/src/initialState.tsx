import React from 'react'
import {Provider as ReduxProvider} from 'react-redux'

import {Logger} from '@batman/core-logger'
import {NextFunction} from 'express'
import {AnyAction, Store} from 'redux'

export const stateMiddleware = (store: Store<any, AnyAction>) => {
  const provider = ({providerStore, children}) => {
    return <ReduxProvider store={providerStore}>{children}</ReduxProvider>
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
