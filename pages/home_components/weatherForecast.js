import React, { useEffect, useState } from 'react'
import LinearProgressBar from './linearProgressBar.js'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeather } from '../../store/weatherSlice'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

function GetWeatherForecast({ lat, lon }) {

    const dispatch = useDispatch();
    const { daily, status, error } = useSelector((state) => state.weather);

    const [weekMinMax, setMinMax] = useState([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);

    useEffect(() => {
        if (lat && lon) {  // Solo se lat/lon sono validi
            dispatch(fetchWeather({ lat, lon }));
        }
    }, [dispatch, lat, lon]);

    useEffect(() => {
        if (daily && daily.length > 0) {
            let threeDays = daily.slice(0, 3);
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            threeDays.forEach((day) => {
                if (day.minTemp < min) min = day.minTemp;
                if (day.maxTemp > max) max = day.maxTemp;
            });
            setMinMax([min, max]);
            // console.log(daily.slice(0, 3));
        }
    }, [daily]);

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
                                <View key={index} style={styles.daysForecast}>
                                    <View style={{ display: 'flex', flexDirection: 'row', width: '50%', height: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ textTransform: 'capitalize', color: 'white', fontFamily: 'MiSans-Medium' }}>
                                            {new Date(day.date).toLocaleDateString('it-IT', { weekday: 'long' }).slice(0, 3)}
                                        </Text>
                                        <Image
                                            source={{ uri: `https://gabryc0de.github.io/weather-icons/wmo_${day.icon}.png` }}
                                            style={{ height: 50, aspectRatio: '1/1' }}
                                        />

                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '50%', height: '100%' }}>
                                        <Text style={[styles.texts, { color: 'rgba(255, 255, 255, 0.7)' }]}>{Math.round(day.minTemp)}°</Text>
                                        {/* {console.log('Min: ', day.minTemp, ' Max: ', day.maxTemp)} */}
                                        {
                                            (weekMinMax) ?
                                                <LinearProgressBar
                                                    min={Math.round(day.minTemp)}
                                                    max={Math.round(day.maxTemp)}
                                                    weekMinMax={weekMinMax}
                                                    isToday={(index == 0) ? true : false}>
                                                </LinearProgressBar> :
                                                <ActivityIndicator size={'large'}></ActivityIndicator>
                                        }

                                        <Text style={[styles.texts, { color: 'rgba(255, 255, 255, 0.7)' }]}>{Math.round(day.maxTemp)}°</Text>
                                    </View>
                                </View>
                            ))) : ''
                    }
                </Pressable>
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
    daysForecast: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    texts: {
        fontFamily: 'MiSans-Medium',
        fontSize: 12,
        width: '20%',
        textAlign: 'center'
    }
})

export default GetWeatherForecast;