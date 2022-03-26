import {Temporal} from "@js-temporal/polyfill"
import {useState} from "react"
import {useInterval} from "./useInterval"

export const useNow = (update: boolean = false, interval: number = 1000)=>{
    const [now, setNow] = useState<Temporal.PlainDateTime>(Temporal.Now.plainDateTimeISO)
    useInterval(() => update && setNow(Temporal.Now.plainDateTimeISO()), interval)
    return now
}