 import { createSlice } from "@reduxjs/toolkit";


export type CustomerState = {
    token: string | null;
    customer: {
        customer_id: number;
        first_name: string;
        last_name: string;
        email: string;
        phoneNumber: string;
        address: string;
        role: string;
    } | null;
} // how the user state will look like in the store

const initialState: CustomerState = {
    token: null,
    customer: null,
} //By default, there is no token and no user (not logged in).

const customerSlice = createSlice({ // createSlice is a function that creates a slice of the Redux store- a slice in simple terms is a part of the store that contains a specific piece of state and the reducers that update that state.
    name: 'customer', // name of the slice, this will be used as a key in the store
    initialState, // initial state of the slice
    reducers: { //a reducer is a function that takes the current state and an action, and returns a new state
        loginSuccess: (state, action) => {
            state.token = action.payload.token; // the token is set when the user logs in successfully
            state.customer = action.payload.customer; // the user is set when the user logs in successfully
        },
        logout: (state) => {
            state.token = null;
            state.customer = null;
        }
    }
})

export const { loginSuccess, logout } = customerSlice.actions; // export the actions so that they can be dispatched from components
export default customerSlice.reducer;