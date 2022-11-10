const fs = require("fs/promises");
const constants = require("fs").constants;

const db = {
  select(criteria) {
    return Promise.resolve(["1", "5"].includes(criteria.id));
  },
  insert(data) {
    return Promise.resolve(1);
  },
};

fs.access("./test", constants.R_OK)
  .then(() => fs.readFile("./test"))
  .then((data) => {
    data = data.toString();
    const lines = data.split("\n");
    return Promise.all(
      lines.map((line) => {
        const [id, name] = line.split(";");
        return db.select({ id: id }).then((result) => {
          if (!result) {
            return db.insert({ id, name });
          }
        });
      })
    );
  })
  .then(() => console.log("end of script"));
