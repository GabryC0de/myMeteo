import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

import { getCoordinates, getWeather } from "./weatherAPI.js";

app.get('/weather-request', async (req, res) => {
    let city = "Riva del Garda";

    let coords = await getCoordinates(city);
    if (!coords) return res.status(404).json({ error: 'City not found.' });

    const weather = await getWeather(coords.lat, coords.lon);
    if (!weather) return res.status(500).json({ error: 'Weather data unavailable.' });

    res.json({
        city,
        coordinates: coords,
        weather: weather.instant,
        forecast: weather.next_1_hours
    });
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});