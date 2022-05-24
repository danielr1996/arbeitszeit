import {Temporal} from "@js-temporal/polyfill"
import {FunctionComponent} from "react"

type Props = {
    date: Temporal.PlainDate
}

export const CalendarYear: FunctionComponent<Props> = ({date})=>{
    const items = Array.from({length: date.daysInYear}, (_, i) => i + 1)

    return <>
        {date.year}<br/>
        <ul >
            {items.map(i=><li>{i}</li>)}
        </ul>
    </>
}