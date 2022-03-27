import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "redux/store"
import {useSelector} from "react-redux"
import {useMemo} from "react"

type LoginState = {
    username: string | null
    password: string | null
    url: string | null
}

const slice = createSlice({
    name: 'login',
    initialState: { username: localStorage.getItem('username'), password: localStorage.getItem('password'), url: localStorage.getItem('url') } as LoginState,
    reducers: {
        setCredentials: (state, { payload: { username, password, url } }: PayloadAction<LoginState>) => {
            state.username = username
            state.password = password
            state.url = url
        },
    },
})

export const { setCredentials } = slice.actions

export const loginReducer =  slice.reducer

export const selectIsLoggedIn = (state: RootState) => !!(state.login.url && state.login.password && state.login.username)

export const useLoginState = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn)

    return useMemo(() => (isLoggedIn), [isLoggedIn])
}