const https = require("https");

const req = https.request(
  "https://api.www.root-me.org/challenges",
  {
    method: "GET",
    headers: {
      Cookie:
        "api_key=722535_51a9e752eca992f12c221d604f360ab4d90acd19d07d2e5fdb8d5f7fb300eaf6",
    },
  },
  (res) => {
    console.log(res.statusCode);

    console.log(res);
  }
);

req.end();
