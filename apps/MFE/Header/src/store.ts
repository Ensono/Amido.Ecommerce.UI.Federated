import { configureStore } from "@reduxjs/toolkit";
import headerCounterReducer, { headerCounterSlice } from "./ducks/headerCounter";

export const headerStore = configureStore({
    reducer: {
        headerCounter: headerCounterReducer,
    },
})

export const headerCounterActions = headerCounterSlice.actions

export type RootState = ReturnType<typeof headerStore.getState>
export type AppDispatch = typeof headerStore.dispatch