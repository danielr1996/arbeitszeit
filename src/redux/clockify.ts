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

type ClockifyTimeEntry = { id: number, timeInterval: {start: string, end: string, duration: number }}
const transformResponse = (response: ClockifyTimeEntry[]): Timesheet[] => {
    return response.map(timesheet => {
        const active = !timesheet.timeInterval.end
        // @ts-ignore
        const begin = new Date(timesheet.timeInterval.start).toTemporalInstant().toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDateTime()
        // @ts-ignore
        const end = active ? Temporal.Now.plainDateTimeISO() : new Date(timesheet.timeInterval.end).toTemporalInstant().toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDateTime()
        const duration = begin.until(end)
        return {...timesheet, begin, end, active, duration}
    })
}

export const kimaiApi = createApi({
    reducerPath: 'kimaiApi',
    tagTypes: ['user', 'timesheets', 'today', 'active'],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<any, {token: string, workspaceId: string, userId: string}>({
            query: ({token}) => ({
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
            query: () => `workspaces/${localStorage.getItem('workspaceId')}/user/${localStorage.getItem('userId')}/time-entries?in-progress=1`,
            transformResponse: (response: Timesheet[]) => {
                return response.length > 0 ? response[0] : null
            },
        }),
        user: builder.query<{ profilePicture: string }, void>({
            query: () => `user`,
            providesTags: ['user']
        }),
        getTimesheets: builder.query<Timesheet[],void>({
            query: () => {
                const workspace = localStorage.getItem('workspaceId')
                const user = localStorage.getItem('userId')
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                const endMonth = isoMonth.toString().padStart(2,'0')
                const endDay = isoDay.toString().padStart(2,'0')
                const endDate=`${isoYear}-${endMonth}-${endDay}T00:00:00Z`
                return `workspaces/${workspace}/user/${user}/time-entries?end=${endDate}&page-size=5000`
            },
            providesTags: ['timesheets'],
            transformResponse
        }),
        getTodaysTimesheet: builder.query<Timesheet[], void>({
            query: () => {
                const workspace = localStorage.getItem('workspaceId')
                const user = localStorage.getItem('userId')
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                const startMonth = isoMonth.toString().padStart(2,'0')
                const startDay = isoDay.toString().padStart(2,'0')
                const startDate=`${isoYear}-${startMonth}-${startDay}T00:00:00Z`
                return `workspaces/${workspace}/user/${user}/time-entries?start=${startDate}`
            },
            providesTags: ['timesheets', 'today'],
            transformResponse
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
