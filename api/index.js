const express = require('express')
const ws = require('ws');
const app = express();

// import the database scripts
const db = require("./db");
db.connect()

// import the routes
const home = require('./routes/home')
const users = require('./routes/users')
const auth = require('./routes/auth')
const content = require('./routes/content')

// use som of the inbuild middleware
app.use(express.json())
app.use(express.static('public'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// register the routes
app.use('/api', home)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/content', content)

// define the port to 3000 if not set by an enviroinment variable
const port = process.env.PORT || 8080

// Set up a websocket server
const wsServer = new ws.Server({ noServer: true });

// start the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// handle the request to upgrade the connection to a websocket
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

// handle the websocket server requests
wsServer.on('connection', socket => {
  // on message
  socket.on('message', message => console.log(message));
});


