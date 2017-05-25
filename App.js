import React from 'react';
import haversine from './haversine.js';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import { MapView, Constants, Location, Permissions, SQLite } from 'expo';
import ClueDescription from './components/ClueDescription';
import ClueOverlay from './components/ClueOverlay';
import StartButton from './components/StartButton';
import CheckInButton from './components/CheckInButton';
import ResetButton from './components/ResetButton';
import db from './controllers/db';
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

    console.log('getting saved clue');
    // If user played before, continue where the user left off.
    db.transaction(async (tx) => {

      //define executeSql
       function getCurrClue() {
        return new Promise((resolve, reject) => {
          tx.executeSql('select curr_clue from user;', [], (_, result) => resolve(result), reject);
        });
      }

       function getClueDescript(clueId) {
        return new Promise((resolve, reject) => {
          tx.executeSql(`select * from clue inner join on location where clue.location_id = location.id and clue.id = ${clueId.rows.item(0).curr_clue};`,
            [], (_, result) => {
              resolve(result)
            }, (_, res) => {
              reject(res)
            });
        });
      }

      //call executeSql to get promise
      let curr_clue = await getCurrClue();

      let curr_description = await getClueDescript(curr_clue)
      .then((res) => {
      })

      // let curr_description = await getClueDescript(curr_clue)


      //   curr_cluePromise
      //   .then(result => {
      //   if (result.rows.length) {
      //     let clueId = result.rows.item(0);

      //     let clueDescriptPromise = getClueDescript();
      //     clueDescriptPromise
      //       .then(description => {
      //         console.log('final result', description);
      //       });
      //   }
      //   else {
      //     console.log('no clue found!!!')
      //     return false;
      //   }
      // })
    }, (err) => console.log("error in getsavedclue", err), (...x) => console.log("success in getsavedclue", x));
  };
  // _getSavedClue = () => {
  //   console.log('getting saved clue');
  //   // If user played before, continue where the user left off.
  //   db.transaction(tx => {
  //     console.log("getsavedclue TX --->", tx)
  //     tx.executeSql('select curr_clue from user;', [], (_, result) => {
  //         console.log("inside tx.executeSQL getSavedClue result --->", result)
  //         if (result.rows.length) {
  //           let clueId = result.rows.item(0);
  //           db.transaction(getClueDescription => {
  //             console.log("db transaction getClueDescription --->", getClueDescription)
  //             getClueDescription.executeSql(`select * from clue inner join on location where clue.location_id = location.id and clue.id = ?;`,
  //               [clueId],
  //               (_, description_Result) => {
  //                 if (description_Result.rows.length) {
  //                   let record = description_Result.rows.item(0);
  //                   console.log(record);
  //                   this.setState({
  //                     isGameStarted: true,
  //                     clue: record.description,
  //                     clueId: clueId,
  //                     clueLocation: {
  //                       latitude: record.latitude,
  //                       longitude: record.longitude,
  //                       placename: record.place_name,
  //                       radius: record.radius
  //                     }
  //                   });
  //                 }
  //                 return true;
  //               });
  //           });
  //         }
  //         else {
  //           console.log('no clue found!!!')
  //           return false;
  //         }
  //       });
  //   }, (err) => console.log("error in getsavedclue", err), (...x) => console.log("success in getsavedclue", x));
  // };

  _getNewClue = () => {
    db.transaction(tx => {
      tx.executeSql(`select *
                     from clue inner join location on clue.location_id = location.id where completed = 0;`,
        [],
        (_, result) => {
          if (result.rows.length) {
            let randIndex = Math.floor(Math.random() * result.rows.length);

            if (this.state.cluesCompleted === 0)
              randIndex = 0;

            let record = result.rows.item(randIndex);
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
      this.setState({ cluesCompleted: completed });
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
    }
  };

  _resetPressed = () => {
    console.log('reset pressed!');
    this.setState({isGameStarted: false,
                   cluesCompleted: 0
                 });
  }

  render() {
    if (this.state.location == null) {
      return (<View style={styles.container} />);
    }
    else {
      return (

        <View style={styles.container}>
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
            <MapView.Circle
              radius={20}
              fillColor={'#00F'}
              center={{
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
            <CheckInButton style={styles.checkInButton} checkIn={this._checkInPressed} />
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
    height: 160,
    width: 80,
    position: 'absolute',
    bottom: 40,
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
    backgroundColor: 'yellow'
  }
});
