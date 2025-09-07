// Components
import LocationManager from './location'
import { FontAwesomeIcon } from '../../icons/icons.js';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/weatherSlice.js';

// React
import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native';


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
            <View style={{ display: 'flex' }}>
                <Text style={styles.text}>
                    {(current && status == 'succeeded') ? Math.round(current.temperature_2m) + '°' : ""}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 18, fontFamily: 'MiSans-Regular', textTransform: 'capitalize' }}>
                    {(current && status == 'succeeded') ? `${current.description} ${Math.round(daily[0].maxTemp)}°/${Math.round(daily[0].minTemp)}°` : ""}
                </Text>
                <Pressable style={{ alignSelf: 'flex-start', width: '25%', display: 'inline-block', marginTop: 5, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 8 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                        <FontAwesomeIcon icon="leaf" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'MiSans-Regular' }}>{` AQI ${(current && status == 'succeeded') ? current.european_aqi : ''}`}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
};

const styles = StyleSheet.create(
    {
        weatherIcons: {
            aspectRatio: '1/1',
        },
        text: {
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
    }
)
export default WeatherNow;