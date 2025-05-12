const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();

const routes = require("./routes");

// 🔐 Smart dynamic CORS config
const allowedOrigins = [
  "https://lens-ed-e-learning-photography.onrender.com",
  "https://lens-ed-fullstack.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight handling

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Backend API routes
app.use("/", routes);

// Catch-all to support React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});