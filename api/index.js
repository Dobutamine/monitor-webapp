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
    socket.on("message", async (_message) => {
      // convert message to javascript object
      const message = JSON.parse(_message);
      
      // get the command (get/set)
      const command = message.command
      
      // get the payload
      const payload = message.payload

      // process the message
      switch (command) {
        // the caller wants to retrieve a monitor object from database
        case "get":
          try {
            // try to find a monitor object with the correct id
            let monitor = await Monitor.findOne({ id: payload.id });

            // if monitor object is found return it to the caller
            if (monitor) {
              socket.send(JSON.stringify(monitor));
            }
          } catch (err) {}
          break;
        // the caller wants to update a monitor object in the database   
        case "set":
          try {
            // try to find a monitor object with the correct id and update it with the new values
            let old_monitor = await Monitor.findOneAndUpdate({ id: payload.id }, payload);
          } catch (err) {}
          break;
      }
    });
  } catch (error) {
    console.log(error);
  }
});
