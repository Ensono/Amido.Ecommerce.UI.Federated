import {PayloadAction, createSlice} from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    set: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

export const {increment, set} = counterSlice.actions
export default counterSlice.reducer
