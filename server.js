// First, run 'npm install pusher express cookie-parser'
// Then run this file with 'node server.js'
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const Pusher = require("pusher");
const cors = require("cors");
require("dotenv").config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  console.log(1111111, res);
  res.sendFile(path.join(__dirname, "./index.html"));
});
app.post("/pusher/auth", (req, res) => {
  console.log(22222222, req);
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  // Primitive auth: the client self-identifies. In your production app,
  // the client should provide a proof of identity, like a session cookie.
  const user_id = req.cookies.user_id;
  const presenceData = { user_id };
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}!`));