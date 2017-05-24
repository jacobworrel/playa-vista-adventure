let data = {};

//schema to create location table
data.location = `CREATE TABLE IF NOT EXISTS location(
id INT PRIMARY KEY ,
longitude NUMERIC,
latitude NUMERIC,
place_name TEXT,
radius INTEGER
);`

//schema to create clue table
data.clue = `CREATE TABLE IF NOT EXISTS clue(
id INT PRIMARY KEY,
description TEXT,
location_id NUMERIC,
completed BOOLEAN
);`

//schema to create user table
data.user = `CREATE TABLE IF NOT EXISTS user(
curr_clue NUMERIC
);`

export default data;
