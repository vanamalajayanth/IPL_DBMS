// // Write code to convert your JSON to CSV here
import { getFiles } from "./utils.js";

const allPlayers = {};
const allReferees = {};
const allTeams = {};
const allVenues = {};
const allSeasons = {}; //need to be  changed.

const extractDetails = (data) => {
  const registry = data.info.registry.people;
  const [team1Players, team2Players] = Object.values(data.info.players);
  const currentPlayers = team1Players.concat(team2Players);

  for (const player of currentPlayers) {
    if (!Object.hasOwn(allPlayers, player)) { //need to change
      allPlayers[player] = {
        player_name: player,
        registry_id: registry[player],
      };
    }
  }

  const currentReferees = Object.values(data.info.officials).flatMap(
    (person) => person
  );

  for (const referee of currentReferees) {
    if (!Object.hasOwn(allReferees, referee)) {
      allReferees[referee] = {
        referee_name: referee,
        registry_id: registry[referee],
      };
    }
  }
  const [team1, team2] = data.info.teams;

  if (!Object.hasOwn(allTeams, team1)) {
    allTeams[team1] = {
      team_name: team1,
      team_abbrevation: team1
        .split(" ")
        .map((str) => str[0])
        .join(""),
    };
  }

  if (!Object.hasOwn(allTeams, team2)) {
    allTeams[team2] = {
      team_name: team2,
      team_abbrevation: team2
        .split(" ")
        .map((str) => str[0])
        .join(""),
    };
  }

  const season = data.info.season;
  if (!Object.hasOwn(allSeasons, season)) {
    allSeasons[season] = { season_year: season };
  }

  const city = data.info.city;
  const venue = data.info.venue;
  if (!Object.hasOwn(allVenues, venue)) {
    allVenues[venue] = { stadium: venue, city: city };
  }
};

const getData = () => {
  const refereeData = ["referre_name,registry_id"];
  const playerData = ["player_name,registry_id"];
  const teamsData = ["team_name,team_abbrevation"];
  const seasonsData = ["season_year"];
  const venuesData = ["stadium,city"];

  for (const referee of Object.values(allReferees)) {
    refereeData.push(`${referee.referee_name},${referee.registry_id}`);
  }

  for (const player of Object.values(allPlayers)) {
    playerData.push(`${player.player_name},${player.registry_id}`);
  }

  for (const team of Object.values(allTeams)) {
    teamsData.push(`${team.team_name},${team.team_abbrevation}`);
  }

  for (const season of Object.values(allSeasons)) {
    seasonsData.push(`${season.season_year}`);
  }

  for (const venue of Object.values(allVenues)) {
    venuesData.push(`"${venue.stadium}","${venue.city}"`);
  }

  return { playerData, refereeData, teamsData, seasonsData, venuesData };
};

const write = (details) => {
  const data = details.at(-1);
  Deno.writeTextFile("../tables/players.csv", data.playerData.join("\n"));
  Deno.writeTextFile("../tables/referees.csv", data.refereeData.join("\n"));
  Deno.writeTextFile("../tables/teams.csv", data.teamsData.join("\n"));
  Deno.writeTextFile("../tables/seasons.csv", data.seasonsData.join("\n"));
  Deno.writeTextFile("../tables/venues.csv", data.venuesData.join("\n"));
};

const main = () => {
  const files = getFiles();

  const dataFiles = files.map((file) =>
    Deno.readTextFile(`../data/${file}`)
      .then(JSON.parse)
      .then(extractDetails)
      .then(getData)  
  );

  Promise.all(dataFiles).then(write);
};

main();
