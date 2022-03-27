import {setCredentials} from "components/login/loginSlice"
import {Middleware} from "@reduxjs/toolkit"
import {kimaiApi} from "redux/kimai"

/**
 * Synchronize redux state with localstorage
 */
export const loginMiddleware:Middleware = store => next => action => {
    if(setCredentials.match(action)){
        if(action.payload.username && action.payload.password && action.payload.url){
            localStorage.setItem('username',action.payload.username)
            localStorage.setItem('password',action.payload.password)
            localStorage.setItem('url',action.payload.url)
            // TODO: Invalidate on mutation. See https://github.com/danielr1996/arbeitszeit/issues/1
            store.dispatch(kimaiApi.util.resetApiState())
        }else{
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('url')
        }
    }
    return next(action)
}