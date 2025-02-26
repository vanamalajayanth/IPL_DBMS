-- Write the SQL statements that will populate the database
-- Note that some data will have to be hard-coded by hand.
-- For Example: team names.

-- step-1

\copy team(team_name,team_abbrevation) from '/Users/vanamalajayanth/workspace/dbmsAssignments/iplData/tables/teams.csv' DELIMITER ',' CSV HEADER;

-- step-2

\copy player(player_name,registry_id) from '/Users/vanamalajayanth/workspace/dbmsAssignments/iplData/tables/players.csv' WITH (FORMAT csv, HEADER true);

-- step-3

\copy referre(referre_name,registry_id) from '/Users/vanamalajayanth/workspace/dbmsAssignments/iplData/tables/referees.csv' DELIMITER ',' CSV HEADER;

-- step-4

\copy season(season_year) from '/Users/vanamalajayanth/workspace/dbmsAssignments/iplData/tables/seasons.csv' DELIMITER ',' CSV HEADER;

-- step-5

\copy venue(stadium,city) from '/Users/vanamalajayanth/workspace/dbmsAssignments/iplData/tables/venues.csv' DELIMITER ',' CSV HEADER;


-- step-6
