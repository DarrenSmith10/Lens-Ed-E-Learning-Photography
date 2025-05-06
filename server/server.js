const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "https://lens-ed-client.onrender.com", // frontend origin
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use(routes);

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

//Check if server is alive
// This is a simple endpoint to check if the server is alive
app.get("/", (req, res) => {
  res.send("Lens-Ed Backend is alive 🎯");
});
