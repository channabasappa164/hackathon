const mysql = require("mysql");

// Create a MySQL connection pool
const db = mysql.createPool({
  host: "localhost", // Replace with your database host
  user: "root", // Replace with your MySQL username
  password: "Channa164$", // Replace with your MySQL password
  database: "hackathon", // Replace with your database name
});

module.exports = db;
