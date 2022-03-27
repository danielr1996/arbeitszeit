import {Temporal} from "@js-temporal/polyfill";
import {normalize} from "./Duration";
describe('normalize',()=>{

    test('normalizes a positive duration', ()=>{
        const duration = Temporal.Duration.from({hours: 4, minutes: 90,seconds:90})
        const expected = Temporal.Duration.from({hours: 5,minutes:31,seconds:30})
        const actual = normalize(duration)
        expect(Temporal.Duration.compare(actual,expected)).toBe(0)
    })

    test('normalizes a negative duration', ()=>{
        const duration = Temporal.Duration.from({hours: -4, minutes: -90,seconds:-90})
        const expected = Temporal.Duration.from({hours: -5,minutes:-31,seconds:-30})
        const actual = normalize(duration)
        expect(Temporal.Duration.compare(actual,expected)).toBe(0)
    })
})