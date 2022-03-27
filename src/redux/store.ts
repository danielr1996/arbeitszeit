import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { kimaiApi } from 'redux/kimai'
import {loginReducer} from "components/login/loginSlice"
import {loginMiddleware} from "components/login/loginMiddleware"

export const store = configureStore({
    reducer: {
        [kimaiApi.reducerPath]: kimaiApi.reducer,
        login: loginReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(kimaiApi.middleware).concat(loginMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)