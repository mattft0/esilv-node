const Scrapper = require("./Scrapper");

const scrap = new Scrapper(
  "https://api.www.root-me.org/challenges?debut_challenges=50",
  {
    method: "GET",
    headers: {
      Cookie:
        "api_key=722535_51a9e752eca992f12c221d604f360ab4d90acd19d07d2e5fdb8d5f7fb300eaf6",
    },
  },
  // process data
  (data) => {
    return Object.values(data[0]).map((c) => ({
      id: c.id_challenge,
      title: c.titre,
    }));
  }
);

scrap.scrap().then((data) => console.log(data));
