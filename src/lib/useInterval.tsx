import {useEffect} from "react";

export const useInterval = (fn:()=>void, millis: number = 1000 )=>{
    useEffect(() => {
        const interval = setInterval(fn, millis);
        return () => clearInterval(interval);
    }, [fn, millis]);
}