//app.js

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;

const db = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7763540",
  password: "QNsYA36zDh",
  database: "sql7763540",
});

/*const thomg = ``
app.get("/users", (req, res) => { 
  db.query(thomg,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});*/

app.get('/api/workout', (req, res) => {
  const sql = `
      SELECT w.id AS workout_id, w.name AS workout_name, 
             e.id AS exercise_id, e.name AS exercise_name, 
             e.reps, e.time, e.description, e.image_id
      FROM workouts w
      LEFT JOIN exercises e ON w.id = e.workout_id
  `;

  db.query(sql, (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }

      // Group exercises under each workout
      const workouts = {};
      results.forEach(row => {
          if (!workouts[row.workout_id]) {
              workouts[row.workout_id] = {
                  id: row.workout_id,
                  name: row.workout_name,
                  exercises: []
              };
          }

          if (row.exercise_id) { // If there are exercises
              workouts[row.workout_id].exercises.push({
                  id: row.exercise_id,
                  name: row.exercise_name,
                  reps: row.reps,
                  time: row.time,
                  description: row.description,
                  image_id: row.image_id
              });
          }
      });

      res.json(Object.values(workouts));
  });
});

app.get('/api/exercise/id/:id', (req, res) => {
  const exerciseId = req.params.id;

  const sql = `
      SELECT * FROM exercises 
      WHERE id = ? 
      LIMIT 1
  `;

  db.query(sql, [exerciseId], (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No exercise found with that ID' });
      }

      res.json(results[0]);
  });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
