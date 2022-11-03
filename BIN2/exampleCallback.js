// Lire un fichier ensuite checker que chaque ligne a été insérée dans une BDD si non, l'insérer
const fs = require("fs");

const file = "./test";
// Check if file is readable
fs.access(file, fs.constants.R_OK, (err) => {
  if (err) console.log("File " + file + " is not readable", err);
  else {
    // Read the file content
    fs.readFile(file, (err, data) => {
      if (err) console.log("Error while reading the file " + file, err);
      data = data.toString();
      const lines = data.split("\n");
      console.log(lines);
    });
  }
});
