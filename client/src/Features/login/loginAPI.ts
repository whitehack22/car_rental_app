import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";

export type TLoginResponse = {
    token: string;
    customer: {
        customerID: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        address: string;
        role: string;
    };
}

type LoginInputs = {
    email: string;
    password: string;
}

export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginCustomer: builder.mutation<TLoginResponse, LoginInputs>({
            query: (loginData) => ({
                url: '/api/customer/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        })
    })
});