// Lire un fichier ensuite checker que chaque ligne a été insérée dans une BDD si non, l'insérer
const fs = require("fs/promises");
const { constants } = require("fs");

// Mock DB promise
const db = {
  async select(criteria) {
    return ["1", "5"].includes(criteria.id)
      ? [{ id: criteria.id, name: "Test" + criteria.id }]
      : [];
  },
  async insert(data) {
    return 1;
  },
  async update(criteria, data) {
    return 1;
  },
};

// Declare async function
(async () => {
  const file = "./test";
  // Check if file is readable
  if (await fs.access(file, constants.R_OK)) {
    // Read the file content
    let data = await fs.readFile(file);
    // Buffer to String
    data = data.toString();
    // Split lines
    const lines = data.split("\n").map((line) => line.split(";"));
    // For each lines
    for (const [id, name] of lines) {
      // Check if line is in db
      const rows = await db.select({ id });
      if (!rows.length) {
        // Insert it if not
        await db.insert({ id, name });
      } else {
        // If in DB check last value equals current value
        if (rows[0].name !== name) {
          await db.update({ id: rows[0].id }, { name });
        }
      }
    }
  }
  console.log("End of script");
})(); // use it directly
