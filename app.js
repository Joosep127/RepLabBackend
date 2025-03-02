//app.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

const db = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7763540',
    password: 'QNsYA36zDh',
    database: 'your-db' 
  });

  app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    });