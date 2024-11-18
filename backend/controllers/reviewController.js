const db = require("../config/db");

// Insert a new review
exports.addReview = (req, res) => {
  const { paperId, relevancy, originality, technical, feedback } = req.body;

  db.query(
    "INSERT INTO Review (Paper_ID, Relevancy_Score, Originality_Score, Technical_Quality, Feedback) VALUES (?, ?, ?, ?, ?)",
    [paperId, relevancy, originality, technical, feedback],
    (err, result) => {
      if (err) {
        console.error("Error inserting review:", err);
        res.status(500).json({ error: "Error inserting review" });
      } else {
        res.status(201).json({ message: "Review submitted successfully" });
      }
    }
  );
};
