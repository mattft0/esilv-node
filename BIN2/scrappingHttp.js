const https = require("https");

const req = https.request(
  "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  {
    method: "GET",
  },
  (res) => {
    console.log(res.statusCode);

    let bufferList = [];
    res.on("data", (data) => {
      bufferList.push(data);
    });

    res.on("end", () => {
      let data = Buffer.concat(
        bufferList,
        bufferList.reduce((acc, item) => acc + item.length, 0)
      );

      if (/(html|xml)/.test(res.headers["content-type"])) {
        // Format data
        data = data.toString();
        const { JSDOM } = require("jsdom");
        data = new JSDOM(data).window.document;

        // process data
        data = Array.from(
          data.querySelectorAll(
            "table tbody tr:not(:first-child) th, table tbody tr:not(:first-child) td:first-of-type"
          )
        );
        data = data.reduce((acc, item, index) => {
          if (index % 2 === 0) {
            acc[item.textContent.trim()] = data[index + 1].textContent.trim();
          }
          return acc;
        }, {});
        console.log(data);
      }

      console.log("End of request");
    });
  }
);

req.end();
