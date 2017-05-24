import Expo, { SQLite } from 'expo';
import data from './sqlLiteModels';

//create new database named projectDB
const db = Expo.SQLite.openDatabase('projectDB');

// db.transaction(tx => {
//   tx.executeSql(`DROP TABLE user;`);
// })

// create location, clue, and user data table
db.transaction(tx => {
  tx.executeSql(data.location, [], (_, result) => console.log('created location table', result),
    (_, error) => console.log('error creating location table', error));
  tx.executeSql(data.clue, [], (_, result) => console.log('created clue table', result),
    (_, error) => console.log('error creating clue table', result));
  tx.executeSql(data.user, [], (_, result) => console.log('created user table', result),
    (_, error) => console.log('error creating user table', result));
  //only run once first time you create database
  // tx.executeSql(`INSERT INTO user VALUES (?);`, [1],
  //   (_, result) => console.log('inserted curr_clue into user table', result),
  //   (_, error) => console.log('error inserting curr_clue into user table', result));
});

export default db;
