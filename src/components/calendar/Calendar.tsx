import {Temporal} from "@js-temporal/polyfill"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons'
import {useState} from "react"
import Duration = Temporal.Duration

/*
Own Component for Day, Week, Month, Year
use Temporal daysInMonth, monthInYear methods to render correct amount of "subitems"
Dropdown to switch between "resolutions"
Clicking on a subitem "drills down" to the next level
Add "Today" button to quickly get back to today
 */
export const Calendar = () => {
    const [current, setCurrent] = useState(Temporal.Now.plainDateISO())
    const prev = ()=>{
        setCurrent(current=>current.subtract(Duration.from({days: 1})))
    }

    const frwd = ()=>{
        setCurrent(current=>current.add(Duration.from({days: 1})))
    }

    return <>

        <span className="text-5xl">
            <button><FontAwesomeIcon className="mr-3" icon={faAngleLeft} onClick={prev}/></button>
            {current.toLocaleString()}
            <button><FontAwesomeIcon className="ml-3" icon={faAngleRight} onClick={frwd}/></button>
        </span>
    </>
}