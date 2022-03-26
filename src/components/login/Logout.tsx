import {FunctionComponent, useEffect} from "react"
import {useDispatch} from "react-redux"
import {setCredentials} from "components/login/loginSlice"

export const Logout: FunctionComponent = ()=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(setCredentials({username: null, password:null,url:null}))
    })
    return <></>
}