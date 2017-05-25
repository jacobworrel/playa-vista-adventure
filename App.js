import React from 'react';
import haversine from './haversine.js';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import { MapView, Constants, Location, Permissions, SQLite } from 'expo';
import ClueDescription from './components/ClueDescription';
import ClueOverlay from './components/ClueOverlay';
import CheckInButton from './components/CheckInButton';
import ResetButton from './components/ResetButton';
import db from './controllers/db';
import StartButton from './components/StartButton';
import dbController from './controllers/dbController';

export default class App extends React.Component {
  state = {
    isGameStarted: false,
    clue: '',
    clueId: null,
    clueLocation: null,
    location: null,
    errorMessage: null,
    distance: 0,
    cluesCompleted: 0,
    checkinButtonColor: 'transparent',
    savedClue: false
  };
  //hi
  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
      this._watchPositionAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  //always gets current position
  _watchPositionAsync = async () => {
    await Location.watchPositionAsync({ enableHighAccuracy: true, distanceInterval: 4 },
      (location) => {
        this.setState({ location });
      });
  };


  _getSavedClue = () => {
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM user
                    INNER JOIN clue
                    ON user.curr_clue=clue.location_id
                    INNER JOIN location
                    ON clue.location_id=location.id;`, [],
        (_, result) => {
          console.log("success getting saved clue", result);
          if (result.rows.length) {
            let record = result.rows.item(0);
            console.log('record', record)
            this.setState({
              isGameStarted: true,
              clueId: record.id,
              clue: record.description,
              cluesCompleted: record.id - 1,
              clueLocation: {
                latitude: record.latitude,
                longitude: record.longitude,
                placename: record.place_name,
                radius: record.radius
              }
            });
          }
        },
        (_, err) => console.log("error getting new clue", err)
      )
    })
  }

  _getNewClue = () => {
    db.transaction(tx => {
      tx.executeSql(`SELECT *
                     FROM clue INNER JOIN location
                     ON clue.location_id = location.id
                     WHERE completed = 0;`, [],
        (_, result) => {
          if (result.rows.length) {
            let record = result.rows.item(this.state.cluesCompleted);
            this.setState({
              isGameStarted: true,
              savedClue: true,
              clue: record.description,
              clueId: record.id,
              clueLocation: {
                latitude: record.latitude,
                longitude: record.longitude,
                placename: record.place_name,
                radius: record.radius
              }
            });
          }
        },
        (_, err) => console.log("error getting new clue", err)
      );
    });
  };

  _startPressed = () => {
    console.log('start pressed!');
    dbController.populate();
    this._getSavedClue();
    if (this.state.savedClue) {
      console.log('no saved clue')
      this._getNewClue();
    }
    this.setState({ isGameStarted: true });
  };

  _checkInPressed = () => {
    console.log('check in pressed!');
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM user`, [], (_, result) => console.log('user table content -->', result))
    })
    this._getLocationAsync();
    const distance = haversine.getDistance(this.state.location.coords.latitude, this.state.location.coords.longitude, this.state.clueLocation.latitude, this.state.clueLocation.longitude);
    this.setState({ distance })

    if (distance <= this.state.clueLocation.radius) {
      this._getNewClue();
      let completed = this.state.cluesCompleted;
      completed++;
      this.setState({ cluesCompleted: completed, checkinButtonColor: 'green' });
      this._toggleColor();
      db.transaction(tx => {
        tx.executeSql(`UPDATE user
                       SET curr_clue = ?;`, [++completed],
          (_, result) => console.log('updated curr_clue in user table', result),
          (_, err) => console.log("error updating user table", err)
        );
      });
    }
    else {
      console.log('location not found!');
      this.setState({checkinButtonColor: 'red'});
      this._toggleColor();
    }
  };

  _resetPressed = () => {
    db.transaction(tx => {
      tx.executeSql(`UPDATE user
                     SET curr_clue = ?;`, [1],
        (_, result) => console.log('updated curr_clue in user table', result),
        (_, err) => console.log("error updating user table", err)
      );
    });
  this.setState({isGameStarted: false,
                 cluesCompleted: 0,
                 checkinButtonColor: 'transparent'
               });
}

  _toggleColor = () => {
    setTimeout(() => {
      this.setState({checkinButtonColor: 'transparent'})
    }, 500)
  }

  render() {
    if (this.state.location == null) {
      return (<View style={styles.container} />);
    }
    else {
      return (

        <View style={styles.container}>
        <StatusBar hidden />
          <MapView
            style={styles.mapView}
            provider={'google'}
            region={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0,//0.0922,
              longitudeDelta: 0.01//0.0421,
            }}
          >
            <MapView.Marker
              image={require('./assets/cat.png')}
              coordinate={{
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude
              }}
            />
          </MapView>
          {
            this.state.isGameStarted
              ? null
              : <StartButton
                style={styles.startButton}
                startGame={this._startPressed}
              />
          }
          {
            this.state.isGameStarted &&
            <CheckInButton style={styles.checkInButton} checkIn={this._checkInPressed} checkinButtonColor={this.state.checkinButtonColor} />
          }
          {
            this.state.isGameStarted &&
            <ClueOverlay style={styles.clueOverlay} clue={this.state.clue} cluesCompleted={this.state.cluesCompleted} />
          }
          {
            this.state.isGameStarted &&
            <ResetButton style={styles.resetButton} reset={this._resetPressed} />
          }
        </View>
      );
    }
  }
}

//stylesheet for react-native
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapView: {
    flex: 30
  },
  clueOverlay: {
    height: 80,
    backgroundColor: '#01579B',
  },
  checkInButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center'
  },

  resetButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 40,
    width: 80,
    backgroundColor: 'purple'
  },

  startButton: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB6C1'
  }
});
