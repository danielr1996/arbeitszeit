import {useLocation, Navigate,} from "react-router-dom"
import {useLoginState} from "./loginSlice"

export const RequireLogin = ({ children }: { children: JSX.Element }) => {
    const location = useLocation()
    const isLoggedIn = useLoginState()
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children
}