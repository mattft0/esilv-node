const Sequelize = require("sequelize");

const DATABASE_URL =
  process.env.DATABASE_URL || "mysql://user:password@localhost:3306/app";

const connection = new Sequelize(DATABASE_URL);

connection.authenticate().then(() => console.log("Database connected"));

module.exports = connection;
