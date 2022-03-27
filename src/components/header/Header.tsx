import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import clock from 'assets/img/clock.svg'
import {useLoginState} from "components/login/loginSlice"
import {useUserQuery} from "redux/kimai"

export const Header: FunctionComponent = () => {
    const isLoggedIn = useLoginState()
    const { data} = useUserQuery()
    return (<>
        <div className="bg-slate-900 p-3 flex items-center justify-between">
            <div className="flex items-center">
                <img alt="" src={clock} className="mr-3"/>
                <a className="text-xl mr-3" href="/">Arbeitszeiten</a>

                {/*<span className="text-md mr-3"><Link to="/timesheets">Timesheets</Link></span>*/}
            </div>
            <div className="flex items-center">
                {isLoggedIn ?
                    <span className="text-md mr-3"><Link to="/logout">Logout</Link></span>:
                    <span className="text-md mr-3"><Link to="/login">Login</Link></span>
                }
                {/*<div className="mr-3"><SaldoComponent today={today} saldo={saldo}/></div>*/}
                {isLoggedIn && <img className="w-10 ml-3 rounded-full" src={data?.avatar} alt="avatar"/>}
            </div>
        </div>
    </>)
}