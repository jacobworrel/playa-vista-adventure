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

export default dbController;