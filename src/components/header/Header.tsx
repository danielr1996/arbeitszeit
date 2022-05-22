import React, {FunctionComponent} from "react"
import clock from 'assets/img/clock.svg'
import {useLoginState} from "components/login/loginSlice"
import {StartStop} from "components/header/StartStop"
import {Avatar} from "./Avatar"
import {LoginButton} from "./LoginButton"
import {Link} from "react-router-dom"

export const Header: FunctionComponent = () => {
    const isLoggedIn = useLoginState()
    return (<>
        <div className="bg-slate-900 p-3 flex items-center justify-between">
            <div className="flex items-center">
                <span><Link to="/"><img alt="" src={clock} className="mr-3"/></Link></span>
                <span className="text-xl hidden sm:block"><Link to="/">Arbeitszeiten</Link></span>
                <span></span>
            </div>
            <div className="flex items-center">
                {isLoggedIn && <span className="ml-7 text-3xl"><StartStop /></span>}
                <span className="ml-7 text-3xl"><LoginButton /></span>
                {isLoggedIn && <span className="ml-6"><Avatar /></span>}
            </div>
        </div>
    </>)
}