const qrCode = require('qrcode-npm');
const User = require('./db/models/user');

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

helpers.signup = async function(data) {
	const [user] = await User.find({ username: data.username }, 'username password').exec();
	if (user == null) {
		const newUser = new User({
			username: data.username,
			password: User.generateHash(data.password),
		});
		const result = await newUser.save();
		return 'SERVER: Signup successful.';
	} else {
		return `SERVER: User ${data.username} already exists.`;
	}
};

helpers.login = async function(data, callback) {
	const [user] = await User.find({ username: data.username }, 'username password').exec();
	if (user == null) {
		return `SERVER: User ${data.username} not found.`;
	} else {
		const res = await User.validatePassword(data.password, user.password);
		if (res) return `SERVER: Login successful.`;
		return `SERVER: Password does not match.`;
	}
};

module.exports = helpers;