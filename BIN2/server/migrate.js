const { connection } = require("./models");

connection
  .sync()
  .then(() => console.log("Database synced"))
  .then(() => connection.close());
