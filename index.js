const express = require('express');
const qrCode = require('qrcode-npm');
const bodyParser = require('body-parser');
const helpers = require('./helpers.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000 );

app.get('/', (req, res) => {
  res.writeHeader(200, {"Content-Type": "text/html"});  
  res.end('');    // creates an <img> tag as text
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let qr = helpers.getQRCode(`The username is ${username} and the password is ${password}.`);

  if (username && password) {
    res.end(qr);
  } else {
    res.end('https://static.vix.com/es/sites/default/files/styles/large/public/w/webcomic-name-oh-no.png?itok=HzW3_IIC');
  }
});


app.listen(app.get('port'), () => console.log('Example app listening on port!'))