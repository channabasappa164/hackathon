const express = require("express");
const { addReview } = require("../controllers/reviewController");

const router = express.Router();

// Add a new review
router.post("/", addReview);

module.exports = router;
