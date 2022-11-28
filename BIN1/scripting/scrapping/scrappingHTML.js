const client = require("https");
const { JSDOM } = require("jsdom");

const request = client.request(
  "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  {
    headers: {
      Accept: "text/html",
    },
  },
  (res) => {
    console.debug(res.socket.address());
    let data = Buffer.alloc(0);
    res.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
      console.debug("data request", chunk);
    });
    res.on("end", () => {
      console.debug("end request");
      // prepare data
      if (res.headers["content-type"].startsWith("application/json")) {
        data = data.toString();
        data = JSON.parse(data);
      }
      if (res.headers["content-type"].startsWith("text/html")) {
        data = data.toString();
        // Create DOM from data string
        data = new JSDOM(data);
        // Only get document for scrapping
        data = data.window.document;
      }

      // process data
      console.log(data);
      //  ==> Get th and first td of each tr
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
      console.log(result);
    });
    res.on("close", () => {
      console.log("close request");
    });
  }
);

request.end();
