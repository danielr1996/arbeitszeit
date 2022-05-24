import  {FunctionComponent} from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Login} from "components/login/Login"
import {Overview} from "components/overview/Overview"
import {Logout} from "components/login/Logout"
import {RequireLogin} from "components/login/RequireLogin"
import {RequireLogout} from "components/login/RequireLogout"
import {Header} from "components/header/Header"
import {DebugBreakpoints} from "lib/DebugBreakpoints"
import {Calendar} from "components/calendar/Calendar"

export const App: FunctionComponent = ()=> {
    return <BrowserRouter>
        <div className="flex flex-col h-screen overflow-y-hidden bg-slate-800 text-zinc-400">
            <header className="flex-shrink-0">
                <Header/>
            </header>
            <main className="flex-grow overflow-y-auto">
                <Routes>
                    <Route path="/" element={<RequireLogin><Overview/></RequireLogin>}/>
                    {/*<Route path="/timesheets" element={<RequireLogin><Timesheets timesheets={groupByDay} today={today}/></RequireLogin>}/>*/}
                    <Route path="/calendar" element={<RequireLogin><Calendar/></RequireLogin>}/>
                    <Route path="/login" element={<RequireLogout><Login/></RequireLogout>}/>
                    <Route path="/logout" element={<RequireLogin><Logout/></RequireLogin>}/>
                    {/*<Route path="*" element={<NotFound />} />*/}
                </Routes>
            </main>
            <footer className="flex-shrink-0">
                {/*<Footer/>*/}
            </footer>
           <DebugBreakpoints />
        </div>
    </BrowserRouter>
}
