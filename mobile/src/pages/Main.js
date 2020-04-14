import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import {MaterialIcons} from '@expo/vector-icons';

import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';


import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs} from '../services/socket';

const Main = ({navigation}) => {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('')

    useEffect(() => {
        async function loadInitialPosition() {
          const { granted } = await requestPermissionsAsync();
    
          if (granted) {
            const { coords } = await getCurrentPositionAsync({
              enableHighAccuracy: true,
            });
    
            const { latitude, longitude } = coords;
    
            setCurrentRegion({
              latitude,
              longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            });

          }
        }
    
        loadInitialPosition();
      }, []);

    
    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs])
    
    function setupWebSocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect({
            latitude,
            longitude,
            techs
        })
    }

    async function loadDevs() {
        const {latitude, longitude} = currentRegion;
        

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: techs
            }
        });
        setDevs(response.data.devs);
        setupWebSocket();
    }

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    if(!currentRegion) {
        return null
    }
       
    return (
        <>
            <MapView 
                onRegionChangeComplete={handleRegionChange} 
                initialRegion={currentRegion} 
                style={styles.map}>
               {
                   devs.map(dev => (
                    <MapView.Marker 
                        key={dev._id}
                        coordinate={
                            { 
                                latitude:dev.location.coordinates[1], 
                                longitude:dev.location.coordinates[0] 
                                }
                            }>
                    
                        <Image 
                            style={styles.avatar}
                            source={{uri: dev.avatar_url}} 
                        />

                        <MapView.Callout onPress={() => {
                            navigation.navigate('Profile', {github_ursername: dev.github_ursername})
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </MapView.Callout>
                    </MapView.Marker>
                   ))
               }     

            </ MapView >
            <View style={styles.searchForm}>
            <TextInput 
                style={styles.searchInput}
                placeholder="Buscar por Devs"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={text => setTechs(text)}
            />

            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#222"/>
            </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex:1
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#ccc'
    },
    
    callout: {
        width: 260,
        borderRadius: 5
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio: {
        color: '#666',
        marginTop: 5
    },

    devTechs: {
        marginTop: 5
    },
    
    searchForm: {
        position: 'absolute',
        top: 5,
        left: 20, 
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20, 
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }

})

export default Main;