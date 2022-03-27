import {getGaugeProps} from './DailyComponent'
import {Temporal} from "@js-temporal/polyfill"

describe('getGaugeProps', () => {
    const dailyWorkingTime = Temporal.Duration.from({hours: 8})
    const now = Temporal.PlainDateTime.from('2020-08-05T14:00:00')

    test('with undefined timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, undefined)
        const expected = {percentage: 1}
        expect(actual).toStrictEqual(expected)
    })

    test('with no timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, [])
        const expected = {percentage: 1}
        expect(actual).toStrictEqual(expected)
    })

    test('with one active timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, [
            {
                id: 1,
                active: true,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00')
            }
        ])
        const expected = {
            percentage: .75,
            duration: Temporal.Duration.from({hours: 6}),
            remaining: Temporal.Duration.from({hours: -2}),
            start: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
            end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
        }
        expect(actual.percentage).toEqual(expected.percentage)
        expect(Temporal.Duration.compare(actual.duration || '', expected.duration)).toBe(0)
        expect(Temporal.Duration.compare(actual.remaining || '', expected.remaining)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.start || '', expected.start)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.end || '', expected.end)).toBe(0)
    })

    test('with two completed and one active timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, [
            {
                id: 1,
                active: true,
                begin: Temporal.PlainDateTime.from('2020-08-05T12:00:00'),
            },
            {
                id: 2,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T09:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T11:00:00'),
            },
            {
                id: 3,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
            },


        ])
        const expected = {
            percentage: .75,
            duration: Temporal.Duration.from({hours: 6}),
            remaining: Temporal.Duration.from({hours: -2}),
            start: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
            end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
        }
        expect(actual.percentage).toEqual(expected.percentage)
        expect(Temporal.Duration.compare(actual.duration || '', expected.duration)).toBe(0)
        expect(Temporal.Duration.compare(actual.remaining || '', expected.remaining)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.start || '', expected.start)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.end || '', expected.end)).toBe(0)
    })

    test('with one completed timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, [
            {
                id: 1,
                active: false,
                end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
            }
        ])
        const expected = {
            percentage: 1,
            duration: Temporal.Duration.from({hours: 8}),
            remaining: Temporal.Duration.from({hours: 0}),
            start: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
            end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
        }
        expect(actual.percentage).toEqual(expected.percentage)
        expect(Temporal.Duration.compare(actual.duration || '', expected.duration)).toBe(0)
        expect(Temporal.Duration.compare(actual.remaining || '', expected.remaining)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.start || '', expected.start)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.end || '', expected.end)).toBe(0)
    })

    test('with three completed timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T12:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T17:00:00'),
            },
            {
                id: 2,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T09:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T11:00:00'),
            },
            {
                id: 3,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
            },


        ])
        const expected = {
            percentage: 1.125,
            duration: Temporal.Duration.from({hours: 9}),
            remaining: Temporal.Duration.from({hours: +1}),
            start: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
            end: Temporal.PlainDateTime.from('2020-08-05T17:00:00'),
        }
        expect(actual.percentage).toEqual(expected.percentage)
        expect(Temporal.Duration.compare(actual.duration || '', expected.duration)).toBe(0)
        expect(Temporal.Duration.compare(actual.remaining || '', expected.remaining)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.start || '', expected.start)).toBe(0)
        expect(Temporal.PlainDateTime.compare(actual.end || '', expected.end)).toBe(0)
    })

})