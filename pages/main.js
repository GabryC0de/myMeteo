// React
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native'

// Expo
import * as Font from 'expo-font'
import * as Location from 'expo-location'
import { LinearGradient } from 'expo-linear-gradient'

//Redux
import { useSelector, useDispatch } from 'react-redux'
import { startLoading, finishLoading, selectLoader } from '../store/loadersSlice.js'

// Components
import Header from './home_components/header.js'
import LineChart from './home_components/lineChart.js'
import BarsDataset from './home_components/barChart.js'
import WeatherNow from './home_components/weatherNow.js'
import ProgressBarsSection from './home_components/progressBars.js'
import GetWeatherForecast from './home_components/weatherForecast.js'

// Componente principale dell'App
function Main() {

    const dispatch = useDispatch();
    const fontsLoading = useSelector(selectLoader('fonts'));
    const currentLocationLoader = useSelector(selectLoader('currentLocationLoader'));

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState(null);

    const loadFonts = async () => {
        try {
            dispatch(startLoading('fonts'));
            await Font.loadAsync({
                'MiSans-Thin': require('../assets/fonts/MiSans-Thin.ttf'),
                'MiSans-Regular': require('../assets/fonts/MiSans-Regular.ttf'),
                'MiSans-ExtraLight': require('../assets/fonts/MiSans-ExtraLight.ttf'),
                'MiSans-Light': require('../assets/fonts/MiSans-Light.ttf'),
                'MiSans-Medium': require('../assets/fonts/MiSans-Medium.ttf'),
            });
        } catch (error) {
            console.error("Error in loading fonts: ", error);
        } finally {
            dispatch(finishLoading('fonts'));
        }
    };

    useEffect(() => {
        loadFonts();
    }, []);

    const requestPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permesso negato',
                'Abilita i permessi di localizzazione nelle impostazioni',
                [
                    { text: 'Annulla', style: 'cancel' },
                    { text: 'Apri impostazioni', onPress: () => Linking.openSettings() }
                ]
            );
            return false;
        }
        return true;
    };

    const getCurrentLocation = async () => {
        dispatch(startLoading('currentLocationLoader'))
        setError(null);

        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) return;

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });

            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                timestamp: new Date(location.timestamp).toLocaleTimeString(),
            });

        } catch (error) {
            setError(error.message);
        } finally {
            dispatch(finishLoading('currentLocationLoader'));
        }
    };

    const getAddressFromCoordinates = async (lat, lon) => {
        if (!lat || !lon) return;

        try {
            dispatch(startLoading('address'));
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                {
                    headers: {
                        'User-Agent': 'app-meteo/1.0 (gabriele.cont2006@gmail.com)'
                    }
                }
            );
            const data = await response.json();
            setAddress(data.address || null); // Ora salviamo solo l'oggetto address

        } catch (error) {
            console.error("Errore nel fetch dell'indirizzo:", error);
            setError("Impossibile ottenere l'indirizzo");
            setAddress(null);
        } finally {
            dispatch(finishLoading('address'));
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (location && !currentLocationLoader) {
            getAddressFromCoordinates(location.latitude, location.longitude);
        }
    }, [location, currentLocationLoader]);

    // Funzione per visualizzare l'indirizzo in modo sicuro
    const renderAddress = () => {
        if (!address) return "Indirizzo non disponibile";

        // Puoi scegliere quali campi mostrare in base a ciò che restituisce l'API
        return address.village
            || address.town
            || address.city
            || address.county
            || address.state
            || "Località sconosciuta";
    };

    return (
        <LinearGradient
            colors={['#244588', '#3560ae', '#97c9ea']} // Array di colori per il gradiente
            start={{ x: 0, y: 0 }} // Punto di inizio (0,0) = top-left
            end={{ x: 0, y: 1 }}   // Punto di fine (1,1) = bottom-right
            style={{ flex: 1, justifyContent: 'center', padding: 0, }}>
            {(fontsLoading) ? <ActivityIndicator size={'large'}></ActivityIndicator> :
                <SafeAreaView style={{ flex: 1, padding: 15, paddingBottom: 0 }}>
                    <Header></Header>
                    <ScrollView>
                        <View style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                            <View style={{ marginBottom: 100 }}>
                                <WeatherNow
                                    lat={location?.latitude}  // Usa l'operatore ?. per sicurezza
                                    lon={location?.longitude}
                                    location={renderAddress()}
                                    error={error}>
                                </WeatherNow>
                            </View>
                            <View>
                                <GetWeatherForecast lat={(location && !currentLocationLoader) ? location.latitude : null} lon={(location && !currentLocationLoader) ? location.longitude : null}>
                                </GetWeatherForecast>
                            </View>
                        </View>
                        <View>
                            {/* <BarsDataset></BarsDataset> */}
                            <LineChart></LineChart>
                        </View>

                        <View style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 20, marginBottom: 20 }}>
                            <ProgressBarsSection></ProgressBarsSection>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            }
        </LinearGradient >
    )
}

export default Main;