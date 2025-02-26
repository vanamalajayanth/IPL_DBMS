-- Write the SQL statements that will create the database
-- and the tables for the application.

-- step-1:

create table season(
season_id serial PRIMARY key,
season_year varchar
);

-- step-2

CREATE table team(
team_id serial PRIMARY key,
team_name varchar(100),
team_abbrevation varchar(10)
);

-- step-3

create table player(
player_id serial PRIMARY key,
player_name varchar(100),
registry_id varchar(100)
);

-- step-4

create table referee(
  referee_id serial primary key,
  referee_name varchar(100),
  registry_id varchar(100)
);

-- step-5

create table match(
match_id bigserial primary key,
season_id integer references season(season_id),
match_date date,
match_stage varchar(20),
match_number integer,
team1_id integer REFERENCES team(team_id),
team2_id integer REFERENCES team(team_id),
toss_winner_id integer REFERENCES team(team_id),
toss_desicion varchar(50),
player_of_the_match_id integer references player(player_id),
match_winner_id integer REFERENCES team(team_id),
venue_id integer,
won_by_wickets integer,
won_by_runs integer
);

-- step-6

create table match_player(
match_id integer REFERENCES match(match_id),
team_id integer REFERENCES team(team_id),
player_id integer references player(player_id)
);

-- step-7

create table match_referee(
match_id integer REFERENCES match(match_id),
referee_id integer REFERENCES referee(referee_id),
referee_type varchar(100)
);

-- step-8

create table venue(
venue_id serial primary key,
stadium varchar(200),
city varchar(100)
);

--step-9

create table delivery(
  deleviry_id serial primary key,
  match_id integer references match(match_id),
  innings_number smallint,
  over_number smallint,
  delivery_number smallint,
  ball_number smallint,
  batter_id integer references player(player_id),
  bowler_id integer references player(player_id),
  non_striker_id integer references player(player_id),
  batter_runs smallint
);

-- step-10

create table dismissal(
  dismissal_id bigserial primary key,
  delivery_id integer references delivery(delivery_id),
  player_out_id integer references player(player_id),
  dismissal_by_id integer references player(player_id),
  fileder_id integer references player(player_id),
  kind varchar(50)
);

-- -- step-11

CREATE TABLE extra(
extra_id serial PRIMARY key,
delivery_id INTEGER REFERENCES delivery(delivery_id),
extra_type varchar(50),
extra_runs smallint
);

-- --step-12
