import {FunctionComponent, useState} from "react"
import {Gauge} from "lib/GaugeComponent"
import {Temporal} from "@js-temporal/polyfill"
import {Time} from "lib/Time"
import {Duration} from "lib/Duration"
import {useDailyWorkingTime} from "lib/useDailyWorkingTime"
import {Timesheet} from "redux/kimai"
import {useNow} from "lib/useNow"

export type Props = {
    timesheets?: Timesheet[]
}

type GaugeProps = {
    percentage?: number,
    start?: Temporal.PlainDateTime,
    end?: Temporal.PlainDateTime,
    duration?: Temporal.Duration,
    overtime?: Temporal.Duration,
    remaining?: Temporal.Duration,
    remainingWithOvertime?: Temporal.Duration,
}

export const getGaugeProps = (dailyWorkingTime: Temporal.Duration, now: Temporal.PlainDateTime, timesheets?: Timesheet[]): GaugeProps => {
    if (!timesheets || timesheets.length <= 0) {
        return {
            percentage: 1
        }
    }
    timesheets = timesheets.map(timesheet => timesheet.active ? ({
        ...timesheet,
        end: now,
        duration: timesheet.begin.until(now)
    }) : timesheet)
    const start = timesheets.slice(-1)[0].begin
    const duration = timesheets.reduce((sum, timesheet) => sum.add(timesheet.begin.until(timesheet.end || timesheet.begin)), Temporal.Duration.from({hours: 0}))
    const percentage = duration?.total('hours') / dailyWorkingTime.total('hours')
    const remaining = duration.subtract(dailyWorkingTime)
    let end = timesheets[0].end
    if (timesheets[0].active) {
        // @ts-ignore
        end = end.subtract(remaining)
    }
    return {
        start, end, percentage, duration, remaining
    }
}

export const DailyComponent: FunctionComponent<Props> = ({timesheets}) => {
    const dailyWorkingTime = useDailyWorkingTime()
    const now = useNow(true)
    const {
        start,
        end,
        percentage,
        duration,
        overtime,
        remaining,
        remainingWithOvertime
    } = getGaugeProps(dailyWorkingTime, now, timesheets)
    return <>
        <div className="m-5 inline-block">
            <Gauge
                percentage={percentage}
                startText={<span className="text-3xl"><Time displayEmpty time={start}/> </span>}
                endText={<span className="text-3xl"><Time displayEmpty time={end}/> </span>}
                centerText={<div className="text-center">
                        <span className="text-4xl"><Duration withColor withoutMono displayEmpty withSeconds
                                                             duration={duration}/></span><br/>
                    <span className="text-xl"><Duration withColor withoutMono displayEmpty withSeconds
                                                        duration={remaining}/></span><br/>
                    <span className="text-xl"><Duration withColor withoutMono displayEmpty withSeconds
                                                        duration={remainingWithOvertime}/></span><br/>
                </div>}
            />
            <span className="text-5xl text-center block"><Duration displayEmpty duration={overtime}/></span>
        </div>
    </>
}