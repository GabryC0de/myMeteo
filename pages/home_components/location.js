import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Linking } from 'react-native';


const LocationManager = ({ location, loading, loadingAddress, error }) => {
    

    return (
        <View style={{ padding: 20 }}>
            {loading || loadingAddress ? (
                <ActivityIndicator size="large" />
            ) : error ? (
                <Text style={{ color: 'red' }}>{error}</Text>
            ) : (
                <Text style={{ fontSize: 18, marginBottom: 20, fontWeight: 'bold' }}>
                    {location}
                </Text>
            )}
        </View>
    );
};

export default LocationManager;