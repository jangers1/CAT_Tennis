const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serves frontend

let players = [
  { id: 1, name: 'Riccardo', points: 0 },
  { id: 2, name: 'Rohan', points: 0 },
  { id: 3, name: 'Roshan', points: 0 },
  { id: 4, name: 'Sam', points: 0 },
  { id: 5, name: 'Katerina', points: 0 },
  { id: 6, name: 'Hemant', points: 0 }
];

let logs = [];

// API routes here

// Get all players
app.get("/api/players", (req, res) => {
  res.json(players);
});

// Add a new player
app.post("/api/players", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
  const newPlayer = { id: newId, name, points: 0 };
  players.push(newPlayer);
  res.json(newPlayer);
});

// Update points
app.post("/api/players/:id/points", (req, res) => {
  const playerId = parseInt(req.params.id);
  const { points } = req.body;
  const player = players.find(p => p.id === playerId);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.points += points;
  const logEntry = {
    playerName: player.name,
    pointsAdded: points,
    timestamp: new Date().toISOString()
  };
  logs.unshift(logEntry);
  res.json({ player, logEntry });
});

// Get logs
app.get("/api/logs", (req, res) => {
  res.json(logs.slice(0, 50));
});

// Reset data
app.post("/api/reset", (req, res) => {
  players = players.map(p => ({ ...p, points: 0 }));
  logs = [];
  res.json({ message: "Data reset." });
});

// Catch-all to serve index.html for SPA routing (put this **after** all other routes)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server — only call this once, at the end
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
