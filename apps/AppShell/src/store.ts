import {configureStore} from '@reduxjs/toolkit'

import counterReducer, {counterSlice} from './ducks/counter'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export const counterActions = counterSlice.actions

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
