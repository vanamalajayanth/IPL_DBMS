export const getFiles = () => {
  const files = [];
  const fileObjects = Deno.readDirSync("../data");

  fileObjects.forEach((file) => {
    if (file.name.endsWith(".json")) {
      files.push(file.name);
    }
  });

  return files;
};

const parseEventDetails = (event) =>
  Object.hasOwn(event, "match_number")
    ? ["league", event.match_number]
    : event.stage.split(" ");

export const extractMatchDetails = (data) => {
  const matchData = [];
  const playerOfTheMatch = Object.hasOwn(data.info, "player_of_match")
    ? data.info.player_of_match[0]
    : null;
  const [matchStage, matchNumber] = parseEventDetails(data.info.event);
  matchData.push(data.info.season);
  matchData.push(data.info.dates[0]);
  matchData.push(matchStage);
  matchData.push(+matchNumber || 0);
  matchData.push(data.info.teams[0]);
  matchData.push(data.info.teams[1]);
  matchData.push(data.info.toss.winner);
  matchData.push(data.info.toss.decision);
  matchData.push(playerOfTheMatch);
  matchData.push(data.info.outcome?.winner || null);
  matchData.push(data.info.venue);
  matchData.push(data.info.outcome?.by?.wickets || null);
  matchData.push(data.info.outcome?.by?.runs || null);

  return matchData;
};

export const extractMatchPlayersDetails = (data) => {
  const [matchStage, matchNumber] = parseEventDetails(data.info.event);
  const [team1, team2] = data.info.teams;
  const team1Players = data.info.players[team1];
  const team2Players = data.info.players[team2];
  const matchdate = data.info.dates[0];

  const team1Details = team1Players.map((player) => [
    matchdate,
    matchStage,
    +matchNumber || 0,
    team1,
    player,
  ]);
  const team2Details = team2Players.map((player) => [
    matchdate,
    matchStage,
    +matchNumber || 0,
    team2,
    player,
  ]);

  return team1Details.concat(team2Details);
};

export const extractRefereeDetails = (data) => {
  const [matchStage, matchNumber] = parseEventDetails(data.info.event);
  const matchdate = data.info.dates[0];
  const refereeDetails = data.info.officials;

  return Object.entries(refereeDetails).flatMap((referee) =>
    referee[1].map((names) => [
      matchdate,
      matchStage,
      +matchNumber || 0,
      referee[0],
      names,
    ])
  );
};

export const extractDeliveryDetails = (data) => {
  const [matchStage, matchNumber] = parseEventDetails(data.info.event);
  const matchdate = data.info.dates[0];
  const innings = data.innings;
  const deliveryData = [];
  const dismissals = [];
  const extras = [];

  for (let index = 0; index < innings.length; index++) {
    const inningNumber = index + 1;
    const overs = innings[index].overs;

    for (const overObj of overs) {
      const currentOver = overObj.over;
      const deliveries = overObj.deliveries;
      let deliveryNumber = 0;
      let ballNumber = 0;

      for (const delivery of deliveries) {
        let extraType = null;
        let extraRuns = 0;
        deliveryNumber += 1;
        ballNumber += 1;

        if ("extras" in delivery) {
          extraType = Object.keys(delivery.extras)[0];
          extraRuns = delivery.runs.extras;
          ballNumber -= 1;
          extras.push([
            matchdate,
            matchStage,
            +matchNumber || 0,
            inningNumber,
            currentOver,
            deliveryNumber,
            extraType,
            extraRuns,
          ]);
        }

        if ("wickets" in delivery) {
          dismissals.push([
            matchdate,
            matchStage,
            +matchNumber || 0,
            inningNumber,
            currentOver,
            deliveryNumber,
            delivery.wickets[0].player_out,
            delivery.bowler,
            delivery.wickets[0].fielders?.at(0)?.name || null,
            delivery.wickets[0].kind,
          ]);
        }

        deliveryData.push([
          matchdate,
          matchStage,
          +matchNumber || 0,
          inningNumber,
          currentOver,
          deliveryNumber,
          ballNumber,
          delivery.batter,
          delivery.bowler,
          delivery.non_striker,
          delivery.runs.batter,
        ]);
      }
    }
  }

  return [deliveryData, dismissals,extras];
};

// extractDeliveryDetails(
//   JSON.parse(Deno.readTextFileSync("../sampleData/335982.json"))
// );
