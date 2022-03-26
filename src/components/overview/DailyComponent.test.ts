import {getGaugeProps} from './DailyComponent'
import {Temporal} from "@js-temporal/polyfill"

interface TemporalMatchers<R = unknown> {
    toEqualDuration(actual: Temporal.Duration): R;
    toEqualPlainDateTime(actual: Temporal.PlainDateTime): R;
}

declare global {
    namespace jest {
        interface Expect extends TemporalMatchers {}
        interface Matchers<R> extends TemporalMatchers<R> {}
        interface InverseAsymmetricMatchers extends TemporalMatchers {}
    }
}

expect.extend({
    toEqualDuration(actual, expected) {
        return {pass: Temporal.Duration.compare(actual, expected) === 0, message: ()=>`Durations do not match, expected: ${expected}, actual: ${actual}`}
    },
    toEqualPlainDateTime(actual, expected) {
        return {pass: Temporal.PlainDateTime.compare(actual, expected) === 0, message: ()=>`PlainDateTimes do not match, expected: ${expected}, actual: ${actual}`}
    }

})

describe('getGaugeProps', () => {
    const dailyWorkingTime = Temporal.Duration.from({hours: 8})
    const now = Temporal.PlainDateTime.from('2020-08-05T14:00:00')
    const overtime = Temporal.Duration.from({hours: 0})
    test('with undefined timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, undefined)
        const expected = {percentage: 1, overtime}

        expect(actual.percentage).toStrictEqual(expected.percentage)
        expect(actual.overtime).toEqualDuration(expected.overtime)
    })

    test('with no timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, [])
        const expected = {percentage: 1, overtime}
        expect(actual.percentage).toStrictEqual(expected.percentage)
        expect(actual.overtime).toEqualDuration(expected.overtime)
    })

    test('with one active timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, [
            {
                id: 1,
                active: true,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                end: now,
                duration: Temporal.Duration.from({hours: 6}),
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
        expect(actual.duration).toEqualDuration(expected.duration)
        expect(actual.remaining).toEqualDuration(expected.remaining)
        expect(actual.start).toEqualPlainDateTime(expected.start)
        expect(actual.end).toEqualPlainDateTime(expected.end)
    })

    test('with two completed and one active timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, [
            {
                id: 1,
                active: true,
                begin: Temporal.PlainDateTime.from('2020-08-05T12:00:00'),
                end: now,
                duration: Temporal.Duration.from({hours: 2}),
            },
            {
                id: 2,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T09:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T11:00:00'),
                duration: Temporal.Duration.from({hours: 2}),
            },
            {
                id: 3,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                duration: Temporal.Duration.from({hours: 2}),
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
        expect(actual.duration).toEqualDuration(expected.duration)
        expect(actual.remaining).toEqualDuration(expected.remaining)
        expect(actual.start).toEqualPlainDateTime(expected.start)
        expect(actual.end).toEqualPlainDateTime(expected.end)
    })

    test('with one completed timesheet', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
                duration: Temporal.Duration.from({hours: 8}),
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
        expect(actual.duration).toEqualDuration(expected.duration)
        expect(actual.remaining).toEqualDuration(expected.remaining)
        expect(actual.start).toEqualPlainDateTime(expected.start)
        expect(actual.end).toEqualPlainDateTime(expected.end)
    })

    test('with three completed timesheets', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, overtime, [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T12:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T17:00:00'),
                duration: Temporal.Duration.from({hours: 5}),
            },
            {
                id: 2,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T09:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T11:00:00'),
                duration: Temporal.Duration.from({hours: 2}),
            },
            {
                id: 3,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T06:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                duration: Temporal.Duration.from({hours: 2}),
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
        expect(actual.duration).toEqualDuration(expected.duration)
        expect(actual.remaining).toEqualDuration(expected.remaining)
        expect(actual.start).toEqualPlainDateTime(expected.start)
        expect(actual.end).toEqualPlainDateTime(expected.end)
    })

    test('with one completed timesheet greater than 8 hours', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, Temporal.Duration.from({hours: 1}), [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T16:30:00'),
                duration: Temporal.Duration.from({hours: 8, minutes:30}),
            }
        ])
        const expected = {
            overtime: Temporal.Duration.from({hours: 1, minutes: 30})
        }
        expect(actual.overtime).toEqualDuration(expected.overtime)
    })

    test('with one completed timesheet equal to 8 hours', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, Temporal.Duration.from({hours: 1}), [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T16:00:00'),
                duration: Temporal.Duration.from({hours: 8}),
            }
        ])
        const expected = {
            overtime: Temporal.Duration.from({hours: 1})
        }
        expect(actual.overtime).toEqualDuration(expected.overtime)
    })

    test('with one completed timesheet less than 8 hours', () => {
        const actual = getGaugeProps(dailyWorkingTime, now, Temporal.Duration.from({hours: 1}), [
            {
                id: 1,
                active: false,
                begin: Temporal.PlainDateTime.from('2020-08-05T08:00:00'),
                end: Temporal.PlainDateTime.from('2020-08-05T15:00:00'),
                duration: Temporal.Duration.from({hours: 7}),
            }
        ])
        const expected = {
            overtime: Temporal.Duration.from({hours: 1})
        }
        expect(actual.overtime).toEqualDuration(expected.overtime)
    })
})