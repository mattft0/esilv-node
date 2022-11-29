const Scrapper = require("./Scrapper");

const scrapper = new Scrapper(
  "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  {
    headers: {
      Accept: "text/html",
    },
  },
  async (data) => {
    let result = {};
    const nodes = data.querySelectorAll(
      "table tbody tr:not(:first-child) > th, table tbody tr:not(:first-child) > td:first-of-type"
    );
    nodes.forEach((node, index) => {
      if (index % 2 !== 0) return;
      const code = node.textContent.trim();
      const message = nodes[index + 1].textContent.trim();
      result[code] = message;
    });
    return result;
  }
);

scrapper.scrap().then(console.log);
