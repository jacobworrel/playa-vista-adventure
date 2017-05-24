import db from './db';

const dbController = {
  addEvent: (location, clue) => {
    db.transaction(tx => {

      tx.executeSql(`INSERT INTO location VALUES (?, ?, ?, ?, ?);`, 
      [location.id, location.latitude, location.longitude, location.placename, location.radius], 
      (_,result) => console.log("success inserting into location table", result), 
      (_,err) => console.log("error inserting into location table", err));

      tx.executeSql(`INSERT INTO clue VALUES (?, ?, ?, ?);`, 
      [clue.id, clue.description, location.id, clue.completed], 
      (_,result) => console.log("success inserting into clue table", result), 
      (_,err) => console.log("error inserting into clue table", err));
    })
  },
  populate: function() {
    this.addEvent({id:1, latitude:-118.4222983, longitude:33.979500, placename:"CodeSmith", radius:80}, 
                  {id:1, description:"Home for the next 12 weeks...", completed:0});
    this.addEvent({id:2, latitude:-118.422547, longitude:33.977925, placename:"4hr zone", radius:160}, 
                  {id:2, description:"Juniors come here every 4 hours", completed:0});
    this.addEvent({id:3, latitude:-118.4182312, longitude:33.9767221, placename:"Whole Foods", radius:130}, 
                  {id:3, description:"Popular choice for lunch...", completed:0});
    this.addEvent({id:4, latitude:-118.4267177, longitude:33.9671522, placename:"Playa Vista Sports Park", radius:400}, 
                  {id:4, description:"Where seniors got their butts kicked...", completed:0});
  }
}

export default dbController;