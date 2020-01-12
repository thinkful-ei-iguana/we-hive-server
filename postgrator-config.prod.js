require("dotenv").config({
  path: "./.env.prod"
});

module.exports = {
  migrationDirectory: "migrations",
  driver: "pg",
  connectionString: process.env.DB_URL,
  ssl: true
};
