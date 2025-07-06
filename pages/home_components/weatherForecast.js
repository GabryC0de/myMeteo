import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native';

function GetWeatherForecast({ lat, lon }) {

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeatherData = async (lat, lon) => {
        if (!lat || !lon) return;

        const API_KEY = "3a7c7be0b2c932aa543572cf106403e4"; // Sostituisci con la tua chiave
        const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`;
        try {
            setLoading(true);

            const response = await fetch(FORECAST_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Estrai i dati giornalieri (1 previsione al giorno alle 12:00)
            const dailyForecasts = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            ).slice(0, 5); // Prendi solo 5 giorni

            setWeather({
                current: data.list[0],
                forecast: dailyForecasts
            });

        } catch (error) {
            console.error("Errore nel fetch:", error);
            Alert.alert("Errore", "Impossibile ottenere i dati meteo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData(lat, lon);
    }, [lat, lon])
    return (
        <View>
            {/* <Image
                source={{ uri: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png` }}
                style={{ width: 50, height: 50 }}
            /> */}
        </View>
    )

};

export default GetWeatherForecast;