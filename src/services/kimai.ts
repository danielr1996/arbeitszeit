import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const kimaiApi = createApi({
    reducerPath: 'kimaiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        // prepareHeaders: (headers,{getState})=>{
        //     headers.set('X-AUTH-USER','d.richter@headtrip.eu')
        //     headers.set('X-AUTH-TOKEN','Reichenschwand5')
        //     return headers
        // }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<any, {username: string, password: string}>({
            query: ({username, password}) =>({
                url:  `https://danielr1996.kimai.cloud/api/ping`,
                headers: {
                    'X-AUTH-USER': username,
                    'X-AUTH-TOKEN': password,
                }
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = kimaiApi