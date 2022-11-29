const Scrapper = require("./Scrapper");

const scrapper = new Scrapper(
  "https://worldcupjson.net/matches",
  {
    headers: {
      Accept: "application/json",
    },
  },
  (data) =>
    data
      .filter((match) => match.status !== "future_unscheduled")
      .map((match) => ({
        status: match.status,
        date: match.datetime,
        stage: match.stage_name,
        home: match.home_team.name,
        away: match.away_team.name,
        score: `${match.home_team.goals} - ${match.away_team.goals}`,
        winner: match.winner,
      }))
);

scrapper.scrap().then((scrappedData) => console.log(scrappedData));
