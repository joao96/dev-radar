import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';


function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      // granted -> se o usuário deu permissão ou não de usar a localização dele
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
        })
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    // copia todos os devs que já estão cadastrados e adiciona no final o novo dev in real time
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebSocket() {
    // disconectar do socket previamente conectado (a busca antiga)
    disconnect();

    const { latitude, longitude } = currentRegion;
    // passando para o back a posição atual do usuário e as tecnologias que ele está buscando
    connect(
      latitude,
      longitude,
      techs,
    );
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;
  
    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      }
    });

    setDevs(response.data.devs);
    setupWebSocket(); // muito provavelmente vai ser executada ANTES de ter setado os Devs acima
      // solução para ESSE PROBLEMA: cria-se mais um useEffect e coloca o dev no array de dependências, quando ele
      // finalmente for mudado, executa o subscribeToNewDevs()!
  }

  function handleRegionChanged(region) {
    console.log(region);
    setCurrentRegion(region);
  }

  // enquanto o mapa não tiver pronto pra ser mostrado com 
  // a região atual do usuário, não mostrá-lo!
  if (!currentRegion) { 
    return null;
  }

  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
          key={dev._id}
          coordinate={{ 
            longitude: dev.location.coordinates[0],
            latitude: dev.location.coordinates[1], 
          }}
        >
          <Image 
            style={styles.avatar} 
            source={{ uri: dev.avatar_url }}
          />
          
          {/* toda vez que clicar na imagem (marker), o callout vai mostrar alguma coisa */}
          <Callout onPress={() => {
            // vai executar a navegação para o perfil do usuário
            navigation.navigate('Profile', { github_username: dev.github_username });

          }}>
            <View style={styles.callout}>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devBio}>{dev.bio}</Text>
              <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
            </View>
          </Callout>
        </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff",
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  devBio: {
    color: "#666",
    marginTop: 5,
  },
  devTechs: {
    marginTop: 5,
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
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
      height: 4
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