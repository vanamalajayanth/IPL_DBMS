-- Add any queries here that you will be given later to run on the database.

-- players who played in the match which happend on date "2024-04-09"

SELECT player.player_name from match
join match_player on match_player.match_id = match.match_id
join player on player.player_id = match_player.player_id
where match_date = '2024-04-09'

-- players in rcb in season 2024

-- how many matches played by rcb

-- how many matches played by rcb with csk

-- how many matches played by csk in 2020 season

-- how many runs did rr pant scored in ipl history

select sum(batter_runs) from player join delivery on player.player_id = delivery.batter_id
where player_name = 'RR Pant'