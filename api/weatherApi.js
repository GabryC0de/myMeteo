export const fetchWeatherData = async (lat, lon) => {
    // console.log("Chiamando API con lat/lon:", lat, lon); // Debug
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Coordinate non valide');
    }

    const API_KEY = "3a7c7be0b2c932aa543572cf106403e4";
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`;

    try {
        const response = await fetch(FORECAST_URL);
        // console.log("API Response status:", response.status); // Debug
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // console.log("Dati API ricevuti:", data); // Debug
        return { current: data.list[0], daily: processDailyForecast(data.list) };
    } catch (error) {
        console.error("Errore API:", error); // Debug
        throw error; // Rilancia l'errore per Redux
    }
};

// funzione che processa i dati dell'API
const processDailyForecast = (list) => {
    const dailyForecasts = {};
    list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                description: item.weather[0].description,
                icons: [item.weather[0].icon], // Array di tutte le icone del giorno
                conditions: [item.weather[0].main], // Array di condizioni (es: "Rain", "Clouds")
            };
        } else {
            dailyForecasts[date].minTemp = Math.min(dailyForecasts[date].minTemp, item.main.temp_min);
            dailyForecasts[date].maxTemp = Math.max(dailyForecasts[date].maxTemp, item.main.temp_max);
            dailyForecasts[date].icons.push(item.weather[0].icon);
            dailyForecasts[date].conditions.push(item.weather[0].main);
        }
    });

    // Calcola l'icona dominante per ogni giorno
    return Object.entries(dailyForecasts).map(([date, data]) => {
        const iconCounts = {};
        data.icons.forEach(icon => {
            iconCounts[icon] = (iconCounts[icon] || 0) + 1;
        });
        const dominantIcon = Object.keys(iconCounts).reduce((a, b) =>
            iconCounts[a] > iconCounts[b] ? a : b
        );

        return {
            date,
            minTemp: data.minTemp,
            maxTemp: data.maxTemp,
            description: data.description,
            icon: dominantIcon, // Icona più frequente
            condition: mode(data.conditions), // Condizione più frequente (es: "Rain")
        };
    });
};

// Helper per trovare la condizione più frequente
const mode = (arr) => {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
};