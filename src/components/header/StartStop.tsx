import React, {FunctionComponent} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import {useGetActiveTimesheetQuery, useStartTimesheetMutation, useStopTimesheetMutation} from "redux/kimai"
export const StartStop: FunctionComponent = () => {
    const [start] = useStartTimesheetMutation()
    const [stop] = useStopTimesheetMutation()
    const activeTimesheet= useGetActiveTimesheetQuery().data

    const onClick = ()=>{
        if(activeTimesheet){
            stop(activeTimesheet.id)
        }else{
            start()
        }
    }

    return <div className="text-3xl w-9">
        <button><FontAwesomeIcon icon={!activeTimesheet ? faPlay : faPause} onClick={onClick}/></button>
    </div>
}