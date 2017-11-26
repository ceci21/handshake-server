const qrCode = require('qrcode-npm');

let helpers = {};

// Returns image string of QR code.
helpers.getQRCode = function(data) {
  let qr = qrCode.qrcode(4, 'M');
  qr.addData(data);
  qr.make();
  let img = qr.createImgTag(4)
  let reg = /"([^"]*)"/g;
  let result = img.match(reg)[0];
  result = result.substring(1, result.length - 1)
  return result;
};

module.exports = helpers;