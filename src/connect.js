import "jsr:@std/dotenv/load";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {
  getFiles,
  extractMatchDetails,
  extractMatchPlayersDetails,
  extractRefereeDetails,
  extractDeliveryDetails,
} from "./utils.js";

const readDBConfig = (env) => {
  const {
    DENO_USER: user,
    DATABASE: database,
    HOST: hostname,
    PORT: port,
    PASSWORD: password,
  } = env.toObject();

  return { user, database, hostname, port, password };
};

const client = new Client(readDBConfig(Deno.env));

const queryTemplates = {
  match: `
insert into match("season_id","match_date","match_stage","match_number","team1_id", "team2_id", "toss_winner_id","toss_desicion","player_of_the_match_id","match_winner_id","venue_id","won_by_wickets","won_by_runs")
select (select season_id from season where season_year = $1),
$2,
$3,
$4,
(select team_id from team where team_name = $5),
(select team_id from team where team_name = $6),
(select team_id from team where team_name = $7),
$8,
(select player_id from player where player_name = $9),
(select team_id from team where team_name = $10),
(select venue_id from venue where stadium = $11),
$12,
$13
`,
  matchPlayers: `
insert into match_player("match_id","team_id","player_id")
select 
(select match_id from match where match_date = $1 AND match_stage = $2 and match_number = $3),
(select team_id from team where team_name = $4),
(select player_id from player where player_name=$5)
`,
  matchReferees: `
  insert into match_referee("match_id","referee_id","referee_type")
  select 
(select match_id from match where match_date = $1 AND match_stage = $2 and match_number = $3),
(select referee_id from referee where referee_name = $4),
$5
  `,

  delivery: `
  insert into delivery("match_id","innings_number","over_number","delivery_number","ball_number","batter_id","bowler_id","non_striker_id","batter_runs")
  select 
(select match_id from match where match_date = $1 AND match_stage = $2 and match_number = $3),
$4,
$5,
$6,
$7,
(select player_id from player where player_name = $8),
(select player_id from player where player_name = $9),
(select player_id from player where player_name = $10),
$11
  `,

  dismissal: `
 INSERT INTO dismissal (delivery_id, player_out_id, dismissal_by_id, fielder_id, kind)
SELECT 
  (SELECT delivery_id FROM delivery 
   WHERE match_id = (SELECT match_id FROM match 
                     WHERE match_date = $1 
                     AND match_stage = $2 
                     AND match_number = $3) 
   AND innings_number = $4
   and over_number = $5
   AND delivery_number = $6),
  (SELECT player_id FROM player WHERE player_name = $7),
  (SELECT player_id FROM player WHERE player_name = $8),
  (SELECT player_id FROM player WHERE player_name = $9),
  $10
  `,

  extra: `
 INSERT INTO extra (delivery_id, extra_type, extra_runs)
SELECT 
  (SELECT delivery_id FROM delivery 
   WHERE match_id = (SELECT match_id FROM match 
                     WHERE match_date = $1 
                     AND match_stage = $2 
                     AND match_number = $3) 
   AND innings_number = $4
   and over_number = $5
   AND delivery_number = $6),
   $7,$8
  `,
};

const insertData = (query, values) => {
  return client.queryArray(`${query}`, values);
};

function main() {
  client
    .connect()
    .then(() => {
      console.log("Connected to PostgreSQL");
      const files = getFiles();
      const insertions = [];

      files.forEach((file) => {
        const data = JSON.parse(Deno.readTextFileSync(`../data/${file}`));
        const matchDetails = extractMatchDetails(data);
        insertions.push(insertData(queryTemplates.match, matchDetails));

        const playerDetails = extractMatchPlayersDetails(data);
        playerDetails.forEach((playerData) => {
          insertions.push(insertData(queryTemplates.matchPlayers, playerData));
        });

        const refereeDetails = extractRefereeDetails(data);
        refereeDetails.forEach((refereeData) => {
          insertions.push(
            insertData(queryTemplates.matchReferees, refereeData)
          );
        });

        const [deliveryDetails, dismissals, extras] =
          extractDeliveryDetails(data);

        deliveryDetails.forEach((deliveryData) => {
        insertions.push(insertData(queryTemplates.delivery, deliveryData));
        });

        dismissals.forEach((dismissalData) => {
          insertions.push(insertData(queryTemplates.dismissal, dismissalData));
        });

        extras.forEach((extraData) => {
          insertions.push(insertData(queryTemplates.extra, extraData));
        });
      });

      return Promise.all(insertions);
    })
    .then(() => {
      console.log("successfully inserted ✅");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    })
    .finally(() => {
      client.end();
    });
}

// main();
