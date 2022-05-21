import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {RootState} from "redux/store"
import {Temporal} from "@js-temporal/polyfill"

const dynamicBaseQuery: BaseQueryFn = async (args, WebApi, extraOptions) => {
    const baseUrl = (WebApi.getState() as RootState).login.url ?? ''
    const rawBaseQuery = fetchBaseQuery({
        baseUrl:`${baseUrl}/api`,
        prepareHeaders: (headers, {getState}) => {
            const auth = (getState() as RootState).login
            if (auth.username && auth.password) {
                headers.set('X-AUTH-USER', auth.username)
                headers.set('X-AUTH-TOKEN', auth.password)
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
    tagTypes: ['user','timesheets', 'today', 'active'],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<any, { url: string, username: string, password: string }>({
            query: ({url, username, password}) => ({
                url: `${url}/api/ping`,
                headers: {
                    'X-AUTH-USER': username,
                    'X-AUTH-TOKEN': password,
                }
            }),
        }),
        startTimesheet: builder.mutation<void, void>({
            query: ()=>({url: `timesheets`, method: 'POST', body: {activity: '1', project: '1'}}),
            invalidatesTags: ['today','active']
        }),
        stopTimesheet: builder.mutation<void, number>({
            invalidatesTags: ['today','active'],
            query: (id)=>({url: `timesheets/${id}/stop`, method: 'PATCH'})
        }),
        getActiveTimesheet: builder.query<Timesheet | null, void>({
            providesTags: ['timesheets', 'today', 'active'],
            query: ()=>`timesheets?active=1`,
            transformResponse: (response: Timesheet[]) => {
                return response.length > 0 ? response[0] : null
            },
        }),
        user: builder.query<{ avatar: string }, void>({
            query: () => `users/me`,
            providesTags: ['user']
        }),
        getTimesheets: builder.query<Timesheet[],void>({
            query: () => {
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                return `timesheets?end=${isoYear}-${isoMonth}-${isoDay}T00:00:00&size=1000000`
            },
            providesTags: ['timesheets'],
            transformResponse: (response: { id: number, description: string, tags: string[],begin: string,end: string,duration:number }[]) => {
                return response.map(timesheet=> {
                    const active = !timesheet.end
                    const begin = Temporal.PlainDateTime.from(timesheet.begin)
                    const end = active ? Temporal.Now.plainDateTimeISO() : Temporal.PlainDateTime.from(timesheet.end)
                    const duration = begin.until(end)
                    return{...timesheet, begin, end, active, duration}})
            }
        }),
        getTodaysTimesheet: builder.query<Timesheet[],void>({
            query: () => {
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                return `timesheets?begin=${isoYear}-${isoMonth}-${isoDay}T00:00:00`
            },
            providesTags: ['timesheets', 'today'],
            transformResponse: (response: { id: number, description: string, tags: string[],begin: string,end: string,duration:number }[]) => {
                return response.map(timesheet=> {
                    const active = !timesheet.end
                    const begin = Temporal.PlainDateTime.from(timesheet.begin)
                    const end = active ? Temporal.Now.plainDateTimeISO() : Temporal.PlainDateTime.from(timesheet.end)
                    const duration = begin.until(end)
                    return{...timesheet, begin, end, active, duration}})
            },
        })
    }),
})

export const {useLoginMutation, useUserQuery, useGetTimesheetsQuery, useGetTodaysTimesheetQuery, useStartTimesheetMutation, useGetActiveTimesheetQuery, useStopTimesheetMutation} = kimaiApi