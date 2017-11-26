const express = require('express');
const qrCode = require('qrcode-npm');

const app = express()

app.set('port', process.env.PORT || 5000);

app.get('/', (req, res) => {
  var qr = qrCode.qrcode(4, 'M');
  qr.addData("hello");
  qr.make();
  res.writeHeader(200, {"Content-Type": "text/html"});  
  console.log('broken');
  let img = qr.createImgTag(4)
  let reg = /"([^"]*)"/g;
  let result = img.match(reg)[0];

  res.end(result);    // creates an <img> tag as text
});


app.listen(app.get('port'), () => console.log('Example app listening on port!'))