/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View, PermissionsAndroid, Text, Button, StatusBar} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loja: 'Dê sua localização!',
      backgroundColor: getRandomColor(),
    };
    this.alterarLoja = this.alterarLoja.bind(this);
  }

  alterarLoja(loja) {
    this.setState({loja});
  }

  carregarLojaPeloGps = () => {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    let loja = 'Não encontrada :/';

    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          axios
            .get(
              `http://192.168.0.14:8080/lojas/latitude/${
                position.coords.latitude
              }/longitude/${position.coords.longitude}`,
            )
            .then(response => {
              loja = response.data.nome;
              this.setState({loja});
            });
        },
        error => {
          // See error code charts below.
          console.warn(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
    this.setState({backgroundColor: getRandomColor()});
  };

  render() {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: this.state.backgroundColor,
        }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={this.state.backgroundColor}
        />
        <View style={{flex: 1, top: '40%'}}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#FFF',
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            {this.state.loja}
          </Text>
          <Button title={'carregar loja'} onPress={this.carregarLojaPeloGps} />
        </View>
      </View>
    );
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default App;
