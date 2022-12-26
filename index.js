const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

const handleAuth = (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const user_id = req.body.user_id;
  const presenceData = { user_id };
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
};

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

const handleOnline = () => {
  let Colts = {
    name: "Colts",
    score: 0,
  };

};

app.get("/start", simulate);
app.get("/online", handleOnline);
app.post("/pusher/auth", handleAuth);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
