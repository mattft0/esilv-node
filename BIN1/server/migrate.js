const { connection } = require("./models");

connection.sync().then(() => console.log("Database migrated"));
