import {Temporal} from "@js-temporal/polyfill"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import { useState} from "react"
import {match} from "../../lib/match";
import {CalendarDay} from "./CalendarDay";
import {CalendarWeek} from "./CalendarWeek";
import {CalendarMonth} from "./CalendarMonth";
import {CalendarYear} from "./CalendarYeark";

export const Calendar = () => {
    const [current, setCurrent] = useState(Temporal.Now.plainDateISO())
    const [resolution, setResolution] = useState('day')

    const resUp = ()=>{
        setResolution(res=>{
            switch(res){
                case 'day': return 'week'
                case 'week': return 'month'
                case 'month': return 'year'
            }
            return res
        })
    }
    const resDown = ()=>{
        setResolution(res=>{
            switch(res){
                case 'year': return 'month'
                case 'month': return 'week'
                case 'week': return 'day'
            }
            return res
        })
    }
    const prev = (v: 'days' | 'months' | 'years') =>setCurrent(current => current.subtract(Temporal.Duration.from({[v]: 1})))
    const next = (v: 'days' | 'months' | 'years') =>setCurrent(current => current.add(Temporal.Duration.from({[v]: 1})))

    return <>
        <div className="text-5xl inline-grid grid-cols-4 justify-items-center">
                <button><FontAwesomeIcon icon={faAngleUp} onClick={() => resUp()}/></button>
                <button><FontAwesomeIcon icon={faAngleUp} onClick={() => prev('days')}/></button>
                <button><FontAwesomeIcon icon={faAngleUp} onClick={() => prev('months')}/></button>
                <button><FontAwesomeIcon icon={faAngleUp} onClick={() => prev('years')}/></button>
                <span>{resolution}</span>
                <span>{current.getISOFields().isoDay}</span>
                <span>{current.getISOFields().isoMonth}</span>
                <span>{current.getISOFields().isoYear}</span>
                <button><FontAwesomeIcon icon={faAngleDown} onClick={() => resDown()}/></button>
                <button><FontAwesomeIcon icon={faAngleDown} onClick={() => next('days')}/></button>
                <button><FontAwesomeIcon icon={faAngleDown} onClick={() => next('months')}/></button>
                <button><FontAwesomeIcon icon={faAngleDown} onClick={() => next('years')}/></button>
        </div><br/>
        {match([
            [resolution === 'day', <CalendarDay date={current} />],
            [resolution === 'week', <CalendarWeek date={current} />],
            [resolution === 'month', <CalendarMonth date={current} />],
            [resolution === 'year', <CalendarYear date={current} />],
        ])}

    </>
}