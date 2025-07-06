import axios from 'axios';

const USER_AGENT = 'metno-weather-app/1.0 gabriele.cont2006@gmail.com'; // Replace with your info

const getCoordinates = async (city) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: city, format: 'json', limit: 1 },
            headers: { 'User-Agent': USER_AGENT }
        });
        if (response.data.length === 0) return null;
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        return null;
    }
};

const getWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
            headers: { 'User-Agent': USER_AGENT }
        });
        return response.data.properties.timeseries[0].data;
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        return null;
    }
};

// Export functions for use in main.js
export { getCoordinates, getWeather };