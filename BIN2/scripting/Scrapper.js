const https = require("https");

class Scrapper {
  constructor(url, options, callback) {
    this.url = url;
    this.options = options;
    this.callback = callback;
  }

  scrap() {
    return new Promise((resolve, reject) => {
      https
        .request(this.url, this.options, (res) => {
          let bufferList = [];
          res.on("data", (data) => {
            bufferList.push(data);
          });
          res.on("error", (err) => reject(err));
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
            }
            if (/application\/json/.test(res.headers["content-type"])) {
              // Format data
              data = data.toString();
              data = JSON.parse(data);
            }

            resolve(this.callback(data));
          });
        })
        .end();
    });
  }
}

module.exports = Scrapper;
