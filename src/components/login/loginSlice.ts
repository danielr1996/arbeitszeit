import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "redux/store"
import {useSelector} from "react-redux"
import {useMemo} from "react"

type LoginState = {
    token: string | null
}

const slice = createSlice({
    name: 'login',
    initialState: {token:localStorage.getItem('token')} as LoginState,
    reducers: {
        setCredentials: (state, {payload: {token}}: PayloadAction<LoginState>) => {
            state.token = token
        },
    },
})

export const { setCredentials } = slice.actions

export const loginReducer =  slice.reducer

export const selectIsLoggedIn = (state: RootState) => !!state.login.token

export const useLoginState = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn)

    return useMemo(() => (isLoggedIn), [isLoggedIn])
}