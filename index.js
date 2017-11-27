
const express = require('express');
const session = require('express-session')
const qrCode = require('qrcode-npm');
const bodyParser = require('body-parser');
const helpers = require('./helpers.js');
const mongoose = require('mongoose');

const MONGODB_URI = require('./db/mongo.js');

const LOGGED_IN_USERS = {};
const TIMERS = [];


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

const app = express();

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

app.post('/handshake', (req, res) => {
  console.log('Req.body: ', req.body);

  let scanningUser = req.body.scanningUser;
  let scannedUser = req.body.scannedUser;

  var checkForHandshake = () => {
    LOGGED_IN_USERS[scanningUser] = scannedUser;
    if (LOGGED_IN_USERS[scannedUser] === scanningUser && LOGGED_IN_USERS[scanningUser] === scannedUser) {
      console.log(`Handshake between ${scanningUser} and ${scannedUser} made!`);
      // Remove user property.
      delete LOGGED_IN_USERS.scanningUser;

      // End response.
      res.end('');

      // Remove all timers.
      for (var timer of TIMERS) {
        clearTimeout(timer);
      }
    }
    TIMERS.push(setTimeout(checkForHandshake, 250));
  };
  
  if (scanningUser === scannedUser) {
    res.end('');
  } else {
    TIMERS.push(setTimeout(checkForHandshake, 250));
  }
  
});



app.listen(app.get('port'), () => console.log('Example app listening on port!'))