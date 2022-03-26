import React, {FunctionComponent} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Login} from "./pages/Login";
import {Overview} from "./pages/Overview";

export const App: FunctionComponent = ()=> {
    return <BrowserRouter>
        <div className="flex flex-col h-screen overflow-y-hidden bg-slate-800 text-zinc-400">
            <header className="flex-shrink-0">
                {/*<Header saldo={saldo} today={today} isLoggedIn={isLoggedIn}/>*/}
            </header>
            <main className="flex-grow overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Overview/>}/>
                    {/*<Route path="/timesheets" element={<RequireLogin><Timesheets timesheets={groupByDay} today={today}/></RequireLogin>}/>*/}
                    <Route path="/login" element={<Login/>}/>
                    {/*<Route path="/logout" element={<RequireLogin><Logout onLogout={setLoggedIn}/></RequireLogin>}/>*/}
                    {/*<Route path="*" element={<NotFound />} />*/}
                </Routes>
            </main>
            <footer className="flex-shrink-0">
                {/*<Footer/>*/}
            </footer>
        </div>
    </BrowserRouter>
}
