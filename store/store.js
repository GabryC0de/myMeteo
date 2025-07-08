import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice.js';
import loadersReducer from './loadersSlice.js'


export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        loaders: loadersReducer,
    },
});