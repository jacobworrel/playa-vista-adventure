import Expo, { SQLite } from 'expo';
import data from './sqlLiteModels';

//create new database named projectDB
const db = Expo.SQLite.openDatabase('projectDB');

//REFACTOR IDEA
db.transaction(tx => {
  tx.executeSql(data.location);
  tx.executeSql(data.clue);
  tx.executeSql(data.user);
});

export default db;
