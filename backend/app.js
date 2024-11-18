const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const paperRoutes = require("./routes/paperRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", reviewRoutes);

// Start the server
const PORT = 5007;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
