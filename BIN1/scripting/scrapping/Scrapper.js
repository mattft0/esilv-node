const https = require("https");
const http = require("http");
const { mkdtempSync, writeFileSync } = require("fs");
const { JSDOM } = require("jsdom");
const path = require("path");
const os = require("os");

function Scrapper(url, options = {}, callback = (data) => data) {
  this.scrap = function () {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith("https") ? https : http;
      protocol
        .request(url, options, (response) => {
          let data = Buffer.alloc(0);
          response.on("data", (chunk) => {
            data = Buffer.concat([data, chunk]);
          });
          response.on("end", () => {
            // prepare data
            if (
              response.headers["content-type"].startsWith("application/json")
            ) {
              data = data.toString();
              data = JSON.parse(data);
            }
            if (response.headers["content-type"].startsWith("text/html")) {
              data = data.toString();
              // Create DOM from data string
              data = new JSDOM(data);
              // Only get document for scrapping
              data = data.window.document;
            }

            if (
              response.headers["content-type"].startsWith("image/") ||
              response.headers["content-type"].startsWith("video/") ||
              response.headers["content-type"].startsWith("audio/")
            ) {
              const tempDir = mkdtempSync(path.join(os.tmpdir(), "scrapper-"));
              const filename = path.basename(url);
              const filepath = path.join(tempDir, filename);
              writeFileSync(filepath, data);
              data = filepath;
            }

            // process data
            const result = callback(data);
            if (result instanceof Promise) {
              result
                .then((dataCallback) => resolve(dataCallback))
                .catch((err) => reject(err));
            } else {
              resolve(result);
            }
          });
        })
        .end();
    });
  };
}

module.exports = Scrapper;
