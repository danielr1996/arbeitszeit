import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "redux/store"
import {useSelector} from "react-redux"
import {useMemo} from "react"

type LoginState = {
    token: string | null,
    workspaceId: string | null,
    userId: string | null,
}

const slice = createSlice({
    name: 'login',
    initialState: {token:localStorage.getItem('token'), workspaceId: localStorage.getItem('workspaceId'), userId: localStorage.getItem('userId')} as LoginState,
    reducers: {
        setCredentials: (state, {payload: {token, workspaceId, userId}}: PayloadAction<LoginState>) => {
            state.token = token
            state.workspaceId = workspaceId
            state.userId = userId
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
