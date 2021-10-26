const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// GET Players API 1

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

// API 2

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const addPlayerQuery = `
    INSERT INTO
      cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;

  const dbResponse = await db.run(addPlayerQuery);
  const bookId = dbResponse.lastID;
  response.send("Player Added To Team");
});

// API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

// API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

// API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
        cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
