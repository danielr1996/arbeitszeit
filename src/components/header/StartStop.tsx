import React, {FunctionComponent, useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import {useGetActiveTimesheetQuery, useStartTimesheetMutation, useStopTimesheetMutation} from "redux/clockify"

export const StartStop: FunctionComponent = () => {
    const [start] = useStartTimesheetMutation()
    const [stop] = useStopTimesheetMutation()
    const activeTimesheet= useGetActiveTimesheetQuery().data
    const [icon, setIcon] = useState(faSpinner)
    useEffect(() => {
        setIcon(activeTimesheet !== null ? faPause : faPlay)
    }, [activeTimesheet])

    const onClick = ()=>{
        setIcon(faSpinner)
        if(activeTimesheet){
            stop(activeTimesheet.id)
        }else{
            start()
        }
    }

    return <div>
        <button><FontAwesomeIcon icon={icon} onClick={onClick}/></button>
    </div>
}