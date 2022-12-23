const express = require("express");
const app = express();
const Pusher = require("pusher");

require("dotenv").config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

const simulate = () => {
  let Colts = {
    name: "Colts",
    score: 0,
  };

  let Titan = {
    name: "Titan",
    score: 0,
  };

  const generateNumber = () => Math.floor(Math.random() * 2);

  setInterval(() => {
    Colts.score = Colts.score + generateNumber();
    Titan.score = Titan.score + generateNumber();
    pusher.trigger("realtime-updates", "scores", [Colts, Titan]);
  }, 3500);
};

app.get("/start", simulate);

app.listen(3000, () => console.log("Listening on port 3000"));
