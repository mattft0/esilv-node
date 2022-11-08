const https = require("https");

const req = https.request(
  "https://api.www.root-me.org/challenges?debut_challenges=50",
  {
    method: "GET",
    headers: {
      Cookie:
        "api_key=722535_51a9e752eca992f12c221d604f360ab4d90acd19d07d2e5fdb8d5f7fb300eaf6",
    },
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

      if (/application\/json/.test(res.headers["content-type"])) {
        // Format data
        data = data.toString();
        data = JSON.parse(data);
      }
      // process data
      console.log(
        Object.values(data[0]).map((c) => ({
          id: c.id_challenge,
          title: c.titre,
        }))
      );
      console.log("End of request");
    });
  }
);

req.end();
