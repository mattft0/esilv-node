// Lire un fichier ensuite checker que chaque ligne a été insérée dans une BDD si non, l'insérer
const fs = require("fs");

// Mock DB callback
const db = {
  select(criteria, callback) {
    setTimeout(
      () =>
        callback(
          undefined,
          ["1", "5"].includes(criteria.id)
            ? [{ id: criteria.id, name: "Test" + criteria.id }]
            : []
        ),
      0
    );
  },
  insert(data, callback) {
    setTimeout(() => callback(undefined, 1), 0);
  },
  update(criteria, data, callback) {
    setTimeout(() => callback(undefined, 1), 0);
  },
};

const file = "./test";
// Check if file is readable
fs.access(file, fs.constants.R_OK, (err) => {
  if (err) console.log("File " + file + " is not readable", err);
  else {
    // Read the file content
    fs.readFile(file, (err, data) => {
      if (err) console.log("Error while reading the file " + file, err);
      // Buffer to String
      data = data.toString();
      const lines = data.split("\n").map((line) => line.split(";"));
      let count = 0;
      // For each lines
      for (let [id, name] of lines) {
        // Check if line is in db
        db.select({ id: id }, (_, rows) => {
          if (!rows.length) {
            // Insert it if not
            db.insert({ id, name }, (err, nbInserted) => {
              if (nbInserted) {
                count++;
                if (count === lines.length) {
                  console.log("End of script (inserted)");
                }
              }
            });
          } else {
            // If in DB check last value equals current value
            if (rows[0].name !== name) {
              db.update({ id: rows[0].id }, { name }, (err, nbUpdated) => {
                if (nbUpdated) {
                  count++;
                  if (count === lines.length) {
                    console.log("End of script (updated line)");
                  }
                }
              });
            } else {
              count++;
              if (count === lines.length) {
                console.log("End of script (skipped line)");
              }
            }
          }
        });
      }
    });
  }
});
