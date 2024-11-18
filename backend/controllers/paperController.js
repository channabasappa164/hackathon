const db = require("../config/db");

// Get the status of a specific paper
exports.getPaperStatus = (req, res) => {
  const paperId = req.params.id;

  db.query(
    "SELECT Status FROM Paper WHERE Paper_ID = ?",
    [paperId],
    (err, result) => {
      if (err) {
        console.error("Error fetching paper status:", err);
        res.status(500).json({ error: "Error fetching paper status" });
      } else {
        res.status(200).json(result[0]);
      }
    }
  );
};
