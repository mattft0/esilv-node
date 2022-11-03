// Lire un fichier et ajouter en base de données les lignes de logs qui ne sont pas déjà présentes
const fs = require("fs");

const db = {
  select(criteria, callback) {
    setTimeout(() => callback(undefined, ["1", "5"].includes(criteria.id)), 0);
  },
  insert(data, callback) {
    setTimeout(() => callback(undefined, 1), 0);
  },
};

// Check if file exists and is readable
fs.access("./test", fs.constants.R_OK, (e) => {
  if (e) console.error("File ./test not readable", e);
  else {
    // Read file and return all data as a Buffer
    fs.readFile("./test", (e, data) => {
      if (e) console.error("Cannot read ./test", e);
      else {
        // Exchange Buffer to String
        data = data.toString();
        const lines = data.split("\n");
        // For each lines
        let count = 0;
        for (const line of lines) {
          const [id, name] = line.split(";");
          // Check if id is in DB
          db.select({ id: id }, (err, result) => {
            if (err) console.error(err);
            else {
              // Insert data if not exists
              if (!result) {
                db.insert({ id, name }, (err, nbInserted) => {
                  if (err) console.error(err);
                  else {
                    count++;
                    if (count === lines.length) {
                      console.log("End of script (insert)");
                    }
                  }
                });
              } else {
                // If data exists, skip
                count++;
                if (count === lines.length) {
                  console.log("End of script (skip)");
                }
              }
            }
          });
        }
      }
    });
  }
});
