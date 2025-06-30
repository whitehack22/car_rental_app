import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TCar = {
    carID: number;
    carModel: string;
    year: string;
    color: string;
    rentalRate: string;
    availability: boolean;
    locationID: number;
}

export const carsAPI = createApi({
    reducerPath: 'carsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).customer.token; // get the token from the user slice of the state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`); // set the Authorization header with the token
            }
            headers.set('Content-Type', 'application/json'); // set the Content-Type header to application/json
            return headers; // return the headers to be used in the request
        }
    }),

    tagTypes: ['Cars'],
    endpoints: (builder) => ({
        createCar: builder.mutation<TCar, Partial<TCar>>({
            query: (newCar) => ({
                url: '/api/car',
                method: 'POST',
                body: newCar
            }),
            invalidatesTags: ['Cars'] // invalidates the cache for the Cars tag when a new car is created
        }),
        getCars: builder.query<{ data: TCar[] }, void>({ //void means no parameters are needed to fetch the cars
            query: () => '/api/cars',
            providesTags: ['Cars'] // this tells RTK Query that this endpoint provides the Cars tag, so it can be used to invalidate the cache when a new car is created
        }),
        updateCar: builder.mutation<TCar, Partial<TCar> & { carID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a car
            query: (updatedCar) => ({
                url: `/api/car/${updatedCar.carID}`,
                method: 'PUT',
                body: updatedCar
            }),
            invalidatesTags: ['Cars'] // invalidates the cache for the Cars tag when a car is updated
        }),
        deleteCar: builder.mutation<{ success: boolean, carID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the car that was deleted, number is the type of the id parameter
            query: (carID) => ({
                url: `/api/car/${carID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cars'] // invalidates the cache for the Cars tag when a car is deleted
        }),
        // get car by id
        getCarById: builder.query<{ data: TCar[] }, number>({
            query: (carId) => `/api/car/${carId}`,
            providesTags: ['Cars'] // this tells RTK Query that this endpoint provides the Cars tag, so it can be used to invalidate the cache when a new car is created
        })
    })
})