import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

import LocationManager from './location';
import { fetchWeather } from '../../store/weatherSlice.js';

function WeatherNow({ lat, lon, location, loadingProp, errorProp }) {
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

        <View>
            <View style={styles.location}>
                <LocationManager location={location} loading={loadingProp} error={errorProp}>
                </LocationManager>
                {(current && status == 'succeeded') ? <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png` }}
                    style={[styles.weatherIcons, { height: 50 }]} />
                    : <ActivityIndicator size={'large'}></ActivityIndicator>}

            </View>
            <View style={styles.displayTemp}>
                <Text style={styles.texts}>
                    {(current && status == 'succeeded') ? Math.round(current.main.temp) + '°' : ""}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 18, fontFamily: 'MiSans-Regular', textTransform: 'capitalize' }}>
                    {(current && status == 'succeeded') ? `${current.weather[0].description} ${Math.round(daily[0].maxTemp)}°/${Math.round(daily[0].minTemp)}°` : ""}
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