// 🚀 Startup log
console.log("🚀 Starting server script...");

// Load core modules
const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');

// Set up database connection
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
const pool = new Pool({ connectionString: connectionString });

// Serve the gradebook page at the root route BEFORE static middleware
app.get('/', function (req, res) {
    console.log("🔍 Serving AMeddaugh_gradebook.html...");
    res.sendFile(path.join(__dirname, 'public', 'AMeddaugh_gradebook.html'));
});

// Serve static files (like gradebook.js) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get student grades
app.get('/api/grades', function (req, res) {
    pool.query(
        `SELECT Students.student_id, first_name, last_name, AVG(assignments.grade) as total_grade
         FROM Students
         LEFT JOIN Assignments ON Assignments.student_id = Students.student_id
         GROUP BY Students.student_id
         ORDER BY total_grade DESC`,
        [],
        function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            result.rows.forEach(function (row) {
                console.log(`Student Name: ${row.first_name} ${row.last_name}`);
                console.log(`Grade: ${row.total_grade}`);
            });

            res.status(200).json(result.rows);
        }
    );
});

// Start the server
let server = app.listen(3000, function () {
    console.log("✅ App Server via Express is listening on port 3000");
    console.log("🔗 Open your browser to http://localhost:3000/");
    console.log("🛑 To quit, press CTRL + C");
});
