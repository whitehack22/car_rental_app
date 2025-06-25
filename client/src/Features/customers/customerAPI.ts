import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

export type TCustomer = {
    customer_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    address: string;
    password:string;
    role: string;
    is_verified: string;

}

export const customerAPI = createApi({ // sets up API endpoints for user management - creating users and verifying them etc
    reducerPath: 'customerAPI', // this is the key in the store where the API state will be stored - name of the API in the store
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain, // base URL for the API - this is the domain where the API is hosted
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).customer.token; // get the token from the user slice of the state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`); // set the Authorization header with the token
            }
            headers.set('Content-Type', 'application/json'); // set the Content-Type header to application/json
            return headers; // return the headers to be used in the request
        }
    }), // base query function that will be used to make requests to the API

    // used to invalidate the cache when a mutation is performed 
    //  it helps to keep the data fresh in the cache, that is to mean that when a user is created, the cache is invalidated so that the next time the users are fetched, the new user is included in the list.
    tagTypes: ['Customers'],
    endpoints: (builder) => ({
        createCustomer: builder.mutation<TCustomer, Partial<TCustomer>>({
            query: (newCustomer) => ({
                url: '/api/customer',
                method: 'POST',
                body: newCustomer
            }),
            invalidatesTags: ['Customers']
        }),
         verifyCustomer: builder.mutation<{ message: string }, { email: string; code: string }>({
            query: (data) => ({
                url: '/api/customer/verify',
                method: 'POST',
                body: data,
            }),
        }),
        getCustomers: builder.query<TCustomer[], void>({
            query: () => '/api/customers',
            providesTags: ['Customers']
        }),
        // update customer
        updateCustomer: builder.mutation<TCustomer, Partial<TCustomer> & { customer_id: number }>({
            query: (customer) => ({
                url: `/api/customer/${customer.customer_id}`,
                method: 'PUT',
                body: customer,
            }),
            invalidatesTags: ['Customers']
        }),
        getCustomerById: builder.query<TCustomer, number>({
            query: (customer_id) => `/api/customer/${customer_id}`,
        }),
    })

})