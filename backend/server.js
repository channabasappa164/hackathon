const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "conference_db", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit();
  }
  console.log("Connected to MySQL database.");
});

// Create Tables
app.get("/api/create-tables", (req, res) => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Author (
        Author_ID INT AUTO_INCREMENT PRIMARY KEY,
        FullName VARCHAR(255) NOT NULL,
        Mobile_No VARCHAR(15) NOT NULL,
        Email_ID VARCHAR(255) UNIQUE NOT NULL,
        DOB DATE NOT NULL,
        Organization VARCHAR(255),
        Specialization VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS Track (
        Track_ID INT AUTO_INCREMENT PRIMARY KEY,
        Track_Name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Paper (
        Paper_ID INT AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,
        Abstract TEXT NOT NULL,
        Keywords TEXT NOT NULL,
        Submission_Date DATE NOT NULL,
        Author_ID INT NOT NULL,
        Status ENUM('Submitted', 'Under Review', 'Accepted', 'Rejected') DEFAULT 'Submitted',
        Track_ID INT NOT NULL,
        FOREIGN KEY (Author_ID) REFERENCES Author(Author_ID) ON DELETE CASCADE,
        FOREIGN KEY (Track_ID) REFERENCES Track(Track_ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Reviewer (
        Reviewer_ID INT AUTO_INCREMENT PRIMARY KEY,
        FullName VARCHAR(255) NOT NULL,
        Specialization VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Review (
        Review_ID INT AUTO_INCREMENT PRIMARY KEY,
        Paper_ID INT NOT NULL,
        Relevancy_Score INT CHECK (Relevancy_Score BETWEEN 1 AND 10),
        Originality_Score INT CHECK (Originality_Score BETWEEN 1 AND 10),
        Technical_Quality INT CHECK (Technical_Quality BETWEEN 1 AND 10),
        Feedback TEXT NOT NULL,
        FOREIGN KEY (Paper_ID) REFERENCES Paper(Paper_ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Schedule (
        Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
        Paper_ID INT NOT NULL,
        DateTime DATETIME NOT NULL,
        FOREIGN KEY (Paper_ID) REFERENCES Paper(Paper_ID) ON DELETE CASCADE
    );
  `;

  db.query(createTablesQuery, (err, result) => {
    if (err) {
      console.error("Error creating tables:", err);
      res.status(500).send("Error creating tables.");
    } else {
      res.send("Tables created successfully.");
    }
  });
});

// API: Insert a Review
app.post("/api/reviews", (req, res) => {
  const { paperId, relevancy, originality, technical, feedback } = req.body;
  const insertReviewQuery = `
    INSERT INTO Review (Paper_ID, Relevancy_Score, Originality_Score, Technical_Quality, Feedback)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertReviewQuery,
    [paperId, relevancy, originality, technical, feedback],
    (err, result) => {
      if (err) {
        console.error("Error inserting review:", err);
        res.status(500).send("Error inserting review.");
      } else {
        res.send("Review submitted successfully.");
      }
    }
  );
});

// API: Get Paper Status
app.get("/api/papers/:id/status", (req, res) => {
  const paperId = req.params.id;
  const getStatusQuery = `
    SELECT Status FROM Paper WHERE Paper_ID = ?
  `;

  db.query(getStatusQuery, [paperId], (err, result) => {
    if (err) {
      console.error("Error fetching paper status:", err);
      res.status(500).send("Error fetching paper status.");
    } else {
      res.json(result[0]);
    }
  });
});

// Trigger Logic Emulation (Optional for Demo)
app.get("/api/trigger-simulation", (req, res) => {
  const updateStatusTrigger = `
    CREATE TRIGGER UpdatePaperStatus
    AFTER INSERT ON Review
    FOR EACH ROW
    BEGIN
        DECLARE review_count INT;
        DECLARE avg_score DECIMAL(5, 2);

        -- Count the total number of reviews for the paper
        SELECT COUNT(*) INTO review_count
        FROM Review
        WHERE Paper_ID = NEW.Paper_ID;

        -- If the paper has at least 3 reviews
        IF review_count >= 3 THEN
            -- Calculate the average score of all reviews for the paper
            SELECT AVG((Relevancy_Score + Originality_Score + Technical_Quality) / 3) INTO avg_score
            FROM Review
            WHERE Paper_ID = NEW.Paper_ID;

            -- Update the status of the paper based on the average score
            IF avg_score >= 7.0 THEN
                UPDATE Paper
                SET Status = 'Accepted'
                WHERE Paper_ID = NEW.Paper_ID;
            ELSE
                UPDATE Paper
                SET Status = 'Rejected'
                WHERE Paper_ID = NEW.Paper_ID;
            END IF;
        END IF;
    END;
  `;

  db.query(updateStatusTrigger, (err, result) => {
    if (err) {
      console.error("Error creating trigger:", err);
      res.status(500).send("Error creating trigger.");
    } else {
      res.send("Trigger created successfully.");
    }
  });
});

// Server Listening
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
