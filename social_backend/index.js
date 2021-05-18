const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("./routes/websockets")(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

server.listen(3001, () => {
  console.log("API listening on port 3001");
});

app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/posts"));
app.use("/api", require("./routes/notifications"));

const mongoUserName = "devuser";
const mongoPassword = "devpassword";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "social_red_react";

var uri =
  "mongodb://" +
  mongoUserName +
  ":" +
  mongoPassword +
  "@" +
  mongoHost +
  ":" +
  mongoPort +
  "/" +
  mongoDatabase;

var options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  authSource: "admin",
};

try {
  mongoose.connect(uri, options).then(
    () => {
      console.log("\n");
      console.log("*******************************".green);
      console.log("✔ Mongo Successfully Connected!".green);
      console.log("*******************************".green);
      console.log("\n");
    },
    (err) => {
      console.log("\n");
      console.log("*******************************".red);
      console.log("    Mongo Connection Failed    ".red);
      console.log("*******************************".red);
      console.log("\n");
      console.log(err);
    }
  );
} catch (error) {
  console.log("ERROR CONNECTION MONGODB");
  console.log(error.red);
}
