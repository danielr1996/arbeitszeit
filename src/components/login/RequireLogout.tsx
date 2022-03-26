import {
    useLocation,
    Navigate,
} from "react-router-dom"
import {useLoginState} from "./loginSlice"

export const RequireLogout = ({ children }: { children: JSX.Element }) => {
    const location = useLocation()
    const isLoggedIn = useLoginState()
    if (isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
    return children
}