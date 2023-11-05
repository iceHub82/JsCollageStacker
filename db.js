const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var cors = require('cors');
const app = express();
app.use(cors());

// Connecting Database 
let db = new sqlite3.Database('./db.sqlite', (err) => {
    if(err) { 
        console.log("Error Occurred - " + err.message);
    } 
    else{ 
        console.log("DataBase Connected");
    } 
})

db.serialize(() => {
    // db.run('CREATE TABLE IF NOT EXISTS pages (pageId INTEGER PRIMARY KEY, projectId INTEGER NOT NULL, content TEXT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS projects (projectId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created DATETIME NOT NULL, updated DATETIME NULL)')

    // db.run('DROP TABLE pages');
    db.run('CREATE TABLE IF NOT EXISTS pages (pageId INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NULL, projectId INTEGER, FOREIGN KEY(projectId) REFERENCES projects (projectId))')

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});




app.get('/' , (req , res) => { 
    res.send('bitch')
}) 
    
app.listen(4000 , () => { 
    console.log("server started")
})