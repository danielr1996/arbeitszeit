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
                headers.set('X-AUTH-USER', 'd.richter@headtrip.eu')
                headers.set('X-AUTH-TOKEN', 'Reichenschwand5')
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
    tagTypes: ['user','timesheets'],
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
            },
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // `onStart` side-effect
                // dispatch(messageCreated('Fetching post...'))
                // console.log('Fetching')
                try {
                    const { data } = await queryFulfilled
                    // `onSuccess` side-effect
                    // console.log(data)
                    // dispatch(messageCreated('Post received!'))
                } catch (err) {
                    // console.log('error')
                    // `onError` side-effect
                    // dispatch(messageCreated('Error fetching post!'))
                }
            },
        }),
        getTodaysTimesheet: builder.query<Timesheet[],void>({
            query: () => {
                const {isoDay, isoMonth, isoYear} = Temporal.Now.plainDateISO().getISOFields()
                return `timesheets?begin=${isoYear}-${isoMonth}-${isoDay}T00:00:00`
            },
            providesTags: ['timesheets'],
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

export const {useLoginMutation, useUserQuery, useGetTimesheetsQuery, useGetTodaysTimesheetQuery } = kimaiApi