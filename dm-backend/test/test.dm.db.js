//test/test.dm.db.js

//creates the database for api testing

//import sqlite3
const sqlite = require('sqlite3').verbose();

//create database connection 
const connection = new sqlite.Database('./testdb.db',
    (error) => {
        if (error) {
            console.log('error establishing database connection for testing...', error);
        }
        else {
            console.log('CONNECTED!!! Test Database Connection established...');
            //enable use of foreign keys in database
            connection.get('pragma foreign_keys=on');


        }
    });

//export database connection
module.exports = connection;