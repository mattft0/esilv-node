const { connection } = require("./models");

connection
  .sync({
    alter: true,
  })
  .then(() => console.log("Database migrated"))
  .then(() => connection.close());
