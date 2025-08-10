export const fetchWeatherData = async (lat, lon) => {

    const weatherDescriptions = {
        // Ciel Sereno / Principalmente Sereno
        0: "Cielo sereno",
        1: "Principalmente sereno",
        // Parzialmente Nuvoloso / Nuvoloso
        2: "Parzialmente nuvoloso",
        3: "Nuvoloso",
        // Nebbia
        45: "Nebbia",
        48: "Nebbia depositata (brina)",
        // Pioviggine
        51: "Pioviggine leggera",
        53: "Pioviggine moderata",
        55: "Pioviggine densa",
        // Pioviggine Gelata
        56: "Pioviggine gelata leggera",
        57: "Pioviggine gelata densa",
        // Pioggia
        61: "Pioggia leggera",
        63: "Pioggia moderata",
        65: "Pioggia forte",
        // Pioggia Gelata
        66: "Pioggia gelata leggera",
        67: "Pioggia gelata forte",
        // Neve
        71: "Neve leggera",
        73: "Neve moderata",
        75: "Neve forte",
        77: "Grandinata (grani di neve)",
        // Rovesci
        80: "Rovesci di pioggia leggeri",
        81: "Rovesci di pioggia moderati",
        82: "Rovesci di pioggia violenti",
        // Rovesci di Neve
        85: "Rovesci di neve leggeri",
        86: "Rovesci di neve forti",
        // Temporali
        95: "Temporale (debole o moderato)", // Attenzione: 95 è temporale, senza grandine
        // Temporali con Grandine (solo per WMO)
        96: "Temporale con grandine leggera", // Questi codici sono meno comuni nelle API di previsione standard
        99: "Temporale con grandine forte"
    };

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Coordinate non valide');
    }

    const FORECAST_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&current=is_day,temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,rain,weather_code,surface_pressure&timezone=auto`;

    try {
        const response = await fetch(FORECAST_URL);
        // console.log("API Response status:", response.status); // Debug
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // console.log("Dati API ricevuti:", data); // Debug

        let currentCondition = { "description": weatherDescriptions[data.current.weather_code] };
        let current = { ...data.current, ...currentCondition };
        daily = [];

        Array.from({ length: 5 }, (_, i) => {
            daily.push(
                {
                    "date": data.daily.time[i],
                    "minTemp": data.daily.temperature_2m_min[i],
                    "maxTemp": data.daily.temperature_2m_max[i],
                    "description": weatherDescriptions[data.daily.weather_code[i]],
                    "icon": data.daily.weather_code[i], // Icona più frequente
                    "sunrise": data.daily.sunrise[i],
                    "sunset": data.daily.sunset[i],
                }
            )
        });
        return { current, daily };
    } catch (error) {
        console.error("Errore API:", error); // Debug
        throw error; // Rilancia l'errore per Redux
    }
};