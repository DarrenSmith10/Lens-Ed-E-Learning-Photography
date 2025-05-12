require("dotenv").config();
const Sequelize = require("sequelize");

// Debug logging to verify environment values
console.log("📦 DB_NAME:", process.env.DB_NAME);
console.log("📦 DB_USERNAME:", process.env.DB_USERNAME);
console.log("📦 DB_HOST:", process.env.DB_HOST);

if (!process.env.DB_PASSWORD) {
  console.error("❌ Missing DB_PASSWORD in environment variables.");
  process.exit(1);
}

if (!process.env.DB_NAME) {
  console.error("❌ Missing DB_NAME in environment variables.");
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false, // Set to true to see SQL logs
  }
);

module.exports = sequelize;