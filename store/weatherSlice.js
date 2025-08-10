import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeatherData } from '../api/weatherApi';

// Async Thunk per la chiamata API
export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async ({ lat, lon }) => {
        // chiamata all'API con lat e lon opportune
        const data = await fetchWeatherData(lat, lon);
        return data;
    }
);

// creazione dello slice
const weatherSlice = createSlice({
    // inizializzazione dei valori dello slice
    name: 'weather',
    initialState: {
        current: null,
        daily: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    // tiene traccia dello stato della chiamata all'API
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.current = action.payload.current;
                state.daily = action.payload.daily;
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default weatherSlice.reducer;