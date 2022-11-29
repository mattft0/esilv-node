const Scrapper = require("./Scrapper");
const { copyFile, unlink } = require("fs/promises");
const path = require("path");

const scrapper = new Scrapper(
  "https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/logo-desktop.png",
  {},
  async (data) => {
    console.log(data);
    const filename = path.basename(data);
    const dest = path.join(process.cwd(), filename);
    await copyFile(data, dest);
    await unlink(data);
    return dest;
  }
);

scrapper.scrap().then((scrappedData) => console.log(scrappedData));
