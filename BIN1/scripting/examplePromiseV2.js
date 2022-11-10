const fs = require("fs/promises");
const constants = require("fs").constants;

const db = {
  async select(criteria) {
    return ["1", "5"].includes(criteria.id);
  },
  async insert(data) {
    return 1;
  },
};

(async () => {
  await fs.access("./test", constants.R_OK);
  let data = await fs.readFile("./test");
  data = data.toString();
  const lines = data.split("\n").map((l) => l.split(";"));
  await Promise.all(
    lines.map(async ([id, name]) => {
      const result = await db.select({ id: id });
      if (!result) {
        await db.insert({ id, name });
      }
    })
  );
  console.log("end of script");
})();
