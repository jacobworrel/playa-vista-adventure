import db from './db';

const dbController = {
  addEvent: (location, clue) => {
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO location VALUES (${location.id}, ${location.latitude}, ${location.longitude}, ${location.placename}, ${location.radius})`);
      tx.executeSql(`INSERT INTO clue VALUES (${clue.id}, ${clue.description}, ${location.id}, ${clue.completed})`);
    })
  },
  populate: function() {
    this.addEvent({id:1, latitude:-118.4222983, longitude:33.979500, placename:"CodeSmith", radius:80}, {id:12, description:"Home for the next 12 weeks...", completed:0})
    this.addEvent({id:1, latitude:-118.4182312, longitude:33.9767221, placename:"Whole Foods", radius:130}, {id:11, description:"Popular choice for lunch...", completed:0})
    this.addEvent({id:1, latitude:-118.422547, longitude:33.977925, placename:"4hr zone", radius:160}, {id:13, description:"Every juniors nightmare (hint: Dont lose track of time!)...", completed:0})
    this.addEvent({id:1, latitude:-118.4267177, longitude:33.9671522, placename:"Playa Vista Sports Park", radius:400}, {id:14, description:"Where seniors got their butts kicked...", completed:0})
  }
}

//  getSavedClue = () => {
//     console.log('getting saved clue');
//     // If user played before, continue where the user left off.
//     db.transaction(tx => {
//       tx.executeSql('select curr_clue from user;', [], (_, result) => {
//           if (result.rows.length) {
//             let clueId = result.rows.item(0);
//           } else {
//             console.log('no clue found!!!')
//             return false;
//           }
//         });
//     }, (err) => console.log("error in getsavedclue", err), (...x) => console.log("success in getsavedclue", x));
//   };

export default dbController;

// db.transaction(tx => {
//               tx.executeSql(`select * from clue inner join on location where clue.location_id = location.id and clue.id = ?;`,
//                 [clueId],
//                 (_, description_Result) => {
//                   if (description_Result.rows.length) {
//                     let record = description_Result.rows.item(0);
//                     console.log(record);
//                     this.setState({
//                       isGameStarted: true,
//                       clue: record.description,
//                       clueId: clueId,
//                       clueLocation: {
//                         latitude: record.latitude,
//                         longitude: record.longitude,
//                         placename: record.place_name,
//                         radius: record.radius
//                       }
//                     });
//                   }
//                   return true;
//                 });
//             });
