import {setCredentials} from "components/login/loginSlice"
import {Middleware} from "@reduxjs/toolkit"
import {kimaiApi} from "redux/clockify"

/**
 * Synchronize redux state with localstorage
 */
export const loginMiddleware:Middleware = store => next => action => {
    if(setCredentials.match(action)){
        if(action.payload.token && action.payload.userId && action.payload.workspaceId){
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('userId',action.payload.userId)
            localStorage.setItem('workspaceId',action.payload.workspaceId)
            // TODO: Invalidate on mutation. See https://github.com/danielr1996/arbeitszeit/issues/1
            store.dispatch(kimaiApi.util.resetApiState())
        }else{
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('workspaceId')
        }
    }
    return next(action)
}
