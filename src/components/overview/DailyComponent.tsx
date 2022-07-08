import {FunctionComponent} from "react"
import {Gauge} from "lib/GaugeComponent"
import {Time} from "lib/Time"
import {Duration} from "lib/Duration"
import {useDailyWorkingTime} from "lib/useDailyWorkingTime"
import {Timesheet} from "redux/clockify"
import {useNow} from "lib/useNow"
import {Temporal} from "@js-temporal/polyfill"

type GaugeProps = {
    percentage?: number,
    start?: Temporal.PlainDateTime,
    end?: Temporal.PlainDateTime,
    duration?: Temporal.Duration,
    overtime?: Temporal.Duration,
    remaining?: Temporal.Duration,
    remainingWithOvertime?: Temporal.Duration,
}


export const getStart = (timesheets: Timesheet[]) => timesheets.slice(-1)[0].begin
export const getEnd = (timesheets: Timesheet[], remaining: Temporal.Duration) => {
    let end = timesheets[0].end
    if (timesheets[0].active) {
        // @ts-ignore
        end = end.subtract(remaining)
    }
    return end
}
export const getDuration = (timesheets: Timesheet[], now: Temporal.PlainDateTime) =>timesheets
    .map(t => ({...t, end: t.active ? now : t.end, duration: t.active ? t.begin.until(now) : t.duration}))
    .reduce((sum, timesheet) => sum.add(timesheet.duration), Temporal.Duration.from({hours: 0}))

export const getPercentage = (duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => duration?.total('hours') / dailyWorkingTime.total('hours')
export const getRemaining = (duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => duration.subtract(dailyWorkingTime)
export const getRemainingWithOvertime = (remaining: Temporal.Duration, overtime: Temporal.Duration) => remaining.add(overtime)
export const getOvertime = (overtime: Temporal.Duration, remaining: Temporal.Duration, duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => Temporal.Duration.compare(dailyWorkingTime, duration) <= 0 ? overtime.add(remaining) : overtime

export const getGaugeProps = (dailyWorkingTime: Temporal.Duration, now: Temporal.PlainDateTime, overtime: Temporal.Duration, timesheets?: Timesheet[]): GaugeProps => {
    if (!timesheets || timesheets.length <= 0) {
        return {
            percentage: 1,
            overtime,
        }
    }
    const start = getStart(timesheets)
    const duration = getDuration(timesheets, now)
    const percentage = getPercentage(duration, dailyWorkingTime)
    const remaining = getRemaining(duration, dailyWorkingTime)
    const end = getEnd(timesheets, remaining)
    const remainingWithOvertime = getRemainingWithOvertime(remaining, overtime)
    overtime = getOvertime(overtime, remaining, duration, dailyWorkingTime)

    return {
        start,
        end,
        duration,
        percentage,
        remaining,
        remainingWithOvertime,
        overtime,
    }
}

export type Props = {
    timesheets?: Timesheet[]
    overtimeGesamt: Temporal.Duration
}

export const DailyComponent: FunctionComponent<Props> = ({timesheets, overtimeGesamt}) => {
    const dailyWorkingTime = useDailyWorkingTime()
    const now = useNow(true)
    const {
        start,
        end,
        percentage,
        duration,
        overtime,
        remaining,
        remainingWithOvertime,
    } = getGaugeProps(dailyWorkingTime, now, overtimeGesamt, timesheets)
    return <>
        <div className="m-5 inline-block">
            <Gauge
                percentage={percentage}
                startText={<span className="text-3xl"><Time displayEmpty time={start}/> </span>}
                endText={<span className="text-3xl"><Time displayEmpty time={end}/> </span>}
                centerText={<div className="text-center">
                            <span className="text-4xl">
                                <Duration withColor withoutMono displayEmpty withSeconds duration={duration}/>
                            </span><br/>
                    <span className="text-xl">
                                <Duration withColor withoutMono displayEmpty withSeconds duration={remaining}/><br/>
                                (<Duration withColor withoutMono displayEmpty withSeconds
                                           duration={remainingWithOvertime}/>)
                            </span>
                </div>}
            />
            <span className="text-5xl text-center block"><Duration displayEmpty withColor duration={overtime}/></span>
        </div>
    </>
}