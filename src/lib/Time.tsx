import {Temporal} from "@js-temporal/polyfill";
import {FunctionComponent} from "react"

type Props = {
    time?: Temporal.PlainDateTime | Temporal.PlainTime,
    displayEmpty?: boolean
}
export const Time: FunctionComponent<Props> = ({time, displayEmpty}) => {
    const format = (time: Temporal.PlainDateTime | Temporal.PlainTime | undefined): string => {
        if(!time){
            if(displayEmpty){
                return '--:--'
            }
            return ''
        }
        const hour = time?.hour.toString().padStart(2,' ')
        const minute = time?.minute.toString().padStart(2,'0')
        return `${hour}:${minute}`
    }
    return <span className="font-mono whitespace-breakspaces">{format(time)}</span>
}