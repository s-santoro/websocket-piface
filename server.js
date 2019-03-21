const express = require('express');
const bodyParser = require('body-parser');
const json = require('./piface.json');
const piface = require('piface');
const WebSocket = require("ws");
const port = 3069;

let app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  console.log("get index");
  res.sendFile(__dirname+'/index.html');
});

app.listen(port, () => console.log(`app listening on port ${port}!`))

let portnum = "8069";

const wss = new WebSocket.Server({ port: portnum });
console.log("Websocket created on port " + portnum);

wss.on("connection", onConnected.bind(wss));

// initialize piface
piface.init();
let piState = json;
let startup = true;

function onConnected(socket, request) {
  socket.on("message", onMessage.bind(socket));
  socket.on("close", onClosed.bind(socket));
  // address of websocket server
  var me = this.address();
  console.log(
    "Connection" +
      socket._socket.remoteAddress +
      " -> " +
      me.address +
      ":" +
      me.port
  );
  setTimeout(sendScheduled.bind(socket), 1000);
}

function onMessage(message) {
  // setPiface on message
  console.log("Received: '" + message + "'");
  setPiface(JSON.parse(message));
  piState = JSON.parse(message);
  this.send(message);
}

function onClosed() {
  startup = true;
  console.log("Closed connection to " + this._socket.remoteAddress);
}

function sendScheduled() {
  if (!this) {
    return;
  }
  if (this.readyState != this.OPEN) {
    return;
  }
  // get pi status and send it to browser
  let newPiState = getPiface();
  if(piState.inputs.state != newPiState.inputs.state || startup) {
    startup = false;
    piState.inputs.state = newPiState.inputs.state;
    this.send(JSON.stringify(piState));
    console.log("Sent to " + this._socket.remoteAddress + ": " + JSON.stringify(newPiState));
  }
  setTimeout(sendScheduled.bind(this), 10);
}

// set state of piface
function setPiface(piState) {
  let outputs = piState.outputs.state;
  piface.write_output(convertBinToDec(outputs));
}

// get state of piface
function getPiface() {
  let inputs = piface.read_input();
  // necessary to clone object and avoid reference to old object
  let newPiState = JSON.parse(JSON.stringify(piState));
  newPiState.inputs.state = convertDecToBin(inputs);
  return newPiState;
}

function convertDecToBin(decimal) {
  return parseInt(decimal, 10).toString(2);
}

function convertBinToDec(binAsString) {
  return parseInt(binAsString, 2).toString(10);
}
