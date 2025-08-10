import LocationManager from './location'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/weatherSlice.js';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';


function WeatherNow({ lat, lon, location, errorProp }) {
    const dispatch = useDispatch();
    const { current, daily, status, error } = useSelector((state) => state.weather);

    useEffect(() => {
        if (lat && lon) {  // Solo se lat/lon sono validi
            dispatch(fetchWeather({ lat, lon }));
        }
    }, [dispatch, lat, lon]);

    if (status === 'loading') {
        return <ActivityIndicator size="large" />;
    }

    if (status === 'failed') {
        return <Text>Error: {error}</Text>;
    }

    return (

        <View style={{ marginBottom: 10 }}>
            <View style={styles.location}>
                <LocationManager location={location} error={errorProp}>
                </LocationManager>
                {(current && status == 'succeeded') ?

                    <Image
                        source={{ uri: `https://gabryc0de.github.io/weather-icons/wmo_${current.weather_code}.png` }}
                        // source={{ uri: `https://gabryc0de.github.io/weather-icons/wmo_${current.weather_code}_n.png` }} // Uploada le variabili "Night" delle icone
                        style={[styles.weatherIcons, { height: 50 }]} />

                    : <ActivityIndicator size={'large'}></ActivityIndicator>}

            </View>
            <View style={styles.displayTemp}>
                <Text style={styles.texts}>
                    {(current && status == 'succeeded') ? Math.round(current.temperature_2m) + '°' : ""}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 18, fontFamily: 'MiSans-Regular', textTransform: 'capitalize' }}>
                    {(current && status == 'succeeded') ? `${current.description} ${Math.round(daily[0].maxTemp)}°/${Math.round(daily[0].minTemp)}°` : ""}
                </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create(
    {
        weatherIcons: {
            aspectRatio: '1/1',
        },
        texts: {
            fontFamily: 'MiSans-ExtraLight',
            color: 'white',
            fontSize: 110,
        },
        location: {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
        },
        displayTemp: {

        }
    }
)
export default WeatherNow;