// loadersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Ogni chiave rappresenta un loader specifico
    fonts: false,
    currentLocationLoader: false,
    address: false,
    // Aggiungi altri loader qui
};

export const loadersSlice = createSlice({
    name: 'loaders',
    initialState,
    reducers: {
        startLoading: (state, action) => {
            state[action.payload] = true;
        },
        finishLoading: (state, action) => {
            state[action.payload] = false;
        },
    },
});

export const { startLoading, finishLoading } = loadersSlice.actions;

// Selettori
export const selectLoader = (loaderName) => (state) => state.loaders[loaderName];

export default loadersSlice.reducer;