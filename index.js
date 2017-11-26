const express = require('express');
const session = require('express-session')
const qrCode = require('qrcode-npm');
const bodyParser = require('body-parser');
const helpers = require('./helpers.js');
const mongoose = require('mongoose');

const MONGODB_URI = require('./db/mongo.js');


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
  console.log('SERVER: (GET) Server index')
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

app.post('/qrcode', async (req, res) => {
  console.log('SERVER: (POST) Getting QR code...');

  let message = req.body.message;
  
  let qr = helpers.getQRCode(message);

  if (username && password) {
    res.end(qr);
  } else {
    res.end('https://static.vix.com/es/sites/default/files/styles/large/public/w/webcomic-name-oh-no.png?itok=HzW3_IIC');
  }
})


app.listen(app.get('port'), () => console.log('Example app listening on port!'))