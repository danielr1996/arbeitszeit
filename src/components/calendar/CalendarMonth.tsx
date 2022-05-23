import {Temporal} from "@js-temporal/polyfill"
import {FunctionComponent} from "react"

type Props = {
    date: Temporal.PlainDate
}

export const CalendarMonth: FunctionComponent<Props> = ({date})=>{
    const items = Array.from({length: date.daysInMonth}, (_, i) => i + 1)
    return <>
        {date.monthCode}
        <ul >
            {items.map(i=><li>{i}</li>)}
        </ul>
    </>
}