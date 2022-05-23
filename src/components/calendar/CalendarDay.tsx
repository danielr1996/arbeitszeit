import {Temporal} from "@js-temporal/polyfill"
import {FunctionComponent} from "react"

type Props = {
    date: Temporal.PlainDate
}

export const CalendarDay: FunctionComponent<Props> = ({date})=>{
    const items = Array.from({length: 24}, (_, i) => i + 1)
    return <>
        {date.day}.{date.month}.{date.year}<br/>
        <ul >
            {items.map(i=><li>{i}</li>)}
        </ul>
    </>
}