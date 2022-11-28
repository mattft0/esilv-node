const client = require("https");

const request = client.request(
  "https://worldcupjson.net/matches",
  {
    headers: {
      Accept: "application/json",
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

      // process data
      console.log(
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
    });
    res.on("close", () => {
      console.log("close request");
    });
  }
);

request.end();
