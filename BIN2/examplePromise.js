// Lire un fichier ensuite checker que chaque ligne a été insérée dans une BDD si non, l'insérer
const fs = require("fs/promises");
const { constants } = require("fs");

// Mock DB promise
const db = {
  select(criteria) {
    return Promise.resolve(
      ["1", "5"].includes(criteria.id)
        ? [{ id: criteria.id, name: "Test" + criteria.id }]
        : []
    );
  },
  insert(data) {
    return Promise.resolve(1);
  },
  update(criteria, data) {
    return Promise.resolve(1);
  },
};

const file = "./test";
// Check if file is readable
fs.access(file, constants.R_OK)
  // Read the file content
  .then(() => fs.readFile(file))
  // Split lines
  .then((data) => {
    // Buffer to String
    data = data.toString();
    return data.split("\n").map((line) => line.split(";"));
  })
  .then((lines) =>
    Promise.all(
      // For each lines
      lines.map(([id, name]) =>
        // Check db
        db.select({ id }).then((rows) => {
          if (!rows.length) {
            // Insert it if not
            return db.insert({ id, name });
          } else {
            // If in DB check last value equals current value
            if (rows[0].name !== name) {
              return db.update({ id: rows[0].id }, { name });
            }
            // else skip
          }
        })
      )
    )
  )
  .then(() => console.log("End of script"));
