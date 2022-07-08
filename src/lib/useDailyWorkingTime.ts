import {Temporal} from "@js-temporal/polyfill";

export const useDailyWorkingTime = ()=>{
    return Temporal.Duration.from({hours:7})
}