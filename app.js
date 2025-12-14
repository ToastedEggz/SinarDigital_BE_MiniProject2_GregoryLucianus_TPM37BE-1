const express = require("express");
const path = require("path");
require("dotenv").config();

const bookmarkRoutes = require("./src/routes/bookmarkRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/bookmarks", bookmarkRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Bookmark Maker API is running");
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
