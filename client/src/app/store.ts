import  { persistReducer, persistStore } from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { customerAPI } from '../Features/customers/customerAPI'
import storage from 'redux-persist/lib/storage'
import { loginAPI } from '../Features/login/loginAPI'
import userSlice from '../Features/login/userSlice'


const persistConfig = {
    key: 'root', //storage key for the persisted state
    version: 1, //version of the persisted state
    storage, // storage engine to use (localStorage in this case)
    whitelist: ['customer'] // Only persist the user slice - this means only the user state will be saved in local storage
}

const rootReducer = combineReducers({ //combining all reducers into one root reducer
    [customerAPI.reducerPath]: customerAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    customer: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer) // wrap combined redicers with persistReducer to enable persistence in local storage 

export const store = configureStore({
   reducer: persistedReducer,

   //middleware
    //The reason we need to add the middleware is because the RTK Query APIs (usersAPI and loginAPI) use middleware to handle caching, invalidation, polling, and other features.
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false // disable serializable check for the persisted state - A serializable value is a value that can be converted to JSON and back without losing information. Its desabled here because the RTK Query APIs use non-serializable values (like functions) in their state.
   })
        .concat(customerAPI.middleware) // add the customersAPI middleware to the store - helps with caching, invalidation, polling, and other features
        .concat(loginAPI.middleware) // add the loginAPI middleware
})

export const persistedStore = persistStore(store) // needed for persisting the store to local storage
export type RootState = ReturnType<typeof store.getState> // RootState is the type of the entire state tree in the store - TS support