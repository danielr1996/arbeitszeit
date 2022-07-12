import {FunctionComponent, useState} from "react"
import {Timesheet, useGetTimesheetsQuery, useGetTodaysTimesheetQuery} from "redux/clockify"
import {Temporal} from "@js-temporal/polyfill"
import {useDailyWorkingTime} from "lib/useDailyWorkingTime"
import {DailyComponent, getDuration} from "./DailyComponent"
import {useNow} from "../../lib/useNow";

export const Overview: FunctionComponent = () => {
    const todaysTimesheets = useGetTodaysTimesheetQuery().data
    const timesheets = useGetTimesheetsQuery().data || []
    const now = useNow(true)

    // const [workDayEnded, setWorkDayEnded] = useState(false)
    const dailyWorkingTime = useDailyWorkingTime()
    const duration = timesheets.reduce((sum, timesheet) => sum.add(timesheet.duration), Temporal.Duration.from({hours: 0}))
    const groupByDay: { by: Temporal.PlainDate,timesheets: Timesheet[] }[] = Object.values(timesheets.reduce((acc: { [key: string]: { by: Temporal.PlainDate, timesheets: Timesheet[] } }, t) => {
        const key = t.begin.toPlainDate().toString();
        (acc[key] = acc[key] || {by: t.begin.toPlainDate(), timesheets: []}).timesheets.push(t)
        return acc
    }, {}))
    const workDays = groupByDay.filter(group=>group.by.dayOfWeek !== 7 && group.by.dayOfWeek !== 6).length
    const should = Temporal.Duration.from({hours: (workDays+1) * dailyWorkingTime.hours})
    const overtimeGesamt = duration.subtract(should).add(getDuration(todaysTimesheets || [],now))
    return <>
        <div className="h-full flex justify-center items-center">
            <DailyComponent timesheets={todaysTimesheets} overtimeGesamt={overtimeGesamt}/>
            {/*<label>*/}
            {/*<input checked={workDayEnded} onChange={e=>setWorkDayEnded(e.target.checked)} type="checkbox" />Arbeitstag beendet?*/}
            {/*</label>*/}
        </div>
    </>
}
