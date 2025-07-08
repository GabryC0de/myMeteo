// React
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Linking } from 'react-native';

//Redux
import { useSelector } from 'react-redux';
import { selectLoader } from '../../store/loadersSlice.js';

const LocationManager = ({ location, loading, error }) => {

    const addressLoading = useSelector(selectLoader('address'));

    return (
        <View>
            {loading || addressLoading ? (
                <ActivityIndicator size="large" />
            ) : error ? (
                <Text style={{ color: 'red' }}>{error}</Text>
            ) : (
                <Text style={{ fontFamily: 'MiSans-Medium', color: 'white', fontSize: 18 }}>
                    {location}
                </Text>
            )}
        </View>
    );
};

export default LocationManager;