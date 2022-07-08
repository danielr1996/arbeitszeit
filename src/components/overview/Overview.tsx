import {FunctionComponent} from "react"
import {Timesheet, useGetTimesheetsQuery, useGetTodaysTimesheetQuery} from "redux/clockify"
import {Temporal} from "@js-temporal/polyfill"
import {useDailyWorkingTime} from "lib/useDailyWorkingTime"
import {DailyComponent} from "./DailyComponent";

export const Overview: FunctionComponent = () => {
    const todaysTimesheets = useGetTodaysTimesheetQuery().data
    const timesheets = useGetTimesheetsQuery().data || []

    const dailyWorkingTIme = useDailyWorkingTime()
    const duration = timesheets.reduce((sum, timesheet) => sum.add(timesheet.duration), Temporal.Duration.from({hours: 0}))
    const groupByDay: { by: Temporal.PlainDate,timesheets: Timesheet[] }[] = Object.values(timesheets.reduce((acc: { [key: string]: { by: Temporal.PlainDate, timesheets: Timesheet[] } }, t) => {
        const key = t.begin.toPlainDate().toString();
        (acc[key] = acc[key] || {by: t.begin.toPlainDate(), timesheets: []}).timesheets.push(t)
        return acc
    }, {}))
    const should = Temporal.Duration.from({hours: (groupByDay.length) * dailyWorkingTIme.hours})
    const overtimeGesamt = duration.subtract(should)
    return <>
        <div className="h-full flex justify-center items-center">
            <DailyComponent timesheets={todaysTimesheets} overtimeGesamt={overtimeGesamt}/>
        </div>
    </>
}