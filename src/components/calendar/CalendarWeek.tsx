import {Temporal} from "@js-temporal/polyfill"
import {FunctionComponent} from "react"

type Props = {
    date: Temporal.PlainDate
}

export const CalendarWeek: FunctionComponent<Props> = ({date})=>{
    const items = Array.from({length: date.daysInWeek}, (_, i) => i + 1)

    return <>
        KW: {date.weekOfYear}<br/>
        <ul >
            {items.map(i=><li>{i}</li>)}
        </ul>
    </>
}