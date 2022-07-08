import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {RootState} from "redux/store"
import {Temporal} from "@js-temporal/polyfill"

const dynamicBaseQuery: BaseQueryFn = async (args, WebApi, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl: `https://api.clockify.me/api/v1/`,
        prepareHeaders: (headers, {getState}) => {
            const auth = (getState() as RootState).login
            if (auth.token) {
                headers.set('X-API-KEY', auth.token)
            }
            return headers
        }
    })
    return rawBaseQuery(args, WebApi, extraOptions)
}

export type Timesheet = {
    active: boolean
    id: number,
    description?: string,
    tags?: string[],
    begin: Temporal.PlainDateTime,
    end: Temporal.PlainDateTime,
    duration: Temporal.Duration,
}

export const kimaiApi = createApi({
    reducerPath: 'kimaiApi',
    tagTypes: ['user', 'timesheets', 'today', 'active'],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<any, string>({
            query: (token) => ({
                url: `https://api.clockify.me/api/v1/user`,
                headers: {'X-API-KEY': token}
            }),
        }),
        startTimesheet: builder.mutation<void, void>({
            query: () => ({url: `timesheets`, method: 'POST', body: {activity: '1', project: '1'}}),
            invalidatesTags: ['today', 'active']
        }),
        stopTimesheet: builder.mutation<void, number>({
            invalidatesTags: ['today', 'active'],
            query: (id) => ({url: `timesheets/${id}/stop`, method: 'PATCH'})
        }),
        getActiveTimesheet: builder.query<Timesheet | null, void>({
            providesTags: ['timesheets', 'today', 'active'],
            query: () => `workspaces/6045ec663c29ee3f11aad4f1/user/62bd9675673709522335a7b5/time-entries?in-progress=1`,
            transformResponse: (response: Timesheet[]) => {
                return response.length > 0 ? response[0] : null
            },
        }),
        user: builder.query<{ profilePicture: string }, void>({
            query: () => `user`,
            providesTags: ['user']
        }),
        getTimesheets: builder.query<Timesheet[], void>({
            query: () => {
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                return `workspaces/6045ec663c29ee3f11aad4f1/user/62bd9675673709522335a7b5/time-entries?end=${isoYear}-0${isoMonth}-0${isoDay}T00:00:00Z&page-size=5000`
            },
            providesTags: ['timesheets'],
            transformResponse: (response: { id: number, timeInterval: {begin: string, end: string, duration: number }}[]) => {
                return response.map(timesheet => {
                    const active = !timesheet.timeInterval.end
                    const begin = Temporal.PlainDateTime.from(timesheet.timeInterval.begin)
                    const end = active ? Temporal.Now.plainDateTimeISO() : Temporal.PlainDateTime.from(timesheet.timeInterval.end)
                    const duration = begin.until(end)
                    return {...timesheet, begin, end, active, duration}
                })
            },
        }),
        getTodaysTimesheet: builder.query<Timesheet[], void>({
            query: () => {
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                return `workspaces/6045ec663c29ee3f11aad4f1/user/62bd9675673709522335a7b5/time-entries?start=${isoYear}-0${isoMonth}-0${isoDay}T00:00:00Z`
            },
            providesTags: ['timesheets', 'today'],
            transformResponse: (response: { id: number, timeInterval: {start: string, end: string, duration: number }}[]) => {
                return response.map(timesheet => {
                    const active = !timesheet.timeInterval.end
                    const begin = Temporal.PlainDateTime.from(timesheet.timeInterval.start.slice(0,-1))
                    const end = active ? Temporal.Now.plainDateTimeISO() : Temporal.PlainDateTime.from(timesheet.timeInterval.end.slice(0,-1))
                    const duration = begin.until(end)
                    return {...timesheet, begin, end, active, duration}
                })
            },
        })
    }),
})

export const {
    useLoginMutation,
    useUserQuery,
    useGetTimesheetsQuery,
    useGetTodaysTimesheetQuery,
    useStartTimesheetMutation,
    useGetActiveTimesheetQuery,
    useStopTimesheetMutation
} = kimaiApi