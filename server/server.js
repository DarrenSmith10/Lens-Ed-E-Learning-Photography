const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();



app.use(cors({
  origin: "https://lens-ed-e-learning-photography.onrender.com",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Backend API routes
app.use("/api", routes);

// Catch-all to support React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const routes = require("./routes"); // Adjust as needed to your actual router file

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});