import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from './pages/home_components/header.js'
import LocationManager from './pages/home_components/location.js'
import * as Location from 'expo-location';
import GetWeatherForecast from './pages/home_components/weatherForecast.js';
import WeatherNow from './pages/home_components/weatherNow.js';

export default function App() {

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null); // Cambiato da '' a null
  const [loadingAddress, setLoadingAddress] = useState(false);

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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    if (!lat || !lon) return;

    setLoadingAddress(true);
    try {
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

      // Debug: mostra l'intera risposta nella console
      // console.log("Risposta completa da OpenStreetMap:", data);
      // if (data.address) {
      //   console.log("Dettagli indirizzo:", data.address);
      // }

    } catch (error) {
      console.error("Errore nel fetch dell'indirizzo:", error);
      setError("Impossibile ottenere l'indirizzo");
      setAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location && !loading) {
      getAddressFromCoordinates(location.latitude, location.longitude);
    }
  }, [location, loading]);

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
    <SafeAreaView style={{ backgroundColor: "#fffg", flex: 1 }}>
      <Header></Header>
      <ScrollView>
        <View>
          <LocationManager location={renderAddress()} loading={loading} loadingAddress={loadingAddress} error={error}>
          </LocationManager>
          <View>
            <WeatherNow lat={(location && !loading) ? location.latitude : null} lon={(location && !loading) ? location.longitude : null}>
            </WeatherNow>
          </View>
          <View>
            <GetWeatherForecast lat={(location && !loading) ? location.latitude : null} lon={(location && !loading) ? location.longitude : null}>
            </GetWeatherForecast>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});