import {setCredentials} from "components/login/loginSlice"
import {Middleware} from "@reduxjs/toolkit"
import {kimaiApi} from "redux/clockify"

/**
 * Synchronize redux state with localstorage
 */
export const loginMiddleware:Middleware = store => next => action => {
    if(setCredentials.match(action)){
        if(action.payload.token){
            localStorage.setItem('token',action.payload.token)
            // TODO: Invalidate on mutation. See https://github.com/danielr1996/arbeitszeit/issues/1
            store.dispatch(kimaiApi.util.resetApiState())
        }else{
            localStorage.removeItem('token')
        }
    }
    return next(action)
}