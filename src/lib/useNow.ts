import {Temporal} from "@js-temporal/polyfill"
import {useState} from "react"
import {useInterval} from "./useInterval"

export const useNow = (update: boolean = false)=>{
    const [now, setNow] = useState<Temporal.PlainDateTime>(Temporal.Now.plainDateTimeISO)
    useInterval(() => update && setNow(Temporal.Now.plainDateTimeISO()))
    return now
}