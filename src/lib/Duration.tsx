import {Temporal} from "@js-temporal/polyfill"
import classNames from "classnames"
import {match} from "lib/match"

/**
 * Converts a Temporal.Duration to a plain Javascript object with values readable and writable by string keys
 * @param d the Temporal.Duration object to convert
 */
const toObject = (d:Temporal.Duration): {[key: string]: number} => ({
    years: d.years,
    months: d.months,
    weeks: d.weeks,
    days: d.days,
    hours: d.hours,
    minutes: d.minutes,
    seconds: d.seconds,
    milliseconds: d.milliseconds,
    microseconds: d.microseconds,
    nanoseconds: d.nanoseconds
})

/**
 * Shifts the duration component @from to next bigger component @to
 * @param d the duration to shift
 * @param multiplier the multiplier between @from and @to
 * @param from the component that should be shifted from
 * @param to the component that should be shifted to
 */
const shift = (d: Temporal.Duration, {multiplier, from, to}: { multiplier: number, from: string, to: string }) => {
    const durationLike = toObject(d)
    /**
     * Get the component from the Temporal.Duration that should be shifted from
     */
    const duration = durationLike[from]

    /**
     * Calculate the next bigger component that should be shifted to and discard any decimal places
     * e.g. 90s => 1m (30s discarded)
     */
    const next = Math.floor(duration / multiplier)
    durationLike[to] = next + durationLike[to]

    /**
     * Calculate the remainder of this component, i.e. the decimal places that were discarded in the last step
     * e.g. 90s => 30s (1m was calculated in the last step)
     */
    durationLike[from] = duration % multiplier

    /**
     * Calculate the remainder of this component, i.e. the decimal places that were discarded in the last step
     * e.g. 90s => 30s (1m was calculated in the last step)
     */
    return Temporal.Duration.from(durationLike)
}

/**
 * Normalizes a Temporal.Duration object so that each duration component x is smaller than the amount of x that fits into the next larger component
 * e.g. 90seconds => 1minute 30seconds, 3690seconds => 1hour 1minute 30seconds
 * TODO: replace with official implementation https://tc39.es/proposal-temporal/docs/#balancing
 * @param d the duration to normalize
 */
export const normalize = (d: Temporal.Duration | undefined) => {
    if (!d) {
        return Temporal.Duration.from({hours: 0})
    }
    let wasNegative = false;
    /**
     * negate before normalizing because a negative duration give funny results, and negate it again before returning
     */
    if (d.sign === -1) {
        wasNegative = true
        d = d.negated()
    }
    const conversions = [
        {multiplier: 1000, from: 'nanoseconds', to: 'microseconds'},
        {multiplier: 1000, from: 'microseconds', to: 'milliseconds'},
        {multiplier: 1000, from: 'milliseconds', to: 'seconds'},
        {multiplier: 60, from: 'seconds', to: 'minutes'},
        {multiplier: 60, from: 'minutes', to: 'hours'},
        {multiplier: 24, from: 'hours', to: 'days'},
        {multiplier: 7, from: 'days', to: 'weeks'},
        {multiplier: 4, from: 'weeks', to: 'months'},
        {multiplier: 12, from: 'months', to: 'years'}
    ]

    /**
     * Shift each component to the next one starting from the smallest
     */
    if (wasNegative) {
        return conversions.reduce((acc, curr) => shift(acc, curr), d).negated()
    }
    return conversions.reduce((acc, curr) => shift(acc, curr), d)
};
type Props = {
    duration?: Temporal.Duration
    withoutPrefix?: boolean,
    withoutPadding?: boolean,
    withColor?: boolean,
    withoutMono?: boolean,
    withSeconds?: boolean,
    displayEmpty?: boolean,
}
export const Duration = ({duration, withoutPadding, withoutPrefix, withColor, withoutMono, withSeconds, displayEmpty}: Props) => {

    const classes = classNames(
        {'font-mono': !withoutMono},
        {'text-green-500': withColor && duration?.sign === +1},
        {'text-red-500': withColor && duration?.sign === -1},
        {'text-blue-500': withColor && duration?.sign === 0}
    )
    const format = (duration?: Temporal.Duration): string => {
        if(!duration){
            if(displayEmpty){
                return '--:--'
            }
            return ''
        }
        duration = normalize(duration)
        const prefix = withoutPrefix ? '' : match([
            [duration.sign === 1, '+'],
            [duration.sign === 0, '±'],
            [duration.sign === -1, '-'],
        ])
        const hours = withoutPadding ? Math.abs(duration.hours).toString() : Math.abs(duration.hours).toString().padStart(2, ' ')
        const minutes = Math.abs(duration.minutes).toString().padStart(2, '0')
        const seconds = withSeconds ? ':' + Math.abs(duration.seconds).toString().padStart(2, '0') : ''
        return `${prefix}${hours}:${minutes}${seconds}`
    }
    return <span className={classes}>{format(duration)}</span>
}