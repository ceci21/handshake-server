
const express = require('express');
const app = express();
const session = require('express-session')
const qrCode = require('qrcode-npm');
const bodyParser = require('body-parser');
const helpers = require('./helpers.js');
const mongoose = require('mongoose');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const MONGODB_URI = require('./db/mongo.js');

var LOGGED_IN_USERS = {};

const handshake = (req, res) => {
  helpers.handshake(data);
}

mongoose.connect(MONGODB_URI);

let db = mongoose.connection;

db.on('error', () => {
	console.log('FAILED TO CONNECT TO MONGOOSE');
});

db.once('open', () => {
	console.log('CONNECTED TO MONGOOSE');
});

io.on('connection', (socket) => {
  console.log('A user connected!');
  socket.on('playSound', (type) => {
    console.log('Type: ', type);
    if (type === 'success') {
      io.emit('playSound', 'success');
    } else if (type === 'beep') {
      io.emit('playSound', 'beep');
    } else if (type === 'fail') {
      io.emit('playSound', 'fail');
    }
  });
})

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000 );

app.get('/', (req, res) => {
  res.writeHeader(200, {"Content-Type": "text/html"});  
  res.end('');    // creates an <img> tag as text
});

app.get('/username', async (req, res) => {
  console.log('SERVER: (GET) RETRIEVING USERNAME...');
  console.log('Session username: ', req.session.username);
  if (req.session.username) {
    res.end(req.session.username);
  } else {
    res.end('');
  }
});

app.post('/login', async (req, res) => {
  console.log('SERVER: (POST) Logging in...');
  req.session.username = '';
  let loginResponse = await helpers.login(req.body);
  if (loginResponse.status) {
    req.session.username = req.body.username;
  }
	res.end(JSON.stringify(loginResponse));
});

app.post('/signup', async (req, res) => {
  console.log('SERVER: (POST) Signing up...');
  let signupResponse = await helpers.signup(req.body);
	res.end(JSON.stringify(signupResponse));
});

app.post('/qrcode', (req, res) => {
  console.log('SERVER: (POST) Getting QR code...');

  let message = req.session.username;
  
  let qr = helpers.getQRCode(message);

  res.end(qr);
});

app.post('/userdata', async (req, res) => {
  let getUserDataResponse = await helpers.getUserData(req.body);
  res.end(getUserDataResponse);
});

app.post('/handshake', (req, res) => {
  console.log('SERVER: (POST) Doing handshake...');
  let scanningUser = req.body.scanningUser;
  let scannedUser = req.body.scannedUser;
  let intervalId;
  var checkForHandshake = () => {
    LOGGED_IN_USERS[scanningUser] = scannedUser;
    if (LOGGED_IN_USERS[scannedUser] === scanningUser && LOGGED_IN_USERS[scanningUser] === scannedUser) {
      console.log('SERVER: (POST) Handshake made!!');
      delete LOGGED_IN_USERS.scanningUser;
      clearInterval(intervalId);
      res.end('');
    }
  };
  if (scanningUser === scannedUser) {
    res.end('');
  } else {
    intervalId = setInterval(checkForHandshake, 250);
  }
});



http.listen(app.get('port'), () => console.log('Example app listening on port!'))