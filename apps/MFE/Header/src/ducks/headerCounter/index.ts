import {createSlice} from '@reduxjs/toolkit'

export interface HeaderCounterState {
  value: number
}

const initialState: HeaderCounterState = {
  value: 0,
}

export const headerCounterSlice = createSlice({
  name: 'headerCounter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
  },
})

export const {increment, decrement} = headerCounterSlice.actions
export default headerCounterSlice.reducer
