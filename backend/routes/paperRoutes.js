const express = require("express");
const { getPaperStatus } = require("../controllers/paperController");

const router = express.Router();

// Get paper status
router.get("/:id/status", getPaperStatus);

module.exports = router;
