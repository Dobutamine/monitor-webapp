const { Monitor } = require("./models/monitor");
const express = require("express");
const ws = require("ws");
const app = express();

// import the database scripts
const db = require("./db");
db.connect();

// import the routes
const users = require("./routes/users");
const auth = require("./routes/auth");
const configs = require("./routes/configs");
const medias = require("./routes/medias");
const labs = require("./routes/labs");
const states = require("./routes/states");
const admin = require("./routes/admin");

const { createWebSocketStream } = require("ws");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// use som of the inbuild middleware
app.use(express.json());
app.use(express.static("public"));

// register the routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/configs", configs);
app.use("/api/media", medias);
app.use("/api/labs", labs);
app.use("/api/states", states);
app.use("/api/admin", admin);

// define the port to 3000 if not set by an enviroinment variable
const port = process.env.PORT || 8080;

// Set up a websocket server
const wsServer = new ws.Server({ noServer: true });

// start the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// handle the request to upgrade the connection to a websocket
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

// handle the websocket server requests
wsServer.on("connection", async (socket) => {
  // on message
  try {
    socket.on("message", async (message) => {
      const convertedMessage = JSON.parse(message);
      switch (convertedMessage.command) {
        case "get":
          try {
            let monitor = await Monitor.findOne({ id: convertedMessage.id });
            if (monitor) {
              socket.send(JSON.stringify(monitor));
            }
          } catch (err) {}
          break;
        case "set":
          try {
            let monitor2 = await Monitor.findOne({ id: convertedMessage.id });

            if (monitor2) {
              
              monitor2.heartrate = convertedMessage.heartrate;
              monitor2.satPre = convertedMessage.satPre;
              monitor2.satPost = convertedMessage.satPost;
              monitor2.satVen = convertedMessage.satVen;
              monitor2.respRate = convertedMessage.respRate;
              monitor2.etco2 = convertedMessage.etco2;
              monitor2.abpSyst = convertedMessage.abpSyst;
              monitor2.abpDiast = convertedMessage.abpDiast;
              monitor2.pfi = convertedMessage.pfi;
              monitor2.temp = convertedMessage.temp;
              monitor2.cvp = convertedMessage.cvp;
              monitor2.papSyst = convertedMessage.papSyst;
              monitor2.papDiast = convertedMessage.papDiast;
              monitor2.rhythmType = convertedMessage.rhythmType;
              monitor2.rhythmParameter = convertedMessage.rhythmParameter;
              monitor2.intubated = convertedMessage.intubated;
              monitor2.imageName = convertedMessage.imageName;
              monitor2.compressionsFrequency = convertedMessage.compressionsFrequency;
              monitor2.configurationUpdateCounter = convertedMessage.configurationUpdateCounter;

              await monitor2.save();
            }
          } catch (err) {}
          break;
      }
    });
  } catch (error) {
    console.log(error);
  }
});
