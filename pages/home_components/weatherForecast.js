import React, { useEffect } from 'react'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/weatherSlice';
import LinearProgressBar from './linearProgressBar.js'
import TestProgress from './prova.js';

function GetWeatherForecast({ lat, lon }) {
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
        <>
            <View style={styles.forecastContainer}>
                <Pressable style={{ padding: 5, height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'MiSans-Medium' }}>
                        Previsioni in 5 giorni
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'MiSans-Medium' }}>
                        {'Dettagli >'}
                    </Text>
                </Pressable>

                <Pressable style={{ padding: 5 }}>
                    {
                        (daily) ?
                            (daily.slice(0, 3).map((day, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ textTransform: 'capitalize', color: 'white', fontFamily: 'MiSans-Medium' }}>
                                            {new Date(day.date).toLocaleDateString('it-IT', { weekday: 'long' }).slice(0, 3)}
                                        </Text>
                                        <Image
                                            source={{ uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png` }}
                                            style={{ height: 50, aspectRatio: '1/1' }} />
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
                                        <Text style={[styles.texts, { color: 'rgba(255, 255, 255, 0.7)' }]}>{Math.round(day.minTemp)}°</Text>
                                        <LinearProgressBar
                                            min={0.2}
                                            max={.86}
                                            progress={0.7}>
                                        </LinearProgressBar>
                                        <Text style={[styles.texts, { color: 'rgba(255, 255, 255, 0.7)' }]}>{Math.round(day.maxTemp)}°</Text>
                                    </View>
                                </View>
                            ))
                            ) : ''
                    }
                </Pressable>

                {/* <TestProgress></TestProgress> */}
            </View >
        </>
    )
};

const styles = StyleSheet.create({
    forecastContainer: {
        display: 'block',
        borderRadius: 16,
        padding: 15,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    texts: {
        fontFamily: 'MiSans-Medium',
        fontSize: 12
    }
})

export default GetWeatherForecast;