/*
 * Create a dummy SQLite3 Database
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const passwordHash = require('password-hash');


// Read SQL files
var create_users_table_sql = fs.readFileSync(
    path.resolve(__dirname, 'sql', 'create_users_dummy_table.sql'), 'utf-8',
    function(err, data) {
        if (err) throw err;
        return data;
    }
);
var create_news_table_sql = fs.readFileSync(
    path.resolve(__dirname, 'sql', 'create_news_dummy_table.sql'), 'utf-8',
    function(err, data) {
        if (err) throw err;
        return data;
    }
);
var insert_news_table_sql = fs.readFileSync(
    path.resolve(__dirname, 'sql', 'insert_news_dummy_values.sql'), 'utf-8',
    function(err, data) {
        if (err) throw err;
        return data;
    }
);


// SQL routines execution
const db = new sqlite3.Database(':memory:', err => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Successful connection to the dummy database in memory");
});

db.exec(create_users_table_sql, function(err) {
    if (err) throw err;
    var hashedPassword = passwordHash.generate('demo');
    db.run('INSERT INTO users (username, password) VALUES ("demo", (?))', hashedPassword);    
});

db.exec(create_news_table_sql, function(err) {
    if (err) throw err;
    db.run(insert_news_table_sql);
});

module.exports = db;
