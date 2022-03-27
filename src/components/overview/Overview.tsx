import {FunctionComponent} from "react"
import {DailyComponent} from "components/overview/DailyComponent"
import {useGetTodaysTimesheetQuery} from "redux/kimai"

export const Overview: FunctionComponent = () => {
    const { data} = useGetTodaysTimesheetQuery()

    return <>
        <div className="h-full flex justify-center items-center">
            <DailyComponent timesheets={data}/>
        </div>
    </>
}