import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native';

function WeatherNow({ lat, lon }) {

    const [loading, setLoading] = useState(false);
    const [weatherData, setWeather] = useState({
        main: {
            "feels_like": 24.19,
            "humidity": 83,
            "pressure": 1007,
            "temp": 23.61,
            "temp_max": 24.81,
            "temp_min": 23.01
        },
        weather: {
            "description": "pioggia leggera",
            "icon": "10d",
            "id": 500,
            "main": "Rain"
        }
    });

    const fetchWeatherData = async (lat, lon) => {
        if (!lat || !lon) return;

        const API_KEY = "3a7c7be0b2c932aa543572cf106403e4"; // Sostituisci con la tua chiave
        const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`;

        try {
            setLoading(true);

            const response = await fetch(CURRENT_WEATHER_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setWeather({
                main: {
                    "feels_like": data.main.feels_like,
                    "humidity": data.main.humidity,
                    "pressure": data.main.pressure,
                    "temp": data.main.temp,
                    "temp_max": data.main.temp_max,
                    "temp_min": data.main.temp_min,
                },
                weather: {
                    "description": data.weather[0].description,
                    "icon": data.weather[0].icon,
                    "id": data.weather[0].id,
                    "main": data.weather[0].main,
                }
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
            <Image
                source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png` }}
                style={[styles.weatherIcons, { height: 50 }]}
            />
            <Text>
                {
                    (weatherData && !loading) ? weatherData.main.temp.toFixed(1) : ""
                }
            </Text>
        </View>
    )
};

const styles = StyleSheet.create(
    {
        weatherIcons: {
            aspectRatio: '1/1',
        },
    }
)

export default WeatherNow;